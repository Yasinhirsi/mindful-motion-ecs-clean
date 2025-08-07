variable "alb_name" {
  type        = string
  description = "Name for the Application Load Balancer"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID for the ALB and target group"
}

variable "subnet_ids" {
  type        = list(string)
  description = "Two public subnet IDs for the ALB"
}

variable "acm_certificate_arn" {
  type        = string
  description = "ACM cert ARN for HTTPS listener"
}
