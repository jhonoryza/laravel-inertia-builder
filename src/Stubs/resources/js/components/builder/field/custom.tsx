/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { customFieldsComponents } from '@/components/builder/custom-fields';

export function AppFieldBuilderCustom({ field, value, onChange, error }: any) {
    // Use field state as initial value if provided and no value exists yet
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Initialize state from field.state if value is undefined
        if (!initialized && value === undefined && field.state !== undefined) {
            onChange(field.name, field.state);
            setInitialized(true);
        }
    }, [initialized, field.name, field.state, value, onChange]);

    // Render the custom component if specified
    if (field.component) {
        const Component = customFieldsComponents[field.component];

        if (Component) {
            return (
                <div className={cn('space-y-2', field.mergeClass)}>
                    <Component
                        name={field.name}
                        label={field.label}
                        value={value ?? field.state}
                        onChange={(newValue: any) => onChange(field.name, newValue)}
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
