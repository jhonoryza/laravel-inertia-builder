<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import AppDataTableRowContent from './AppDataTableRowContent.vue';
import AppDataTableRowHeader from './AppDataTableRowHeader.vue';
import AppDataTableRowEmpty from './AppDataTableRowEmpty.vue';
import AppDataTableRowLoading from './AppDataTableRowLoading.vue';
import { useDatatableStore } from '@/stores/datatable';

const props = defineProps<{
    idx: string;
}>();

const store = useDatatableStore(props.idx)();

// state loading
const loading = ref(false);

onMounted(() => {
    router.on("start", () => (loading.value = true));
    router.on("finish", () => (loading.value = false));
});

</script>

<template>
    <Table className="min-w-full divide-y divide-gray-200 border-t">
        <TableHeader>
            <AppDataTableRowHeader :idx="idx" :is-action-avail="$slots.rowAction !== undefined" />
        </TableHeader>
        <TableBody>
            <template v-if="store.data.length > 0">
                <AppDataTableRowLoading v-if="loading" :idx="idx" />
                <AppDataTableRowContent v-else :idx="idx">
                    <template #default="{ item }">
                        <slot name="rowAction" :item="item" />
                    </template>
                </AppDataTableRowContent>
            </template>

            <AppDataTableRowEmpty v-else :idx="idx" />
        </TableBody>
    </Table>
</template>
