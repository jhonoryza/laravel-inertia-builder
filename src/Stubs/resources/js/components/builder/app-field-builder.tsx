/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {Key} from 'react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Checkbox} from '@/components/ui/checkbox';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {AppFieldBuilderDatetime} from "@/components/builder/app-field-builder-datetime";
import {AppFieldBuilderMarkdown} from "@/components/builder/app-field-builder-markdown";
import {AppFieldBuilderFlatpickr} from "@/components/builder/app-field-builder-flatpickr";
import {AppFieldBuilderFile} from "@/components/builder/app-field-builder-file";
import {AppFieldBuilderCheckboxList} from "@/components/builder/app-field-builder-checkbox-list";
import {AppFieldBuilderRichText} from "@/components/builder/app-field-builder-rich-text";
import {AppFieldBuilderRepeater} from "@/components/builder/app-field-builder-repeater";
import {AppFieldBuilderKeyValue} from "@/components/builder/app-field-builder-key-value";
import {AppFieldBuilderTags} from "@/components/builder/app-field-builder-tags";
import {AppFieldBuilderCustom} from "@/components/builder/app-field-builder-custom";
import {Slider} from "@/components/ui/slider";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {FieldDefinition} from "@/types/field-builder";
import {router} from "@inertiajs/react";

interface FieldBuilderProps {
    field: FieldDefinition;
    value: any;
    setData: (field: string, value: any) => void;
    error?: string;
    isProcessing?: boolean;
}

