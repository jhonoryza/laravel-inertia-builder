/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, PlusCircle, Check } from 'lucide-react';

interface TagsFieldProps {
    field: {
        name: string;
        label: string;
        type: string;
        suggestions?: string[];
        separator?: string;
        addButtonLabel?: string;
        maxTags?: number;
        tagPrefix?: string;
        placeholder?: string;
        mergeClass?: string;
    };
    value: string[] | null;
    onChange: (name: string, value: any, operator?: string) => void;
    error?: string;
}

export function AppFieldBuilderTags({ field, value, onChange, error }: TagsFieldProps) {
    const [tags, setTags] = useState<string[]>(value || []);
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const updateTags = (newTags: string[]) => {
        setTags(newTags);
        onChange(field.name, newTags);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addTag = (tag: string) => {
        // Don't add empty tags
        if (!tag.trim()) return;

        // Don't exceed max tags if specified
        if (field.maxTags !== undefined && tags.length >= field.maxTags) return;

        // Add prefix if specified
        const formattedTag = field.tagPrefix ? `${field.tagPrefix}${tag}` : tag;

        // Check if tag already exists
        if (!tags.includes(formattedTag)) {
            updateTags([...tags, formattedTag]);
        }

        // Clear input after adding
        setInputValue('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        updateTags(newTags);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Add tag on Enter
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        }

        // Remove last tag on Backspace if input is empty
        if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }

        // Handle separator for adding multiple tags at once
        if (field.separator && inputValue.includes(field.separator)) {
            e.preventDefault();
            const newTags = inputValue.split(field.separator)
                .filter(tag => tag.trim() !== '');

            newTags.forEach(tag => {
                // Check if we haven't reached max tags
                if (field.maxTags === undefined || tags.length < field.maxTags) {
                    addTag(tag.trim());
                }
            });
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        addTag(suggestion);
        setShowSuggestions(false);
    };

    const handleInputFocus = () => {
        if (inputValue.length > 0 && field.suggestions?.length) {
            setShowSuggestions(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (e.target.value.length > 0 && field.suggestions?.length) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    // Filter suggestions based on input
    const filteredSuggestions = field.suggestions
        ? field.suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(field.tagPrefix ? `${field.tagPrefix}${suggestion}` : suggestion)
        )
        : [];

    const showAddButton = field.maxTags === undefined || tags.length < field.maxTags;

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[38px]">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                    >
                        <span>{tag}</span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 rounded-full hover:bg-primary/20"
                            onClick={() => removeTag(tag)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}

                <div className="flex-1 min-w-[180px] relative">
                    <Input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={handleInputFocus}
                        placeholder={tags.length === 0 ? (field.placeholder || 'Add tags...') : ''}
                        className="border-0 shadow-none focus-visible:ring-0 px-0 py-0 h-auto min-h-[24px]"
                        disabled={field.maxTags !== undefined && tags.length >= field.maxTags}
                    />

                    {/* Suggestions dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div
                            ref={suggestionsRef}
                            className="absolute z-50 mt-1 w-full max-w-[280px] rounded-md border bg-card shadow-md overflow-hidden"
                        >
                            <div className="max-h-[200px] overflow-y-auto py-1">
                                {filteredSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-muted text-sm"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                        <Check className="h-4 w-4 opacity-70" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showAddButton && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (inputValue.trim()) {
                            addTag(inputValue);
                        } else {
                            inputRef.current?.focus();
                        }
                    }}
                    className="mt-1"
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {field.addButtonLabel || 'Add Tag'}
                </Button>
            )}

            {field.separator && (
                <div className="text-xs text-muted-foreground mt-1">
                    Separate multiple tags with "{field.separator}"
                </div>
            )}

            {field.maxTags !== undefined && (
                <div className="text-xs text-muted-foreground">
                    {tags.length} of {field.maxTags} tags used
                </div>
            )}

        </div>
    );
}
