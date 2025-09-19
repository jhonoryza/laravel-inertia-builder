<script lang="ts" setup>
import { Head } from '@inertiajs/vue3';
import AppLayout from "@/layouts/AppLayout.vue";
import AppFormBuilder from "@/components/builder/AppFormBuilder.vue";
import { Card, CardContent } from "@/components/ui/card";
import AppFormBuilderAction from "@/components/builder/form/AppFormBuilderAction.vue";
import { route } from "ziggy-js";
import type { Form } from '@/types/form';
import type { BreadcrumbItem } from "@/types";
import { useFormStore } from '@/stores/form';

// Props
interface Props {
    form: Form;
}
const props = defineProps<Props>();

const { baseRoute, routeId, title, prefix } = props.form;

const idx = `${prefix}-show}`;
const store = useFormStore(idx)();
store.setData(props.form);

const breadcrumbs: BreadcrumbItem[] = [
    { title: title, href: route(baseRoute + ".index") },
    { title: 'show', href: route(baseRoute + ".show", routeId) },
    { title: `#${routeId}`, href: '' },
];

</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">

        <Head :title="`show ${title} #${routeId}`" />
        <div class="p-4">
            <Card class="p-4 max-w-full">
                <CardContent>
                    <AppFormBuilder :form="props.form" :idx="idx">
                        <template #formAction>
                            <AppFormBuilderAction :form="props.form" :idx="idx" />
                        </template>
                    </AppFormBuilder>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
