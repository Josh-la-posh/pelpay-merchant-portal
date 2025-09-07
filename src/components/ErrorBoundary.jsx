import { Component } from 'react';
import PropTypes from 'prop-types';
import ToastProvider from './ToastProvider';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Optional: log to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-xl w-full bg-white shadow-md rounded-md p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">An unexpected error occurred. Please try refreshing the page.</p>
            <pre className="text-xs text-left bg-gray-100 p-2 rounded overflow-auto max-h-40">{this.state.error?.toString()}</pre>
            <div className="mt-4">
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-priColor text-white rounded">Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <ToastProvider />
        {this.props.children}
      </>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
