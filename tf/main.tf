module "frontend" {
  source = "/Users/dan/dev/personal/notifycal/modules/tofu-module-static-website"
  # source = "git@github.com:Notifycal/tofu-module-static-website.git?ref=v1.1.1"

  base_domain   = var.base_domain
  domain_prefix = var.domain_prefix

  enable_www_redirect = var.enable_www_redirect

  cloudflare_private_site_auth_enabled = !var.is_public
}
