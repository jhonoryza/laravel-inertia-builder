/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {FieldDefinition} from "@/types/field-builder";

interface CheckboxListFieldProps {
    field: FieldDefinition;
    value: any;
    onChange: (name: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderCheckboxList({ field, value, onChange }: CheckboxListFieldProps) {
    // Ensure value is an array
    const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);

    const handleCheckboxChange = (checkboxValue: string | number | boolean, checked: boolean) => {
        let newValues: any[];

        if (checked) {
            // Add value if it's not already selected
            newValues = [...selectedValues, checkboxValue];
        } else {
            // Remove value if it's currently selected
            newValues = selectedValues.filter(v => v !== checkboxValue);
        }

        onChange(field.name, newValues);
    };

    return (
        <div className="space-y-2">
            {field.options?.map((option) => (
                <div key={option.value.toString()} className="flex items-center space-x-2">
                    <Checkbox
                        id={`${field.name}-${option.value}`}
                        checked={selectedValues.includes(option.value)}
                        onCheckedChange={(checked) => handleCheckboxChange(option.value, !!checked)}
                        className={field.mergeClass}
                        disabled={field.isDisable}
                    />
                    <Label
                        htmlFor={`${field.name}-${option.value}`}
                        className="text-sm font-normal"
                    >
                        {option.label}
                    </Label>
                </div>
            ))}

            {field.options?.length === 0 && (
                <div className="text-sm text-muted-foreground italic">
                    {field.placeholder || 'No options available'}
                </div>
            )}
        </div>
    );
}
