import {TableCell, TableRow} from "@/components/ui/table";
import {Column} from "@/types/datatable";

type Props = {
    columns: Column[];
}

export function AppDatatableRowEmpty({columns}: Props) {
    return (
        <TableRow>
            <TableCell
                colSpan={columns.length + 2}
                className="h-96 text-center text-muted-foreground"
            >
                Empty results.
            </TableCell>
        </TableRow>
    );
}
