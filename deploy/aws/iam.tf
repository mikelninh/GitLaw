# Two roles per ECS-on-Fargate convention:
#   1. execution_role — what AWS uses to start the task (pull image, fetch secrets, write logs)
#   2. task_role      — what the running container uses (none needed here, but defined for future)

# ─── Execution role ──────────────────────────────────────────────────
data "aws_iam_policy_document" "ecs_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "execution" {
  name               = "${var.service_name}-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume.json
}

resource "aws_iam_role_policy_attachment" "execution_managed" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Custom policy for: fetch the OpenAI secret + write logs.
data "aws_iam_policy_document" "execution_extra" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [aws_secretsmanager_secret.openai.arn]
  }
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.mcp.arn}:*"]
  }
}

resource "aws_iam_role_policy" "execution_extra" {
  name   = "secrets-and-logs"
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.execution_extra.json
}

# ─── Task role (for the running container) ───────────────────────────
resource "aws_iam_role" "task" {
  name               = "${var.service_name}-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume.json
}

# CloudWatch log group for the container's stdout/stderr (already JSON-structured)
resource "aws_cloudwatch_log_group" "mcp" {
  name              = "/ecs/${var.service_name}"
  retention_in_days = 30
}
