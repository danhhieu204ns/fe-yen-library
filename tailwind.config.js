/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        corePlugins: {
            preflight: false,
        },
        extend: {
            backgroundColor: {
                primary: '#f37423',
            },
            textColor: {
                primary: '#f37423',
            },
            colors: {
                primary: '#f37423',
                delete: '#cf1322',
                edit: '#fadb14'
            },
        },
    },
    plugins: [],
};
