# Shared filesystem for the FAISS vectorstore + citation graph cache.
# Both files are regeneratable but expensive — EFS keeps them across
# task restarts and lets the server skip the ~10s rebuild on every cold start.

resource "aws_efs_file_system" "data" {
  creation_token   = "${var.service_name}-data"
  encrypted        = true
  performance_mode = "generalPurpose"
  throughput_mode  = "bursting"

  lifecycle_policy {
    transition_to_ia = "AFTER_30_DAYS"
  }

  tags = { Name = "${var.service_name}-efs" }
}

resource "aws_efs_mount_target" "data" {
  count           = length(aws_subnet.private)
  file_system_id  = aws_efs_file_system.data.id
  subnet_id       = aws_subnet.private[count.index].id
  security_groups = [aws_security_group.efs.id]
}

resource "aws_efs_access_point" "data" {
  file_system_id = aws_efs_file_system.data.id
  posix_user {
    uid = 1000  # gitlaw user inside the container
    gid = 1000
  }
  root_directory {
    path = "/data"
    creation_info {
      owner_uid   = 1000
      owner_gid   = 1000
      permissions = "0755"
    }
  }
}

resource "aws_security_group" "efs" {
  name        = "${var.service_name}-efs-sg"
  description = "Allow NFS from Fargate tasks only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "NFS from Fargate"
    from_port       = 2049
    to_port         = 2049
    protocol        = "tcp"
    security_groups = [aws_security_group.fargate.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.service_name}-efs-sg" }
}
