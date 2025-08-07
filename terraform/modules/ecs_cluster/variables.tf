variable "ecs_cluster_name" { type = string }
variable "execution_role_arn" { type = string }
variable "task_role_arn" { type = string }
variable "container_image_url" { type = string }
variable "next_public_supabase_url" { type = string }
variable "next_public_supabase_anon_key" { type = string }

variable "subnet_ids" { type = list(string) }
variable "alb_sg_id" { type = string }        # ALB SG to allow inbound from
variable "target_group_arn" { type = string } # TG to attach service to

# Optional knobs
variable "container_port" {
  type    = number
  default = 3000
}

variable "log_group_name" {
  type    = string
  default = "/ecs/mindful-motion"
}

variable "desired_count" {
  type    = number
  default = 1
}
