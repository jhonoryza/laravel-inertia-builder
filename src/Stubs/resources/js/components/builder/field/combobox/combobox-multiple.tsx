import {FieldDefinition} from "@/types/field-builder";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {router} from "@inertiajs/react";
import {Checkbox} from "@/components/ui/checkbox";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (name: string, value: any, operator?: string) => void;
    setFields: React.Dispatch<React.SetStateAction<FieldDefinition[]>>;
}

export function AppFieldBuilderComboboxMultiple({field, value, onChange, setFields}: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={field.isDisable}
                    className={cn('w-full justify-between', field.mergeClass)}
                >
                    {value ? `${value.length} selected` : field.placeholder || 'Select options'}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search..."
                        className="h-9"
                        onValueChange={(val) => {
                            if (val && field.serverside) {
                                setTimeout(() => {
                                    const key = `${field.name}_q`;
                                    router.get(
                                        window.location.href,
                                        {
                                            [key]: val,
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true,
                                            onSuccess: (page) => {
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                const fields = (page.props as any)?.form?.fields as FieldDefinition[];
                                                if (fields) {
                                                    setFields(fields);
                                                }
                                            },
                                        },
                                    );
                                }, 300);
                            }
                        }}
                    />
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                        {field.options?.map((opt) => {
                            const isChecked = Array.isArray(value) ? value.includes(opt.value) : String(value) === String(opt.value);
                            return (
                                <CommandItem
                                    key={field.key + opt.label.toString()}
                                    value={opt.label.toString()}
                                    onSelect={() => {
                                        const current = Array.isArray(value) ? value : value ? [value] : [];
                                        const newSet = new Set(current);
                                        if (isChecked) {
                                            newSet.delete(opt.value);
                                        } else {
                                            newSet.add(opt.value);
                                        }
                                        onChange(field.name, Array.from(newSet));
                                    }}
                                >
                                    <Checkbox checked={isChecked} className="mr-2"/>
                                    {opt.label}
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
