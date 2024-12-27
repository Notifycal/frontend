<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.5 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.0 |
| <a name="requirement_cloudflare"></a> [cloudflare](#requirement\_cloudflare) | ~> 4.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_frontend"></a> [frontend](#module\_frontend) | git@github.com:Notifycal/tofu-module-static-website.git | v1.1.1 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_base_domain"></a> [base\_domain](#input\_base\_domain) | n/a | `string` | n/a | yes |
| <a name="input_domain_prefix"></a> [domain\_prefix](#input\_domain\_prefix) | n/a | `string` | `""` | no |
| <a name="input_enable_www_redirect"></a> [enable\_www\_redirect](#input\_enable\_www\_redirect) | When set to true, www. will redirect to the naked domain. | `string` | `true` | no |
| <a name="input_is_public"></a> [is\_public](#input\_is\_public) | When set to false, the site will be behind auth. | `bool` | `true` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_bucket_names"></a> [bucket\_names](#output\_bucket\_names) | n/a |
| <a name="output_main_bucket_name"></a> [main\_bucket\_name](#output\_main\_bucket\_name) | n/a |
| <a name="output_site_url"></a> [site\_url](#output\_site\_url) | n/a |
<!-- END_TF_DOCS -->