import kleur from 'kleur';

type ColorFunc = (str: string | number) => string;

export interface Framework {
  name: string;
  display: string;
  color: ColorFunc;
  variants: FrameworkVariant[];
}

export interface FrameworkVariant {
  name: string;
  display: string;
  color: ColorFunc;
  installCommand: string;
  pathsToCopy: string[];
  defaultDir: string;
  devPort: string;
  templateDir: string;
  additionalDeps?: string[];
}

export const allFrameworks: Framework[] = [
  {
    name: 'react',
    display: 'React',
    color: kleur.cyan,
    variants: [
      {
        name: 'vite-ts',
        display: 'React Vite + TypeScript',
        color: kleur.white,
        installCommand: 'npm create vite@latest PROJECT_NAME -- --template react-ts',
        pathsToCopy: ['src', '.env.template'],
        defaultDir: 'studio-experiences-react-app',
        devPort: '5173',
        templateDir: 'react-vite-ts',
      },
      {
        name: 'next-demo-marketing',
        display: 'NextJS Marketing Demo',
        color: kleur.white,
        installCommand:
          'npx create-next-app@latest PROJECT_NAME --ts --eslint --app --src-dir --no-import-alias --no-tailwind',
        pathsToCopy: ['src', '.env.template', 'next.config.mjs'],
        defaultDir: 'nextjs-marketing-demo',
        devPort: '3000',
        templateDir: 'nextjs-marketing-demo',
        additionalDeps: ['next-i18n-router'],
      },
    ],
  },
];

export type EnvFileData = {
  environment: string;
  spaceId: string;
  accessToken: string;
  previewAccessToken: string;
  experienceTypeId: string;
};
