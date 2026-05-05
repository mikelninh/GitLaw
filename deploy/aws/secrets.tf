# OPENAI_API_KEY lives here, encrypted with the default AWS-managed KMS key.
# The actual value is set OUT-OF-BAND (not via terraform) so it never lands
# in tfstate. Run once after `terraform apply`:
#
#   aws secretsmanager put-secret-value \
#       --secret-id $(terraform output -raw openai_secret_arn) \
#       --secret-string "sk-your-key-here"

resource "aws_secretsmanager_secret" "openai" {
  name                    = "${var.service_name}/openai-api-key"
  description             = "OpenAI API key for embeddings (text-embedding-3-small)"
  recovery_window_in_days = 7
}

# Initial empty placeholder so ECS task definition can resolve it.
# Real value is set via the AWS CLI command above.
resource "aws_secretsmanager_secret_version" "openai_placeholder" {
  secret_id     = aws_secretsmanager_secret.openai.id
  secret_string = "PLACEHOLDER-RUN-PUT-SECRET-VALUE-AFTER-APPLY"

  lifecycle {
    ignore_changes = [secret_string]
  }
}
