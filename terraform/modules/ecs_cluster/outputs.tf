output "ecs_service_name" {
  value       = aws_ecs_service.this.name
  description = "ECS Service name"
}

output "ecs_tasks_sg_id" {
  value       = aws_security_group.ecs_tasks.id
  description = "Security group id used by ECS tasks"
}
