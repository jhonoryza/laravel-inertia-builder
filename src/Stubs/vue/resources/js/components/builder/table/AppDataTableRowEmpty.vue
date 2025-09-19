<script setup lang="ts">
import { TableRow } from '@/components/ui/table';
import TableCell from '@/components/ui/table/TableCell.vue';
import { useDatatableStore } from '@/stores/datatable';

const props = defineProps<{
    idx: string;
}>();

const store = useDatatableStore(props.idx)();

</script>

<template>
    <TableRow>
        <TableCell :colSpan="store.tableData.columns.length + 2" className="h-96 text-center text-muted-foreground">
            Empty results.
        </TableCell>
    </TableRow>
</template>
