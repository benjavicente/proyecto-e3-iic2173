terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "app_server" {
  name = "security-group-app-server"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "ssh"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All Ports Egress"
  }
}

resource "aws_instance" "app_server" {
  ami                    = "ami-04505e74c0741db8d"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.app_server.id]
  key_name               = aws_key_pair.kp.key_name

  tags = {
    Name = "Backend"
  }

  # Install docker
  user_data = <<-EOF
    sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  EOF
}

# SSH Key Pair

variable "ssh_key_name" {
  type    = string
  default = "ssh-aws-ass"
}

resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "kp" {
  key_name   = var.ssh_key_name
  public_key = tls_private_key.pk.public_key_openssh

  provisioner "local-exec" {
    command = <<-EOF
      echo '${tls_private_key.pk.private_key_pem}' > ./${var.ssh_key_name}.pem
      chmod 400 ./${var.ssh_key_name}.pem
    EOF
  }
}

output "instance_ssh_address" {
  value       = "ubuntu@${aws_instance.app_server.public_dns}"
  description = "SSH Address to the EC2 Instance"
}
