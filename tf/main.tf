module "frontend" {
  source = "git@github.com:Notifycal/tofu-module-static-website.git?ref=v2.1.1"

  force_destroy_bucket = var.force_destroy_bucket

  base_domain   = var.base_domain
  domain_prefix = var.domain_prefix

  enable_www_redirect = var.enable_www_redirect

  cloudflare_config = var.cloudflare_config
}
