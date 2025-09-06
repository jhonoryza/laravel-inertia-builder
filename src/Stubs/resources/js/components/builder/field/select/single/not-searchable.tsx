import {FieldDefinition} from "@/types/field-builder";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Key} from "react";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (name: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderSelectSingleNotSearchable({field, value, onChange}: Props) {
    return (
        <Select
            value={value.toString() || ''}
            onValueChange={(val) => onChange(field.name, val)}
            disabled={field.isDisable}
        >
            <SelectTrigger>
                <SelectValue placeholder={field.placeholder || 'Select an option'}/>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
                {field.options?.map((opt) => (
                    <SelectItem key={field.key + opt.value as Key} value={opt.value.toString() as string}
                                className={field.mergeClass}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
