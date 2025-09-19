<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableRow } from "@/components/ui/table";
import { useDatatableStore } from "@/stores/datatable";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-vue-next";

const props = defineProps<{
    idx: string;
    isActionAvail: boolean;
}>();

const store = useDatatableStore(props.idx)();

</script>

<template>
    <TableRow>
        <!-- Checkbox Select All -->
        <TableHead class="w-12">
            <Checkbox v-model="store.isAllSelected" aria-label="Select all" />
        </TableHead>

        <!-- Column Headers -->
        <TableHead v-for="col in store.tableData.columns.filter((col) => !store.hiddenColumns[col.name])"
            :key="col.name" @click="col.sortable && store.handleSort(col.name)"
            :class="col.sortable ? 'cursor-pointer' : ''">
            <div class="flex items-center gap-2">
                <span>{{ col.label }}</span>
                <template v-if="col.sortable">
                    <ArrowUp v-if="store.sort === col.name && store.dir === 'asc'" class="h-4 w-4" />
                    <ArrowDown v-else-if="store.sort === col.name && store.dir === 'desc'" class="h-4 w-4" />
                    <ArrowUpDown v-else class="h-4 w-4" />
                </template>
            </div>
        </TableHead>

        <!-- Action Column -->
        <TableHead v-if="isActionAvail">Actions</TableHead>
    </TableRow>
</template>
