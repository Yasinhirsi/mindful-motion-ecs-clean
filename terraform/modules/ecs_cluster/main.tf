# -------- Security group for tasks --------
resource "aws_security_group" "ecs_tasks" {
  name   = "${var.ecs_cluster_name}-tasks-sg"
  vpc_id = data.aws_vpc.selected.id

  # Allow traffic from ALB to container port
  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [var.alb_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Pull VPC id from one of the subnets (for SG creation)
data "aws_subnet" "first" {
  id = var.subnet_ids[0]
}

data "aws_vpc" "selected" {
  id = data.aws_subnet.first.vpc_id
}

# -------- CloudWatch Log Group --------
resource "aws_cloudwatch_log_group" "ecs" {
  name              = var.log_group_name
  retention_in_days = 7
}

# -------- ECS Cluster --------
resource "aws_ecs_cluster" "this" {
  name = var.ecs_cluster_name
}

# -------- Task Definition --------
locals {
  container_name = "mindful-motion"
  family_name    = "${var.ecs_cluster_name}-task"
}

resource "aws_ecs_task_definition" "this" {
  family                   = local.family_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = local.container_name
      image     = var.container_image_url
      essential = true

      portMappings = [{
        containerPort = var.container_port
        hostPort      = var.container_port
        protocol      = "tcp"
      }]

      environment = [
        { name = "NEXT_PUBLIC_SUPABASE_URL", value = var.next_public_supabase_url },
        { name = "NEXT_PUBLIC_SUPABASE_ANON_KEY", value = var.next_public_supabase_anon_key }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = "eu-west-2"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

# -------- ECS Service --------
resource "aws_ecs_service" "this" {
  name            = "${var.ecs_cluster_name}-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = local.container_name
    container_port   = var.container_port
  }

  depends_on = [aws_cloudwatch_log_group.ecs]
}
