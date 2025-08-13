import {router, usePage} from '@inertiajs/react';
import {useEffect, useRef, useState} from 'react';
import {toast} from 'sonner';
import {AppDataTableToolbar} from "./app-datatable-toolbar";
import {AppDataTableContent} from "./app-datatable-content";
import {AppDataTablePagination} from "./app-datatable-pagination";
import {ActiveFilter, DataTableCommon} from '@/types/datatable';
import {AppDataTableActiveFilters} from "@/components/builder/app-datatable-active-filters";

type DataTable = {
    data: DataTableCommon;
    routeName: string;
    tableRoute: string;
};

export default function AppDataTable({
     data,
     routeName,
     tableRoute,
 }: DataTable) {
    const { name, prefix, items, filters, columns, actions, perPage, perPageOptions } = data;
    const [openFilterPopovers, setOpenFilterPopovers] = useState<Record<string, boolean>>({});
    const openPopover = (field: string) => setOpenFilterPopovers(prev => ({...prev, [field]: true}));
    const closePopover = (field: string) => setOpenFilterPopovers(prev => ({...prev, [field]: false}));

    const {flash} = usePage().props as { flash?: { success?: string; error?: string; description?: string } };

    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        columns.forEach(col => {
            initial[col.name] = col.hidden;
        });
        return initial;
    });
    const toggleColumn = (colName: string) => {
        setHiddenColumns(prev => ({
            ...prev,
            [colName]: !prev[colName],
        }));
    };

    const initialActiveFilters: ActiveFilter[] = [];
    if (filters.filter) {
        Object.entries(filters.filter).forEach(([field, value]) => {
            const operator = value.split(':')[0];
            const filterValue = value.split(':')[1];
            initialActiveFilters.push({field, operator, value: filterValue});
        });
    }
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(initialActiveFilters);

    const [searchQuery, setSearchQuery] = useState(() => filters.q || '');
    const [sort, setSort] = useState(() => filters.sort);
    const [dir, setDir] = useState(() => filters.dir);

    const firstRender = useRef(true);

    const handleSort = (colName: string) => {
        if (sort === colName) {
            setDir(dir === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(colName);
            setDir('asc');
        }
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return; // skip request pertama
        }

        if (
            (sort.length > 0 && dir.length > 0)
            || searchQuery.length > 0
            || activeFilters.length > 0
        ) {
            // console.log(sort, dir, searchQuery, activeFilters)
            setTimeout(() => {
                const filterParams = activeFilters.reduce((acc, filter) => {
                    if (filter.value && Array.isArray(filter.value) && filter.value.length > 0) {
                        const joined = filter.value.length > 1 ? filter.value.join(',') : filter.value.toString();
                        //console.log(joined);
                        //console.log(filter.value);
                        acc[`${prefix}filter[${filter.field}]`] = filter.operator
                            ? `${filter.operator}:${joined}`
                            : joined;
                    } else if (filter.value) {
                        acc[`${prefix}filter[${filter.field}]`] = filter.operator
                            ? `${filter.operator}:${filter.value}`
                            : filter.value as string;
                    }
                    return acc;
                }, {} as Record<string, string>);

                // if (Object.keys(filterParams).length <= 0 && activeFilters.length > 0) {
                //     return;
                // }

                const params = Object.keys(filterParams).length > 0 ? filterParams : {};
                // console.log(params);

                const routeUrl = tableRoute ? tableRoute : route(`${routeName}.index`);
                const searchParam = prefix + 'q';
                const sortByParam = prefix + 'sort';
                const sortDirParam = prefix + 'dir';
                router.get(
                    routeUrl,
                    {
                        ...(params ? {...params} : {}),
                        [searchParam]: searchQuery,
                        [sortByParam]: sort,
                        [sortDirParam]: dir,
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        only: [name],
                    },
                );
            }, 500);
        }
    }, [sort, dir, searchQuery, activeFilters, tableRoute, routeName, prefix]);

    useEffect(() => {
        if (flash?.success) {
            toast.success('success', {
                position: 'top-center',
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast.error('error', {
                position: "top-center",
                description: flash.error,
            });
        }
    }, [flash]);

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            const visibleIds = items.data.map((item) => item.id as string | number);
            const mergeIds = Array.from(new Set([...visibleIds, ...selectedIds]));
            setSelectedIds(mergeIds);
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectOne = (id: string | number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleAddFilter = (field: string) => {
        const filterExists = activeFilters.some((filter) => filter.field === field);

        if (!filterExists) {
            const filterDef = filters.opt?.find((f) => f.field === field);
            if (!filterDef) return;

            const newFilter: ActiveFilter = {
                field,
                value: filterDef.type === 'select' && filterDef.multiple ? [] : '',
                operator: filterDef.operators[0]?.value ?? ''
            };

            setActiveFilters(prev => [...prev, newFilter]);
            openPopover(field);
            activeFilters.filter((filter) => filter.field !== field).forEach((filter) => {
                closePopover(filter.field);
            })
            return;
        }
        openPopover(field);
        activeFilters.filter((filter) => filter.field !== field).forEach((filter) => {
            closePopover(filter.field);
        })
    };

    const removeFilter = (field: string) => {
        const newFilters = activeFilters.filter((f) => f.field !== field);
        setActiveFilters(newFilters);
    };

    return (
        <div className="overflow-hidden rounded-xl border bg-background text-foreground shadow-sm">
            <AppDataTableToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedIds={selectedIds}
                activeFilters={activeFilters}
                filters={filters}
                handleAddFilter={handleAddFilter}
                columns={columns}
                toggleColumn={toggleColumn}
                hiddenColumns={hiddenColumns}
                routeName={routeName}
                actions={actions}
            />
            <AppDataTableActiveFilters
                name={name}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                filters={filters}
                removeFilter={removeFilter}
                openFilterPopovers={openFilterPopovers}
                openPopover={openPopover}
                closePopover={closePopover}
            />
            <AppDataTableContent
                items={items}
                columns={columns}
                selectedIds={selectedIds}
                hiddenColumns={hiddenColumns}
                sort={sort}
                dir={dir}
                handleSort={handleSort}
                toggleSelectAll={toggleSelectAll}
                toggleSelectOne={toggleSelectOne}
                routeName={routeName}
            />
            <AppDataTablePagination
                name={name}
                prefix={prefix}
                items={items}
                perPage={perPage}
                perPageOptions={perPageOptions}
                selectedIds={selectedIds}
                toggleSelectAll={toggleSelectAll}
            />
        </div>
    );
}
