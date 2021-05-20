const production = !process.env.ROLLUP_WATCH;

module.exports = {
    mode: 'jit',
    purge: {
        content: [
            "./src/**/*.svelte",
        ],
        options: {
            defaultExtractor: content => [
                ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
                ...(content.match(/(?<=class:)[^=>\/\s]*/g) || []),
            ],
        },
        enabled: production // disable purge in dev
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
    future: {
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true,
    },

}
