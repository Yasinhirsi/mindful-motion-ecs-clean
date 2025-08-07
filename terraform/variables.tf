variable "vpc_name" { type = string }
variable "subnet_public_a_name" { type = string }
variable "subnet_public_b_name" { type = string }
variable "alb_name" { type = string }
variable "ecs_cluster_name" { type = string }
variable "container_image_url" { type = string }
variable "next_public_supabase_url" { type = string }
variable "next_public_supabase_anon_key" { type = string }
variable "execution_role_arn" { type = string }
variable "task_role_arn" { type = string }

variable "acm_domain_name" {
  type        = string
  description = "Domain to look up ACM cert for HTTPS"
  default     = "tm.yasinhirsi.com"
}
