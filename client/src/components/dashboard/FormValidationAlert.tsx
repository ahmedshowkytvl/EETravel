import React from 'react';
import { AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ValidationStatus = 'error' | 'success' | 'warning' | 'info';

interface FormValidationAlertProps {
  status: ValidationStatus;
  title: string;
  message: string;
  className?: string;
}

export function FormValidationAlert({ 
  status, 
  title, 
  message,
  className
}: FormValidationAlertProps) {
  const getIcon = () => {
    switch (status) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getVariantClass = () => {
    switch (status) {
      case 'error':
        return 'bg-destructive/15 text-destructive border-destructive/20';
      case 'success':
        return 'bg-green-500/15 text-green-600 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/15 text-yellow-600 border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/15 text-blue-600 border-blue-500/20';
    }
  };
  
  return (
    <Alert className={`${getVariantClass()} ${className || ''}`}>
      <div className="flex items-start gap-2">
        {getIcon()}
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
      </div>
    </Alert>
  );
}

export function FormValidationSummary({ 
  errors, 
  className 
}: { 
  errors: { field: string; message: string }[]; 
  className?: string;
}) {
  if (!errors || errors.length === 0) return null;
  
  return (
    <Alert className={`bg-destructive/15 text-destructive border-destructive/20 ${className || ''}`}>
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5" />
        <div>
          <AlertTitle>Please fix the following errors:</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>
                  <span className="font-medium">{error.field}:</span> {error.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}

export function FormRequiredFieldsNote() {
  return (
    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
      <AlertCircle className="h-3 w-3" />
      <span>Fields marked with an asterisk (*) are required</span>
    </div>
  );
}