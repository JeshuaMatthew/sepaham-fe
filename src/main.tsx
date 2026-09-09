import { StrictMode, Component } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', background: '#1c1c1c', color: '#ededed', minHeight: '100vh' }}>
          <h1 style={{ color: '#e55', marginBottom: 16 }}>Runtime Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#111', padding: 16, color: '#f88' }}>
            {err.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#111', padding: 16, color: '#aaa', marginTop: 16, fontSize: 12 }}>
            {err.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
