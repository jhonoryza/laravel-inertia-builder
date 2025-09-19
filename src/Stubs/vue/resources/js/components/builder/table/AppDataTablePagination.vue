<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDatatableStore } from '@/stores/datatable'
import { DataTableProps } from '@/types/datatable'
import { router } from '@inertiajs/vue3'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { AcceptableValue } from 'reka-ui'
import { route } from 'ziggy-js'

const props = defineProps<{
    idx: string
}>()

const store = useDatatableStore(props.idx)();

const routeUrl = store.tableData.tableRoute ?? route(`${store.tableData.baseRoute}.index`)
const hasSimplePagination = store.tableData.paginationMethod === 'simple' || store.tableData.paginationMethod === 'cursor'

type RespProp = {
    data: DataTableProps,
};

// ganti rows per page
const handlePerPageChange = (value: AcceptableValue): any => {
    const perPageParam = store.tableData.prefix + 'perPage'
    router.get(
        routeUrl,
        { [perPageParam]: value as string },
        {
            preserveState: true,
            preserveScroll: true,
            only: [store.tableData.name],
            onSuccess: (page) => {
                const props = page.props as unknown as RespProp;
                store.updateItems(props.data.items);
            }
        },
    )
}

// fungsi aman untuk goTo
const goTo = (url?: string | null | undefined) => {
    if (!url) return
    router.get(
        url,
        {},
        {
            preserveState: true,
            preserveScroll: true,
            only: [store.tableData.name],
            onSuccess: (page) => {
                const props = page.props as unknown as RespProp;
                store.updateItems(props.data.items);
            }
        }
    );
}

</script>

<template>
    <div
        class="flex flex-col sm:flex-row items-center justify-between gap-2 space-y-2 sm:space-y-0 border-t px-4 py-3 text-sm">
        <!-- Selected rows info -->
        <div class="flex flex-col items-start">
            <div>
                <Button v-if="store.selectedIds.length > 0" variant="link" type="button" class="cursor-pointer"
                    @click="store.toggleSelectAll(false)">
                    Deselect all
                </Button>
            </div>
            <div>
                <template v-if="store.selectedIds.length === store.totalItems">
                    All {{ store.totalItems }} rows selected
                </template>
                <template v-else-if="store.selectedIds.length > 0">
                    {{ store.selectedIds.length }} {{ store.totalItems ? 'of' : '' }}
                    {{ store.totalItems ? store.totalItems : '' }} rows selected
                </template>
                <template v-else>No rows selected.</template>
            </div>
        </div>

        <!-- Rows per page -->
        <div class="flex items-center gap-2">
            <p class="text-sm font-medium">Rows per page</p>
            <Select :model-value="`${store.tableData.perPage}`" @update:model-value="handlePerPageChange">
                <SelectTrigger class="h-8 w-[70px]">
                    <SelectValue :placeholder="`${store.tableData.perPage}`" />
                </SelectTrigger>
                <SelectContent side="top">
                    <SelectItem v-for="option in store.tableData.perPageOptions" :key="option" :value="`${option}`">
                        {{ option }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        <!-- Pagination -->
        <div class="flex items-center gap-4">
            <div v-if="store.totalItems > 0">Page {{ store.items.from }} of {{ store.totalItems }}</div>

            <!-- Simple pagination -->
            <div v-if="hasSimplePagination" class="flex gap-2">
                <Button variant="ghost" size="sm" class="cursor-pointer"
                    :disabled="!store.items.prev_page_url || !store.items.first_page_url"
                    @click="store.items.first_page_url ? goTo(store.items.first_page_url) : null">
                    <ChevronsLeft />
                </Button>
                <Button variant="ghost" size="sm" class="cursor-pointer" :disabled="!store.items.prev_page_url"
                    @click="store.items.prev_page_url ? goTo(store.items.prev_page_url) : null">
                    <ChevronLeft />
                </Button>
                <Button variant="ghost" size="sm" class="cursor-pointer" :disabled="!store.items.next_page_url"
                    @click="store.items.next_page_url ? goTo(store.items.next_page_url) : null">
                    <ChevronRight />
                </Button>
                <Button variant="ghost" size="sm" class="cursor-pointer"
                    :disabled="!store.items.next_page_url || !store.items.last_page_url"
                    @click="store.items.last_page_url ? goTo(store.items.last_page_url) : null">
                    <ChevronsRight />
                </Button>
            </div>

            <!-- Full pagination -->
            <div v-else>
                <Pagination v-if="store.items?.links" :items-per-page="store.tableData.perPage || 0"
                    :total="store.totalItems" :page="store.currentPage">
                    <PaginationContent>
                        <PaginationItem v-for="(link, i) in store.items.links" :key="i" :value="Number(link.label)"
                            :is-active="link.active">
                            <Button size="sm" :variant="link.active ? 'default' : 'outline'"
                                class="hover:cursor-pointer" :disabled="!link.url"
                                @click="link.url ? goTo(link.url) : null">
                                <span v-if="link.label.includes('Previous')">«</span>
                                <span v-else-if="link.label.includes('Next')">»</span>
                                <span v-else v-html="link.label"></span>
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    </div>
</template>
