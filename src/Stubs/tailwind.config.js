import typography from '@tailwindcss/typography';

export default {
    content: [
        "./resources/js/**/*.js",
        "./resources/js/**/*.jsx",
        "./resources/js/**/*.ts",
        "./resources/js/**/*.tsx",
        "./resources/**/*.blade.php",
    ],
    // safelist: [
    //     // grid
    //     {pattern: /grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /sm:grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /md:grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /xl:grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /2xl:grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //
    //     // col-span
    //     {pattern: /col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /sm:col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /md:col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /xl:col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /2xl:col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //
    //     // order
    //     {pattern: /order-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /sm:order-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /md:order-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /xl:order-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    //     {pattern: /2xl:order-(1|2|3|4|5|6|7|8|9|10|11|12)/},
    // ],
    plugins: [
        typography,
    ],
};
