<script setup lang="ts">
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { customCellComponents } from "@/components/builder/custom-cell";
import type { DataItem } from "@/types/datatable";
import { h } from "vue";
import { useDatatableStore } from "@/stores/datatable";

const props = defineProps<{
    idx: string;
}>();

const store = useDatatableStore(props.idx)();

// slot untuk row action
defineSlots<{
    default?: (item: DataItem) => any;
}>();

// helper render cell
function renderCellContent(value: unknown) {
    if (value === null || value === undefined) return null;

    if (value && typeof value === "object" && "component" in value) {
        const { component, props } = value as { component: string; props?: any };
        const Cmp = customCellComponents[component];
        return Cmp ? h(Cmp, props) : h("span", {}, `Unknown component: ${component}`);
    }

    if (typeof value === "object" && "__html" in (value as any)) {
        return h("span", { innerHTML: (value as any).__html });
    }

    return h("span", {}, String(value));
}

</script>

<template>
    <TableRow v-for="(item, index) in store.data" :key="`table-row-${index}`"
        :class="{ 'bg-muted': store.isChecked(item.id as string) }">
        <!-- Checkbox -->
        <TableCell>
            <Checkbox v-model="store.checkedMap[item.id as string].value" aria-label="Select row" />
        </TableCell>

        <!-- Data cells -->
        <TableCell v-for="col in store.tableData.columns.filter((c) => !store.hiddenColumns[c.name])"
            :key="`table-cell-${col.name}`">
            <component :is="renderCellContent(item[col.name])" />
        </TableCell>

        <!-- Action slot -->
        <TableCell>
            <slot :item="item" />
        </TableCell>
    </TableRow>
</template>
