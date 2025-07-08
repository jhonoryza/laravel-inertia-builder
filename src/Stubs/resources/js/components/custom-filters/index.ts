import React from 'react';
import { ActiveFilter, Filter } from '@/types/datatable';
import {RatingFilter} from "@/components/custom-filters/rating-filter";

export interface CustomFilterComponentProps {
    value: string | string[] | undefined;
    onChange: (value: string | string[]) => void;
    filterDef: Filter;
    activeFilter: ActiveFilter;
}

// Register all filter custom component here.
// Key (ex: 'rating') is a key named will be used in backend PHP.
export const customFilterComponents: Record<string, React.ComponentType<CustomFilterComponentProps>> = {
    // example:
    // date-range-picker: DateRangePickerFilter,
    rating: RatingFilter,
};
