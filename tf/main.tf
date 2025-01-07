module "frontend" {
  source = "git@github.com:Notifycal/tofu-module-static-website.git?ref=v1.1.1"

  base_domain   = var.base_domain
  domain_prefix = var.domain_prefix

  enable_www_redirect = var.enable_www_redirect

  cloudflare_config = !var.is_local_env ? {
    account_name = "notifycal.com"
    private_site_auth = !var.is_public ? {
      idp_name = "Github"
    } : null
  } : null
}
