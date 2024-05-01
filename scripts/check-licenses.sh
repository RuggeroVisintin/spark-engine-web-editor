#!/bin/bash
set -e

success_icon=""
error_icon=""
info_icon=""

# check if this project is actually licensed
echo "${info_icon} Check project license"

license=$(cat package.json | jq '.license')
if [[ $license == null ]]; then
    echo "${error_icon} Missing project license"
    exit 1;
fi

echo "${success_icon} Project is licensed!"

# check if included libraries licenses are allowed
echo "${info_icon} Checking dependencies' licenses"

allowed_licenses="$(cat .allowed-licenses | jq -r '. | join(";")');"
npx license-checker \
    --direct \
    --onlyAllow "${allowed_licenses};" \
    --excludePrivatePackages \
    --csv \
    --out ./reports/license-report.csv

echo "${success_icon} Dependencies licenses ok!"