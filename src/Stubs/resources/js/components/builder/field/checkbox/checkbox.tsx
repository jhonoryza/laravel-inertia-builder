import {FieldDefinition} from "@/types/field-builder";
import {Checkbox} from "@/components/ui/checkbox";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (name: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderCheckbox({field, value, onChange}: Props) {
    return (
        <div>
            <Checkbox
                id={field.name}
                checked={!!value}
                onCheckedChange={(checked) => onChange(field.name, checked)}
                className={field.mergeClass}
                disabled={field.isDisable}
            />
        </div>
    )
}
