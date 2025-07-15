import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Checkbox} from '@/components/ui/checkbox';
import {Column, DataItem, DataTableProps} from '@/types/datatable';
import {ArrowDown, ArrowUp, ArrowUpDown} from 'lucide-react';
import {router} from '@inertiajs/react';

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
                                        routeName
                                    }: AppDataTableContentProps) {
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
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.data.map((item: DataItem) => {
                    const id = item.id as string | number;
                    return (
                        <TableRow key={id} className={selectedIds.includes(id) ? 'bg-muted' : ''}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedIds.includes(id)}
                                    onCheckedChange={() => toggleSelectOne(id)}
                                    aria-label="Select row"
                                />
                            </TableCell>
                            {columns.filter(col => !hiddenColumns[col.name]).map((col) => {
                                const rawHtml = item[col.name] ?? '';
                                return <TableCell key={col.name}
                                                  className='cursor-pointer'
                                                  onClick={() => router.visit(route(`${routeName}.show`, id))}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: rawHtml }} />
                                </TableCell>;
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
