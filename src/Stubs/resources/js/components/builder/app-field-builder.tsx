/* eslint-disable @typescript-eslint/no-explicit-any */
import {AppFieldBuilderCheckboxList} from '@/components/builder/app-field-builder-checkbox-list';
import {AppFieldBuilderCustom} from '@/components/builder/app-field-builder-custom';
import {AppFieldBuilderDatetime} from '@/components/builder/app-field-builder-datetime';
import {AppFieldBuilderFile} from '@/components/builder/app-field-builder-file';
import {AppFieldBuilderFlatpickr} from '@/components/builder/app-field-builder-flatpickr';
import {AppFieldBuilderKeyValue} from '@/components/builder/app-field-builder-key-value';
import {AppFieldBuilderMarkdown} from '@/components/builder/app-field-builder-markdown';
import {AppFieldBuilderRepeater} from '@/components/builder/app-field-builder-repeater';
import {AppFieldBuilderRichText} from '@/components/builder/app-field-builder-rich-text';
import {AppFieldBuilderTags} from '@/components/builder/app-field-builder-tags';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Checkbox} from '@/components/ui/checkbox';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from '@/components/ui/command';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {FieldDefinition} from '@/types/field-builder';
import {router} from '@inertiajs/react';
import {format} from 'date-fns';
import {Check, ChevronsUpDown, Copy} from 'lucide-react';
import React, {Key, useState} from 'react';
import {AppFieldBuilderPassword} from './app-field-builder-password';

interface FieldBuilderProps {
    field: FieldDefinition;
    value: any;
    setFields: React.Dispatch<React.SetStateAction<FieldDefinition[]>>;
    onReactive: (name: string, value: any, operator?: string) => void;
    error?: string;
    isProcessing?: boolean;
}

