output "alb_url" {
  description = "Public URL — visit /sse to verify the MCP server is reachable"
  value       = "http${var.domain_name != "" ? "s" : ""}://${var.domain_name != "" ? var.domain_name : aws_lb.main.dns_name}"
}

output "ecr_repository_url" {
  description = "ECR repo URL for `docker push`"
  value       = aws_ecr_repository.mcp.repository_url
}

output "openai_secret_arn" {
  description = "Secrets Manager ARN — set the value via `aws secretsmanager put-secret-value`"
  value       = aws_secretsmanager_secret.openai.arn
}

output "log_group_name" {
  description = "CloudWatch log group — JSON-structured logs land here"
  value       = aws_cloudwatch_log_group.mcp.name
}

output "ecs_cluster" {
  description = "ECS cluster name — useful for `aws ecs update-service` from CI"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service" {
  description = "ECS service name"
  value       = aws_ecs_service.mcp.name
}

output "vpc_id" {
  value = aws_vpc.main.id
}
