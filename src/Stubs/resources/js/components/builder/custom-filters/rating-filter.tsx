import { RatingField } from '@/components/builder/custom-fields/rating-field';
import React from 'react';
import { CustomFilterComponentProps } from './index';

export function RatingFilter({ value, onChange, filterDef }: CustomFilterComponentProps) {
    return (
        <RatingField
            name={filterDef.field}
            label={filterDef.label}
            value={Number(value) || 0}
            onChange={(newValue) => onChange(String(newValue))}
        />
    );
}
