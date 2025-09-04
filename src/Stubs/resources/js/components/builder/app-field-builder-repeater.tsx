
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { AppFieldBuilder } from './app-field-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FieldDefinition } from "@/types/field-builder";

interface RepeaterFieldProps {
    field: FieldDefinition & {
        schema?: FieldDefinition[];
        minItems?: number;
        maxItems?: number;
        addButtonLabel?: string;
        itemLabel?: string;
        collapsible?: boolean;
        collapsed?: boolean;
        reorderable?: boolean;
    };
    value: any[];
    setFields: React.Dispatch<React.SetStateAction<FieldDefinition[]>>;
    onReactive: (name: string, value: any, operator?: string) => void;
    error?: string | Record<string, any>;
}

export function AppFieldBuilderRepeater({ field, value, setFields, onReactive, error }: RepeaterFieldProps) {
    // Ensure value is an array
    const items = Array.isArray(value) ? value : [];

    const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Initialize open/closed state for items based on the collapsed prop
    useEffect(() => {
        if (field.collapsible) {
            const initialOpenState = items.reduce((acc, _, index) => {
                acc[index] = !field.collapsed;
                return acc;
            }, {} as Record<number, boolean>);
            setOpenItems(initialOpenState);
        }
    }, [field.collapsible, field.collapsed, items.length]);

    const addItem = () => {
        // Check if we've reached the maximum allowed items
        if (field.maxItems !== undefined && items.length >= field.maxItems) {
            return;
        }

        // Create a new empty item with default values
        const newItem = field.schema?.reduce((acc, schemaField) => {
            // Set default values based on field type
            if (['checkbox', 'toggle'].includes(schemaField.type)) {
                acc[schemaField.name] = false;
            } else if (schemaField.type === 'checkbox-list') {
                acc[schemaField.name] = [];
            } else {
                acc[schemaField.name] = '';
            }
            return acc;
        }, {} as Record<string, any>) || {};

        // Add the new item to the array
        const updatedItems = [...items, newItem];
        onReactive(field.name, updatedItems);

        // Auto-open the new item if collapsible
        if (field.collapsible) {
            setOpenItems((prev) => ({
                ...prev,
                [updatedItems.length - 1]: true,
            }));
        }
    };

    const removeItem = (index: number) => {
        // Check if we've reached the minimum allowed items
        if (field.minItems !== undefined && items.length <= field.minItems) {
            return;
        }

        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        onReactive(field.name, updatedItems);
    };

    const updateItemField = (index: number, fieldName: string, fieldValue: any) => {
        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            [fieldName]: fieldValue,
        };
        onReactive(field.name, updatedItems);
    };

    const toggleCollapse = (index: number) => {
        setOpenItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const moveItem = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= items.length) return;

        const updatedItems = [...items];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);

        onReactive(field.name, updatedItems);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        moveItem(draggedIndex, index);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const getItemLabel = (item: Record<string, any>, index: number) => {
        if (!field.itemLabel) return `Item ${index + 1}`;

        // Replace placeholders in the item label
        let label = field.itemLabel.replace(':index', String(index + 1));

        // Replace field values in the format {field_name}
        const fieldMatches = label.match(/\{([^}]+)\}/g) || [];
        fieldMatches.forEach(match => {
            const fieldName = match.slice(1, -1); // Remove { and }
            const fieldValue = item[fieldName] || '';
            label = label.replace(match, String(fieldValue));
        });

        return label;
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => {
                const itemErrors = typeof error === 'object' && error !== null && error[index]
                    ? error[index]
                    : {};

                return (
                    <Card
                        key={index}
                        className={cn(
                            'border relative',
                            draggedIndex === index && 'border-primary opacity-70'
                        )}
                        draggable={field.reorderable}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        {field.reorderable && (
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                        )}

                        {field.collapsible ? (
                            <Collapsible open={openItems[index]} onOpenChange={() => toggleCollapse(index)}>
                                <CardHeader className="py-3 px-4">
                                    <div className="flex items-center justify-between">
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm" className="p-0 h-auto">
                                                <CardTitle className="text-sm font-medium flex items-center gap-1">
                                                    {openItems[index] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                    {getItemLabel(item, index)}
                                                </CardTitle>
                                            </Button>
                                        </CollapsibleTrigger>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(index)}
                                            disabled={field.minItems !== undefined && items.length <= field.minItems}
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="space-y-4">
                                            {field.schema?.map((schemaField) => (
                                                <AppFieldBuilder
                                                    key={`${index}-${schemaField.name}-${field.key}`}
                                                    field={schemaField}
                                                    value={item[schemaField.name]}
                                                    setFields={setFields}
                                                    onReactive={(fieldName, fieldValue) => updateItemField(index, fieldName, fieldValue)}
                                                    error={itemErrors && itemErrors[schemaField.name]}
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        ) : (
                            <>
                                <CardHeader className="py-3 px-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium">
                                            {getItemLabel(item, index)}
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(index)}
                                            disabled={field.minItems !== undefined && items.length <= field.minItems}
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {field.schema?.map((schemaField) => (
                                            <AppFieldBuilder
                                                key={`${index}-${schemaField.name}`}
                                                field={schemaField}
                                                value={item[schemaField.name]}
                                                setFields={setFields}
                                                onReactive={(fieldName, fieldValue) => updateItemField(index, fieldName, fieldValue)}
                                                error={itemErrors && itemErrors[schemaField.name]}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </>
                        )}
                    </Card>
                );
            })}

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                disabled={field.maxItems !== undefined && items.length >= field.maxItems}
                className="mt-2"
            >
                <PlusCircle className="h-4 w-4 mr-2" />
                {field.addButtonLabel || 'Add Item'}
            </Button>
        </div>
    );
}
