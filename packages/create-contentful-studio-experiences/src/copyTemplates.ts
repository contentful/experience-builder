import { cp } from 'fs/promises';

const excludedPathsToCopy = ['node_modules', 'dist', '.next', 'package.json', '.env.local'];

async function copyFolder(src: string, dest: string) {
  try {
    await cp(src, dest, {
      recursive: true,
      filter: (src) => {
        if (excludedPathsToCopy.some((exclude) => src.includes(exclude))) {
          return false;
        }
        return true;
      },
    });
  } catch (err) {
    console.error(`Error copying folder: ${err}`);
  }
}

await copyFolder('../templates', './templates');
