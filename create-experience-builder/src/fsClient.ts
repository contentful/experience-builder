import spawn from 'cross-spawn';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { EnvFileData, FrameworkVariant } from './models.js';

export class FsClient {
  async createProject(variant: FrameworkVariant, projectName: string) {
    const installCommand = variant.installCommand.replace('PROJECT_NAME', projectName);
    const installStatus = await this.runCommand(installCommand);

    if (installStatus !== 0) {
      console.error(`error running ${installCommand}`);
      process.exit(1);
    }

    const templateDir = this.getTemplateDir(variant.templateDir);

    const projectDir = this.getProjectDir(projectName);

    this.copyTemplateFiles(projectDir, templateDir, variant.srcDir);

    const installEbLibsCommand = `npm i --prefix ${projectDir} @contentful/experience-builder @contentful/experience-builder-components`;

    const ebLibStatus = await this.runCommand(installEbLibsCommand);

    if (ebLibStatus !== 0) {
      console.error(`error running ${installEbLibsCommand}`);
      process.exit(1);
    }
  }

  copyEnvFile(projectDir: string, envFileData: EnvFileData) {
    fs.writeFileSync(
      path.join(projectDir, '.env.local'),
      `VITE_ENVIRONMENT_ID=${envFileData.environment}
VITE_SPACE_ID=${envFileData.spaceId}
VITE_ACCESS_TOKEN=${envFileData.accessToken}
VITE_PREVIEW_ACCESS_TOKEN=${envFileData.previewAccessToken}
VITE_EB_TYPE_ID=${envFileData.typeId}`
    );
  }

  copyTemplateFiles(projectDir: string, templateDir: string, srcDir: string) {
    fs.rmSync(path.join(projectDir, srcDir), { recursive: true, force: true });
    fs.cpSync(path.join(templateDir, srcDir), path.join(projectDir, srcDir), { recursive: true });
    fs.cpSync(path.join(templateDir, '.env.local'), path.join(projectDir, '.env.local'));
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

  getTemplateDir(framework: string) {
    return path.join(fileURLToPath(import.meta.url), '../../templates', framework);
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
