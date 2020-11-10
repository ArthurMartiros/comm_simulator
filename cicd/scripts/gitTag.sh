#!/bin/bash
echo "BITBUCKET_EXIT_CODE ${BITBUCKET_EXIT_CODE}"


if [ "${BITBUCKET_EXIT_CODE}" -eq 0  ]; then
    export VERSION=$(jq .version package.json | sed 's/\"//g')
    export TAG=v${VERSION:-"0.0.0"}-${BITBUCKET_COMMIT:0:7}
    git tag -f ${TAG} ${BITBUCKET_COMMIT}
    git push --tags
else
    echo "Exit code is '${BITBUCKET_EXIT_CODE}', Tag should not be created"
    exit ${BITBUCKET_EXIT_CODE};
fi