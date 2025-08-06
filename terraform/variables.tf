variable "vpc_name" {
  description = "Name tag of the existing VPC"
  type        = string
}

variable "subnet_public_a_name" {
  description = "Name tag of public subnet A"
  type        = string
}

variable "subnet_public_b_name" {
  description = "Name tag of public subnet B"
  type        = string
}

variable "alb_name" {
  description = "Name for the ALB"
  type        = string
}

variable "ecs_cluster_name" {
  description = "Name for the ECS cluster"
  type        = string
}

variable "container_image_url" {
  description = "Full ECR image URL"
  type        = string
}

variable "next_public_supabase_url" {
  type = string
}

variable "next_public_supabase_anon_key" {
  type = string
}

variable "execution_role_arn" {
  type        = string
  description = "ECS task execution role ARN"
}

variable "task_role_arn" {
  type        = string
  description = "ECS task IAM role ARN"
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for HTTPS"
  type        = string
}
