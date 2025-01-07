variable "base_domain" {
  type    = string
  default = "notifycal.com"
}

variable "domain_prefix" {
  type    = string
  default = ""
}

variable "enable_www_redirect" {
  type        = string
  description = "When set to true, www. will redirect to the naked domain."
  default     = true
}

variable "is_public" {
  type        = bool
  default     = true
  description = "When set to false, the site will be behind auth."
}

locals {
  domain = var.domain_prefix == "" ? var.base_domain : "${var.domain_prefix}.${var.base_domain}"

  main_dns_record_name     = var.domain_prefix == "" ? "@" : var.domain_prefix
  redirect_dns_record_name = var.domain_prefix == "" ? "www" : "www.${var.domain_prefix}"
}
