/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppFieldBuilderCheckbox } from "@/components/builder/field/checkbox/checkbox";
import { AppFieldBuilderCheckboxList } from '@/components/builder/field/checkbox/checkbox-list';
import { AppFieldBuilderComboboxMultiple } from "@/components/builder/field/combobox/combobox-multiple";
import { AppFieldBuilderComboboxSingle } from "@/components/builder/field/combobox/combobox-single";
import { AppFieldBuilderCustom } from '@/components/builder/field/custom';
import { AppFieldBuilderDate } from "@/components/builder/field/date";
import { AppFieldBuilderDatetime } from '@/components/builder/field/datetime';
import { AppFieldBuilderFile } from '@/components/builder/field/file';
import { AppFieldBuilderFlatpickr } from '@/components/builder/field/flatpickr';
import { AppFieldBuilderHidden } from "@/components/builder/field/hidden";
import { AppFieldBuilderKeyValue } from '@/components/builder/field/key-value';
import { AppFieldBuilderLabel } from "@/components/builder/field/label";
import { AppFieldBuilderMarkdown } from '@/components/builder/field/markdown';
import { AppFieldBuilderPassword } from '@/components/builder/field/password';
import { AppFieldBuilderRepeater } from '@/components/builder/field/repeater';
import { AppFieldBuilderRichText } from '@/components/builder/field/rich-text';
import { AppFieldBuilderSelectMultipleNotSearchable } from "@/components/builder/field/select/multiple/not-searchable";
import { AppFieldBuilderSelectMultipleSearchable } from "@/components/builder/field/select/multiple/searchable";
import { AppFieldBuilderSelectSingleNotSearchable } from "@/components/builder/field/select/single/not-searchable";
import { AppFieldBuilderSelectSingleSearchable } from "@/components/builder/field/select/single/searchable";
import { AppFieldBuilderSlider } from "@/components/builder/field/slider";
import { AppFieldBuilderTags } from '@/components/builder/field/tags';
import { AppFieldBuilderText } from "@/components/builder/field/text";
import { AppFieldBuilderTextarea } from "@/components/builder/field/textarea";
import { AppFieldBuilderToggle } from "@/components/builder/field/toggle";
import { AppFieldInfoDate } from "@/components/builder/info/date";
import { AppFieldInfoFile } from "@/components/builder/info/file";
import { AppFieldInfoMarkdown } from "@/components/builder/info/markdown";
import { AppFieldInfoText } from "@/components/builder/info/text";
import { AppFieldInfoTextList } from "@/components/builder/info/text-list";
import { FieldDefinition } from '@/types/field-builder';
import React from 'react';

interface FieldBuilderProps {
    field: FieldDefinition;
    value: any;
    setFields: React.Dispatch<React.SetStateAction<FieldDefinition[]>>;
    onReactive: (name: string, value: any, operator?: string) => void;
    error?: string;
    isProcessing?: boolean;
}

export function AppFieldBuilder({
    field,
    setFields,
    value,
    onReactive,
    error,
}: FieldBuilderProps) {

    const onChange = (name: string, value: any, operator?: string) => {
        onReactive(name, value, operator);
    };

    if (field.hidden) {
        return <></>;
    }

    value = value == "[]" ? [] : value;

    if (field.asInfo) {
        if (Array.isArray(value)) {
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldInfoTextList value={value} />
                </AppFieldBuilderLabel>
            );
        } else {
            switch (field.type) {
                case 'markdown':
                    return (
                        <AppFieldBuilderLabel field={field} error={error}>
                            <AppFieldInfoMarkdown value={value} />
                        </AppFieldBuilderLabel>
                    );
                case 'datetime-local':
                case 'date':
                    return (
                        <AppFieldBuilderLabel field={field} error={error}>
                            <AppFieldInfoDate value={value} />
                        </AppFieldBuilderLabel>
                    );
                case 'file':
                    return (
                        <AppFieldBuilderLabel field={field} error={error}>
                            <AppFieldInfoFile value={value} />
                        </AppFieldBuilderLabel>
                    );
                default:
                    return (
                        <AppFieldBuilderLabel field={field} error={error}>
                            <AppFieldInfoText value={value} />
                        </AppFieldBuilderLabel>
                    );
            }
        }
    }

    switch (field.type) {
        case 'textarea':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderTextarea field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'slider':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderSlider value={value} field={field} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'file':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderFile field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'text':
        case 'number':
        case 'email':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderText field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'password':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderPassword field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'hidden':
            return (
                <AppFieldBuilderHidden field={field} value={value} onChange={onChange} />
            );
        case 'markdown':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderMarkdown field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'checkbox-list':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderCheckboxList field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'rich-text':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderRichText field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'repeater':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderRepeater field={field} value={value || []} setFields={setFields}
                        onReactive={onReactive} error={error} />
                </AppFieldBuilderLabel>
            );
        case 'key-value':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderKeyValue field={field} value={value || {}} onChange={onChange} error={error} />
                </AppFieldBuilderLabel>
            );
        case 'tags':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderTags field={field} value={value || []} onChange={onChange} error={error} />
                </AppFieldBuilderLabel>
            );
        case 'custom':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderCustom field={field} value={value} onChange={onChange} error={error} />
                </AppFieldBuilderLabel>
            );
        case 'flatpickr':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderFlatpickr field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'date':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderDate field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'datetime-local':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderDatetime field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'select':
            if (field.multiple && !field.searchable) {
                return (
                    <AppFieldBuilderLabel field={field} error={error}>
                        <AppFieldBuilderSelectMultipleNotSearchable field={field} value={value} onChange={onChange} />
                    </AppFieldBuilderLabel>
                );
            }
            if (!field.multiple && field.searchable) {
                return (
                    <AppFieldBuilderLabel field={field} error={error}>
                        <AppFieldBuilderSelectSingleSearchable field={field} value={value} onChange={onChange}
                            setFields={setFields} />
                    </AppFieldBuilderLabel>
                );
            }
            if (field.multiple && field.searchable) {
                return (
                    <AppFieldBuilderLabel field={field} error={error}>
                        <AppFieldBuilderSelectMultipleSearchable field={field} value={value} onChange={onChange}
                            setFields={setFields} />
                    </AppFieldBuilderLabel>
                );
            }
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderSelectSingleNotSearchable field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'combobox':
            if (field.multiple) {
                return (
                    <AppFieldBuilderLabel field={field} error={error}>
                        <AppFieldBuilderComboboxMultiple field={field} value={value} onChange={onChange}
                            setFields={setFields} />
                    </AppFieldBuilderLabel>
                );
            }
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderComboboxSingle field={field} value={value} onChange={onChange}
                        setFields={setFields} />
                </AppFieldBuilderLabel>
            );
        case 'radio':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderDate field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'checkbox':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderCheckbox field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        case 'toggle':
            return (
                <AppFieldBuilderLabel field={field} error={error}>
                    <AppFieldBuilderToggle field={field} value={value} onChange={onChange} />
                </AppFieldBuilderLabel>
            );
        default:
            return <></>;
    }
}
