export type ActiveFilter = {
    field: string;
    operator?: string;
    value?: string | string[];
};

export type FilterOperator = {
    value: string;
    label: string;
};

export type SelectOption = {
    value: string;
    label: string;
};

export type Filter = {
    field: string;
    label: string;
    type: string;
    operators: FilterOperator[];
    config?: Record<string, unknown>;
    utcConvert?: boolean;
    options?: SelectOption[];
    multiple?: boolean;
    searchable?: boolean;
    serverside ?: boolean;
    component?: string;
};

export type DataTableFilters = Record<string, unknown> & {
    q: string;
    sort: string;
    dir: 'asc' | 'desc';
    opt?: Filter[];
    filter?: Record<string, string>;
};

export type DataItem = Record<string, unknown>;

export type PaginatedItems = {
    data: DataItem[];
    current_page: number;
    from: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
    next_page_url?: string;
    prev_page_url?: string;
    first_page_url? : string;
    last_page_url? : string;
};

export type Column = {
    name: string;
    label: string;
    sortable: boolean;
    searchable: boolean;
    hidden: boolean;
    relation?: string;
    relationKey?: string;
    relationType?: 'belongsTo' | 'hasMany';
};

type Action = {
    label: string;
    name: string;
    message: string;
    rowSelected: boolean;
    needConfirm: boolean;
}

export type DataTableProps = {
    items: PaginatedItems;
    columns: Column[];
    filters: DataTableFilters;
    routeName: string;
    tableRoute?: string;
    actions: Action[];
    perPage?: number;
    perPageOptions?: number[];
};
