import { useEffect, useLayoutEffect, useState } from 'react';

const useEnhancedEffect =
  typeof window !== 'undefined' && process.env.NODE_ENV !== 'test' ? useLayoutEffect : useEffect;

type NoSsrProperties = {
  children: React.ReactNode;
  defer?: boolean;
  fallback?: React.ReactNode;
};

export const NoSsr = ({ children, defer = false, fallback = null }: NoSsrProperties) => {
  const [isMounted, setMountedState] = useState(false);

  useEnhancedEffect(() => {
    if (!defer) setMountedState(true);
  }, [defer]);

  useEffect(() => {
    if (defer) setMountedState(true);
  }, [defer]);

  return isMounted ? children : fallback;
};
