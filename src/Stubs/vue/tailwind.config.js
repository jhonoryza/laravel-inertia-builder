import typography from '@tailwindcss/typography';

export default {
    content: [
        "./resources/js/**/*.js",
        "./resources/js/**/*.jsx",
        "./resources/js/**/*.ts",
        "./resources/js/**/*.tsx",
        "./resources/**/*.blade.php",
    ],
    plugins: [
        typography,
    ],
};
