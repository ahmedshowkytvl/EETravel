import { useEffect } from "react";

/**
 * A hook to manage unsaved changes in a form
 * 
 * @param isDirty Whether the form is dirty (has unsaved changes)
 * @param onBeforeUnload Callback to run before the page unloads
 * @returns void
 * 
 * Usage:
 * ```
 * const formIsDirty = form.formState.isDirty;
 * 
 * useUnsavedChanges(formIsDirty, () => {
 *   if (formIsDirty) {
 *     // Show a warning or do something to prevent navigation
 *     return false; // Cancel navigation
 *   }
 *   return true; // Allow navigation
 * });
 * ```
 */
export function useUnsavedChanges(isDirty: boolean, onBeforeUnload: () => boolean): void {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // Standard way to show a confirmation dialog
        e.preventDefault();
        e.returnValue = "";
      }
    };

    // Add event listener for before unload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);
}