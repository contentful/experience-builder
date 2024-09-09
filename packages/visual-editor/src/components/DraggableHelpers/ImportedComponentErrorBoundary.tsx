import { isContentfulComponent } from '@contentful/experiences-core';
import React, { ErrorInfo } from 'react';

class ImportedComponentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImportedComponentError';
  }
}

class ExperienceSDKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExperienceSDKError';
  }
}

type ImportedComponentErrorBoundaryProps = {
  children?: React.ReactNode;
  componentID?: string;
};

export class ImportedComponentErrorBoundary extends React.Component<ImportedComponentErrorBoundaryProps> {
  constructor(props: ImportedComponentErrorBoundaryProps) {
    super(props);
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    if (error.name === 'ImportedComponentError' || error.name === 'ExperienceSDKError') {
      // This error was already handled by a nested error boundary and should be passed upwards
      // We have to do this as we wrap every component on every layer with this error boundary and
      // thus an error deep in the tree bubbles through many layers of error boundaries.
      throw error;
    }
    // Differentiate between custom and SDK-provided components for error tracking
    const ErrorClass = isContentfulComponent(this.props.componentID)
      ? ExperienceSDKError
      : ImportedComponentError;
    const err = new ErrorClass(error.message);
    err.stack = error.stack;
    throw err;
  }

  render() {
    return this.props.children;
  }
}
