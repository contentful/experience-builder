// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const path = require('path');

// eslint-disable-next-line no-undef
const sdkVersionFilePath = path.resolve(__dirname, '../src/sdkVersion.ts');

/*
This script creates a file `sdkVersion.ts` in the `src` directory with the current SDK version, and 
is usually ran before each build to ensure the file exists
*/
// eslint-disable-next-line no-undef
fs.writeFileSync(
  sdkVersionFilePath,
  `export const SDK_VERSION = '${process.env.npm_package_version}';\n`,
  { flag: 'w' },
);
