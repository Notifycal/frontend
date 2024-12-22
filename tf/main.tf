data "cloudflare_zone" "main" {
  name = var.base_domain
}

module "static_landing" {
  source = "git@github.com:Notifycal/tofu-module-static-website.git?ref=v1.0.1"

  bucket_name = local.domain

  enable_s3_public_access = false
  enable_www_redirect     = var.enable_www_redirect
}

resource "cloudflare_record" "main" {
  zone_id = data.cloudflare_zone.main.id
  # @ is how Cloudflare calls the naked domain
  name    = local.main_dns_record_name
  value   = module.static_landing.site_urls.main
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "www_redirect" {
  count = var.enable_www_redirect ? 1 : 0

  zone_id = data.cloudflare_zone.main.id
  name    = local.redirect_dns_record_name
  value   = module.static_landing.site_urls.redirect
  type    = "CNAME"
  proxied = true
}
