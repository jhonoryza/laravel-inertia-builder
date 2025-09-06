/* eslint-disable @typescript-eslint/no-explicit-any */
export type FieldOption = {
    label: string;
    value: string | number | boolean;
};

export type ColumnDef = {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
};

export type FieldDefinition = {
    columnSpan?: ColumnDef;
    columnOrder?: ColumnDef;
    name: string;
    key: string;
    label: string;
    prefix?: string;
    suffix?: string;
    grid?: boolean;
    gridKey?: string;
    gridCol?: ColumnDef;
    order: number;
    type: 'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'password'
        | 'textarea' | 'select' | 'combobox' | 'radio' | 'checkbox' | 'toggle'
        | 'markdown' | 'flatpickr' | 'hidden' | 'slider' | 'file'
        | 'checkbox-list' | 'rich-text' | 'repeater' | 'key-value' | 'tags'
        | 'custom';
    options?: FieldOption[];
    isDisable?: boolean;
    hidden?: boolean;
    cols?: number;
    rows?: number;
    mode?: 'single' | 'multiple' | 'range' | 'time';
    config?: Record<string, any>;
    placeholder?: string;
    isInline?: boolean;
    mergeClass?: string;
    min?: number;
    max?: number;
    step?: number;
    accept?: string[];
    multiple?: boolean;
    toolbar?: string[];
    minHeight?: number;
    maxHeight?: number;
    schema?: FieldDefinition[];
    minItems?: number;
    maxItems?: number;
    addButtonLabel?: string;
    itemLabel?: string;
    collapsible?: boolean;
    collapsed?: boolean;
    reorderable?: boolean;
    addable?: boolean;
    editable?: boolean;
    removable?: boolean;
    keyLabel?: string;
    valueLabel?: string;
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    suggestions?: string[];
    separator?: string;
    maxTags?: number;
    tagPrefix?: string;
    withTime?: boolean;
    utcConvert?: boolean;
    searchable?: boolean;
    serverside?: boolean;
    defaultValue?: any;
    reactive?: boolean;
    debounce?: number;
    copyable?: boolean;
    asInfo?: boolean;
};
