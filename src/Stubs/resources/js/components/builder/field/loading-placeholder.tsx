import {gridClasses} from "@/lib/utils";
import {FieldDefinition} from "@/types/field-builder";

type Props = {
    field: FieldDefinition;
};

export function AppFieldBuilderLoadingPlaceholder({field}: Props) {
    return (
        <div
            key={field.key}
            className={`space-y-2 ${field.isInline ? 'flex items-center space-x-2' : ''} ${gridClasses(field.gridCol)}`}
        >
            {/* Label skeleton */}
            <div className="h-4 w-24 rounded bg-muted animate-pulse"/>

            {/* Input skeleton */}
            <div className="flex w-full rounded-md bg-muted animate-pulse h-6"/>
        </div>
    );
}
