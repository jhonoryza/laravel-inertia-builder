import { AppDataTableActiveFilters } from '@/components/builder/table/active-filters';
import { ActiveFilter, DataItem, DataTableProps } from '@/types/datatable';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { AppDataTableContent } from './table/content';
import { AppDataTablePagination } from './table/pagination';
import { AppDataTableToolbar } from './table/toolbar';

type DataTable = {
    data: DataTableProps;
    children?: {
        rowAction?: (item: DataItem) => React.ReactNode;
        toolbarAction?: React.ReactNode;
    };
};

export default function AppDataTable({ data, children }: DataTable) {
    const { name, prefix, items, filters, columns, disablePagination } = data;
    const [openFilterPopovers, setOpenFilterPopovers] = useState<Record<string, boolean>>({});
    const openPopover = (field: string) => setOpenFilterPopovers((prev) => ({ ...prev, [field]: true }));
    const closePopover = (field: string) => setOpenFilterPopovers((prev) => ({ ...prev, [field]: false }));

    const { flash } = usePage().props as { flash?: { success?: string; error?: string; link?: string } };

    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        columns.forEach((col) => {
            initial[col.name] = col.hidden;
        });
        return initial;
    });
    const toggleColumn = (colName: string) => {
        setHiddenColumns((prev) => ({
            ...prev,
            [colName]: !prev[colName],
        }));
    };

    const initialActiveFilters: ActiveFilter[] = [];
    if (filters.filter) {
        Object.entries(filters.filter).forEach(([field, value]) => {
            const operator = value.split(':')[0];
            const filterValue = value.split(':')[1];
            initialActiveFilters.push({ field, operator, value: filterValue });
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
            return; // skip first request
        }

        if ((sort.length > 0 && dir.length > 0) || searchQuery.length > 0 || activeFilters.length > 0) {
            // console.log(sort, dir, searchQuery, activeFilters)
            const handler = setTimeout(() => {
                const filterParams = activeFilters.reduce(
                    (acc, filter) => {
                        if (filter.value && Array.isArray(filter.value) && filter.value.length > 0) {
                            const joined =
                                filter.value.length > 1
                                    ? filter.value.join(",")
                                    : filter.value.toString();
                            acc[`${prefix}filter[${filter.field}]`] = filter.operator
                                ? `${filter.operator}:${joined}`
                                : joined;
                        } else if (filter.value) {
                            acc[`${prefix}filter[${filter.field}]`] = filter.operator
                                ? `${filter.operator}:${filter.value}`
                                : (filter.value as string);
                        }
                        return acc;
                    },
                    {} as Record<string, string>
                );

                const params =
                    Object.keys(filterParams).length > 0 ? filterParams : {};

                const routeUrl = data.tableRoute
                    ? data.tableRoute
                    : route(`${data.baseRoute}.index`);
                const searchParam = prefix + "q";
                const sortByParam = prefix + "sort";
                const sortDirParam = prefix + "dir";

                router.get(
                    routeUrl,
                    {
                        ...(params ? { ...params } : {}),
                        [searchParam]: searchQuery,
                        [sortByParam]: sort,
                        [sortDirParam]: dir,
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        only: [name],
                    }
                );
            }, 350);

            // cleanup: if there is changed before 250ms, clear old timeout
            return () => clearTimeout(handler);
        }
    }, [sort, dir, searchQuery, activeFilters, prefix]);

    useEffect(() => {
        if (flash?.success) {
            toast.success('success', {
                position: 'top-right',
                closeButton: true,
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast.error('error', {
                position: 'top-right',
                closeButton: true,
                description: flash.error,
            });
        }
        if (flash?.link) {
            toast.success("download", {
                position: 'top-right',
                duration: 10_000,
                closeButton: true,
                description: (
                    <a
                        href={flash.link}
                        className="text-blue-500 underline hover:cursor-pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download file
                    </a>
                ),
            })
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
                operator: filterDef.operators[0]?.value ?? '',
            };

            setActiveFilters((prev) => [...prev, newFilter]);
            openPopover(field);
            activeFilters
                .filter((filter) => filter.field !== field)
                .forEach((filter) => {
                    closePopover(filter.field);
                });
            return;
        }
        openPopover(field);
        activeFilters
            .filter((filter) => filter.field !== field)
            .forEach((filter) => {
                closePopover(filter.field);
            });
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
                handleAddFilter={handleAddFilter}
                columns={columns}
                toggleColumn={toggleColumn}
                hiddenColumns={hiddenColumns}
                data={data}
            >
                {children && children.toolbarAction}
            </AppDataTableToolbar>
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
                disablePagination={disablePagination}
            >
                {children && children.rowAction}
            </AppDataTableContent>

            {!disablePagination && (
                <AppDataTablePagination
                    data={data}
                    selectedIds={selectedIds}
                    toggleSelectAll={toggleSelectAll}
                />
            )}
        </div>
    );
}
