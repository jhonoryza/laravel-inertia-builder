import { maxOrder, sortByOrder } from "@/lib/utils";
import { FieldDefinition, FieldOption } from "@/types/field-builder";
import { Form } from "@/types/form";
import { useForm } from "@inertiajs/vue3";
import { defineStore } from "pinia";
import { computed, nextTick, reactive, ref } from "vue";
import { route } from "ziggy-js";

export const useFormStore = (prefix: string) => {
    return defineStore(`form-${prefix}`, () => {
        const createEmptyFormData = (): Form => ({
            columns: {
                default: 1,
            },
            fields: [],
            baseRoute: "",
            routeId: undefined,
            mode: "create",
            formClass: "",
            modelClass: "",
            title: "",
            canEdit: true,
            prefix: ""
        });

        // ===== MAIN STATE =====
        const formData = reactive<Form>(createEmptyFormData());
        const fields = ref<FieldDefinition[]>([]);
        const inertiaForm = ref<any>(null);
        const debounceTimeouts = ref<Record<string, NodeJS.Timeout>>({});

        // ===== COMPUTED =====
        const isEmpty = computed(() => !formData.formClass);

        // Form values computed from fields
        const formValues = computed(() => {
            return fields.value.reduce((acc, field) => {
                acc[field.key] = field.defaultValue ?? '';
                return acc;
            }, {} as Record<string, any>);
        });

        // Group fields untuk rendering
        const fieldGroups = computed(() => {
            const gridGroups = Object.entries(
                fields.value
                    .filter((f) => f.grid && f.type !== 'hidden')
                    .reduce((acc, f) => {
                        acc[f.gridKey || ''] = acc[f.gridKey || ''] || [];
                        acc[f.gridKey || ''].push(f);
                        return acc;
                    }, {} as Record<string, FieldDefinition[]>)
            );

            const nonGridFields = fields.value.filter((f) => !f.grid && f.type !== 'hidden');

            const groups = [
                ...gridGroups.map(([gridKey, group]) => ({
                    type: 'grid' as const,
                    key: gridKey,
                    fields: sortByOrder(group),
                    maxOrder: maxOrder(group),
                })),
                {
                    type: 'non-grid' as const,
                    key: 'non-grid',
                    fields: sortByOrder(nonGridFields),
                    maxOrder: maxOrder(nonGridFields),
                },
            ];

            return groups.sort((a, b) => a.maxOrder - b.maxOrder);
        });

        const hiddenFields = computed(() => {
            return fields.value.filter((f) => f.type === 'hidden');
        });

        // ===== ACTIONS =====
        const setData = (newData: Form) => {
            Object.assign(formData, newData);
            fields.value = newData.fields || [];
        };

        const resetData = () => {
            Object.assign(formData, createEmptyFormData());
        };


        const initializeForm = () => {
            const initialFormValues = fields.value.reduce((acc, field) => {
                acc[field.key] = field.defaultValue ?? '';
                return acc;
            }, {} as Record<string, any>);

            inertiaForm.value = useForm<Record<string, any>>(initialFormValues);

            // Transform untuk patch support file upload
            inertiaForm.value.transform((data: any) =>
                formData.routeId ? { ...data, _method: 'patch' } : data
            );
        };

        const setDataWithUIInit = (newData: Form) => {
            resetData();
            setData(newData);
            initializeForm();
        };

        // Helper function untuk get cookie
        const getCookie = (name: string): string => {
            return document.cookie.split('; ')
                .find((row) => row.startsWith(name + '='))?.split('=')[1] || '';
        };

        // Live update ke server
        const sendLiveUpdate = async (key: string, value: any) => {
            if (!inertiaForm.value) return;

            try {
                const res = await fetch('/inertia-builder/reactive', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                    },
                    body: JSON.stringify({
                        key,
                        value,
                        state: { ...inertiaForm.value, [key]: value },
                        formClass: formData.formClass,
                        modelClass: formData.modelClass,
                        mode: formData.mode,
                        routeId: formData.routeId,
                    }),
                });

                if (!res.ok) {
                    console.error(`HTTP error! status: ${res.status}`);
                    return;
                }

                const result = await res.json();
                if (result.fields) {
                    setDataWithUIInit(result);
                }
            } catch (error) {
                console.error('Live update failed:', error);
            }
        };

        const getNestedValue = (path: string, defaultValue: any = null) => {
            const value = path.split('.').reduce((obj: any, key) => {
                if (!obj) return undefined;
                return obj[key];
            }, inertiaForm.value);
            return value === undefined ? defaultValue : value;
        };

        const setNestedValue = (obj: any, path: string, value: any) => {
            const keys = path.split('.');
            const lastKey = keys.pop()!;
            const target = keys.reduce((acc, key) => {
                if (!acc[key]) acc[key] = {};
                return acc[key];
            }, obj);
            target[lastKey] = value;
            return obj;
        };

        const onReactive = (key: string, value: any) => {
            if (!inertiaForm.value) return;

            // Gunakan setNestedValue untuk update nested data
            setNestedValue(inertiaForm.value, key, value);

            const field = fields.value.find((f) => f.key === key);

            if (!field?.reactive) return;

            if (field.debounce && field.debounce > 0) {
                if (debounceTimeouts.value[key]) {
                    clearTimeout(debounceTimeouts.value[key]);
                }
                debounceTimeouts.value[key] = setTimeout(async () => {
                    sendLiveUpdate(key, value);
                    setTimeout(() => document.querySelector<HTMLInputElement>('#' + key)?.focus(), 100);
                }, field.debounce);
            } else {
                sendLiveUpdate(key, value);
                setTimeout(() => document.querySelector<HTMLInputElement>('#' + key)?.focus(), 100);
            }
        };

        // Handle form submission
        const handleSubmit = () => {
            if (!inertiaForm.value) return;

            if (formData.routeId) {
                const oldData = formData;
                inertiaForm.value.post(route(`${formData.baseRoute}.update`, formData.routeId), {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        setData(oldData);
                    },
                });
                return;
            }
            const oldData = formData;
            inertiaForm.value.post(route(`${formData.baseRoute}.store`), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                        setData(oldData);
                    },
            });
        };

        // Update fields (untuk reactive components)
        const setFields = (newFields: FieldDefinition[]) => {
            fields.value = newFields;
        };

        const setFieldOption = (key: string, options?: FieldOption[]) => {
            const field = fields.value.find((f) => f.key == key)
            if (field) {
                field.options = options;
            }
        };

        // Get form processing state
        const isProcessing = computed(() => {
            return inertiaForm.value?.processing || false;
        });

        // Get form errors
        const formErrors = computed(() => {
            return inertiaForm.value?.errors || {};
        });

        // Get form data
        const currentFormData = computed(() => {
            return inertiaForm.value?.data || {};
        });

        // Get field value
        const getFieldValue = (key: string) => {
            return inertiaForm.value[key];
        };

        // Get field error
        const getFieldError = (key: string) => {
            return inertiaForm.value?.errors[key];
        };

        // Reset form
        const resetForm = () => {
            inertiaForm.value.reset();
            clearErrors();
        };

        // Clear form errors
        const clearErrors = (key?: string) => {
            if (inertiaForm.value) {
                if (key) {
                    inertiaForm.value.clearErrors(key);
                } else {
                    inertiaForm.value.clearErrors();
                }
            }
        };

        return {
            // State
            formData,
            fields,
            inertiaForm: computed(() => inertiaForm.value),

            // Computed
            isEmpty,
            formValues,
            fieldGroups,
            hiddenFields,
            isProcessing,
            formErrors,
            currentFormData,

            // Actions
            setData: setDataWithUIInit,
            setFields,
            setFieldOption,
            onReactive,
            handleSubmit,
            resetForm,
            clearErrors,
            getFieldValue,
            getFieldError,
            getNestedValue,

            // Utility actions
            sendLiveUpdate,
            initializeForm,
        };
    });
};
