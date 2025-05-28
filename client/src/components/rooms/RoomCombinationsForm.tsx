import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { insertRoomCombinationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Extended schema with validation
const roomCombinationFormSchema = insertRoomCombinationSchema
  .extend({
    adultsCount: z.coerce
      .number()
      .min(1, "At least 1 adult required")
      .max(10, "Maximum 10 adults allowed"),
    childrenCount: z.coerce
      .number()
      .min(0, "Cannot be negative")
      .max(6, "Maximum 6 children allowed"),
    infantsCount: z.coerce
      .number()
      .min(0, "Cannot be negative")
      .max(4, "Maximum 4 infants allowed"),
  })
  .refine(
    (data) => {
      // Total occupants should not exceed 12
      return data.adultsCount + data.childrenCount + data.infantsCount <= 12;
    },
    {
      message: "Total occupants (adults + children + infants) cannot exceed 12",
      path: ["adultsCount"],
    }
  );

type RoomCombination = z.infer<typeof roomCombinationFormSchema>;

interface RoomCombinationsFormProps {
  roomId: number;
  existingCombinations?: RoomCombination[];
  onAddCombination?: (combination: RoomCombination) => void;
  onRemoveCombination?: (index: number) => void;
}

export function RoomCombinationsForm({
  roomId,
  existingCombinations = [],
  onAddCombination,
  onRemoveCombination,
}: RoomCombinationsFormProps) {
  const { toast } = useToast();
  const [combinations, setCombinations] = useState<RoomCombination[]>(existingCombinations);

  const form = useForm<RoomCombination>({
    resolver: zodResolver(roomCombinationFormSchema),
    defaultValues: {
      roomId,
      adultsCount: 2,
      childrenCount: 0,
      infantsCount: 0,
      isDefault: false,
      active: true,
      description: "",
    },
  });

  function generateDescription(data: RoomCombination): string {
    const parts = [];
    if (data.adultsCount > 0) {
      parts.push(`${data.adultsCount} Adult${data.adultsCount !== 1 ? "s" : ""}`);
    }
    if (data.childrenCount > 0) {
      parts.push(`${data.childrenCount} Child${data.childrenCount !== 1 ? "ren" : ""}`);
    }
    if (data.infantsCount > 0) {
      parts.push(`${data.infantsCount} Infant${data.infantsCount !== 1 ? "s" : ""}`);
    }
    return parts.join(" + ");
  }

  function onSubmit(data: RoomCombination) {
    // Auto-generate description if not provided
    if (!data.description) {
      data.description = generateDescription(data);
    }

    // Check if this combination already exists
    const exists = combinations.some(
      (combo) =>
        combo.adultsCount === data.adultsCount &&
        combo.childrenCount === data.childrenCount &&
        combo.infantsCount === data.infantsCount
    );

    if (exists) {
      toast({
        title: "Combination already exists",
        description: "This room occupancy combination already exists.",
        variant: "destructive",
      });
      return;
    }

    // Add the new combination
    const newCombinations = [...combinations, data];
    setCombinations(newCombinations);
    
    // Call parent handler if provided
    if (onAddCombination) {
      onAddCombination(data);
    }

    // Reset form values
    form.reset({
      roomId,
      adultsCount: 2,
      childrenCount: 0,
      infantsCount: 0,
      isDefault: false,
      active: true,
      description: "",
    });

    toast({
      title: "Combination added",
      description: `Added new room combination: ${data.description}`,
    });
  }

  function handleRemoveCombination(index: number) {
    const newCombinations = [...combinations];
    newCombinations.splice(index, 1);
    setCombinations(newCombinations);

    // Call parent handler if provided
    if (onRemoveCombination) {
      onRemoveCombination(index);
    }

    toast({
      title: "Combination removed",
      description: "Room occupancy combination removed successfully.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Room Occupancy Combinations</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Define specific allowed occupancy scenarios for this room by setting
          the number of adults, children, and infants.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="adultsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adults</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormDescription>Age 13+</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="childrenCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Children</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormDescription>Age 2-12</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="infantsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Infants</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormDescription>Under 2 years</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 2 Adults + 1 Child"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Leave blank to auto-generate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Default</FormLabel>
                    <FormDescription>
                      Use as the default occupancy option
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Enable this occupancy combination
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Combination
          </Button>
        </form>
      </Form>

      {combinations.length > 0 && (
        <div className="mt-8">
          <h4 className="text-base font-medium mb-4">Defined Combinations</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {combinations.map((combination, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {combination.description || generateDescription(combination)}
                      </p>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div className="flex items-center">
                          <span className="font-medium text-xs px-2 py-1 rounded-full bg-primary/10 text-primary mr-2">
                            Adults: {combination.adultsCount}
                          </span>
                          <span className="font-medium text-xs px-2 py-1 rounded-full bg-primary/10 text-primary mr-2">
                            Children: {combination.childrenCount}
                          </span>
                          <span className="font-medium text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            Infants: {combination.infantsCount}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                          {combination.isDefault && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Default
                            </span>
                          )}
                          {!combination.active && (
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCombination(index)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}