export function AppFieldBuilder({field, setFields, value, onReactive, error, isProcessing}: FieldBuilderProps) {
    const handleReactiveChange = (newValue: any) => {
        onChange(field.name, newValue);
        // setData(field.name, newValue);
        // if (field.reactive && newValue) {
        //     const data = {[field.name]: newValue};
        //     router.get(window.location.href, data, {
        //         preserveState: true,
        //         preserveScroll: true,
        //         replace: true,
        //         only: ['form'],
        //     });
        // }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const newValue = target.type === 'checkbox' ? target.checked : target.value;
        handleReactiveChange(newValue);
    };

    const onChange = (name: string, value: any, operator?: string) => {
        onReactive(name, value, operator);
    };

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!value) return;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                // fallback lama
                const textarea = document.createElement('textarea');
                textarea.value = value;
                textarea.style.position = 'fixed'; // biar gak geser scroll
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    if (field.hidden) {
        return <></>;
    }

    value = value == "[]" ? [] : value;

    if (field.asInfo) {
        if (Array.isArray(value)) {
            return (
                <div
                    key={field.key}
                    className={`space-y-2 ${field.isInline ? "flex items-center space-x-2" : ""}`}
                >
                    <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                        {field.label}
                    </Label>
                    <ul className="w-full list-disc space-y-1 px-3 text-sm shadow-sm">
                        {value.map((v, i) => (
                            <li key={i} className="text-muted-foreground">
                                {typeof v === 'boolean' ? (v ? 'true' : 'false') : v || '-'}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return (
                <div
                    key={field.key}
                    className={`space-y-2 ${field.isInline ? "flex items-center space-x-2" : ""}`}
                >
                    <Label htmlFor={field.name} className="text-sm font-bold text-foreground">
                        {field.label}
                    </Label>
                    <div
                        className="flex w-full items-center text-sm text-muted-foreground">
                        {typeof value === 'boolean' ? (value ? 'true' : 'false') : value || '-'}
                    </div>
                </div>
            );
        }
    }

    switch (field.type) {
        case 'textarea':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Textarea
                        id={field.name}
                        value={value || ''}
                        onChange={handleChange}
                        cols={field.cols}
                        rows={field.rows}
                        placeholder={field.placeholder || 'Fill in here..'}
                        className={field.mergeClass}
                        disabled={field.isDisable || isProcessing}
                    />
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'slider':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
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
                        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                            <span>{field.min || 0}</span>
                            <span>{value || 0}</span>
                            <span>{field.max || 100}</span>
                        </div>
                    </div>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'file':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderFile field={field} value={value} onChange={onChange}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'text':
        case 'number':
        case 'email':
            return (
                <div key={field.key} className={`space-y-2 ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <div
                        className="flex w-full rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
                        {field.prefix && (
                            <span
                                className="flex items-center border-r border-input px-3 text-sm text-muted-foreground">{field.prefix}</span>
                        )}
                        <Input
                            id={field.name}
                            type={field.type}
                            value={value || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder || 'Fill in here..'}
                            className={cn(field.mergeClass, 'flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0')}
                            disabled={field.isDisable || isProcessing}
                        />
                        {field.suffix && (
                            <span
                                className="flex items-center border-l border-input px-3 text-sm text-muted-foreground">{field.suffix}</span>
                        )}
                        {field.copyable && (
                            <Button type="button" variant="ghost" size="icon" onClick={handleCopy}
                                    className="ml-1 h-9 w-9" disabled={!value}>
                                <Copy className="h-4 w-4"/>
                                <span className="sr-only">Copy</span>
                            </Button>
                        )}
                    </div>
                    {copied && <div className="text-xs text-muted-foreground">Copied!</div>}
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'password':
            return <AppFieldBuilderPassword field={field} value={value} error={error} handleChange={handleChange}/>;
        case 'hidden':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Input
                        id={field.name}
                        type={field.type}
                        value={value || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder || 'Fill in here..'}
                        className={cn(field.mergeClass, 'hidden')}
                        disabled={field.isDisable || isProcessing}
                    />
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'markdown':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderMarkdown field={field} value={value} onChange={onChange}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'checkbox-list':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderCheckboxList field={field} value={value} onChange={onChange}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'rich-text':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderRichText field={field} value={value} onChange={onChange}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'repeater':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderRepeater field={field} value={value || []} setFields={setFields} onReactive={onReactive} error={error}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'key-value':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderKeyValue field={field} value={value || {}} onChange={onChange} error={error}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'tags':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderTags field={field} value={value || []} onChange={onChange} error={error}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'custom':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderCustom field={field} value={value} onChange={onChange} error={error}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'flatpickr':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderFlatpickr field={field} value={value} onChange={onChange}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'date':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                id={field.name}
                                disabled={field.isDisable || isProcessing}
                                className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground', field.mergeClass)}
                            >
                                {value ? format(new Date(value), 'dd/MM/yyyy') : 'select date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar mode="single" selected={value} captionLayout="dropdown"
                                      onSelect={(date) => handleReactiveChange(date)}/>
                        </PopoverContent>
                    </Popover>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'datetime-local':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <AppFieldBuilderDatetime field={field} value={value} onChange={onChange}/>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'select':
            if (field.multiple && !field.searchable) {
                return (
                    <div key={field.key}
                         className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={field.isDisable || isProcessing}
                                    className={cn('w-full justify-between text-muted-foreground hover:text-muted-foreground', field.mergeClass)}
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
                        {error && <div className="text-xs text-destructive">{error}</div>}
                    </div>
                );
            }
            if (!field.multiple && field.searchable) {
                return (
                    <div key={field.key}
                         className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded="false"
                                    disabled={field.isDisable || isProcessing}
                                    className={cn('w-full justify-between', field.mergeClass)}
                                >
                                    {isProcessing
                                        ? 'Loading...'
                                        : field.options?.find((opt) => opt.value === value)?.label || (
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
                                                onSelect={() => handleReactiveChange(opt.value)}
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
                        {error && <div className="text-xs text-destructive">{error}</div>}
                    </div>
                );
            }
            if (field.multiple && field.searchable) {
                return (
                    <div key={field.key}
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
                        {error && <div className="text-xs text-destructive">{error}</div>}
                    </div>
                );
            }
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Select
                        value={value.toString() || ''}
                        onValueChange={(val) => handleReactiveChange(val)}
                        disabled={field.isDisable || isProcessing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={field.placeholder || 'Select an option'}/>
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                            {isProcessing && (
                                <SelectItem value="loading" disabled>
                                    Loading...
                                </SelectItem>
                            )}
                            {field.options?.map((opt) => (
                                <SelectItem key={field.key + opt.value as Key} value={opt.value.toString() as string}
                                            className={field.mergeClass}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'combobox':
            if (field.multiple) {
                return (
                    <div key={field.key}
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
                        {error && <div className="text-xs text-destructive">{error}</div>}
                    </div>
                );
            }
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded="false"
                                disabled={field.isDisable || isProcessing}
                                className={cn('w-full justify-between', field.mergeClass)}
                            >
                                {isProcessing
                                    ? 'Loading...'
                                    : field.options?.find((opt) => opt.value === value)?.label || (
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
                                            onSelect={() => handleReactiveChange(opt.value)}
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
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'radio':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <RadioGroup value={value || ''} onValueChange={(val) => handleReactiveChange(val)}
                                disabled={field.isDisable || isProcessing}>
                        {field.options?.map((opt) => (
                            <div key={opt.value.toString()}
                                 className={cn('flex items-center space-x-2', field.mergeClass)}>
                                <RadioGroupItem value={opt.value.toString()} id={`${field.name}-${opt.value}`}/>
                                <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'checkbox':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Checkbox
                        id={field.name}
                        checked={!!value}
                        onCheckedChange={(checked) => handleReactiveChange(checked)}
                        className={field.mergeClass}
                        disabled={field.isDisable || isProcessing}
                    />
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        case 'toggle':
            return (
                <div key={field.key} className={`'space-y-2' ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
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
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
            );
        default:
            return <></>;
    }
}
