// Register all cell custom component here.
// Key (ex: 'badge') is a key named will be used in backend PHP.

import BadgeCell from "./badge-cell";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customCellComponents : Record<string, React.ComponentType<any>> = {
    'badge' : BadgeCell,
};