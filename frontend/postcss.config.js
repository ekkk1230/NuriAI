
import postcssPresetEnv from 'postcss-preset-env';

const config = {
    plugins: [
        '@tailwindcss/postcss',
        postcssPresetEnv({
            stage: 3,
            features: {
                'color-function': true, // lab(), oklch() 등을 rgb()로 변환 시도
            },
        }),
    ]
};

export default config;
