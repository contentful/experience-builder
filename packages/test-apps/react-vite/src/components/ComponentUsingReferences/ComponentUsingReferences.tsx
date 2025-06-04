/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entry } from 'contentful';
import styles from './ComponentUsingReferences.module.css';

type ComponentUsingReferencesProperties = {
  title: string;
  description: string;
  entry?: Entry;
};

export function ComponentUsingReferences({
  title,
  description,
  entry,
  ...rest
}: ComponentUsingReferencesProperties) {
  const stringFields = collectStringFields(entry);
  return (
    <div {...rest}>
      <h2>{title}</h2>
      <p>{description}</p>
      {stringFields.length > 0 && (
        <div className={styles.entryReference}>
          <i>Reference</i>
          {stringFields.map(([key, value]) => (
            <div key={key}>
              <b>{key}</b>
              <div>
                {'> '}
                {value}
              </div>
            </div>
          ))}
        </div>
      )}{' '}
    </div>
  );
}

const collectStringFields = (entry?: Entry): Array<[string, string]> => {
  return Object.keys(entry?.fields ?? {})
    .map((key) => {
      const field: any = entry?.fields[key];
      if (typeof field === 'string') {
        return [key, field] as [string, string];
      }
      return null;
    })
    .filter(Boolean) as Array<[string, string]>;
};
