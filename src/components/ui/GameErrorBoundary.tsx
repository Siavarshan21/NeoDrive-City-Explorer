'use client';

/**
 * GameErrorBoundary - Catches rendering errors in the 3D canvas
 * and displays a user-friendly error message instead of a blank screen.
 */

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[GameErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a1a',
            color: '#ff4444',
            fontFamily: 'monospace',
            zIndex: 100,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 500, padding: 40 }}>
            <h1 style={{ fontSize: 24, marginBottom: 16, color: '#00f0ff' }}>
              RENDERING ERROR
            </h1>
            <p style={{ marginBottom: 12, color: '#ccc' }}>
              The 3D engine encountered an error. This may be due to WebGL
              not being available in your browser.
            </p>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 24 }}>
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 32px',
                background: 'rgba(0,240,255,0.2)',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
                fontFamily: 'monospace',
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              RELOAD PAGE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
