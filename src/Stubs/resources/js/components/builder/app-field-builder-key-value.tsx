/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeyValueFieldProps {
    field: {
        name: string;
        label: string;
        type: string;
        addable?: boolean;
        editable?: boolean;
        removable?: boolean;
        reorderable?: boolean;
        keyLabel?: string;
        valueLabel?: string;
        addButtonLabel?: string;
        keyPlaceholder?: string;
        valuePlaceholder?: string;
        mergeClass?: string;
    };
    value: Record<string, string> | null;
    setData: (field: string, value: any) => void;
    error?: string | Record<string, string>;
}

export function AppFieldBuilderKeyValue({ field, value, setData, error }: KeyValueFieldProps) {
    // Convert object to array of key-value pairs for easier manipulation
    const [items, setItems] = useState<Array<{ key: string; value: string }>>(() => {
        if (!value) return [];
        return Object.entries(value).map(([key, val]) => ({ key, value: String(val) }));
    });

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Update the form data whenever items change
    const updateData = (newItems: Array<{ key: string; value: string }>) => {
        // Convert array back to object
        const newData = newItems.reduce((acc, { key, value }) => {
            if (key.trim()) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, string>);

        setItems(newItems);
        setData(field.name, newData);
    };

    const addItem = () => {
        const newItems = [...items, { key: '', value: '' }];
        updateData(newItems);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        updateData(newItems);
    };

    const updateItem = (index: number, keyOrValue: 'key' | 'value', newValue: string) => {
        const newItems = [...items];
        newItems[index][keyOrValue] = newValue;
        updateData(newItems);
    };

    const moveItem = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= items.length) return;

        const newItems = [...items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);

        updateData(newItems);
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

    return (
        <div className="space-y-2">
            <div className="rounded-md border">
                {/* Header */}
                <div className="flex items-center p-2 bg-muted/40 border-b">
                    {field.reorderable && <div className="w-8" />}
                    <div className="flex-1 font-medium text-sm">{field.keyLabel || 'Key'}</div>
                    <div className="flex-1 font-medium text-sm">{field.valueLabel || 'Value'}</div>
                    {field.removable && <div className="w-8" />}
                </div>

                {/* Items */}
                <div className="divide-y">
                    {items.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground italic">
                            No items added yet.
                        </div>
                    )}

                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                'flex items-center p-2 gap-2',
                                draggedIndex === index && 'bg-muted/20'
                            )}
                            draggable={field.reorderable}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            {field.reorderable && (
                                <div className="flex-none cursor-move">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                            )}

                            <Input
                                className="flex-1"
                                value={item.key}
                                onChange={(e) => updateItem(index, 'key', e.target.value)}
                                placeholder={field.keyPlaceholder || 'Enter key'}
                                disabled={!field.editable}
                            />

                            <Input
                                className="flex-1"
                                value={item.value}
                                onChange={(e) => updateItem(index, 'value', e.target.value)}
                                placeholder={field.valuePlaceholder || 'Enter value'}
                                disabled={!field.editable}
                            />

                            {field.removable && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="flex-none h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeItem(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {field.addable && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    className="mt-2"
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {field.addButtonLabel || 'Add Item'}
                </Button>
            )}

        </div>
    );
}
