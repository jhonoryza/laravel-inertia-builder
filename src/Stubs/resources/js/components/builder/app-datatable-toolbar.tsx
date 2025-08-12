import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {CheckIcon, Eye, Filter as FilterIconComponent, WrenchIcon, XIcon} from 'lucide-react';
import {ActiveFilter, Column, DataTableProps, Filter} from '@/types/datatable';
import {router} from '@inertiajs/react';

interface AppDataTableToolbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedIds: (string | number)[];
    activeFilters: ActiveFilter[];
    filters: DataTableProps['filters'];
    handleAddFilter: (field: string, value?: string) => void;
    columns: Column[];
    toggleColumn: (colName: string) => void;
    hiddenColumns: Record<string, boolean>;
    routeName: string;
    actions: DataTableProps['actions'];
}

export function AppDataTableToolbar({
                                        searchQuery,
                                        setSearchQuery,
                                        selectedIds,
                                        activeFilters,
                                        filters,
                                        handleAddFilter,
                                        columns,
                                        toggleColumn,
                                        hiddenColumns,
                                        routeName,
                                        actions,
                                    }: AppDataTableToolbarProps) {
    return (
        <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="flex items-center gap-2">
                {actions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className='cursor-pointer flex items-center gap-2' variant="outline" size="sm">
                                <WrenchIcon/>
                                Action
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuGroup>
                                {actions.map((action) => (
                                    <DropdownMenuItem
                                        key={action.name}
                                        className='cursor-pointer'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (action.rowSelected && selectedIds.length === 0) return;
                                            if (action.needConfirm) {
                                                const confirmed = confirm(action.message);
                                                if (!confirmed) return;
                                            }

                                            router.visit(route(`${routeName}.actions`), {
                                                method: 'post',
                                                data: {
                                                    ids: selectedIds,
                                                    action: action.name,
                                                },
                                                preserveScroll: true,
                                            });
                                        }}
                                        disabled={action.rowSelected && selectedIds.length === 0}
                                    >
                                        {action.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                {(filters.opt?.length ?? 0) > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                                <FilterIconComponent className="h-4 w-4"/>
                                Filters
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Available Filters</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                {filters.opt?.map((filter: Filter) => (
                                    <DropdownMenuItem key={filter.field} onSelect={() => handleAddFilter(filter.field)}
                                                      className="flex items-center gap-2 cursor-pointer">
                                        {activeFilters.find((f) => f.field === filter.field) ? (<CheckIcon/>) : (
                                            <XIcon/>)}
                                        <span>{filter.label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4"/>
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            {columns.map((col) => (
                                <DropdownMenuItem key={col.name} onSelect={() => toggleColumn(col.name)}
                                                  className="flex items-center gap-2 cursor-pointer">
                                    {!hiddenColumns[col.name] ? (<CheckIcon/>) : (<XIcon/>)}
                                    <span>{col.label}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
