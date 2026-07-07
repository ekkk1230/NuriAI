import postcssPresetEnv from 'postcss-preset-env';

export default {
    plugins: [
        '@tailwindcss/postcss',
        postcssPresetEnv({
            stage: 3,
            features: {
                'color-function': true,
            },
        }),
    ]
};