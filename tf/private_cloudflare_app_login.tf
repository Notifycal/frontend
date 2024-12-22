data "cloudflare_accounts" "this" {
  count = var.is_public ? 0 : 1

  name = "notifycal.com"
}

data "cloudflare_access_identity_provider" "github" {
  count = var.is_public ? 0 : 1

  name       = "Github"
  account_id = data.cloudflare_accounts.this[0].accounts[0].id
}

resource "cloudflare_access_application" "private_app" {
  count = var.is_public ? 0 : 1

  zone_id = data.cloudflare_zone.main.id
  name    = "${local.domain} private access"
  domain  = local.domain
  type    = "self_hosted"

  allowed_idps = [
    data.cloudflare_access_identity_provider.github[0].id,
  ]
  session_duration          = "24h"
  auto_redirect_to_identity = true
}

resource "cloudflare_access_policy" "gh_org" {
  count = var.is_public ? 0 : 1

  application_id = cloudflare_access_application.private_app[0].id
  zone_id        = data.cloudflare_zone.main.id
  name           = "allow-gh-org"
  precedence     = "1"
  decision       = "allow"

  include {
    github {
      identity_provider_id = data.cloudflare_access_identity_provider.github[0].id
      name                 = "Notifycal"
    }
  }
}
