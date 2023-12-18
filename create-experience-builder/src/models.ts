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
  srcDir: string;
  defaultDir: string;
  devPort: string;
  templateDir: string;
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
        srcDir: 'src',
        defaultDir: 'react-eb-project',
        devPort: '5173',
        templateDir: 'react-vite-ts',
      },
    ],
  },
];

export type EnvFileData = {
  environment: string;
  spaceId: string;
  accessToken: string;
  previewAccessToken: string;
  typeId: string;
};
