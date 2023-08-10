#!/bin/bash

if [ -n "$CI" ]; then
    echo "✅ CI environment detected (from presence of CI env variable)"
else
    echo "❌ No CI environment detected"
    echo "This Build script is only meant to be run within CI environment"
    exit 1
fi


if [ -n "$CTFL_EAP_GITHUB_WRITE_TOKEN" ]; then
    echo "✅ CTFL_EAP_GITHUB_WRITE_TOKEN env variable detected with length (${#CTFL_EAP_GITHUB_WRITE_TOKEN}) bytes"
else
    echo "❌ No CTFL_EAP_GITHUB_WRITE_TOKEN environment variable detected"
    echo "In order to publish to the custom NPM repository, github token must be set within CI settings or as your env variable"
    exit 1
fi

git fetch -p

# get the lates tag that will be the version which will be used
latestTag=$(git describe --tags) # is in format of v{version}
latestVersion=$(cut -c 2- <<< $latestTag) # drops the v and stores the {version}

echo "Found latest tag:      [$latestTag]"
echo "Found latest version:  [$latestVersion]"

# writing this line into a newly created local .npmrc
echo "@ctfl-eap:registry=https://npm.pkg.github.com/ctfl-eap" > .npmrc

# replacing package.version with latest tag and changing package name
jq --arg latestVersion "$latestVersion" '.name="@ctfl-eap/experience-builder" | .version=$latestVersion' package.json > temp.json && mv temp.json package.json

yarn build

## appending the new registry info to the global .npmrc
echo "//npm.pkg.github.com/:_authToken=$CTFL_EAP_GITHUB_WRITE_TOKEN" >> ~/.npmrc

npm publish
