import { useState, useCallback } from "react";
import { useLocation } from "wouter";

export interface UseUnsavedChangesOptions {
  isDirtyFn: () => boolean;
  onSaveAsDraft?: () => void;
  onDiscard?: () => void;
}

export function useUnsavedChanges({
  isDirtyFn,
  onSaveAsDraft = () => {},
  onDiscard = () => {},
}: UseUnsavedChangesOptions) {
  const [_, navigate] = useLocation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const handleNavigation = useCallback(
    (path: string) => {
      const isDirty = isDirtyFn();
      
      if (isDirty) {
        setPendingNavigation(path);
        setShowConfirmDialog(true);
      } else {
        navigate(path);
      }
    },
    [isDirtyFn, navigate]
  );

  const handleSaveAsDraft = useCallback(() => {
    onSaveAsDraft();
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
    setShowConfirmDialog(false);
  }, [onSaveAsDraft, pendingNavigation, navigate]);

  const handleContinue = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  const handleDiscard = useCallback(() => {
    onDiscard();
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
    setShowConfirmDialog(false);
  }, [onDiscard, pendingNavigation, navigate]);

  return {
    showConfirmDialog,
    setShowConfirmDialog,
    pendingNavigation,
    handleNavigation,
    handleSaveAsDraft,
    handleContinue,
    handleDiscard,
  };
}