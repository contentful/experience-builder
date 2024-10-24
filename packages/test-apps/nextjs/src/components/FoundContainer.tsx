/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';

import { NoSsr } from './NoSsr';

export function FoundContainer({ display, children, ...props }: any) {
  return (
    <NoSsr>
      <div style={{ display }} {...props}>
        <span>{display}</span>
        {children}
      </div>
    </NoSsr>
  );
}
