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

variable "cloudflare_config" {
  type = object({
    account_name = optional(string, "notifycal.com")
    private_site_auth = optional(object({
      # Name of the identity provider set up in Cloudflare
      idp_name = optional(string, "Github")
    }))
  })
  default = {
    private_site_auth = null
  }
  description = "Controls the creation of Cloudflare resources such us DNS records, S3 access from Cloudflare and private app access. If null is provided as a value, none of those resources are created"
}

locals {
  domain = var.domain_prefix == "" ? var.base_domain : "${var.domain_prefix}.${var.base_domain}"

  main_dns_record_name     = var.domain_prefix == "" ? "@" : var.domain_prefix
  redirect_dns_record_name = var.domain_prefix == "" ? "www" : "www.${var.domain_prefix}"
}
