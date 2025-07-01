import { Asset, Entry } from 'contentful';

export const isAsset = (value: unknown): value is Asset => {
  return (
    null !== value &&
    typeof value === 'object' &&
    'sys' in value &&
    (value as Asset).sys?.type === 'Asset'
  );
};

export const isEntry = (value: unknown): value is Entry => {
  return (
    null !== value &&
    typeof value === 'object' &&
    'sys' in value &&
    (value as Entry).sys?.type === 'Entry'
  );
};
