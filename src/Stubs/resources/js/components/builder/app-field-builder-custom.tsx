/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { RatingField } from '@/components/custom-fields/rating-field';
import { ColorPickerField } from '@/components/custom-fields/color-picker-field';

interface CustomFieldProps {
    field: {
        name: string;
        label: string;
        type: string;
        component?: string;
        extraAttributes?: Record<string, any>;
        state?: any;
        mergeClass?: string;
    };
    value: any;
    setData: (field: string, value: any) => void;
    error?: string;
}

// Custom components registry
const customComponents: Record<string, React.ComponentType<any>> = {
    'rating-field': RatingField,
    'color-picker-field': ColorPickerField
};

/**
 * Register a custom component to be used with custom fields
 */
export function registerCustomComponent(name: string, component: React.ComponentType<any>) {
    customComponents[name] = component;
}

export function AppFieldBuilderCustom({ field, value, setData, error }: CustomFieldProps) {
    // Use field state as initial value if provided and no value exists yet
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Initialize state from field.state if value is undefined
        if (!initialized && value === undefined && field.state !== undefined) {
            setData(field.name, field.state);
            setInitialized(true);
        }
    }, [initialized, field.name, field.state, value, setData]);

    // Render the custom component if specified
    if (field.component) {
        const Component = customComponents[field.component];

        if (Component) {
            return (
                <div className={cn('space-y-2', field.mergeClass)}>
                    <Component
                        name={field.name}
                        label={field.label}
                        value={value ?? field.state}
                        onChange={(newValue: any) => setData(field.name, newValue)}
                        error={error}
                        {...(field.extraAttributes || {})}
                    />
                </div>
            );
        } else {
            return (
                <div className="text-sm text-destructive">
                    Custom component '{field.component}' not found. Make sure to register it using registerCustomComponent.
                </div>
            );
        }
    }

    // If no component is specified, show a message
    return (
        <div className="text-sm text-amber-500 p-3 bg-amber-50 rounded-md border border-amber-200">
            No component specified for custom field '{field.name}'. Use the 'component' property to specify a React component.
        </div>
    );
}
