output "main_bucket_name" {
  value = module.frontend.bucket_names.main
}

output "bucket_names" {
  value = module.frontend.bucket_names
}

output "site_url" {
  value       = "https://${local.domain}"
}
