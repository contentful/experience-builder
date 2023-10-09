import React, { ErrorInfo, ReactElement } from 'react'
import { sendMessage } from '../communication/sendMessage'
import { OutgoingExperienceBuilderEvent } from '../types'
import './ErrorBoundary.css'

class ImportedComponentError extends Error {}

export class ErrorBoundary extends React.Component<
  { children: ReactElement },
  { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null }
> {
  constructor(props: { children: ReactElement }) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
    if (!(error instanceof ImportedComponentError)) {
      sendMessage(OutgoingExperienceBuilderEvent.CANVAS_ERROR, error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-message">
          <h2 className="title">{`Something went wrong rendering the composition in editor mode:`}</h2>
          <div>{`${this.state.error}`}</div>
        </div>
      )
    }
    return this.props.children
  }
}

export class ImportedComponentErrorBoundary extends React.Component<{ children: ReactElement }> {
  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    const err = new ImportedComponentError(error.message)
    err.stack = error.stack
    throw err
  }

  render() {
    return this.props.children
  }
}
