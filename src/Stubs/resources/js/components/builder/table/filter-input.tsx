import {ActiveFilter, Filter as FilterType} from '@/types/datatable';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {AppFieldBuilderFlatpickr} from "@/components/builder/field/flatpickr";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Check, ChevronDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {customFilterComponents} from '@/components/custom-filters';
import {router} from "@inertiajs/react";

interface FilterInputProps {
    name: string;
    filterDef: FilterType;
    activeFilter: ActiveFilter;
    onFilterChange: (field: string, value: string | string[], operator: string) => void;
}

export function AppDataTableFilterInput({name, filterDef, activeFilter, onFilterChange}: FilterInputProps) {
    const handleValueChange = (value: string | string[], operator: string) => {
        // console.log(filterDef.field, value, operator);
        onFilterChange(filterDef.field, value, operator);
    };

    switch (filterDef.type) {
        case 'select':
            if (filterDef.searchable) {
                if ((filterDef.multiple || activeFilter.operator == 'in' || activeFilter.operator == 'notIn')) {
                    const selectedValues = new Set(Array.isArray(activeFilter.value) ? activeFilter.value : []);
                    return (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn('w-full justify-between bg-popover')}
                                >
                                    {selectedValues.size > 0
                                        ? `${selectedValues.size} selected`
                                        : `Select ${filterDef.label}...`}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                    <CommandInput placeholder="Search..." className="h-9"
                                                  onValueChange={(val) => {
                                                      if (val && filterDef.serverside) {
                                                          setTimeout(() => {
                                                              const key = `${filterDef.field}_q`;
                                                              router.get(window.location.href, {
                                                                  [key]: val,
                                                              }, {
                                                                  preserveState: true,
                                                                  preserveScroll: true,
                                                                  replace: true,
                                                                  only: [name]
                                                              })
                                                          }, 500)
                                                      }
                                                  }}
                                    />
                                    <CommandEmpty>No option found.</CommandEmpty>
                                    <CommandGroup>
                                        {filterDef.options?.map((opt) => {
                                            const isChecked = Array.isArray(activeFilter.value)
                                                ? activeFilter.value.includes(opt.value)
                                                : String(activeFilter.value) === String(opt.value);
                                            return (
                                                <CommandItem
                                                    key={opt.value}
                                                    onSelect={() => {
                                                        const current = Array.isArray(activeFilter.value) ?
                                                            activeFilter.value
                                                            : activeFilter.value ? [activeFilter.value] : [];
                                                        const newSet = new Set(current);
                                                        if (isChecked) {
                                                            newSet.delete(opt.value);
                                                        } else {
                                                            newSet.add(opt.value);
                                                        }
                                                        handleValueChange(Array.from(newSet), activeFilter.operator ?? '')
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
                    )
                }
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded="false"
                                className={cn("w-full justify-between bg-popover")}
                            >
                                {filterDef.options?.find((opt) => opt.value === activeFilter.value)?.label || (
                                    <span className="text-muted-foreground">
                                      {`Select ${filterDef.label}...`}
                                    </span>
                                )}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                                <CommandInput placeholder="Search..." className="h-9"
                                              onValueChange={(val) => {
                                                  if (val && filterDef.serverside) {
                                                      setTimeout(() => {
                                                          const key = `${filterDef.field}_q`;
                                                          router.get(window.location.href, {
                                                              [key]: val,
                                                          }, {
                                                              preserveState: true,
                                                              preserveScroll: true,
                                                              replace: true,
                                                              only: [name],
                                                          })
                                                      }, 500)
                                                  }
                                              }}
                                />
                                <CommandEmpty>No options found.</CommandEmpty>
                                <CommandGroup>
                                    {filterDef.options?.map((opt) => (
                                        <CommandItem
                                            key={opt.value}
                                            value={opt.value}
                                            onSelect={() => {
                                                handleValueChange(opt.value, activeFilter.operator ?? '')
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    opt.value === activeFilter.value ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {opt.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )
            }

            if (filterDef.multiple || activeFilter.operator == 'in' || activeFilter.operator == 'notIn') {
                const selectedValues = new Set(Array.isArray(activeFilter.value) ? activeFilter.value : []);

                return (
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between bg-popover"
                                >
                                    {selectedValues.size > 0
                                        ? `${selectedValues.size} selected`
                                        : `Select ${filterDef.label}...`}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                                    {filterDef.options?.map((option) => {
                                        const isChecked = selectedValues.has(option.value);
                                        return (
                                            <label
                                                key={option.value}
                                                className="flex items-center space-x-2 cursor-pointer"
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        const newSelectedValues = new Set(selectedValues);
                                                        if (checked) {
                                                            newSelectedValues.add(option.value);
                                                        } else {
                                                            newSelectedValues.delete(option.value);
                                                        }
                                                        handleValueChange(Array.from(newSelectedValues), activeFilter.operator ?? '');
                                                    }}
                                                />
                                                <span className="text-sm">{option.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                );
            }

            return (
                <div>
                    <Select
                        onValueChange={(value) => {
                            handleValueChange(value, activeFilter.operator ?? '=')
                        }}
                        value={Array.isArray(activeFilter.value) ? '' : activeFilter.value}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${filterDef.label}...`}/>
                        </SelectTrigger>
                        <SelectContent>
                            {filterDef.options?.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );

        case 'custom': {
            const CustomComponent = filterDef.component ? customFilterComponents[filterDef.component] : null;

            if (CustomComponent) {
                return <CustomComponent
                    value={activeFilter.value}
                    onChange={(value: string | string[]) => handleValueChange(value, activeFilter.operator ?? '=')}
                    filterDef={filterDef}
                    activeFilter={activeFilter}
                />;
            }

            // Fallback untuk custom filter yang tidak terdaftar
            return (
                <div>
                    <p className="text-sm text-muted-foreground p-2">
                        Unregistered custom filter component: <code>{filterDef.component ?? 'N/A'}</code>
                    </p>
                </div>
            );
        }

        case 'date':
            return (
                <div>
                    <AppFieldBuilderFlatpickr
                        field={{
                            name: filterDef.field,
                            key: filterDef.field,
                            order: 1,
                            label: filterDef?.label,
                            type: 'date',
                            mode: 'single',
                            config: filterDef.config,
                            withTime: false,
                            utcConvert: filterDef.utcConvert,
                        }}
                        value={activeFilter.value ?? ''}
                        operator={activeFilter.operator}
                        onChange={(name, value, operator) => {
                            handleValueChange(value, operator ?? '');
                        }}
                    />
                </div>
            );

        case 'boolean':
            return (
                <RadioGroup onValueChange={(val) => {
                    handleValueChange(val, activeFilter.operator ?? '');
                }}
                >
                    <div key={'true'} className="flex items-center space-x-2">
                        <RadioGroupItem className="cursor-pointer" value="true"
                                        id={`${filterDef?.field}-true`}/>
                        <Label
                            htmlFor={`${filterDef?.field}-true`}>Yes</Label>
                    </div>
                    <div key={'false'} className="flex items-center space-x-2">
                        <RadioGroupItem className="cursor-pointer" value="false"
                                        id={`${filterDef?.field}-false`}/>
                        <Label
                            htmlFor={`${filterDef?.field}-false`}>No</Label>
                    </div>
                </RadioGroup>
            )

        case 'text':
        default:
            return (
                <div>
                    <Input
                        type={filterDef.type === 'number' ? 'number' : 'text'}
                        value={Array.isArray(activeFilter.value) ? '' : activeFilter.value}
                        onChange={(e) => handleValueChange(e.target.value, activeFilter.operator ?? '=')}
                        placeholder={`Enter ${filterDef.label}...`}
                    />
                </div>
            );
    }
}
