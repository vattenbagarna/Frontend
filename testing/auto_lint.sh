#!/bin/bash

echo "==> STARTING ESLINT"
npm run lint
if [ $? -eq 1 ]; then
    echo "==> ESLINT FAILED"
    echo "If possible eslint will now try and auto-fix theese issues"
    npm run lint-fix
    if [ $? -eq 1 ]; then
        echo "==> ESLINT FAILED, try fixing this manually"
        exit 1
    else
        echo "==> Eslint fixed the issues, you may proceed."
        exit 0
    fi
else
    echo "==> ESLINT COMPLETED WITHOUT ERRORS"
    exit 0
fi

