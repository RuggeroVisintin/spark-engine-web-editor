#!/bin/bash
set -e

npm run test -- \
    --collectCoverage \
    --coverageDirectory=.coverage \
    --watch=false \
    --watchAll=false \
    --coverageReporters=json \
    --coverageReporters=text \
    --coverageReporters=json-summary \