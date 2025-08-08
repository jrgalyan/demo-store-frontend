import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: '1rem' }}>
          <h1>Something went wrong</h1>
          <p className="error">{this.state.error?.message || 'Unknown error'}</p>
          <p className="muted">Check the browser console for details.</p>
        </div>
      )
    }
    return this.props.children
  }
}
