
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-background">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            We encountered an unexpected error while loading this component. Our team has been notified.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
