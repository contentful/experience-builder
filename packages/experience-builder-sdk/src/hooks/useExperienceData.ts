'use client';
import { getStoreValue, watchStoreValue } from '@contentful/experiences-core';
import { useEffect, useState } from 'react';

export function useExperienceData(key: string) {
  const initialValue = getStoreValue(key);

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    watchStoreValue(key, (newValue) => {
      setValue(newValue);
    });
  }, [key]);

  return value;
}
