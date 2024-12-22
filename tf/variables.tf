variable "base_domain" {
  type = string
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

variable "redirect_base_domains" {
  type    = list(string)
  default = []
}

variable "is_public" {
  type        = bool
  default     = true
  description = "When set to false, the site will be behind auth."
}

locals {
  domain           = var.domain_prefix == "" ? var.base_domain : "${var.domain_prefix}.${var.base_domain}"
  redirect_domains = { for redirect_domain in var.redirect_base_domains : redirect_domain => var.domain_prefix == "" ? redirect_domain : "${var.domain_prefix}.${redirect_domain}" }

  main_dns_record_name     = var.domain_prefix == "" ? "@" : var.domain_prefix
  redirect_dns_record_name = var.domain_prefix == "" ? "www" : "www.${var.domain_prefix}"
}
