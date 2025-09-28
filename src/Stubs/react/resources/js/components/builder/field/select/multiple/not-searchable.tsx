import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";

type Props = {
    field: FieldDefinition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderSelectMultipleNotSearchable({ field, value, onChange }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={field.isDisable}
                    className={cn('w-full justify-between text-muted-foreground hover:text-muted-foreground dark:bg-background', field.mergeClass)}
                >
                    {value && value?.length > 0 ? `${value.length} selected` : field.placeholder || 'Select options'}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
                    {field.options?.map((opt) => {
                        const checked = (value || []).includes(opt.value);
                        return (
                            <label key={field.key + opt.value.toString()}
                                className="flex cursor-pointer items-center space-x-2">
                                <Checkbox
                                    checked={checked}
                                    onCheckedChange={(isChecked) => {
                                        const newValue = new Set(value || []);
                                        if (isChecked) {
                                            newValue.add(opt.value);
                                        } else {
                                            newValue.delete(opt.value);
                                        }
                                        onChange(field.key, Array.from(newValue));
                                    }}
                                />
                                <span className="text-sm">{opt.label}</span>
                            </label>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
