// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { glob } = require('glob');

// The function `searchAndReplaceSdkVersion` is used to find instances of the SDK version in the built dist folder
// and replace them with the current version. This is typically used during the build process to ensure
// that the correct version number is reflected in the final build.
searchAndReplaceSdkVersion;
searchAndReplaceSdkVersion('./dist/**/*.{js,ts,map,d.ts}', process.env.npm_package_version);

async function searchAndReplaceSdkVersion(pattern, replacement) {
  const files = await glob(pattern);

  files.forEach((file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error('Error:', err);
        return;
      }

      const updatedData = data.replace(
        /(const SDK_VERSION = ["|'])([^["|']*)(["|'])/g,
        `$1${replacement}$3`,
      );

      fs.writeFile(file, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error:', err);
          return;
        }
      });
    });
  });
}
