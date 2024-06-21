#! /usr/bin/env node
import {
  confirm,
  intro,
  outro,
  select,
  spinner as Spinner,
  text,
  password,
  log,
} from '@clack/prompts';
import yargs from 'yargs';
import { CtflClient } from './ctflClient.js';
import { allFrameworks } from './models.js';
import { FsClient } from './fsClient.js';
import { generateExperienceNameId } from './utils.js';

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
      `👋 Welcome to the Contentful Experience Builder!\nWe will guide you through creating a new project that will be ready-to-go with Experience Builder!`,
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

    const shouldSelectSpace = await confirm({
      message: 'Would you like to select an existing space to use with Experience Builder?',
    });

    let experienceName: string = '';

    if (shouldSelectSpace) {
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

      const orgs = await ctflClient.getOrgs();

      const selectedOrgId = await select<{ label: string; value: string }[], string>({
        message: 'Select organization the space is in.',
        options: orgs.map((org) => {
          return {
            label: org.name,
            value: org.id,
          };
        }),
      });

      const selectedOrg = orgs.find((org) => org.id === selectedOrgId)!;
      ctflClient.org = selectedOrg;

      const spaces = await ctflClient.getSpacesForOrg(selectedOrgId as string);

      const spaceEnablements = await ctflClient.getManySpaceEnablements({
        orgId: selectedOrgId as string,
      });
      const spaceEnablementsIds = spaceEnablements.map(
        (spaceEnablement) => spaceEnablement.sys.space.sys.id,
      );
      const spacesWithStudioExperienceEnabled = spaces.filter((space) => {
        return spaceEnablementsIds.includes(space.id);
      });

      const selectedSpaceId = await select<{ label: string; value: string }[], string>({
        message: 'Select space to use.',
        options: spacesWithStudioExperienceEnabled.map((space) => {
          return {
            label: space.name,
            value: space.id,
          };
        }),
      });

      const selectedSpace = spaces.find((space) => space.id === selectedSpaceId)!;
      ctflClient.space = selectedSpace;

      const apiKeys = await ctflClient.getApiKeys();

      if (apiKeys.length === 0) {
        spinner.start('No API keys are currently found, creating one.');
        await ctflClient.createApiKeys();
        spinner.stop('API key created!');
      } else if (apiKeys.find((item) => item.name === 'Experience Builder Keys')) {
        log.message('Using existing API key for Experience Builder.');
        const selectedApiKey = apiKeys.find((apiKey) => apiKey.name === 'Experience Builder Keys')!;
        ctflClient.apiKey = selectedApiKey;
        await ctflClient.getPreviewAccessToken(selectedApiKey.previewKeyId);
      } else {
        const createNewOption = { label: 'Create new API key', value: 'create' };
        const selectedApiKeyId = await select<{ label: string; value: string }[], string>({
          message: 'Select API key to use.',
          options: [
            ...apiKeys.map((apiKey) => {
              return {
                label: apiKey.name,
                value: apiKey.accessToken,
              };
            }),
            createNewOption,
          ],
        });

        if (selectedApiKeyId === createNewOption.value) {
          spinner.start('Creating new API key.');
          const apiKey = await ctflClient.createApiKeys();
          await ctflClient.getPreviewAccessToken(apiKey.previewKeyId);
          spinner.stop('API key created!');
        } else {
          const selectedApiKey = apiKeys.find((apiKey) => apiKey.accessToken === selectedApiKeyId)!;
          ctflClient.apiKey = selectedApiKey;
          await ctflClient.getPreviewAccessToken(selectedApiKey.previewKeyId);
        }
      }

      const previewEnvironments = await ctflClient.getPreviewEnvironments();

      const ebPreviewEnvironment = previewEnvironments.find(
        (item) => item.url === `http://localhost:${variant.devPort}`,
      );

      if (previewEnvironments.length === 0 || !ebPreviewEnvironment) {
        experienceName = (await text({
          message:
            'What would you like to call your experience?  Note: something like `Studio Experiences Content Type`, or `Marketing Studio` might be a good idea. This name will be re-used for all future Experiences, as well as the initial Preview Environment',
          validate(expName) {
            if (expName.length === 0) return `Value is required!`;
            if (expName.length > 50) return 'Experience Name must be less than 51 characters.';
          },
        })) as string;
        const experienceNameId = generateExperienceNameId(experienceName);
        console.log('[ index ] experienceName => ', experienceName);

        spinner.start(
          'No preview environments for Experience Builder currently found, creating one.',
        );

        await ctflClient.createPreviewEnvironment(
          variant.devPort,
          experienceName,
          experienceNameId,
        );
        spinner.stop('Preview environment created!');
      } else if (ebPreviewEnvironment) {
        log.message('Using existing preview environment for Experience Builder.');
        ctflClient.previewEnvironment = ebPreviewEnvironment;
      }
    }

    if (!experienceName) {
      experienceName = (await text({
        message:
          'What would you like to call your experience?  Note: something like `Studio Experiences Content Type`, or `Marketing Studio` might be a good idea. This name will be re-used for all future Experiences, as well as the initial Preview Environment',
        validate(expName) {
          if (expName.length === 0) return `Value is required!`;
          if (expName.length > 50) return 'Experience Name must be less than 51 characters.';
        },
      })) as string;
      log.message(`Experience Name ID: ${generateExperienceNameId(experienceName)}`);
    }

    const experienceNameId = generateExperienceNameId(experienceName);
    await ctflClient.createContentLayoutType(experienceName, experienceNameId);

    await ctflClient.createContentEntry(experienceName, experienceNameId);

    const projectDir = fsClient.getProjectDir(projectName);

    spinner.start(
      `Creating a new Contentful Experience Builder project using ${variant.display}, this might take a minute ⏰`,
    );

    await fsClient.createProject(variant, projectName);

    spinner.stop('Done creating project and installing dependencies!');

    //copy env file
    if (shouldSelectSpace && ctflClient) {
      // TODO: Pass experienceNameID
      fsClient.copyEnvFile(projectDir, ctflClient.getEnvFileData(/* experienceNameId */));
    }

    outro(`Your project is ready and located in the ${projectName} folder.`);

    const shouldCleanup =
      args.dev &&
      (await confirm({
        message: 'Cleanup?',
      }));

    if (shouldCleanup) {
      fsClient.deleteDirectory(projectDir);
      await ctflClient.deleteAuthToken();
    }
  } catch (e) {
    console.log(e);
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
}

// }
