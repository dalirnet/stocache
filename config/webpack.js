const path = require('path')
const terserPlugin = require('terser-webpack-plugin')
const yargs = require('yargs')
const env = yargs.argv.env
const package = require('../package.json')

module.exports = {
    mode: env,
    target: 'es5',
    entry: path.resolve('./src/index.js'),
    devtool: 'source-map',
    watch: env === 'development',
    watchOptions: {
        ignored: ['node_modules/**'],
    },
    output: {
        path: path.resolve('./lib'),
        filename: 'index.js',
        library: package.name,
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
        globalObject: "typeof self !== 'undefined' ? self : this",
    },
    module: {
        rules: [
            {
                test: /(\.js)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    resolve: {
        modules: [path.resolve('./node_modules'), path.resolve('./src')],
        extensions: ['.json', '.js'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new terserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
}
