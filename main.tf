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

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All Ports Egress"
  }
}

resource "aws_eip" "instance_ip" {
  vpc      = true
  instance = aws_instance.app_server.id
}


resource "aws_instance" "app_server" {
  ami                    = "ami-04505e74c0741db8d"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.app_server.id]
  key_name               = aws_key_pair.kp.key_name

  tags = {
    Name = "Backend"
  }

  # Install docker, docker-compose, and make
  user_data = <<-EOF
    #!/bin/bash
    sudo apt-get update
    sudo apt-get -y install build-essential
    curl -fsSL --connect-timeout 5 https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install -y docker-ce
    sudo service docker start
    sudo curl --connect-timeout 5 -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo chmod 666 /var/run/docker.sock
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
      rm ./${var.ssh_key_name}.pem || true
      echo '${tls_private_key.pk.private_key_pem}' > ./${var.ssh_key_name}.pem
      chmod 400 ./${var.ssh_key_name}.pem
    EOF
  }
}

# Outputs

# ssh -i ssh-aws-ass.pem $(terraform output -raw instance_ssh_address)

output "instance_ssh_address" {
  value       = "ubuntu@${aws_instance.app_server.public_dns}"
  description = "SSH Address to the EC2 Instance"
}

output "static_ip" {
  value       = aws_eip.instance_ip.public_ip
  description = "Static IP Address of the EC2 Instance"
}
