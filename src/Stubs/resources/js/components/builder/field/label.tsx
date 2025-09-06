import {FieldDefinition} from "@/types/field-builder";
import {Label} from "@/components/ui/label";
import {fieldClasses, gridClasses} from "@/lib/utils";
import {ReactNode} from "react";

type Props = {
    field: FieldDefinition;
    children: ReactNode;
    error?: string;
};


export function AppFieldBuilderLabel({field, children, error}: Props) {
    return (
        <div key={field.key}
             className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''} ${fieldClasses(field)} gap-2 ${gridClasses(field.gridCol)}`}>
            <Label htmlFor={field.name}>{field.label}</Label>
            {children}
            {error && <div className="text-xs text-destructive">{error}</div>}
        </div>
    );
}
