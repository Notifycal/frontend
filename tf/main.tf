module "frontend" {
  source = "git@github.com:Notifycal/tofu-module-static-website.git?ref=v2.1.0"

  base_domain   = var.base_domain
  domain_prefix = var.domain_prefix

  enable_www_redirect = var.enable_www_redirect

  cloudflare_config = var.cloudflare_config
}
