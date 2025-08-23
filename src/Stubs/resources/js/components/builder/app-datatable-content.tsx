/* eslint-disable @typescript-eslint/no-explicit-any */
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Checkbox} from '@/components/ui/checkbox';
import {Column, DataItem, DataTableProps} from '@/types/datatable';
import {ArrowDown, ArrowUp, ArrowUpDown} from 'lucide-react';
import {customCellComponents} from '@/components/custom-cell';

interface AppDataTableContentProps {
    items: DataTableProps['items'];
    columns: Column[];
    selectedIds: (string | number)[];
    hiddenColumns: Record<string, boolean>;
    sort: string;
    dir: 'asc' | 'desc';
    handleSort: (colName: string) => void;
    toggleSelectAll: (checked: boolean) => void;
    toggleSelectOne: (id: string | number) => void;
    routeName: string;
    children?: (item: DataItem, routeName: string) => React.ReactNode;
}

export function AppDataTableContent({
                                        items,
                                        columns,
                                        selectedIds,
                                        hiddenColumns,
                                        sort,
                                        dir,
                                        handleSort,
                                        toggleSelectAll,
                                        toggleSelectOne,
                                        routeName,
                                        children,
                                    }: AppDataTableContentProps) {

    function renderCellContent(value: unknown) {
      if (value === null || value === undefined) return null

      if (value && typeof value === "object" && "component" in value) {
        const { component, props } = value as { component: string; props?: any }
        const Cmp = customCellComponents[component]
        return Cmp ? <Cmp {...props} /> : <span>Unknown component: {component}</span>
      }

      if (typeof value === "object" && "__html" in (value as any)) {
        return <span dangerouslySetInnerHTML={value as any} />
      }

      return <span>{String(value)}</span>
    }

    return (
        <Table className="min-w-full divide-y divide-gray-200 border-t">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">
                        <Checkbox
                            checked={items.data.length > 0 && items.data.every((item) => selectedIds.includes(item.id as string | number))}
                            onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                            aria-label="Select all"
                        />
                    </TableHead>
                    {columns.filter(col => !hiddenColumns[col.name]).map((col) => (
                        <TableHead key={col.name} onClick={() => col.sortable && handleSort(col.name)}
                                   className={col.sortable ? 'cursor-pointer' : ''}>
                            <div className="flex items-center gap-2">
                                <span>{col.label}</span>
                                {col.sortable && (
                                    sort === col.name ? (
                                        dir === 'asc' ? <ArrowUp className="h-4 w-4"/> : <ArrowDown className="h-4 w-4"/>
                                    ) : (
                                        <ArrowUpDown className="h-4 w-4"/>
                                    )
                                )}
                            </div>
                        </TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.data.map((item: DataItem, index: number) => {
                    const id = item.id as string | number;
                    return (
                        <TableRow key={`table-row-${index}`} className={selectedIds.includes(id) ? 'bg-muted' : ''}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedIds.includes(id)}
                                    onCheckedChange={() => toggleSelectOne(id)}
                                    aria-label="Select row"
                                />
                            </TableCell>
                            {columns.filter(col => !hiddenColumns[col.name]).map((col) => {
                                const value = item[col.name]
                                return <TableCell key={`table-cell-${col.name}`}>
                                    {renderCellContent(value)}
                                </TableCell>;
                            })}
                            <TableCell>
                              {children && children(item, routeName)}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
