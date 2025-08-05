<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.5 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.0 |
| <a name="requirement_cloudflare"></a> [cloudflare](#requirement\_cloudflare) | ~> 4.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_frontend"></a> [frontend](#module\_frontend) | git@github.com:Notifycal/tofu-module-static-website.git | v2.2.2 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_base_domain"></a> [base\_domain](#input\_base\_domain) | n/a | `string` | `"notifycal.com"` | no |
| <a name="input_cloudflare_config"></a> [cloudflare\_config](#input\_cloudflare\_config) | Controls the creation of Cloudflare resources such us DNS records, S3 access from Cloudflare and private app access. If null is provided as a value, none of those resources are created | <pre>object({<br/>    account_name = optional(string, "notifycal.com")<br/>    private_site_auth = optional(object({<br/>      # Name of the identity provider set up in Cloudflare<br/>      idp_name = optional(string, "Github")<br/>    }))<br/>    precedence = optional(number, 1)<br/>  })</pre> | <pre>{<br/>  "private_site_auth": null<br/>}</pre> | no |
| <a name="input_domain_prefix"></a> [domain\_prefix](#input\_domain\_prefix) | n/a | `string` | `""` | no |
| <a name="input_enable_www_redirect"></a> [enable\_www\_redirect](#input\_enable\_www\_redirect) | When set to true, www. will redirect to the naked domain. | `string` | `true` | no |
| <a name="input_force_destroy_bucket"></a> [force\_destroy\_bucket](#input\_force\_destroy\_bucket) | n/a | `bool` | `false` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_bucket_names"></a> [bucket\_names](#output\_bucket\_names) | n/a |
| <a name="output_main_bucket_name"></a> [main\_bucket\_name](#output\_main\_bucket\_name) | n/a |
| <a name="output_site_url"></a> [site\_url](#output\_site\_url) | n/a |
<!-- END_TF_DOCS -->