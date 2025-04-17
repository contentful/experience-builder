/* eslint-disable @typescript-eslint/no-explicit-any */
import { Asset, Entry, UnresolvedLink } from 'contentful';
import styles from './ComponentUsingDeepReferences.module.css';
import { useEffect, useState } from 'react';
import { customEntityStore } from '../../custom-store';

type ComponentUsingDeepReferencesProperties = {
  title: string;
  items?: Entry[];
};

export function ComponentUsingDeepReferences({
  title,
  items,
  ...rest
}: ComponentUsingDeepReferencesProperties) {
  return (
    <div {...rest}>
      <h2>{title}</h2>
      {items?.map((entry) => {
        const thumbnail = entry.fields?.thumbnail;
        const name = entry.fields?.name as unknown as string;
        return (
          <div key={entry.sys.id} className={styles.entryReference}>
            <i>Character Reference</i>
            <div>
              <b>Name: </b>
              <span>{name}</span>
            </div>
            <ThumnailImage thumbnail={thumbnail as any} />
          </div>
        );
      })}
    </div>
  );
}

const ThumnailImage = ({ thumbnail }: { thumbnail?: UnresolvedLink<'Asset'> | Asset }) => {
  const [fetched, setFetched] = useState(
    !thumbnail || isAssetLink(thumbnail) ? undefined : thumbnail,
  );

  useEffect(() => {
    if (fetched || !thumbnail || !isAssetLink(thumbnail)) return;
    (async function () {
      const fetchedEntity = (await customEntityStore.getEntityByLink(thumbnail)) as Asset;
      setFetched(fetchedEntity);
    })();
  }, [fetched, thumbnail]);

  if (!fetched) {
    return <>Loading...</>;
  }
  const url = fetched.fields?.file?.url;
  if (typeof url !== 'string') {
    return <span>No thumbnail URL available</span>;
  }
  return <img className={styles.thumbnail} src={url}></img>;
};

const isAssetLink = (
  maybeLink: UnresolvedLink<'Asset'> | Asset,
): maybeLink is UnresolvedLink<'Asset'> => {
  if (maybeLink === null) return false;
  if (typeof maybeLink !== 'object') return false;

  const link = maybeLink as {
    sys?: {
      id?: string;
      type?: string;
    };
  };

  return Boolean(maybeLink.sys?.id) && link.sys?.type === 'Link';
};
