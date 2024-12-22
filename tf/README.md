<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.5 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.0 |
| <a name="requirement_cloudflare"></a> [cloudflare](#requirement\_cloudflare) | ~> 4.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 5.82.2 |
| <a name="provider_cloudflare"></a> [cloudflare](#provider\_cloudflare) | 4.48.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_static_landing"></a> [static\_landing](#module\_static\_landing) | git@github.com:Notifycal/tofu-module-static-website.git | v1.0.1 |

## Resources

| Name | Type |
|------|------|
| [aws_s3_bucket_policy.cloudflare_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy) | resource |
| [cloudflare_access_application.private_app](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/access_application) | resource |
| [cloudflare_access_policy.gh_org](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/access_policy) | resource |
| [cloudflare_record.es_main](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/record) | resource |
| [cloudflare_record.es_www_redirect](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/record) | resource |
| [cloudflare_record.main](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/record) | resource |
| [cloudflare_record.www_redirect](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/record) | resource |
| [aws_iam_policy_document.cloudflare_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [cloudflare_access_identity_provider.github](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/data-sources/access_identity_provider) | data source |
| [cloudflare_accounts.this](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/data-sources/accounts) | data source |
| [cloudflare_ip_ranges.cloudflare](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/data-sources/ip_ranges) | data source |
| [cloudflare_zone.es_zones](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/data-sources/zone) | data source |
| [cloudflare_zone.main](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/data-sources/zone) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_base_domain"></a> [base\_domain](#input\_base\_domain) | n/a | `string` | n/a | yes |
| <a name="input_domain_prefix"></a> [domain\_prefix](#input\_domain\_prefix) | n/a | `string` | `""` | no |
| <a name="input_enable_www_redirect"></a> [enable\_www\_redirect](#input\_enable\_www\_redirect) | When set to true, www. will redirect to the naked domain. | `string` | `true` | no |
| <a name="input_is_public"></a> [is\_public](#input\_is\_public) | When set to false, the site will be behind auth. | `bool` | `true` | no |
| <a name="input_redirect_base_domains"></a> [redirect\_base\_domains](#input\_redirect\_base\_domains) | n/a | `list(string)` | `[]` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_bucket_names"></a> [bucket\_names](#output\_bucket\_names) | n/a |
| <a name="output_main_bucket_name"></a> [main\_bucket\_name](#output\_main\_bucket\_name) | n/a |
| <a name="output_site_urls"></a> [site\_urls](#output\_site\_urls) | n/a |
<!-- END_TF_DOCS -->