import {TableCell, TableRow} from "@/components/ui/table";
import {Column, DataItem} from "@/types/datatable";

type Props = {
    data: DataItem[];
    columns: Column[];
    selectedIds: (string | number)[];
    hiddenColumns: Record<string, boolean>;
}

export function AppDatatableRowLoading({data, columns, selectedIds, hiddenColumns}: Props) {
    return (
        data.map((item: DataItem, index: number) => {
            const id = item.id as string | number;
            return (
                <TableRow key={`table-row-${index}`}
                          className={selectedIds.includes(id) ? 'bg-muted' : ''}>
                    <TableCell>
                        <div className="h-6 rounded bg-muted animate-pulse"/>
                    </TableCell>
                    {columns
                        .filter((col) => !hiddenColumns[col.name])
                        .map((col) => {
                            return <TableCell key={`table-cell-${col.name}`}>
                                <div className="h-6 rounded bg-muted animate-pulse"/>
                            </TableCell>;
                        })}
                    <TableCell>
                        <div className="h-6 rounded bg-muted animate-pulse"/>
                    </TableCell>
                </TableRow>
            )
        })
    );
}
