#!/usr/bin/env bash

set -euo pipefail

SED_TOOL="sed"
if [[ $OSTYPE == 'darwin'* ]]; then
  SED_TOOL="gsed"
fi


# Usage check
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <env-name>"
  exit 1
fi

ENV_NAME="$1"
STAGE_NAME=$ENV_NAME
REGION="${AWS_REGION:-$(aws configure get region)}"
CONFIG_FILE="config/config.local.js"

if [ -z "${REGION:-}" ]; then
  echo "AWS region not configured. Set AWS_REGION or run 'aws configure'."
  exit 1
fi

REST_API_ID=$(aws apigateway get-rest-apis | jq -rc --arg env "${ENV_NAME}" '.items[] | select(.tags.Environment == $env) | .id')
URL="https://${REST_API_ID}.execute-api.${REGION}.amazonaws.com/${STAGE_NAME}"

echo "Updating BACKEND_BASE_URL to: $URL"
"${SED_TOOL}" -E -i "s|BACKEND_BASE_URL: '[^']*'|BACKEND_BASE_URL: '${URL}'|" "$CONFIG_FILE"

exit 0;
