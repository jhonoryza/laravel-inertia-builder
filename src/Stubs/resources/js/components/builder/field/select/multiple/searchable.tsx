import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";
import { router } from "@inertiajs/react";
import { useRef } from "react";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
    setFields: React.Dispatch<React.SetStateAction<FieldDefinition[]>>;
}

export function AppFieldBuilderSelectMultipleSearchable({ field, value, onChange, setFields }: Props) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={field.isDisable}
                    className={cn('w-full justify-between', field.mergeClass)}
                >
                    {value && value.length > 0 ? `${value.length} selected` : field.placeholder || 'Select options'}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search..."
                        className="h-9"
                        onValueChange={(val) => {
                            if (val && field.serverside) {
                                if (timeoutRef.current) {
                                    clearTimeout(timeoutRef.current);
                                }

                                timeoutRef.current = setTimeout(() => {
                                    const key = `${field.key}_q`;
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
                        {field.options?.map((opt, i) => {
                            const isChecked = Array.isArray(value) ? value.includes(opt.value) : String(value) === String(opt.value);
                            return (
                                <CommandItem
                                    key={i + field.key + opt.label.toString()}
                                    value={opt.label.toString()}
                                    onSelect={() => {
                                        const current = Array.isArray(value) ? value : value ? [value] : [];
                                        const newSet = new Set(current);
                                        if (isChecked) {
                                            newSet.delete(opt.value);
                                        } else {
                                            newSet.add(opt.value);
                                        }
                                        onChange(field.key, Array.from(newSet));
                                    }}
                                >
                                    <Checkbox checked={isChecked} className="mr-2" />
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
