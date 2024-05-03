#!/bin/bash
set -e

npx react-scripts test \
    --collectCoverage \
    --coverageDirectory=.coverage \
    --watch=false \
    --watchAll=false \
    --coverageReporters=json \
    --coverageReporters=text \
    --coverageReporters=json-summary \