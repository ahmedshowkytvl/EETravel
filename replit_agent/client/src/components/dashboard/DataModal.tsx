import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface DataModalProps<T> {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  form: UseFormReturn<any>;
  onSubmit: (values: T) => void;
  isSubmitting?: boolean;
  children: React.ReactNode;
  isDelete?: boolean;
}

export function DataModal<T>({
  isOpen,
  setIsOpen,
  title,
  form,
  onSubmit,
  isSubmitting = false,
  children,
  isDelete = false,
}: DataModalProps<T>) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {children}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant={isDelete ? "destructive" : "default"}
              >
                {isSubmitting ? "Saving..." : isDelete ? "Delete" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}