<script setup lang="ts">
import { ref } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import { route } from 'ziggy-js'

// ui components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'

// icons
import { WrenchIcon, Filter as FilterIconComponent, Eye, CheckIcon, XIcon } from 'lucide-vue-next'

// types
import type { Action } from '@/types/datatable'
import { useDatatableStore } from '@/stores/datatable'

const props = defineProps<{
    idx: string
}>()

const store = useDatatableStore(props.idx)();

defineSlots<{
    toolbarAction?: () => any
}>()

const confirmAction = ref<null | { name: string; label: string; message: string }>(null)

const { url } = usePage()

const handleAction = (action: Action) => {
    if (action.rowSelected && store.selectedIds.length === 0) return

    if (action.needConfirm) {
        confirmAction.value = action
        return
    }

    const routeUrl = store.tableData.actionRoute ?? route(`${store.tableData.baseRoute}.actions`)
    router.visit(routeUrl, {
        method: 'post',
        data: {
            ids: store.selectedIds,
            action: action.name,
            url,
        },
        preserveScroll: true,
        preserveState: true,
    })
}

const confirmAndRunAction = () => {
    if (!confirmAction.value) return
    const routeUrl = store.tableData.actionRoute ?? route(`${store.tableData.baseRoute}.actions`)
    router.visit(routeUrl, {
        method: 'post',
        data: {
            ids: store.selectedIds,
            action: confirmAction.value.name,
        },
        preserveScroll: true,
    })
    confirmAction.value = null
}
</script>

<template>
    <div class="flex items-center gap-2 justify-between px-4 py-2">
        <!-- Search -->
        <div class="flex items-center gap-2">
            <Input placeholder="Search..." v-model="store.searchQuery" class="max-w-xs sm:max-w-sm" />
        </div>

        <!-- Toolbar -->
        <div class="flex items-center gap-2">
            <!-- Actions -->
            <DropdownMenu v-if="store.tableData.actions.length > 0">
                <DropdownMenuTrigger as-child>
                    <Button class="flex cursor-pointer items-center gap-2" variant="outline" size="sm">
                        <WrenchIcon />
                        <span class="hidden sm:block">Action</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem v-for="action in store.tableData.actions" :key="action.name"
                            class="cursor-pointer" :disabled="action.rowSelected && store.selectedIds.length === 0"
                            @select.prevent="handleAction(action)">
                            {{ action.label }}
                        </DropdownMenuItem>
                        <slot name="toolbarAction" />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- Filters -->
            <DropdownMenu v-if="(store.tableData.filters.opt?.length ?? 0) > 0">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="sm" class="cursor-pointer gap-2">
                        <FilterIconComponent class="h-4 w-4" />
                        <span class="hidden sm:block">Filters</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Available Filters</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem v-for="filter in store.tableData.filters.opt" :key="filter.field"
                            @select="store.addFilter(filter.field)" class="flex cursor-pointer items-center gap-2">
                            <component
                                :is="store.activeFilters.find((f) => f.field === filter.field) ? CheckIcon : XIcon" />
                            <span>{{ filter.label }}</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- Columns -->
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="sm" class="cursor-pointer gap-2">
                        <Eye class="h-4 w-4" />
                        <span class="hidden sm:block">Columns</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem v-for="col in store.tableData.columns" :key="col.name"
                            @select="store.toggleColumn(col.name)" class="flex cursor-pointer items-center gap-2">
                            <component :is="!store.hiddenColumns[col.name] ? CheckIcon : XIcon" />
                            <span>{{ col.label }}</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>

    <!-- Modal konfirmasi -->
    <AlertDialog :open="!!confirmAction" @update:open="(open) => { if (!open) confirmAction = null }">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                    {{ confirmAction?.message ?? `Are you sure want to run this action ${confirmAction?.label}?` }}
                    <div class="mt-2 text-sm text-muted-foreground">
                        {{ store.selectedIds.join(', ') }}
                    </div>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction @click="confirmAndRunAction">Proceed</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
