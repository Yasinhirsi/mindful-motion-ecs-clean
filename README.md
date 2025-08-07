# 🚀 Mindful Motion — ECS Deployment Project

## 👋 Overview

Mindful Motion is an AI-powered wellness app that helps you prioritize your **mental and physical wellbeing** through sentiment analysis, facial emotion detection, and therapist session scheduling — all wrapped in a smooth, user-friendly experience.

This repo holds the infrastructure-as-code and deployment configs to run Mindful Motion on **AWS ECS Fargate** using Terraform modules, with a focus on scalability, security, and automation.

---

## ✨ Features

- 🐳 Containerized Next.js app with Supabase backend  
- ⚙️ Deployed on AWS ECS Fargate behind an Application Load Balancer (ALB)  
- 🔐 HTTPS powered by AWS Certificate Manager (ACM)  
- 📦 Infrastructure fully managed with Terraform modules  
- ☁️ Remote Terraform state stored on AWS S3, with DynamoDB for state locking  
- 🌐 Custom domain via Cloudflare DNS

---

## 🏗 Architecture

![Mindful Motion Architecture](https://github.com/user-attachments/assets/5e12555e-8746-4f2e-8d1d-36eb5602ce56)
_Figure 1: AWS infrastructure architecture for Mindful Motion._




Traffic flows through:

- 🌍 **Cloudflare** — DNS & HTTPS termination  
- 🔄 **AWS ALB** — routes requests securely  
- 🛠 **ECS Fargate** — runs containerized Next.js app  
- 🗄 **S3 & DynamoDB** — Terraform remote state & locking  
- 🛡 **Supabase** — backend for auth and realtime data

---

## 🚀 Getting Started

Make sure you have your AWS CLI configured with the right permissions, then:

### Terraform

```bash
terraform init
terraform apply
```

## This provisions:

🔹 VPC with public subnets

🔹 ECS cluster & Fargate service

🔹 ALB with HTTP/HTTPS listeners

🔹 ECR container repository

🔹 S3 bucket for Terraform state

🔹 DynamoDB table for state locking

## Docker🐳 
Build, tag, and push your app image to ECR:

```bash
docker build -t mindful-motion .
docker tag mindful-motion:latest <ECR_REPO_URL>:latest
docker push <ECR_REPO_URL>:latest
```

## 🌐 Live Demo
Check out the app live at 👉 https://tm.yasinhirsi.com
