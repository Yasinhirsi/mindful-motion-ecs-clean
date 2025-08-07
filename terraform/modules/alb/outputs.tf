output "alb_sg_id" {
  value       = aws_security_group.alb_sg.id
  description = "Security group ID for the ALB"
}

output "target_group_arn" {
  value       = aws_lb_target_group.ecs_tg.arn
  description = "Target group ARN for ECS service attachment"
}

output "alb_dns_name" {
  value       = aws_lb.this.dns_name
  description = "ALB DNS name (point Cloudflare CNAME here)"
}
