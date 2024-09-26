import spawn from 'cross-spawn';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { EnvFileData, FrameworkVariant } from './models.js';

export class FsClient {
  constructor(private host = 'contentful.com') {}

  async createProject(variant: FrameworkVariant, projectName: string) {
    const installCommand = variant.installCommand.replace('PROJECT_NAME', projectName);
    const installStatus = await this.runCommand(installCommand);

    if (installStatus !== 0) {
      console.error(`error running ${installCommand}`);
      process.exit(1);
    }

    const templateDir = this.getTemplateDir(variant.templateDir);

    const projectDir = this.getProjectDir(projectName);

    this.copyTemplateFiles(projectDir, templateDir, variant.pathsToCopy);

    const additionalLibsToInstall = [
      '@contentful/experiences-sdk-react@latest',
      'contentful@latest',
      ...(variant.additionalDeps ? variant.additionalDeps : []),
    ];

    const installEbLibsCommand = `npm i --prefix ${projectDir} ${additionalLibsToInstall.join(' ')}`;

    const ebLibStatus = await this.runCommand(installEbLibsCommand);

    if (ebLibStatus !== 0) {
      console.error(`error running ${installEbLibsCommand}`);
      process.exit(1);
    }
  }

  copyEnvFile(projectDir: string, envFileData: EnvFileData) {
    const fileContents = fs.readFileSync(path.join(projectDir, '.env.local'), 'utf8');
    const newFileContents = fileContents
      .replace('*YOUR SPACE ID*', envFileData.spaceId)
      .replace('*YOUR ACCESS TOKEN*', envFileData.accessToken)
      .replace('*YOUR PREVIEW ACCESS TOKEN*', envFileData.previewAccessToken)
      .replace('*YOUR EXPERIENCE CONTENT TYPE ID*', envFileData.experienceTypeId);

    fs.writeFileSync(path.join(projectDir, '.env.local'), newFileContents);
  }

  copyTemplateFiles(projectDir: string, templateDir: string, paths: string[]) {
    paths.forEach((srcDir) => {
      fs.rmSync(path.join(projectDir, srcDir), { recursive: true, force: true });
      fs.cpSync(path.join(templateDir, srcDir), path.join(projectDir, srcDir), { recursive: true });
    });
    fs.renameSync(path.join(projectDir, '.env.template'), path.join(projectDir, '.env.local'));
  }

  deleteDirectory(dir: string) {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  directoryExists(dir: string) {
    if (fs.existsSync(dir)) {
      return true;
    }
    return false;
  }

  getProjectDir(projectName: string) {
    return path.join(process.cwd(), projectName);
  }

  getTemplateDir(templateFolderName: string) {
    return path.join(fileURLToPath(import.meta.url), '../../templates', templateFolderName);
  }

  async runCommand(command: string) {
    return new Promise<number | null>((res) => {
      const [commandName, ...args] = command.split(' ');
      spawn(commandName, args, {
        stdio: 'ignore',
      }).on('exit', (code) => {
        res(code);
      });
    });
  }
}

// Future use: get package manager to know which command to run
// function packageFromUserAgent(userAgent?: string) {
//   if (!userAgent) return undefined;
//   const pkgSpec = userAgent.split(' ')[0];
//   const pkgSpecArr = pkgSpec.split('/');
//   return {
//     name: pkgSpecArr[0],
//     version: pkgSpecArr[1],
//   };
// }
