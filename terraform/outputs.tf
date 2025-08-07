output "alb_dns_name" {
  description = "DNS name of the ALB (point Cloudflare CNAME here)"
  value       = module.alb.alb_dns_name
}

output "ecs_service_name" {
  value       = module.ecs_cluster.ecs_service_name
  description = "Name of the ECS Service"
}
