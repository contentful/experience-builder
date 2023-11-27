import React, { ErrorInfo, ReactElement } from 'react';

import { sendMessage } from '../communication/sendMessage';
import { OUTGOING_EVENTS } from '@contentful/experience-builder';
import '../styles/ErrorBoundary.css';

class ImportedComponentError extends Error {}

export class ErrorBoundary extends React.Component<
  { children: ReactElement },
  { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null; showErrorDetails: boolean }
> {
  constructor(props: { children: ReactElement }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showErrorDetails: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    if (!(error instanceof ImportedComponentError)) {
      sendMessage(OUTGOING_EVENTS.CanvasError, error);
    } else {
      throw error;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="cf-error-message">
          <h2 className="title">{`Something went wrong while rendering the experience`}</h2>
          <div>
            The Experience Builder SDK has encountered an error. It may be that the SDK has not been
            set up properly or an imported component has thrown this error. Try to refresh the page
            and find more guidance in our{' '}
            <a
              href="https://www.contentful.com/developers/docs/tutorials/general/experience-builder/"
              rel="noreferrer"
              target="_blank">
              documentation
            </a>
            .
          </div>
          <br />
          <span
            className="more-details"
            onClick={() =>
              this.setState((prevState) => ({
                showErrorDetails: !prevState.showErrorDetails,
              }))
            }>
            {this.state.showErrorDetails ? 'Hide' : 'See'} details
          </span>
          {this.state.showErrorDetails && (
            <code>
              {this.state.error?.stack?.split('\n').map((i, key) => {
                return <div key={key}>{i}</div>;
              })}
            </code>
          )}
        </div>
      );
    }
    return this.props.children;
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
