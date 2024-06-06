import React, { ErrorInfo, ReactElement } from 'react';

class ImportedComponentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImportedComponentError';
  }
}

export class ImportedComponentErrorBoundary extends React.Component<{ children: ReactElement }> {
  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    const err = new ImportedComponentError(error.message);
    err.stack = error.stack;
    throw err;
  }

  render() {
    return this.props.children;
  }
}
