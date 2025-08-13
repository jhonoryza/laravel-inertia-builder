import {Dispatch, SetStateAction} from 'react';
import {
    ActiveFilter,
    DataTableFilters,
    Filter as FilterType
} from '@/types/datatable';
import {X, XIcon} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {AppDataTableFilterInput} from './app-datatable-filter-input';
import {AppDatatableFilterOperator} from "@/components/builder/app-datatable-filter-operator";
import {cn} from "@/lib/utils";

interface AppDataTableActiveFiltersProps {
    name: string;
    activeFilters: ActiveFilter[];
    setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
    filters: DataTableFilters;
    removeFilter: (field: string) => void;
    openFilterPopovers: Record<string, boolean>;
    openPopover: (field: string) => void;
    closePopover: (field: string) => void;
}

export function AppDataTableActiveFilters({
                                              name,
                                              activeFilters,
                                              setActiveFilters,
                                              filters,
                                              removeFilter,
                                              openFilterPopovers,
                                              openPopover,
                                              closePopover
                                          }: AppDataTableActiveFiltersProps) {

    const handleFilterValueChange = (field: string, value: string | string[], operator: string) => {
        setActiveFilters((prevFilters) =>
            prevFilters.map((f) => (f.field === field ? {...f, value, operator} : f)),
        );
    };

    const getDisplayValue = (filter: ActiveFilter, filterDef: FilterType): string => {
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
    }

    return (
        <div className={cn(
            'px-2 flex flex-wrap items-center gap-2',
            activeFilters.length > 0 ? 'mb-2' : '',
        )}>
            {activeFilters.map((filter) => {
                const filterDef = filters.opt?.find((f) => f.field === filter.field);
                if (!filterDef) return null;

                return (
                    <Popover key={filter.field}
                             open={Boolean(openFilterPopovers[filter.field])}
                             onOpenChange={open => open ? openPopover(filter.field) : closePopover(filter.field)}
                    >
                        <div className="flex items-center relative group">
                            <PopoverTrigger asChild>
                                <button
                                    className="inline-flex items-center cursor-pointer
                                         justify-center rounded border px-2 py-1 text-xs font-medium
                                         whitespace-nowrap shrink-0 gap-2
                                         focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
                                         hover:bg-accent hover:text-accent-foreground"
                                >
                                    <span className="text-muted-foreground">{filterDef.label}</span>
                                    <span className="text-muted-foreground">{filter.operator ?? ''}</span>
                                    <span className="font-semibold">{getDisplayValue(filter, filterDef)}</span>
                                </button>
                            </PopoverTrigger>
                            <button
                                onClick={() => removeFilter(filter.field)}
                                className="absolute -right-2 -top-2 z-10 h-4 w-4 items-center justify-center
                                    rounded-full border bg-background text-foreground/60 hover:cursor-pointer
                                    hover:opacity-60 hidden group-hover:inline-flex"
                            >
                                <XIcon className="h-3 w-3"/>
                            </button>
                        </div>
                        <PopoverContent className="w-full p-2" align="start"
                                        onInteractOutside={e => e.preventDefault()}>
                            <div className="flex flex-col gap-2 items-center min-w-2xs">
                                <AppDatatableFilterOperator
                                    filterDef={filterDef}
                                    activeFilter={filter}
                                    onFilterChange={handleFilterValueChange}
                                />
                                <div className="w-full">
                                    <AppDataTableFilterInput
                                        name={name}
                                        filterDef={filterDef}
                                        activeFilter={filter}
                                        onFilterChange={handleFilterValueChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end w-full pt-2 absolute -top-4 right-0">
                                <X className="w-5 h-5 cursor-pointer border-2 rounded-lg bg-muted text-foreground hover:opacity-60"
                                   onClick={() => closePopover(filter.field)}/>
                            </div>
                        </PopoverContent>
                    </Popover>
                );
            })}
        </div>
    );
}
