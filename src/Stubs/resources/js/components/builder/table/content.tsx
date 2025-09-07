import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { Column, DataItem, DataTableProps } from '@/types/datatable';
import { AppDatatableRowLoading } from "@/components/builder/table/row-loading";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { AppDatatableRowContent } from "@/components/builder/table/row-content";
import { AppDatatableRowHeader } from "@/components/builder/table/row-head";
import { AppDatatableRowEmpty } from "@/components/builder/table/row-empty";

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
    children?: (item: DataItem) => React.ReactNode;
    disablePagination: boolean;
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
    children,
    disablePagination,
}: AppDataTableContentProps) {

    const data: DataItem[] = disablePagination ? (items as unknown as DataItem[]) : items.data;

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        router.on('start', () => setLoading(true))
        router.on('finish', () => setLoading(false))
    }, [])

    return (
        <Table className="min-w-full divide-y divide-gray-200 border-t">
            <TableHeader>
                <AppDatatableRowHeader data={data} columns={columns} selectedIds={selectedIds}
                    hiddenColumns={hiddenColumns} dir={dir} handleSort={handleSort}
                    sort={sort} toggleSelectAll={toggleSelectAll} isActionAvail={children !== undefined} />
            </TableHeader>
            <TableBody>
                {data.length > 0 ? (
                    loading ?
                        <AppDatatableRowLoading data={data} columns={columns}
                            selectedIds={selectedIds} hiddenColumns={hiddenColumns} />
                        : <AppDatatableRowContent data={data} columns={columns}
                            selectedIds={selectedIds} hiddenColumns={hiddenColumns}
                            toggleSelectOne={toggleSelectOne}
                            children={children} />
                ) : (
                    <AppDatatableRowEmpty columns={columns} />
                )}
            </TableBody>
        </Table>
    );
}
