module "static_landing" {
  source = "git@github.com:Notifycal/tofu-module-static-website.git?ref=v1.1.0"

  base_domain   = var.base_domain
  domain_prefix = var.domain_prefix

  enable_www_redirect   = var.enable_www_redirect
  redirect_base_domains = var.redirect_base_domains

  cloudflare_private_site_auth_enabled = !var.is_public
}
