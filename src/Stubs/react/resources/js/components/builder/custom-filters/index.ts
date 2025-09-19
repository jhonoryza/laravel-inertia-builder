import React from 'react';
import {RatingFilter} from "@/components/builder/custom-filters/rating-filter";

// Register all filter custom component here.
// Key (ex: 'rating') is a key named will be used in backend PHP.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customFilterComponents: Record<string, React.ComponentType<any>> = {
    rating: RatingFilter,
};
