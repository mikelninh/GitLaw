# AWS Deployment — GitLaw MCP

Deployable Infrastructure-as-Code for running the GitLaw MCP server on AWS Fargate behind an ALB, in **eu-central-1 (Frankfurt)** for DSGVO-aligned data residency.

This is the production-grade alternative to the Fly.io deploy at the repo root (`fly.toml`). Fly is faster for portfolio demos; AWS Fargate is what an enterprise legal-tech team would more likely standardise on.

## What gets created

```
                 Internet (HTTPS)
                       │
          ┌────────────▼────────────┐
          │  ALB (TLS via ACM)      │
          │  WAF rate-limit         │
          └────────────┬────────────┘
                       │
          ┌────────────▼────────────┐
          │  ECS Fargate Service    │
          │  ─ task: gitlaw-mcp     │
          │  ─ desired: 1 (autoscale 1-5)
          │  ─ port: 8000 (SSE)     │
          └────┬───────────┬────────┘
               │           │
               ▼           ▼
        ┌──────────┐   ┌──────────────┐
        │  EFS     │   │  Secrets     │
        │  /rag    │   │  Manager     │
        │  /graph  │   │  OPENAI_KEY  │
        └──────────┘   └──────────────┘

  CloudWatch Logs ◄── stdout/stderr (already JSON-structured)
```

## Files

| File | Purpose |
|---|---|
| `main.tf` | Provider + remote state + tags |
| `network.tf` | VPC + 2 public + 2 private subnets across 2 AZs |
| `ecr.tf` | Container registry for the MCP image |
| `ecs.tf` | Cluster + task definition + service + autoscaling |
| `alb.tf` | Public Application Load Balancer + ACM cert + WAF |
| `efs.tf` | Mounted volume for `rag/vectorstore/` and graph cache |
| `secrets.tf` | Secrets Manager entry for OPENAI_API_KEY |
| `iam.tf` | Task execution role + task role with least-privilege |
| `variables.tf` | All knobs (region, domain, image tag, scale bounds) |
| `outputs.tf` | ALB URL, ECR URL, log-group, secret-arn |

## One-time setup

```bash
# 1. Create an S3 bucket for tf state (manually, once)
aws s3api create-bucket --bucket gitlaw-tfstate-eu-central-1 \
                       --region eu-central-1 \
                       --create-bucket-configuration LocationConstraint=eu-central-1

# 2. Init Terraform (will use the s3 backend)
cd deploy/aws
terraform init

# 3. First deploy: ECR repo first, push image, then everything else
terraform apply -target=aws_ecr_repository.mcp
ECR_URL=$(terraform output -raw ecr_repository_url)
docker build -f ../../gitlaw_mcp/Dockerfile.fly -t gitlaw-mcp:latest ../..
docker tag gitlaw-mcp:latest $ECR_URL:latest
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin $ECR_URL
docker push $ECR_URL:latest

# 4. Apply the rest
terraform apply
```

After `terraform apply` finishes, the ALB DNS is in `terraform output alb_url`.

## CI/CD (push-to-deploy)

`.github/workflows/aws-deploy.yml` (planned) uses GitHub OIDC (no long-lived AWS keys) to:
1. Build the image
2. Push to ECR
3. Force a new ECS deployment

Setup is two AWS commands (creating the IAM role for OIDC) — documented inline in the workflow comments when added.

## Cost estimate (eu-central-1)

| Resource | Monthly |
|---|---:|
| Fargate task (0.25 vCPU, 0.5 GB, 24/7) | ~$11 |
| ALB | ~$18 |
| EFS (1 GB, mostly idle) | ~$0.30 |
| Secrets Manager (1 secret) | ~$0.40 |
| CloudWatch Logs (1 GB ingestion) | ~$0.50 |
| Data transfer (light) | ~$1 |
| **Total** | **~$31/month** |

Scale-to-zero is not native to Fargate (use Fly.io for that). For lower cost, switch the autoscaling min to 0 + accept ~10s cold-start.

## Why this is here

The `gitlaw_mcp/ARCHITECTURE.md` describes the migration path. This directory is the path **as code** — `terraform plan` either succeeds or surfaces concrete errors. That's the difference between "we've thought about cloud" and "we can deploy to cloud".

For Fly.io (faster portfolio demo): see `fly.toml` at the repo root.
