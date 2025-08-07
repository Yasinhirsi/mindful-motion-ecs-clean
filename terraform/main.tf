# ===== Existing VPC + Subnets =====
data "aws_vpc" "existing" {
  filter {
    name   = "tag:Name"
    values = [var.vpc_name]
  }
}

data "aws_subnet" "public_a" {
  filter {
    name   = "tag:Name"
    values = [var.subnet_public_a_name]
  }
}

data "aws_subnet" "public_b" {
  filter {
    name   = "tag:Name"
    values = [var.subnet_public_b_name]
  }
}

# ===== ACM cert lookup (ISSUED, most recent) =====
data "aws_acm_certificate" "cert" {
  domain      = var.acm_domain_name
  statuses    = ["ISSUED"]
  most_recent = true
}

# ===== ALB module =====
module "alb" {
  source              = "./modules/alb"
  alb_name            = var.alb_name
  vpc_id              = data.aws_vpc.existing.id
  subnet_ids          = [data.aws_subnet.public_a.id, data.aws_subnet.public_b.id]
  acm_certificate_arn = data.aws_acm_certificate.cert.arn
}

# ===== ECS module =====
module "ecs_cluster" {
  source                        = "./modules/ecs_cluster"
  ecs_cluster_name              = var.ecs_cluster_name
  execution_role_arn            = var.execution_role_arn
  task_role_arn                 = var.task_role_arn
  container_image_url           = var.container_image_url
  next_public_supabase_url      = var.next_public_supabase_url
  next_public_supabase_anon_key = var.next_public_supabase_anon_key

  subnet_ids       = [data.aws_subnet.public_a.id, data.aws_subnet.public_b.id]
  alb_sg_id        = module.alb.alb_sg_id
  target_group_arn = module.alb.target_group_arn
}
