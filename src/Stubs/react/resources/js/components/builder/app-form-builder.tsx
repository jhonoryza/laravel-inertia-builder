/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppFieldBuilder } from "@/components/builder/app-field-builder";
import { AppFieldBuilderLoadingPlaceholder } from "@/components/builder/field/loading-placeholder";
import { gridClasses, maxOrder, sortByOrder } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";
import { Form } from '@/types/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { route } from 'ziggy-js';
import { Card, CardContent } from "@/components/ui/card";

type PageProps = {
    form: Form;
    children?: {
        formAction: (processing: boolean) => React.ReactNode;
    };
};

export function AppFormBuilder({ form, children }: PageProps) {
    const { columns, fields: initialFields, baseRoute, routeId, formClass, modelClass } = form
    const { flash } = usePage().props as { flash?: { success?: string, error?: string, link?: string } };

    // local state fields that can be updated when reactive/live
    const [fields, setFields] = useState<FieldDefinition[]>(initialFields);

    useEffect(() => {
        if (flash?.success) {
            toast.success('success', {
                position: 'top-right',
                closeButton: true,
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast.error('error', {
                position: 'top-right',
                closeButton: true,
                description: flash.error,
            });
        }
        if (flash?.link) {
            toast.success("download", {
                position: 'top-right',
                duration: 10_000,
                closeButton: true,
                description: (
                    <a
                        href={flash.link}
                        className="text-blue-500 underline hover:cursor-pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download file
                    </a>
                ),
            })
        }
    }, [flash]);

    const initialFormValues = fields.reduce((acc, field) => {
        acc[field.key] = field.defaultValue ?? '';
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
            acc[field.key] = field.defaultValue ?? data[field.key] ?? '';
            return acc;
        }, {} as Record<string, any>);
        setData(newInitialValues);
    }, [fields]);

    const debounceTimeouts = React.useRef<Record<string, NodeJS.Timeout>>({});

    const onReactive = async (key: string, value: any, operator?: string) => {
        setData((prev: any) => ({ ...prev, [key]: value, operator }));
        const field = fields.find((f) => f.key === key);
        if (!field) return;
        if (!field.reactive) return;

        if (field.debounce && field.debounce > 0) {
            // clear timeout before
            if (debounceTimeouts.current[key]) clearTimeout(debounceTimeouts.current[key]);

            // set new timeout
            debounceTimeouts.current[key] = setTimeout(() => {
                sendLiveUpdate(key, value);
            }, field.debounce);
        } else {
            sendLiveUpdate(key, value);
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

    const sendLiveUpdate = async (key: string, value: any) => {
        try {
            const res = await fetch('/inertia-builder/reactive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                    // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    key,
                    value,
                    state: { ...data, [key]: value },
                    formClass,
                    modelClass,
                    mode: form.mode,
                    routeId,
                }),
            });

            if (!res.ok) {
                console.error(`HTTP error! status: ${res.status}`);
                return;
            }

            const result = await res.json();
            if (result.fields) {
                const newState = result.fields.reduce((acc: any, field: any) => {
                    acc[field.key] = field.defaultValue ?? data[field.key] ?? '';
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
            post(route(`${baseRoute}.update`, routeId), {
                preserveState: false,
                preserveScroll: true,
            });
            return;
        }
        post(route(`${baseRoute}.store`));
    };

    const tabGroups = Object.entries(
        fields
            .filter(f => f.tab && f.type !== 'hidden')
            .reduce((acc, f) => {
                acc[f.tabKey || ''] = acc[f.tabKey || ''] || [];
                acc[f.tabKey || ''].push(f);
                return acc;
            }, {} as Record<string, typeof fields>)
    );
    const nonTabFields = fields.filter(f => !f.tab && f.type !== 'hidden');
    const gridGroups = Object.entries(
        nonTabFields
            .filter(f => f.grid)
            .reduce((acc, f) => {
                acc[f.gridKey || ''] = acc[f.gridKey || ''] || [];
                acc[f.gridKey || ''].push(f);
                return acc;
            }, {} as Record<string, typeof fields>)
    );
    const nonTabNonGridFields = nonTabFields.filter(f => !f.grid);

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
            fields: sortByOrder(nonTabNonGridFields),
            maxOrder: maxOrder(nonTabNonGridFields),
        },
        ...tabGroups.map(([tabKey, group]) => ({
            type: "tab" as const,
            key: tabKey,
            fields: sortByOrder(group),
            maxOrder: maxOrder(group),
        }))
    ];

    const hiddenFields = fields.filter(f => f.type === 'hidden');

    const sortedGroups = groups.sort((a, b) => a.maxOrder - b.maxOrder);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
            {(() => {
                const tabDisplayGroups = sortedGroups.filter(g => g.type === 'tab');
                const nonTabDisplayGroups = sortedGroups.filter(g => g.type !== 'tab');

                return (
                    <>
                        {tabDisplayGroups.length > 0 && (
                            <Tabs
                                defaultValue={tabDisplayGroups[0].key}
                                className="w-full"
                            >
                                <TabsList>
                                    {tabDisplayGroups.map((group) => (
                                        <TabsTrigger
                                            className="cursor-pointer"
                                            key={group.key}
                                            value={group.key}
                                        >
                                            {group.key}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                {tabDisplayGroups.map((group) => (
                                    <TabsContent
                                        key={group.key}
                                        value={group.key}
                                    >
                                        <Card>
                                            <CardContent
                                                className={
                                                    gridClasses(columns) +
                                                    ' gap-4'
                                                }
                                            >
                                                {group.fields.map((field) =>
                                                    processing ? (
                                                        <AppFieldBuilderLoadingPlaceholder
                                                            key={
                                                                field.key + 'lt'
                                                            }
                                                            field={field}
                                                        />
                                                    ) : (
                                                        <AppFieldBuilder
                                                            key={field.key}
                                                            field={field}
                                                            value={
                                                                data[field.key]
                                                            }
                                                            onReactive={
                                                                onReactive
                                                            }
                                                            error={
                                                                errors[
                                                                    field.key
                                                                ]
                                                            }
                                                            isProcessing={
                                                                processing
                                                            }
                                                            setFields={
                                                                setFields
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        )}

                        {nonTabDisplayGroups.map((group) => {
                            if (group.type === 'grid') {
                                const gridCol = group.fields[0]?.gridCol;
                                return (
                                    <div
                                        key={group.key}
                                        className={
                                            gridClasses(gridCol) + ' gap-4'
                                        }
                                    >
                                        {group.fields.map((field) =>
                                            processing ? (
                                                <AppFieldBuilderLoadingPlaceholder
                                                    key={field.key + 'lg'}
                                                    field={field}
                                                />
                                            ) : (
                                                <AppFieldBuilder
                                                    key={field.key}
                                                    field={field}
                                                    value={data[field.key]}
                                                    onReactive={onReactive}
                                                    error={errors[field.key]}
                                                    isProcessing={processing}
                                                    setFields={setFields}
                                                />
                                            ),
                                        )}
                                    </div>
                                );
                            }
                            if (group.type === 'non-grid') {
                                return (
                                    <div
                                        key={group.key}
                                        className={
                                            gridClasses(columns) + ' gap-4'
                                        }
                                    >
                                        {group.fields.map((field) =>
                                            processing ? (
                                                <AppFieldBuilderLoadingPlaceholder
                                                    key={field.key + 'nnt'}
                                                    field={field}
                                                />
                                            ) : (
                                                <AppFieldBuilder
                                                    key={field.key}
                                                    field={field}
                                                    value={data[field.key]}
                                                    onReactive={onReactive}
                                                    error={errors[field.key]}
                                                    isProcessing={processing}
                                                    setFields={setFields}
                                                />
                                            ),
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </>
                );
            })()}
            {hiddenFields.map(hiddenField => {
                return (
                    <AppFieldBuilder
                        key={hiddenField.key}
                        field={hiddenField}
                        value={data[hiddenField.key]}
                        onReactive={onReactive}
                        error={errors[hiddenField.key]}
                        isProcessing={processing}
                        setFields={setFields}
                    />
                )
            })}

            {children && children.formAction(processing)}
        </form>
    );
}
