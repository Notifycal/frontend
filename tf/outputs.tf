output "main_bucket_name" {
  value = module.static_landing.bucket_names.main
}

output "bucket_names" {
  value = module.static_landing.bucket_names
}

output "site_urls" {
  value = formatlist("https://%s", concat([local.domain], values(local.redirect_domains)))
}
