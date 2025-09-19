<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useFormStore } from '@/stores/form'
import type { Form } from '@/types/form'
import { Link, router } from '@inertiajs/vue3'
import { RefreshCw } from 'lucide-vue-next'
import { route } from 'ziggy-js'

interface Props {
    form: Form
    idx: string
}

const props = defineProps<Props>()
const store = useFormStore(props.idx)();

const goBack = () => window.history.back()
const goEdit = () => {
    router.visit(route(`${props.form.baseRoute}.edit`, props.form.routeId || 0))
}
</script>

<template>
    <div class="flex items-center justify-between">
        <!-- Show mode -->
        <div v-if="props.form.mode === 'show'" class="flex items-center gap-2">
            <Button v-if="props.form.canEdit" @click="goEdit" variant="default" type="button"
                class="hover:cursor-pointer">
                edit
            </Button>
            <Button @click="goBack" variant="link" type="button" class="hover:cursor-pointer">
                back
            </Button>
        </div>

        <!-- Edit / Create mode -->
        <div v-if="props.form.mode === 'edit' || props.form.mode === 'create'" class="flex items-center gap-2">
            <Button type="submit" :disabled="store.isProcessing" class="hover:cursor-pointer">
                save
            </Button>
            <Button @click="goBack" variant="destructive" type="button" class="hover:cursor-pointer">
                cancel
            </Button>
        </div>

        <!-- Reset link -->
        <div v-if="(props.form.mode === 'edit' || props.form.mode === 'create') && props.form.canEdit" class="mb-2">
            <Button @click="store.resetForm" variant="outline" type="button"
                class="flex items-center gap-2 text-sm hover:cursor-pointer hover:opacity-60">
                <RefreshCw class="h-4 w-4 text-destructive" />
                <span>reset</span>
            </Button>
        </div>
    </div>
</template>
