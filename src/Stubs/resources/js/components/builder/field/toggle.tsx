import {FieldDefinition} from "@/types/field-builder";
import {Switch} from "@/components/ui/switch";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (name: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderToggle({field, value, onChange}: Props) {
    return (
        <div>
            <Switch
                id={field.name}
                checked={!!value}
                onCheckedChange={(checked) => onChange(field.name, checked)}
                className={field.mergeClass}
                disabled={field.isDisable}
            />
        </div>
    );
}
