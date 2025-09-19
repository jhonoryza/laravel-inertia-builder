import { ColorPickerField } from "./color-picker-field";
import { RatingField } from "./rating-field";

// Register all field custom component here.
// Key (ex: 'rating') is a key named will be used in backend PHP.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customFieldsComponents : Record<string, React.ComponentType<any>> = {
    'color-picker' : ColorPickerField,
    'rating': RatingField,
};