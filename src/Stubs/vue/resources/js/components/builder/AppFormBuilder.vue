<script setup lang="ts">

import AppFieldBuilder from '@/components/builder/AppFieldBuilder.vue'
import AppFieldBuilderLoadingPlaceholder from '@/components/builder/field/AppFieldBuilderLoadingPlaceholder.vue'

import { gridClasses } from '@/lib/utils'
import type { Form } from '@/types/form'
import { useFlashStore } from '@/stores/flash'
import { usePage } from '@inertiajs/vue3'
import { useFormStore } from '@/stores/form'
import { watch } from 'vue'

interface Props {
    form: Form
    idx: string
}
const props = defineProps<Props>()
const store = useFormStore(props.idx)();

// --- watch flash
const flashStore = useFlashStore();
const page = usePage()

watch(
    () => page.props.flash,
    (flash) => {
        if (flash) {
            flashStore.setFlash(flash)
        }
    },
    { immediate: true }
)

const handleSubmit = () => {
    store.handleSubmit();
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4" enctype="multipart/form-data">
        <!-- field builder -->
        <div v-if="!store.isEmpty" :class="gridClasses(store.formData.columns) + ' gap-4'">
            <template v-for="group in store.fieldGroups" :key="group.key">
                <div v-if="group.type === 'grid'" :class="gridClasses(group.fields[0]?.gridCol) + ' gap-4'">
                    <template v-for="field in group.fields" :key="field.key">
                        <AppFieldBuilderLoadingPlaceholder v-if="store.isProcessing" :field="field" :key="field.key + 'lg'" />
                        <AppFieldBuilder v-else :field="field" :idx="idx" />
                    </template>
                </div>

                <template v-else>
                    <template v-for="field in group.fields" :key="field.key">
                        <AppFieldBuilderLoadingPlaceholder v-if="store.isProcessing" :field="field" :key="field.key + 'ng'" />
                        <AppFieldBuilder v-else :field="field" :idx="idx" />
                    </template>
                </template>
            </template>
        </div>

        <!-- Loading state untuk form yang belum ready -->
        <div v-else class="flex items-center justify-center py-8">
            <div class="animate-pulse text-muted-foreground">Loading form...</div>
        </div>

        <!-- hidden fields -->
        <template v-for="hiddenField in store.hiddenFields" :key="hiddenField.key">
            <AppFieldBuilder :field="hiddenField" :idx="idx" />
        </template>

        <slot name="formAction" />
    </form>
</template>