export function AppFieldBuilder({field, value, setData, error, isProcessing}: FieldBuilderProps) {
    const handleReactiveChange = (newValue: any) => {
        setData(field.name, newValue);
        if (field.reactive && newValue) {
            const data = {[field.name]: newValue};
            router.get(window.location.href, data, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['fields'],
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const newValue = target.type === 'checkbox' ? target.checked : target.value;
        handleReactiveChange(newValue);
    };

    if (field.hidden) {
        return (<></>);
    }

    switch (field.type) {
        case 'textarea':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Textarea
                        id={field.name}
                        value={value || ''}
                        onChange={handleChange}
                        cols={field.cols}
                        rows={field.rows}
                        placeholder={field.placeholder || ''}
                        className={field.mergeClass}
                        disabled={field.isDisable || isProcessing}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'slider':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <div className="pt-4">
                        <Slider
                            id={field.name}
                            min={field.min || 0}
                            max={field.max || 100}
                            step={field.step || 1}
                            value={[value || 0]}
                            onValueChange={(vals) => handleReactiveChange(vals[0])}
                            className={field.mergeClass}
                            disabled={field.isDisable || isProcessing}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{field.min || 0}</span>
                            <span>{value || 0}</span>
                            <span>{field.max || 100}</span>
                        </div>
                    </div>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'file':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderFile
                        field={field}
                        value={value}
                        setData={setData}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'text':
        case 'number':
        case 'email':
        case 'password':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                        id={field.name}
                        type={field.type}
                        value={value || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder || ''}
                        className={cn(field.mergeClass)}
                        disabled={field.isDisable || isProcessing}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'hidden':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Input
                        id={field.name}
                        type={field.type}
                        value={value || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder || ''}
                        className={cn(field.mergeClass, 'hidden')}
                        disabled={field.isDisable || isProcessing}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'markdown':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderMarkdown
                        field={field}
                        value={value}
                        setData={setData}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'checkbox-list':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderCheckboxList
                        field={field}
                        value={value}
                        setData={setData}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'rich-text':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderRichText
                        field={field}
                        value={value}
                        setData={setData}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'repeater':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderRepeater
                        field={field}
                        value={value || []}
                        setData={setData}
                        error={error}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'key-value':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderKeyValue
                        field={field}
                        value={value || {}}
                        setData={setData}
                        error={error}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'tags':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderTags
                        field={field}
                        value={value || []}
                        setData={setData}
                        error={error}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'custom':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderCustom
                        field={field}
                        value={value}
                        setData={setData}
                        error={error}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'flatpickr':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderFlatpickr
                        field={field}
                        value={value}
                        setData={setData}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'date':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                id={field.name}
                                disabled={field.isDisable || isProcessing}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !value && "text-muted-foreground",
                                    field.mergeClass
                                )}
                            >
                                {value ? format(new Date(value), "dd/MM/yyyy") : "select date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                            <Calendar
                                mode="single"
                                selected={value}
                                captionLayout="dropdown"
                                onSelect={(date) => handleReactiveChange(date)}
                            />
                        </PopoverContent>
                    </Popover>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'datetime-local':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderDatetime
                        field={field}
                        value={value}
                        setData={setData}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'select':
            if (field.multiple && !field.searchable) {
                return (
                    <div key={field.name}
                         className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={field.isDisable || isProcessing}
                                    className={cn("w-full justify-between text-muted-foreground hover:text-muted-foreground", field.mergeClass)}
                                >
                                    {(value?.length > 0
                                        ? `${value.length} selected`
                                        : field.placeholder || 'Select options')}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                                    {field.options?.map((opt) => {
                                        const checked = (value || []).includes(opt.value);
                                        return (
                                            <label
                                                key={opt.value.toString()}
                                                className="flex items-center space-x-2 cursor-pointer"
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={(isChecked) => {
                                                        const newValue = new Set(value || []);
                                                        if (isChecked) {
                                                            newValue.add(opt.value)
                                                        } else {
                                                            newValue.delete(opt.value)
                                                        }
                                                        handleReactiveChange(Array.from(newValue));
                                                    }}
                                                />
                                                <span className="text-sm">{opt.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>
                        {error && <div className="text-sm text-destructive">{error}</div>}
                    </div>
                )
            }
            if (!field.multiple && field.searchable) {
                return (
                    <div key={field.name}
                         className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded="false"
                                    disabled={field.isDisable || isProcessing}
                                    className={cn("w-full justify-between", field.mergeClass)}
                                >
                                    {isProcessing ? 'Loading...' : field.options?.find((opt) => opt.value === value)?.label || (
                                        <span className="text-muted-foreground">
                                      {field.placeholder || 'Select an option'}
                                    </span>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                    <CommandInput placeholder="Search..." className="h-9"
                                                  onValueChange={(val) => {
                                                      if (val && field.serverside) {
                                                          setTimeout(() => {
                                                              const key = `${field.name}_q`;
                                                              router.get(window.location.href, {
                                                                  [key]: val,
                                                              }, {
                                                                  preserveState: true,
                                                                  preserveScroll: true,
                                                                  replace: true,
                                                                  only: ['fields'],
                                                              })
                                                          }, 500)
                                                      }
                                                  }}
                                    />
                                    <CommandEmpty>No options found.</CommandEmpty>
                                    <CommandGroup>
                                        {field.options?.map((opt) => (
                                            <CommandItem
                                                key={opt.label.toString()}
                                                value={opt.label.toString()}
                                                onSelect={() => handleReactiveChange(opt.value)}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        opt.value === value ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                />
                                                {opt.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {error && <div className="text-sm text-destructive">{error}</div>}
                    </div>
                )
            }
            if (field.multiple && field.searchable) {
                return (
                    <div key={field.name}
                         className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={field.isDisable || isProcessing}
                                    className={cn('w-full justify-between', field.mergeClass)}
                                >
                                    {value
                                        ? `${value.length} selected`
                                        : field.placeholder || 'Select options'}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                    <CommandInput placeholder="Search..." className="h-9"
                                                  onValueChange={(val) => {
                                                      if (val && field.serverside) {
                                                          setTimeout(() => {
                                                              const key = `${field.name}_q`;
                                                              router.get(window.location.href, {
                                                                  [key]: val,
                                                              }, {
                                                                  preserveState: true,
                                                                  preserveScroll: true,
                                                                  replace: true,
                                                                  only: ['fields'],
                                                              })
                                                          }, 500)
                                                      }
                                                  }}
                                    />
                                    <CommandEmpty>No option found.</CommandEmpty>
                                    <CommandGroup>
                                        {field.options?.map((opt) => {
                                            const isChecked = Array.isArray(value)
                                                ? value.includes(opt.value)
                                                : String(value) === String(opt.value);
                                            return (
                                                <CommandItem
                                                    key={opt.label.toString()}
                                                    value={opt.label.toString()}
                                                    onSelect={() => {
                                                        const current = Array.isArray(value) ? value : value ? [value] : [];
                                                        const newSet = new Set(current);
                                                        if (isChecked) {
                                                            newSet.delete(opt.value);
                                                        } else {
                                                            newSet.add(opt.value);
                                                        }
                                                        handleReactiveChange(Array.from(newSet));
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
                        {error && <div className="text-sm text-destructive">{error}</div>}
                    </div>
                )
            }
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Select value={value.toString() || ''} onValueChange={(val) => handleReactiveChange(val)}
                            disabled={field.isDisable || isProcessing}>
                        <SelectTrigger>
                            <SelectValue placeholder={field.placeholder || 'Select an option'}/>
                        </SelectTrigger>
                        <SelectContent>
                            {isProcessing && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                            {field.options?.map((opt) => (
                                <SelectItem key={opt.value as Key} value={opt.value.toString() as string}
                                            className={field.mergeClass}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'combobox':
            if (field.multiple) {
                return (
                    <div key={field.name}
                         className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={field.isDisable || isProcessing}
                                    className={cn('w-full justify-between', field.mergeClass)}
                                >
                                    {value
                                        ? `${value.length} selected`
                                        : field.placeholder || 'Select options'}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                    <CommandInput placeholder="Search..." className="h-9"
                                                  onValueChange={(val) => {
                                                      if (val && field.serverside) {
                                                          setTimeout(() => {
                                                              const key = `${field.name}_q`;
                                                              router.get(window.location.href, {
                                                                  [key]: val,
                                                              }, {
                                                                  preserveState: true,
                                                                  preserveScroll: true,
                                                                  replace: true,
                                                                  only: ['fields'],
                                                              })
                                                          }, 500)
                                                      }
                                                  }}
                                    />
                                    <CommandEmpty>No option found.</CommandEmpty>
                                    <CommandGroup>
                                        {field.options?.map((opt) => {
                                            const isChecked = Array.isArray(value)
                                                ? value.includes(opt.value)
                                                : String(value) === String(opt.value);
                                            return (
                                                <CommandItem
                                                    key={opt.label.toString()}
                                                    value={opt.label.toString()}
                                                    onSelect={() => {
                                                        const current = Array.isArray(value) ? value : value ? [value] : [];
                                                        const newSet = new Set(current);
                                                        if (isChecked) {
                                                            newSet.delete(opt.value);
                                                        } else {
                                                            newSet.add(opt.value);
                                                        }
                                                        handleReactiveChange(Array.from(newSet));
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
                        {error && <div className="text-sm text-destructive">{error}</div>}
                    </div>
                )
            }
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded="false"
                                disabled={field.isDisable || isProcessing}
                                className={cn("w-full justify-between", field.mergeClass)}
                            >
                                {isProcessing ? 'Loading...' : field.options?.find((opt) => opt.value === value)?.label || (
                                    <span className="text-muted-foreground">
                                      {field.placeholder || 'Select an option'}
                                    </span>
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                                <CommandInput placeholder="Search..." className="h-9"
                                              onValueChange={(val) => {
                                                  if (val && field.serverside) {
                                                      setTimeout(() => {
                                                          const key = `${field.name}_q`;
                                                          router.get(window.location.href, {
                                                              [key]: val,
                                                          }, {
                                                              preserveState: true,
                                                              preserveScroll: true,
                                                              replace: true,
                                                              only: ['fields'],
                                                          })
                                                      }, 500)
                                                  }
                                              }}
                                />
                                <CommandEmpty>No options found.</CommandEmpty>
                                <CommandGroup>
                                    {field.options?.map((opt) => (
                                        <CommandItem
                                            key={opt.label.toString()}
                                            value={opt.label.toString()}
                                            onSelect={() => handleReactiveChange(opt.value)}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    opt.value === value ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {opt.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'radio':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <RadioGroup value={value || ''} onValueChange={(val) => handleReactiveChange(val)}
                                disabled={field.isDisable || isProcessing}>
                        {field.options?.map((opt) => (
                            <div key={opt.value.toString()}
                                 className={cn(
                                     "flex items-center space-x-2",
                                     field.mergeClass
                                 )}
                            >
                                <RadioGroupItem value={opt.value.toString()} id={`${field.name}-${opt.value}`}/>
                                <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'checkbox':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Checkbox
                        id={field.name}
                        checked={!!value}
                        onCheckedChange={(checked) => handleReactiveChange(checked)}
                        className={field.mergeClass}
                        disabled={field.isDisable || isProcessing}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        case 'toggle':
            return (
                <div key={field.name} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <div>
                        <Switch
                            id={field.name}
                            checked={!!value}
                            onCheckedChange={(checked) => handleReactiveChange(checked)}
                            className={field.mergeClass}
                            disabled={field.isDisable || isProcessing}
                        />
                    </div>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                </div>
            )
        default:
            return (<></>);
    }
}
