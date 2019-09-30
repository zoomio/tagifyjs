const path = require('path');
const webpack = require('webpack');

const { NODE_ENV = 'development' } = process.env;
const isDevelopment = NODE_ENV === 'development';

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'tagify.js',
        library: 'tagifyjs'
    },
    module: {
        rules: [
            {
                // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        // These globals must also be defined in typings-custom/globals.d.ts
        new webpack.DefinePlugin({
            __DEV__: isDevelopment,
            __PROD__: !isDevelopment,
        })
    ],
    externals: {
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        }
    }
};