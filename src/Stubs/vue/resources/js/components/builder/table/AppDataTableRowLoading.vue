<script setup lang="ts">
import { TableCell, TableRow } from "@/components/ui/table"
import { useDatatableStore } from "@/stores/datatable";

const props = defineProps<{
    idx: string
}>()

const store = useDatatableStore(props.idx)();
</script>

<template>
    <template v-for="(item, index) in store.data" :key="`table-row-${index}`">
        <TableRow :class="{ 'bg-muted': store.selectedIds.includes(item.id as string | number) }">
            <TableCell>
                <div class="h-6 rounded bg-muted animate-pulse" />
            </TableCell>

            <template v-for="col in store.tableData.columns" :key="`table-cell-${col.name}`">
                <TableCell v-if="!store.hiddenColumns[col.name]">
                    <div class="h-6 rounded bg-muted animate-pulse" />
                </TableCell>
            </template>

            <TableCell>
                <div class="h-6 rounded bg-muted animate-pulse" />
            </TableCell>
        </TableRow>
    </template>
</template>
