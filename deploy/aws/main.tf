terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }

  # Remote state in S3 — bucket must exist before `terraform init`.
  # See README.md for the one-time bucket-creation command.
  backend "s3" {
    bucket = "gitlaw-tfstate-eu-central-1"
    key    = "mcp/terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project     = "gitlaw-mcp"
      ManagedBy   = "terraform"
      Environment = var.environment
      Owner       = "mikelninh"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" { state = "available" }
