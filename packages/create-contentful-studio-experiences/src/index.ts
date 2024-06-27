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
import { generateContentTypeId, isValidPackageName } from './utils.js';

const DEFAULT = {
  contentType: 'Studio Experiences',
  title: 'Home Page',
  slug: 'homePage',
};

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
      `👋 Welcome to Contentful Studio Experiences!\nWe will guide you through creating a new project that will be ready-to-go with Studio Experiences!`,
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

    let contentTypeId: string | undefined;

    const useExistingSpace = await confirm({
      message:
        'Would you like to connect the project to an existing space with Studio Experiences?',
    });

    if (useExistingSpace) {
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
          message: 'Enter your Contentful management token from the browser window:',
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

      const selectedOrgId = (await select<{ label: string; value: string }[], string>({
        message: 'Select an organization for the space.',
        options: orgs.map((org) => {
          return {
            label: org.name,
            value: org.id,
          };
        }),
      })) as string;

      const selectedOrg = orgs.find((org) => org.id === selectedOrgId);
      ctflClient.org = selectedOrg;

      const spaces = await ctflClient.getSpacesForOrg(selectedOrgId);

      const spaceEnablements = await ctflClient.getSpaceEnablements(selectedOrgId);

      const studioExperiencesEnabledSpaceIds = spaceEnablements
        .filter((val) => val.studioExperiences.enabled)
        .map((spaceEnablement) => spaceEnablement.sys.space.sys.id);

      const spacesWithStudioExperienceEnabled = spaces.filter((space) => {
        return studioExperiencesEnabledSpaceIds.includes(space.id);
      });

      const selectedSpaceId = await select<{ label: string; value: string }[], string>({
        message: 'Select the space to use.',
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
        const newApiKey = await ctflClient.createApiKeys();
        await ctflClient.getPreviewAccessToken(newApiKey.previewKeyId);
        spinner.stop('API key created!');
      } else if (apiKeys.find((item) => item.name === ctflClient.apiKeysName)) {
        log.message('Using existing API key for Studio Experiences.');
        const selectedApiKey = apiKeys.find((apiKey) => apiKey.name === ctflClient.apiKeysName)!;
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

      let contentTypeName: string | undefined;

      const existingContentType = await ctflClient.getExistingExperienceType();

      if (existingContentType) {
        contentTypeName = existingContentType.name;
        contentTypeId = existingContentType.id;
        log.message(`Using existing content type for Experiences: ${contentTypeName}`);
      } else {
        contentTypeName = (await text({
          message: 'Enter a name for the content type for Experiences',
          initialValue: DEFAULT.contentType,
          validate(input) {
            if (input.length === 0) return `Value is required!`;
            if (input.length > 50) return 'Value must be 50 characters or less.';
          },
        })) as string;
        contentTypeId = generateContentTypeId(contentTypeName);
        await ctflClient.createContentType(contentTypeName, contentTypeId);
      }

      const contentEntryId = await ctflClient.getContentEntry(DEFAULT.slug, contentTypeId);

      if (!contentEntryId) {
        await ctflClient.createContentEntry(DEFAULT.title, DEFAULT.slug, contentTypeId);
      }

      const previewEnvironments = await ctflClient.getPreviewEnvironments();

      const previewEnv = previewEnvironments.find(
        (item) => item.url === `http://localhost:${variant.devPort}`,
      );

      if (previewEnvironments.length === 0 || !previewEnv) {
        spinner.start(
          'No content preview environments for Studio Experiences currently found, creating one.',
        );
        await ctflClient.createPreviewEnvironment(variant.devPort, contentTypeName, contentTypeId);
        spinner.stop('Content preview environment created!');
      } else if (previewEnv) {
        log.message('Using existing content preview environment for Studio Experiences.');
        ctflClient.previewEnvironment = previewEnv;
      }
    }

    const projectDir = fsClient.getProjectDir(projectName);

    spinner.start(
      `Creating a new Contentful Studio Experiences project using ${variant.display}, this might take a minute ⏰`,
    );

    await fsClient.createProject(variant, projectName);

    spinner.stop('Done creating project and installing dependencies!');

    const envFileData =
      useExistingSpace && contentTypeId
        ? ctflClient.getEnvFileData(contentTypeId)
        : {
            environment: 'master',
            spaceId: '*YOUR SPACE ID*',
            accessToken: '*YOUR ACCESS TOKEN*',
            previewAccessToken: '*YOUR PREVIEW ACCESS TOKEN*',
            experienceTypeId: '*YOUR EXPERIENCE CONTENT TYPE ID*',
          };
    fsClient.copyEnvFile(projectDir, envFileData);

    const note = useExistingSpace
      ? ''
      : ' To connect your project with Contentful, update your .env.local file.';

    outro(`Your project is ready and located in the ${projectName} folder.${note}`);

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
