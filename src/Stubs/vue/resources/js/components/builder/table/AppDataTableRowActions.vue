<script setup lang="ts">
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, RefreshCw, XCircle } from "lucide-vue-next"
import { router } from "@inertiajs/vue3"
import { route } from "ziggy-js"
import { useDatatableStore } from "@/stores/datatable"

interface Props {
    item: Record<string, any>
    idx: string,
}

const props = defineProps<Props>();

const store = useDatatableStore(props.idx)();

const show = store.tableData.view;
const edit = store.tableData.edit;
const del = store.tableData.delete;
const restore = store.tableData.restore;
const forceDelete = store.tableData.forceDelete;

const id = props.item.id as string | number
const isDeleted = Boolean(props.item.deleted_at)

function goShow() {
    router.visit(route(`${store.tableData.baseRoute}.show`, id))
}
function goEdit() {
    router.visit(route(`${store.tableData.baseRoute}.edit`, id))
}
function doDelete() {
    router.delete(route(`${store.tableData.baseRoute}.destroy`, id), { preserveScroll: true })
}
function doRestore() {
    router.put(route(`${store.tableData.baseRoute}.restore`, id), { preserveScroll: true })
}
function doForceDelete() {
    router.delete(route(`${store.tableData.baseRoute}.forceDestroy`, id), { preserveScroll: true })
}
</script>

<template>
    <div class="flex">
        <!-- normal row -->
        <template v-if="!isDeleted">
            <Button v-if="show" variant="ghost" size="icon" class="cursor-pointer" @click="goShow">
                <Eye class="h-4 w-4" />
            </Button>

            <Button v-if="edit" variant="ghost" size="icon" class="cursor-pointer" @click="goEdit">
                <Pencil class="h-4 w-4" />
            </Button>

            <AlertDialog v-if="del">
                <AlertDialogTrigger as-child>
                    <Button variant="ghost" size="icon" class="text-red-500 hover:text-red-600 cursor-pointer">
                        <Trash2 class="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure want to delete this row {{ id }}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction class="bg-red-500 hover:bg-red-600 cursor-pointer" @click="doDelete">
                            Proceed
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </template>

        <!-- deleted row -->
        <template v-else>
            <AlertDialog v-if="restore">
                <AlertDialogTrigger as-child>
                    <Button variant="ghost" size="icon" class="text-green-500 hover:text-green-600 cursor-pointer">
                        <RefreshCw class="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Want to restore this row {{ id }}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction class="bg-green-500 hover:bg-green-600 cursor-pointer" @click="doRestore">
                            Restore
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog v-if="forceDelete">
                <AlertDialogTrigger as-child>
                    <Button variant="ghost" size="icon" class="text-red-500 hover:text-red-600 cursor-pointer">
                        <XCircle class="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Final Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            This row {{ id }} will be permanently deleted. Proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction class="bg-red-700 hover:bg-red-800 cursor-pointer" @click="doForceDelete">
                            Force Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </template>
    </div>
</template>
