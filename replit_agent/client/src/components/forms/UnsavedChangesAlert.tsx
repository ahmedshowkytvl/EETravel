import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface UnsavedChangesAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveAsDraft: () => void;
  onDiscard: () => void;
  onContinue: () => void;
  title?: string;
  description?: string;
}

export function UnsavedChangesAlert({
  open,
  onOpenChange,
  onSaveAsDraft,
  onDiscard,
  onContinue,
  title = "Unsaved Changes",
  description = "You have unsaved changes in your form. What would you like to do?",
}: UnsavedChangesAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onDiscard}
            className="sm:order-1 w-full sm:w-auto"
          >
            Discard Changes
          </Button>
          <Button
            variant="outline"
            onClick={onSaveAsDraft}
            className="sm:order-2 w-full sm:w-auto"
          >
            Save as Draft
          </Button>
          <Button onClick={onContinue} className="sm:order-3 w-full sm:w-auto">
            Continue Editing
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}