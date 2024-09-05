import React, { ErrorInfo, ReactElement } from 'react';

class ImportedComponentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImportedComponentError';
  }
}

/** Use this error class (inside visual-editor) if you want to make sure that the error
 * is tracked via Sentry. Currently, the `ImportedComponentErrorBoundary` is swallowing
 * more errors than intended, so this way we make sure that the errors are being tracked. */
export class SDKVisualEditorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SDKVisualEditorError';
  }
}

export class ImportedComponentErrorBoundary extends React.Component<{ children: ReactElement }> {
  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    if (error instanceof SDKVisualEditorError) {
      // Turning it into ImportedComponentError skips it during error tracking. By explicitly creating
      // a SDKVisualEditorError, we can make sure that errors in visual-editor are still being tracked.
      throw error;
    }
    const err = new ImportedComponentError(error.message);
    err.stack = error.stack;
    throw err;
  }

  render() {
    return this.props.children;
  }
}
