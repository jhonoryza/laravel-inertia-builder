import RatingFilter from "@/components/builder/custom-filters/RatingFilter.vue";
import type { Component } from "vue";

// Register all filter custom component here.
// Key (ex: 'rating') is a key named will be used in backend PHP.


export const customFilterComponents: Record<string, Component> = {
    rating: RatingFilter,
};
