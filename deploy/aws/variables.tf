variable "region" {
  description = "AWS region — Frankfurt for DSGVO-aligned data residency"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Tag for filtering and IAM scoping"
  type        = string
  default     = "production"
}

variable "service_name" {
  description = "ECS service / DNS / log-group base name"
  type        = string
  default     = "gitlaw-mcp"
}

variable "image_tag" {
  description = "ECR image tag to deploy. Defaults to 'latest'; CI overrides with the commit SHA."
  type        = string
  default     = "latest"
}

variable "container_cpu" {
  description = "Fargate task vCPU units (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "container_memory" {
  description = "Fargate task memory in MB"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Initial / minimum number of running tasks"
  type        = number
  default     = 1
}

variable "max_count" {
  description = "Autoscaling ceiling"
  type        = number
  default     = 5
}

variable "domain_name" {
  description = "Custom domain (e.g. mcp.gitlaw.de). Leave empty for ALB-DNS only."
  type        = string
  default     = ""
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.20.0.0/16"
}
