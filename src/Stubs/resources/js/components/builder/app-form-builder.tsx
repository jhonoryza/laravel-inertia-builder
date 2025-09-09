/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppFieldBuilder } from "@/components/builder/app-field-builder";
import { AppFieldBuilderLoadingPlaceholder } from "@/components/builder/field/loading-placeholder";
import { gridClasses, maxOrder, sortByOrder } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";
import { Form } from '@/types/form';
import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { route } from 'ziggy-js';

type PageProps = {
    form: Form;
    children?: {
        formAction: (processing: boolean) => React.ReactNode;
    };
};

export function AppFormBuilder({ form, children }: PageProps) {
    const { columns, fields: initialFields, baseRoute, routeId, formClass } = form
    const { flash } = usePage().props as { flash?: { success?: string, error?: string, description?: string } };

    // local state fields that can be updated when reactive/live
    const [fields, setFields] = useState<FieldDefinition[]>(initialFields);

    useEffect(() => {
        if (flash?.error) {
            toast.error('error', {
                position: "top-center",
                description: flash.error,
            });
        }
        if (flash?.success) {
            toast.success('success', {
                position: 'top-center',
                description: flash.success,
            });
        }
    }, [flash]);

    const initialFormValues = fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue ?? '';
        return acc;
    }, {} as Record<string, any>);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        transform
    } = useForm<Record<string, any>>(initialFormValues);

    // Inertia's 'patch' method does not support file uploads.
    // To handle file uploads in an update form, we must use 'post' and spoof the method by adding a '_method: "patch"' field to the data.
    // The 'transform' function is used here to add this field to the data right before it's submitted.
    transform((data) => (
        routeId
            ? { ...data, _method: 'patch' }
            : data
    ));

    // This is a neat trick to ensure that when the 'fields' prop updates from a partial reload,
    // the form state also gets updated with any new defaultValues from the server.
    useEffect(() => {
        const newInitialValues = fields.reduce((acc, field) => {
            acc[field.name] = field.defaultValue ?? data[field.name] ?? '';
            return acc;
        }, {} as Record<string, any>);
        setData(newInitialValues);
    }, [fields]);

    const debounceTimeouts = React.useRef<Record<string, NodeJS.Timeout>>({});

    const onReactive = async (name: string, value: any, operator?: string) => {
        setData((prev: any) => ({ ...prev, [name]: value, operator }));
        const field = fields.find((f) => f.name === name);
        if (!field) return;
        if (!field.reactive) return;

        if (field.debounce && field.debounce > 0) {
            // clear timeout before
            if (debounceTimeouts.current[name]) clearTimeout(debounceTimeouts.current[name]);

            // set new timeout
            debounceTimeouts.current[name] = setTimeout(() => {
                sendLiveUpdate(name, value);
            }, field.debounce);
        } else {
            sendLiveUpdate(name, value);
        }
    }

    function getCookie(name: string): string {
        return (
            document.cookie
                .split('; ')
                .find((row) => row.startsWith(name + '='))
                ?.split('=')[1] || ''
        );
    }

    const sendLiveUpdate = async (name: string, value: any) => {
        try {
            const res = await fetch('/inertia-builder/reactive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                    // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name,
                    value,
                    state: { ...data, [name]: value },
                    formClass,
                    mode: form.mode,
                }),
            });

            if (!res.ok) {
                console.error(`HTTP error! status: ${res.status}`);
                return;
            }

            const result = await res.json();
            if (result.fields) {
                const newState = result.fields.reduce((acc: any, field: any) => {
                    acc[field.name] = field.defaultValue ?? data[field.name] ?? '';
                    return acc;
                }, {} as Record<string, any>);

                setData(newState);
                setFields(result.fields);
            }
        } catch (error) {
            console.error('Live update failed:', error);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (routeId) {
            post(route(`${baseRoute}.update`, routeId));
            return;
        }
        post(route(`${baseRoute}.store`));
    };

    const gridGroups = Object.entries(
        fields
            .filter(f => f.grid && f.type !== 'hidden')
            .reduce((acc, f) => {
                acc[f.gridKey || ''] = acc[f.gridKey || ''] || [];
                acc[f.gridKey || ''].push(f);
                return acc;
            }, {} as Record<string, typeof fields>)
    );

    const nonGridFields = fields.filter(f => !f.grid && f.type !== 'hidden');

    const groups = [
        ...gridGroups.map(([gridKey, group]) => ({
            type: "grid" as const,
            key: gridKey,
            fields: sortByOrder(group),
            maxOrder: maxOrder(group),
        })),
        {
            type: "non-grid" as const,
            key: "non-grid",
            fields: sortByOrder(nonGridFields),
            maxOrder: maxOrder(nonGridFields),
        },
    ];

    const hiddenFields = fields.filter(f => f.type === 'hidden');

    const sortedGroups = groups.sort((a, b) => a.maxOrder - b.maxOrder);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
            {/* field builder */}
            <div className={gridClasses(columns) + " gap-4"}>
                {sortedGroups.map(group => {
                    if (group.type === "grid") {
                        const gridCol = group.fields[0]?.gridCol;
                        return (
                            <div key={group.key} className={gridClasses(gridCol) + " gap-4"}>
                                {group.fields.map(field => (
                                    processing ? (
                                        <AppFieldBuilderLoadingPlaceholder field={field} />
                                    ) : (
                                        <AppFieldBuilder
                                            key={field.key}
                                            field={field}
                                            value={data[field.name]}
                                            onReactive={onReactive}
                                            error={errors[field.name]}
                                            isProcessing={processing}
                                            setFields={setFields}
                                        />
                                    )
                                ))}
                            </div>
                        );
                    }

                    // non-grid
                    return group.fields.map(field => (
                        processing ? (
                            <AppFieldBuilderLoadingPlaceholder field={field} />
                        ) : (
                            <AppFieldBuilder
                                key={field.key}
                                field={field}
                                value={data[field.name]}
                                onReactive={onReactive}
                                error={errors[field.name]}
                                isProcessing={processing}
                                setFields={setFields}
                            />
                        )
                    ))
                })}
            </div>
            {hiddenFields.map(hiddenField => {
                return (
                    <AppFieldBuilder
                        key={hiddenField.key}
                        field={hiddenField}
                        value={data[hiddenField.name]}
                        onReactive={onReactive}
                        error={errors[hiddenField.name]}
                        isProcessing={processing}
                        setFields={setFields}
                    />
                )
            })}

            {children && children.formAction(processing)}
        </form>
    );
}
