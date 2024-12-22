data "cloudflare_ip_ranges" "cloudflare" {}

locals {
  cloudflare_ips = data.cloudflare_ip_ranges.cloudflare.ipv4_cidr_blocks
}

data "aws_iam_policy_document" "cloudflare_access" {
  for_each = module.static_landing.bucket_names

  statement {
    sid    = "CloudflareAccess"
    effect = "Allow"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::${each.value}/*",
    ]

    condition {
      test     = "IpAddress"
      variable = "aws:SourceIp"

      values = local.cloudflare_ips
    }
  }
}

resource "aws_s3_bucket_policy" "cloudflare_access" {
  for_each = module.static_landing.bucket_names

  bucket = each.value
  policy = data.aws_iam_policy_document.cloudflare_access[each.key].json
}
