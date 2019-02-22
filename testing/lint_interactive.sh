echo '==> STARTING ESLINT'
npm run lint
if [ $? -eq 1 ]; then
    echo '==> ESLINT FAILED'
    echo 'If possible, do you want to auto-fix the issues? (y/N)'
    read userInput
    if [ "$userInput" = "y" ]; then
        echo '==> Running eslint --fix'
        npm run lint-fix
        echo 're-running test...'
        npm test
    else
        echo 'aborting autofix, returning error.'
        exit 1
    fi
else
echo '==> LINT COMPLETED WITHOUT ERRORS'
exit 0
fi
