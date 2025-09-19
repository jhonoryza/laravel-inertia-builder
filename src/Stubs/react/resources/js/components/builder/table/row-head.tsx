import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Column, DataItem } from "@/types/datatable";

type Props = {
    data: DataItem[];
    columns: Column[];
    selectedIds: (string | number)[];
    hiddenColumns: Record<string, boolean>;
    sort: string;
    dir: 'asc' | 'desc';
    handleSort: (colName: string) => void;
    toggleSelectAll: (checked: boolean) => void;
    isActionAvail: boolean;
}

export function AppDatatableRowHeader({
    data,
    columns,
    selectedIds,
    hiddenColumns,
    sort,
    dir,
    toggleSelectAll,
    handleSort,
    isActionAvail
}: Props) {
    return (
        <TableRow>
            <TableHead className="w-12">
                <Checkbox
                    checked={data.length > 0 && data.every((item) => selectedIds.includes(item.id as string | number))}
                    onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                    aria-label="Select all"
                />
            </TableHead>
            {columns
                .filter((col) => !hiddenColumns[col.name])
                .map((col) => (
                    <TableHead
                        key={col.name}
                        onClick={() => col.sortable && handleSort(col.name)}
                        className={col.sortable ? 'cursor-pointer' : ''}
                    >
                        <div className="flex items-center gap-2">
                            <span>{col.label}</span>
                            {col.sortable &&
                                (sort === col.name ? (
                                    dir === 'asc' ? (
                                        <ArrowUp className="h-4 w-4" />
                                    ) : (
                                        <ArrowDown className="h-4 w-4" />
                                    )
                                ) : (
                                    <ArrowUpDown className="h-4 w-4" />
                                ))}
                        </div>
                    </TableHead>
                ))}
            {isActionAvail ? <TableHead>Actions</TableHead> : ''}
        </TableRow>
    )
}
