import React, { ErrorInfo, ReactElement } from 'react'
import './ErrorBoundary.css'

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
    console.error(error, errorInfo)
    // let's catch this error somehow?
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
