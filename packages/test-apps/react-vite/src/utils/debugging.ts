export const stringifyCompact = (obj: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const omitSysAndMetadataToRemoveNoise = (key: string, value: any) => {
    if (key === 'sys' && (value as { type?: string })?.type === 'Link') {
      // return value;
      return `➡️${value.linkType?.toLowerCase()}://${value.id}`;
    }
    if (['componentTree', 'dataSource', 'unboundValues'].includes(key)) {
      return '{ ... }';
    }

    if (key === 'sys') {
      return `{ ..., id: ${value?.id} }`;
    }

    if (key === 'sys' || key === 'metadata') {
      return undefined;
    }
    return value;
  };

  if (typeof obj === 'string') {
    return obj;
  }
  if (undefined === obj) {
    return 'undefined';
  }
  if (obj === null) {
    return 'null';
  }
  return JSON.stringify(obj, omitSysAndMetadataToRemoveNoise, 2);
};
