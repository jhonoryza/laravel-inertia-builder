import {FieldDefinition} from "@/types/field-builder";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {router} from "@inertiajs/react";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (name: string, value: any, operator?: string) => void;
    setFields: React.Dispatch<React.SetStateAction<FieldDefinition[]>>;
}

export function AppFieldBuilderSelectSingleSearchable({field, value, onChange, setFields}: Props) {
    return (
        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded="false"
                                    disabled={field.isDisable}
                                    className={cn('w-full justify-between', field.mergeClass)}
                                >
                                    {field.options?.find((opt) => opt.value === value)?.label || (
                                        <span
                                            className="text-muted-foreground">{field.placeholder || 'Select an option'}</span>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
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
                                    <CommandEmpty>No options found.</CommandEmpty>
                                    <CommandGroup className="max-h-60 overflow-y-auto">
                                        {field.options?.map((opt) => (
                                            <CommandItem
                                                key={field.key + opt.label.toString()}
                                                value={opt.label.toString()}
                                                onSelect={() => onChange(field.name, opt.value)}
                                            >
                                                <Check
                                                    className={cn('mr-2 h-4 w-4', opt.value === value ? 'opacity-100' : 'opacity-0')}/>
                                                {opt.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
    );
}
