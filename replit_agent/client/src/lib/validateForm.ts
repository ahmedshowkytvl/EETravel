import { toast } from "@/hooks/use-toast";

/**
 * Form validation utility that handles different types of validation errors
 * and displays appropriate toast notifications.
 * 
 * @param formData The data to validate
 * @param validationRules Array of validation rules to check
 * @returns true if all validations pass, false otherwise
 */
export function validateForm(
  formData: any,
  validationRules: {
    condition: boolean;
    errorMessage: { title: string; description: string };
    variant?: "default" | "destructive";
  }[]
): boolean {
  // Check each validation rule
  for (const rule of validationRules) {
    if (rule.condition) {
      // Show toast for this validation error
      toast({
        title: rule.errorMessage.title,
        description: rule.errorMessage.description,
        variant: rule.variant || "destructive",
      });
      return false; // Validation failed
    }
  }
  
  return true; // All validations passed
}

/**
 * Utility function to validate required fields and show appropriate error messages
 * 
 * @param formData Form data object
 * @param requiredFields Array of field names that are required
 * @param fieldLabels Optional mapping of field names to human-readable labels
 * @returns true if all required fields are present, false otherwise
 */
export function validateRequiredFields(
  formData: any,
  requiredFields: string[],
  fieldLabels: Record<string, string> = {}
): boolean {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    const value = formData[field];
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      missingFields.push(fieldLabels[field] || field);
    }
  }
  
  if (missingFields.length > 0) {
    toast({
      title: "Missing Required Fields",
      description: `Please fill in the following required fields: ${missingFields.join(', ')}`,
      variant: "destructive",
    });
    return false;
  }
  
  return true;
}

/**
 * Validates numeric field constraints
 * 
 * @param formData Form data object
 * @param numericRules Rules for numeric fields (min, max)
 * @returns true if all numeric validations pass, false otherwise
 */
export function validateNumericFields(
  formData: any,
  numericRules: Array<{
    field: string;
    label?: string;
    min?: number;
    max?: number;
    integer?: boolean;
  }>
): boolean {
  for (const rule of numericRules) {
    const value = formData[rule.field];
    const fieldLabel = rule.label || rule.field;
    
    // Skip if field is not present or not a number
    if (value === undefined || value === null || value === '') continue;
    
    const numValue = Number(value);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      toast({
        title: "Invalid Number",
        description: `${fieldLabel} must be a valid number`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check integer constraint
    if (rule.integer && !Number.isInteger(numValue)) {
      toast({
        title: "Integer Required",
        description: `${fieldLabel} must be a whole number without decimals`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check min constraint
    if (rule.min !== undefined && numValue < rule.min) {
      toast({
        title: "Value Too Small",
        description: `${fieldLabel} must be at least ${rule.min}`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check max constraint
    if (rule.max !== undefined && numValue > rule.max) {
      toast({
        title: "Value Too Large",
        description: `${fieldLabel} must be at most ${rule.max}`,
        variant: "destructive",
      });
      return false;
    }
  }
  
  return true;
}

/**
 * Validates date fields, including date ranges
 * 
 * @param formData Form data object
 * @param dateRules Rules for date fields
 * @returns true if all date validations pass, false otherwise
 */
export function validateDateFields(
  formData: any,
  dateRules: Array<{
    field: string;
    label?: string;
    minDate?: Date;
    maxDate?: Date;
    notInPast?: boolean;
    notInFuture?: boolean;
  }> = [],
  dateRanges: Array<{
    startField: string;
    endField: string;
    startLabel?: string;
    endLabel?: string;
  }> = []
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check individual date fields
  for (const rule of dateRules) {
    const value = formData[rule.field];
    const fieldLabel = rule.label || rule.field;
    
    // Skip if field is not present
    if (!value) continue;
    
    const dateValue = value instanceof Date ? value : new Date(value);
    
    // Check if it's a valid date
    if (isNaN(dateValue.getTime())) {
      toast({
        title: "Invalid Date",
        description: `${fieldLabel} contains an invalid date`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check not in past constraint
    if (rule.notInPast && dateValue < today) {
      toast({
        title: "Past Date Not Allowed",
        description: `${fieldLabel} cannot be in the past`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check not in future constraint
    if (rule.notInFuture && dateValue > today) {
      toast({
        title: "Future Date Not Allowed",
        description: `${fieldLabel} cannot be in the future`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check min date constraint
    if (rule.minDate && dateValue < rule.minDate) {
      toast({
        title: "Date Too Early",
        description: `${fieldLabel} must be on or after ${rule.minDate.toLocaleDateString()}`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check max date constraint
    if (rule.maxDate && dateValue > rule.maxDate) {
      toast({
        title: "Date Too Late",
        description: `${fieldLabel} must be on or before ${rule.maxDate.toLocaleDateString()}`,
        variant: "destructive",
      });
      return false;
    }
  }
  
  // Check date range constraints
  for (const range of dateRanges) {
    const startValue = formData[range.startField];
    const endValue = formData[range.endField];
    
    // Skip if either field is not present
    if (!startValue || !endValue) continue;
    
    const startDate = startValue instanceof Date ? startValue : new Date(startValue);
    const endDate = endValue instanceof Date ? endValue : new Date(endValue);
    
    // Check if the range is valid
    if (startDate > endDate) {
      toast({
        title: "Invalid Date Range",
        description: `${range.endLabel || range.endField} cannot be earlier than ${range.startLabel || range.startField}`,
        variant: "destructive",
      });
      return false;
    }
  }
  
  return true;
}