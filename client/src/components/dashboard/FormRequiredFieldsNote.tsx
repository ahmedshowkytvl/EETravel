import React from "react";

export function FormRequiredFieldsNote() {
  return (
    <div className="text-sm text-muted-foreground mb-4">
      <p>
        Fields marked with <span className="text-destructive">*</span> are required.
      </p>
    </div>
  );
}