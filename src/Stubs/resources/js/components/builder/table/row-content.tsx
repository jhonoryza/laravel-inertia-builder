/* eslint-disable @typescript-eslint/no-explicit-any */
import {TableCell, TableRow} from "@/components/ui/table";
import {Column, DataItem} from "@/types/datatable";
import {Checkbox} from "@/components/ui/checkbox";
import {customCellComponents} from '@/components/builder/custom-cell';

type Props = {
    data: DataItem[];
    columns: Column[];
    selectedIds: (string | number)[];
    hiddenColumns: Record<string, boolean>;
    routeName: string;
    toggleSelectOne: (id: string | number) => void;
    children?: (item: DataItem, routeName: string) => React.ReactNode;
}

export function AppDatatableRowContent({data, columns, selectedIds, hiddenColumns, routeName, toggleSelectOne, children}: Props) {
    function renderCellContent(value: unknown) {
        if (value === null || value === undefined) return null;

        if (value && typeof value === 'object' && 'component' in value) {
            const {component, props} = value as { component: string; props?: any };
            const Cmp = customCellComponents[component];
            return Cmp ? <Cmp {...props} /> : <span>Unknown component: {component}</span>;
        }

        if (typeof value === 'object' && '__html' in (value as any)) {
            return <span dangerouslySetInnerHTML={value as any}/>;
        }

        return <span>{String(value)}</span>;
    }
    return (
        data.map((item: DataItem, index: number) => {
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
                    {columns
                        .filter((col) => !hiddenColumns[col.name])
                        .map((col) => {
                            const value = item[col.name];
                            return <TableCell
                                key={`table-cell-${col.name}`}>{renderCellContent(value)}</TableCell>;
                        })}
                    <TableCell>{children && children(item, routeName)}</TableCell>
                </TableRow>
            );
        })
    );
}
