<script lang="ts" setup>
import AppFormBuilder from "@/components/builder/AppFormBuilder.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { Head } from "@inertiajs/vue3";
import { Card, CardContent } from "@/components/ui/card";
import { route } from "ziggy-js";
import AppFormBuilderAction from "@/components/builder/form/AppFormBuilderAction.vue";
import type { Form } from "@/types/form";
import type { BreadcrumbItem } from "@/types";
import { useFormStore } from "@/stores/form";

// Props
interface Props {
    form: Form;
}
const props = defineProps<Props>();

const { baseRoute, title, prefix } = props.form;

const idx = `${prefix}-create}`;
const store = useFormStore(idx)();
store.setData(props.form);

const breadcrumbs: BreadcrumbItem[] = [
    { title: title, href: route(baseRoute + ".index") },
    { title: "new", href: route(baseRoute + ".create") },
    { title: "#", href: "" },
];

</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">

        <Head :title="`new ${title}`" />
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
