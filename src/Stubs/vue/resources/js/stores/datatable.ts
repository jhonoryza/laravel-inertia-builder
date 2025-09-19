import { ActiveFilter, DataItem, DataTableProps, Filter, PaginatedItems } from "@/types/datatable";
import { defineStore } from "pinia";
import { computed, reactive, readonly, ref } from "vue";

export const useDatatableStore = (prefix: string) => {
    return defineStore(`table-${prefix}`, () => {
        const createEmptyTableData = (): DataTableProps => ({
            name: '',
            title: '',
            prefix: '',
            items: {
                data: [],
                current_page: 1,
                from: 0,
                last_page: 1,
                links: [],
                path: '',
                per_page: 10,
                to: 0,
                total: 0
            },
            columns: [],
            filters: {
                q: '',
                sort: '',
                dir: 'asc'
            },
            actions: [],
            baseRoute: '',
            edit: false,
            view: false,
            delete: false,
            forceDelete: false,
            restore: false,
            disablePagination: false,
            paginationMethod: 'simple'
        });

        const tableData = reactive<DataTableProps>(createEmptyTableData());

        const isEmpty = computed(() => !tableData.prefix);
        const items = computed(() => tableData.items);
        const data = computed(() => (tableData.disablePagination ? tableData.items : tableData.items.data) as unknown as DataItem[]);
        const totalItems = computed(() => tableData.items.total);
        const currentPage = computed(() => tableData.items.current_page);
        const isInitialized = computed(() => tableData.name !== '');
        const hasSimplePaginate = computed(() => tableData.paginationMethod === 'simple' || tableData.paginationMethod === 'cursor');
        const isAllSelected = computed({
            get: () => {
                const condition = hasSimplePaginate.value ?
                    data.value.every((item) => selectedIds.value.includes(item.id as string | number))
                    : selectedIds.value.length == totalItems.value;
                return (
                    data.value.length > 0 &&
                    condition
                );
            },
            set: (val) => toggleSelectAll(val)
        });
        const checkedMap = computed(() =>
            Object.fromEntries(
                data.value.map((item) => [
                    item.id,
                    computed({
                        get: () => isChecked(item.id as string),
                        set: () => toggleSelectOne(item.id as string),
                    }),
                ])
            )
        )

        const setData = (newData: DataTableProps) => {
            Object.assign(tableData, newData);
        };

        const resetData = () => {
            Object.assign(tableData, createEmptyTableData());
        };

        const updateItems = (newItems: PaginatedItems) => {
            tableData.items = newItems;
        };

        const updateItemsData = (newData: DataItem[]) => {
            tableData.items.data = newData;
        };

        const updateSingleItem = (index: number, updatedItem: DataItem) => {
            if (tableData.items.data[index]) {
                Object.assign(tableData.items.data[index], updatedItem);
            }
        };

        const addItem = (newItem: DataItem) => {
            tableData.items.data.unshift(newItem);
            tableData.items.total += 1;
        };

        const removeItem = (index: number) => {
            tableData.items.data.splice(index, 1);
            tableData.items.total -= 1;
        };

        const updateFilters = (filters: Partial<DataTableProps['filters']>) => {
            Object.assign(tableData.filters, filters);
        };

        const updatePagination = (page: number) => {
            tableData.items.current_page = page;
        };

        // UI State Management
        const selectedIds = ref<(string | number)[]>([]);
        const hiddenColumns = ref<Record<string, boolean>>({});
        const activeFilters = ref<ActiveFilter[]>([]);
        const openFilterPopovers = ref<Record<string, boolean>>({});

        // Initialize UI state when data is set
        const initializeUIState = () => {
            // Initialize hidden columns based on column definitions
            hiddenColumns.value = tableData.columns.reduce((acc, col) => {
                acc[col.name] = col.hidden;
                return acc;
            }, {} as Record<string, boolean>);

            // Initialize active filters from existing filters
            activeFilters.value = [];
            if (tableData.filters.filter) {
                Object.entries(tableData.filters.filter).forEach(([field, value]) => {
                    const [operator, filterValue] = value.split(":");
                    activeFilters.value.push({ field, operator, value: filterValue });
                });
            }

            // Reset selections
            selectedIds.value = [];
            openFilterPopovers.value = {};
        };

        // Selection actions

        const isChecked = (id: string | number) => {
            return selectedIds.value.includes(id) ? true : false;
        };

        const toggleSelectAll = (checked: boolean) => {
            if (checked) {
                const visibleIds = data.value.map((item) => item.id as string | number);
                const mergeIds = Array.from(new Set([...visibleIds, ...selectedIds.value]));
                selectedIds.value = mergeIds;
            } else {
                selectedIds.value = [];
            }
        };

        const toggleSelectOne = (id: string | number) => {
            if (selectedIds.value.includes(id)) {
                selectedIds.value = selectedIds.value.filter(x => x !== id);
            } else {
                selectedIds.value = [...selectedIds.value, id];
            }
        };

        const clearSelection = () => {
            selectedIds.value = [];
        };

        // Column visibility actions
        const toggleColumn = (colName: string) => {
            hiddenColumns.value[colName] = !hiddenColumns.value[colName];
        };

        const showAllColumns = () => {
            Object.keys(hiddenColumns.value).forEach(key => {
                hiddenColumns.value[key] = false;
            });
        };

        const hideAllColumns = () => {
            Object.keys(hiddenColumns.value).forEach(key => {
                hiddenColumns.value[key] = true;
            });
        };

        // Filter actions
        const addFilter = (field: string) => {
            const filterExists = activeFilters.value.some(filter => filter.field === field);
            if (!filterExists) {
                const filterDef = tableData.filters.opt?.find((f: Filter) => f.field === field);
                if (!filterDef) return;

                const newFilter: ActiveFilter = {
                    field,
                    value: filterDef.type === "select" && filterDef.multiple ? [] : "",
                    operator: filterDef.operators[0]?.value ?? "",
                };

                activeFilters.value = [...activeFilters.value, newFilter];
            }
            openPopover(field);

            activeFilters.value
                .filter((filter) => filter.field !== field)
                .forEach((filter) => {
                    closePopover(filter.field);
                });
        };

        const removeFilter = (field: string) => {
            activeFilters.value = activeFilters.value.filter(f => f.field !== field);
            delete openFilterPopovers.value[field];
        };

        const clearAllFilters = () => {
            activeFilters.value = [];
            openFilterPopovers.value = {};
        };

        const updateFilter = (field: string, updates: Partial<ActiveFilter>) => {
            const filterIndex = activeFilters.value.findIndex(f => f.field === field);
            if (filterIndex !== -1) {
                activeFilters.value[filterIndex] = { ...activeFilters.value[filterIndex], ...updates };
            }
        };

        // Filter popover actions
        const openPopover = (field: string) => {
            openFilterPopovers.value[field] = true;
            // Close other popovers
            Object.keys(openFilterPopovers.value).forEach(key => {
                if (key !== field) {
                    openFilterPopovers.value[key] = false;
                }
            });
        };

        const closePopover = (field: string) => {
            openFilterPopovers.value[field] = false;
        };

        const closeAllPopovers = () => {
            openFilterPopovers.value = {};
        };

        // Computed for UI state
        const hasSelection = computed(() => selectedIds.value.length > 0);
        const hasFilters = computed(() => activeFilters.value.length > 0);
        const visibleColumns = computed(() =>
            tableData.columns.filter(col => !hiddenColumns.value[col.name])
        );

        // Override setData to initialize UI state
        const setDataWithUIInit = (newData: DataTableProps) => {
            resetData();
            setData(newData);
            initializeUIState();
        };

        const searchQuery = ref(tableData.filters.q || "");

        const sort = ref(tableData.filters.sort);
        const dir = ref(tableData.filters.dir);

        const handleSort = (colName: string) => {
            if (sort.value === colName) {
                dir.value = dir.value === "asc" ? "desc" : "asc";
            } else {
                sort.value = colName;
                dir.value = "asc";
            }
        };

        const updateFilterOptions = (field: string, options: { id: string, value: any; label: string }[]) => {
            const filterDef = tableData.filters.opt?.find(f => f.field === field);
            if (filterDef) {
                filterDef.options = options;
            }
        };

        const handleFilterChange = (field: string, value: string | string[], operator: string) => {
            const newFilters = activeFilters.value.map(f =>
                f.field === field ? { ...f, value, operator } : f
            );
            activeFilters.value = newFilters;
        };

        const getDisplayFilter = (filter: ActiveFilter, filterDef: Filter) => {
            const value = filter.value;
            if (Array.isArray(value)) {
                if (value.length === 0) return 'None';
                const labels = filterDef.options?.filter(opt => value.includes(opt.value)).map(opt => opt.label) || [];
                if (labels.length > 2) return `${labels.length} selected`;
                return labels.join(', ');
            }
            if (filterDef.type === 'select') {
                return filterDef.options?.find(opt => opt.value === value)?.label || String(value);
            }
            return String(value);
        };

        return {
            // State
            tableData,

            // Computed
            isEmpty,
            items: readonly(items),
            data: readonly(data),
            totalItems,
            currentPage,
            isInitialized,
            isAllSelected,
            checkedMap,

            // UI State
            selectedIds,
            hiddenColumns,
            activeFilters,
            openFilterPopovers,
            searchQuery,
            sort,
            dir,

            // UI Computed
            hasSelection,
            hasFilters,
            visibleColumns,

            // Data Actions
            setData: setDataWithUIInit,
            updateItems,
            updateItemsData,
            updateSingleItem,
            addItem,
            removeItem,
            updateFilters,
            updatePagination,
            initializeUIState,

            // Search and Sort Actions
            handleSort,

            // Selection Actions
            toggleSelectAll,
            toggleSelectOne,
            clearSelection,
            isChecked,

            // Column Actions
            toggleColumn,
            showAllColumns,
            hideAllColumns,

            // Filter Actions
            addFilter,
            removeFilter,
            clearAllFilters,
            updateFilter,
            handleFilterChange,
            getDisplayFilter,

            // Popover Actions
            openPopover,
            closePopover,
            closeAllPopovers,

            // Update filter options
            updateFilterOptions,
        };
    });
};
