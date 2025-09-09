import React, { ErrorInfo, ReactElement } from 'react';
import { sendMessage } from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

('use client');

const styles = {
  errorMessage: {
    // These variables are copied over from `global.css` as they are only defined
    // inside the visual-editor package while we need them here already on the public
    // SDK package. In the future, we could move those into the core package to use them
    // in both places without shipping them in preview mode for customers applications.
    '--exp-builder-font-size-m': '0.875rem',
    '--exp-builder-font-size-l': '1rem',
    '--exp-builder-font-stack-primary':
      '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
    '--exp-builder-red200': '#ffe0e0',
    '--exp-builder-red800': '#7f0010',
    '--exp-builder-blue700': '#0041ab',

    margin: '24px',
    fontSize: 'var(--exp-builder-font-size-m)',
    fontFamily: 'var(--exp-builder-font-stack-primary)',
    color: 'var(--exp-builder-red800)',
    padding: '16px',
    backgroundColor: 'var(--exp-builder-red200)',
  },
  title: {
    marginTop: 0,
    fontSize: 'var(--exp-builder-font-size-l)',
  },
  moreDetails: {
    cursor: 'pointer',
    color: 'var(--exp-builder-blue700)',
  },
};

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
    if (error.name !== 'ImportedComponentError') {
      sendMessage(OUTGOING_EVENTS.CanvasError, error);
    } else {
      throw error;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorMessage}>
          <h2 style={styles.title}>{`Something went wrong while rendering the experience`}</h2>
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
            style={styles.moreDetails}
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
