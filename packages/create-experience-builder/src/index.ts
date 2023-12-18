#! /usr/bin/env node

import { confirm, intro, outro, select, spinner as Spinner, text, password } from '@clack/prompts';
import yargs from 'yargs';
import { CtflClient } from './ctflClient.js';
import { allFrameworks } from './models.js';
import { FsClient } from './fsClient.js';

const args = await yargs(process.argv.slice(2))
  .option('token', {
    alias: 't',
    type: 'string',
    description: 'authToken to use',
  })
  //allows the option to cleanup at the end
  .option('dev', {
    alias: 'd',
    type: 'boolean',
    description: 'dev mode',
    hidden: true,
  })
  .strict()
  .parse();

init().catch((e) => {
  console.error(e);
});

async function init() {
  const spinner = Spinner();
  const ctflClient = new CtflClient();
  const fsClient = new FsClient();

  if (args.token) {
    const validToken = await ctflClient.setAuthToken(args.token);
    if (!validToken) {
      console.error('\nInvalid token\n');
      process.exit(1);
    }
  }

  try {
    intro(
      `👋 Welcome to the Contentful Experience Builder!\nWe will guide you through creating a new project that will be ready-to-go with Experience Builder!`
    );

    const projectType = await select({
      message: 'Pick a project type.',
      options: allFrameworks.map((framework) => {
        return {
          label: framework.color(framework.display),
          value: framework.name,
        };
      }),
    });

    const framework = allFrameworks.find((f) => f.name === projectType)!;

    const variantType = await select({
      message: `What type of ${framework?.display} project?`,
      options: framework.variants.map((variant) => {
        return {
          label: variant.color(variant.display),
          value: variant.name,
        };
      }),
    });

    const variant = framework.variants.find((v) => v.name === variantType)!;

    const projectName = (await text({
      message: 'Where should we install the project?',
      initialValue: variant.defaultDir,
      validate(dir) {
        if (dir.length === 0) return `Value is required!`;
        if (fsClient.directoryExists(dir)) {
          return `Directory ${dir} already exists`;
          //todo enable directory deleting
        } else if (!isValidPackageName(dir)) {
          return `${dir} is not a valid package name`;
        }
      },
    })) as string;

    const shouldCreateSpace = await confirm({
      message: 'Create a Contentful space in your org for experience builder?',
    });

    if (shouldCreateSpace) {
      if (!args.token) {
        const confirmAnswer = await confirm({
          message:
            "Next, a browser window will open where you will log in (or sign up if you don't have an account) to Contentful, and authorize this CLI tool. Once done, you will see your access token, where you can copy it and paste it back into the command window. \n\nAre you ready to continue?",
        });

        if (!confirmAnswer) {
          outro('Ok, bye!');
          process.exit();
        }

        await ctflClient.getAuthToken();

        const authToken = await password({
          message: 'Enter your Contentful management token from the browser window',
          validate(token) {
            if (token.length === 0) return `Value is required!`;
          },
        });

        spinner.start('Validating token...');

        const validToken = await ctflClient.setAuthToken(authToken as string, true);

        if (!validToken) {
          console.error('\nInvalid token\n');
          outro('Ok, bye!');
          process.exit(1);
        }

        spinner.stop('Token validated!');
      }
    }

    if (shouldCreateSpace) {
      const orgs = await ctflClient.getOrgs();

      const selectedOrg = await select<{ label: string; value: string }[], string>({
        message: 'Select org to create space in.',
        options: orgs.map((org) => {
          return {
            label: org.name,
            value: org.id,
          };
        }),
      });

      const spaceName = await text({
        message: 'Enter a name for your space',
        placeholder: 'my-eb-space',
        validate(name) {
          if (name.length === 0) return `Value is required!`;
          //todo validate that space name is a valid one for CF
        },
      });

      spinner.start('Creating space...');

      const space = await ctflClient.createSpace(spaceName as string, selectedOrg as string);

      await ctflClient.createPreviewEnvironment(variant.devPort);

      await ctflClient.createContentLayoutType();

      await ctflClient.createContentEntry();

      await ctflClient.createApiKeys();

      spinner.stop(`Space ${space.name} created!`);
    }

    const projectDir = fsClient.getProjectDir(projectName);

    spinner.start(
      `Creating a new Contentful Experience Builder project using ${variant.display}, this might take a minute ⏰`
    );

    await fsClient.createProject(variant, projectName);

    spinner.stop('Done creating project and installing dependencies!');

    //copy env file
    if (shouldCreateSpace && ctflClient) {
      fsClient.copyEnvFile(projectDir, ctflClient.getEnvFileData());
    }

    outro(`Your project is ready and located in the ${projectName} folder.`);

    const shouldCleanup =
      args.dev &&
      (await confirm({
        message: 'Cleanup?',
      }));

    if (shouldCleanup) {
      fsClient.deleteDirectory(projectDir);
      if (shouldCreateSpace && ctflClient?.space) {
        await ctflClient.deleteSpace();
        await ctflClient.deleteAuthToken();
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
}

// }
