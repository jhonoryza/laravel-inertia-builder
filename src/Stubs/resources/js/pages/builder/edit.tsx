import { Head } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { AppFormBuilder } from "@/components/builder/app-form-builder";
import { Card, CardContent } from "@/components/ui/card";
import { route } from "ziggy-js";
import { Form } from '@/types/form';
import { AppFormBuilderAction } from '@/components/builder/form/action';

type PageProps = {
    form: Form;
};

export default function Edit({ form }: PageProps) {
    const { baseRoute, routeId, title } = form;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: title, href: route(baseRoute + ".index") },
        { title: 'edit', href: route(baseRoute + ".edit", routeId) },
        { title: `#${routeId}`, href: '' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`edit ${title} #${routeId}`} />
            <div className="p-4">
                <Card className="p-4 max-w-full">
                    <CardContent>
                        <AppFormBuilder form={form}>
                            {{
                                formAction: (processing) => (
                                    <AppFormBuilderAction form={form} processing={processing} />
                                )
                            }}
                        </AppFormBuilder>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
