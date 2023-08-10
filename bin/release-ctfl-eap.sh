#!/bin/sh
git fetch -p

# get the lates tag that will be the version which will be used
latestTag=$(git describe --tags) # is in format of v{version}
latestVersion=$(cut -c 2- <<< $latestTag) # drops the v and stores the {version}

# writing this line into a newly ceated local .npmrc
echo "@ctfl-eap:registry=https://npm.pkg.github.com/ctfl-eap" > .npmrc

# replacing package.version with latest tag and changing package name
jq --arg latestVersion "$latestVersion" '.name="@ctfl-eap/experience-builder" | .version=$latestVersion' package.json > temp.json && mv temp.json package.json

yarn build

## appending the new registry info to the global .npmrc
echo "//npm.pkg.github.com/:_authToken=$CTFL_EAP_GITBUB_WRITE_TOKEN" >> ~/.npmrc

cat ~/.npmrc

npm publish --dry-run
