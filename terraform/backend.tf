terraform {
  backend "s3" {
    bucket         = "mindful-motion-tf-state"
    key            = "terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "mindful-motion-tf-locks"
    encrypt        = true
  }
}
