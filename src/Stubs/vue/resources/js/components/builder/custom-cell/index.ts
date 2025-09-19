// custom-cell/index.ts

import type { Component } from "vue";
import BadgeCell from "./BadgeCell.vue";

// Register all cell custom component here.
// Key (ex: 'badge') is a key named will be used in backend PHP.
export const customCellComponents: Record<string, Component> = {
    badge: BadgeCell,
};
