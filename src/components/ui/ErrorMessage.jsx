import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from './Button';

export const ErrorMessage = ({ error, onRetry, onDismiss, className = '' }) => {
  if (!error) return null;

  const isRetryable = error.retryable !== false;

  return (
    <div
      className={`bg-red-50 border-l-4 border-red-500 p-6 rounded-lg animate-in slide-in-from-top-2 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            {error.code === 'TIMEOUT' ? 'Request Timeout' : 'Something went wrong'}
          </h3>
          <p className="text-red-700 mb-4">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="flex gap-3">
            {isRetryable && onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                icon={RefreshCw}
              >
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button
                onClick={onDismiss}
                variant="secondary"
                size="sm"
                icon={X}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
