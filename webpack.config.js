// webpack.config.js

const {resolve} = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: resolve(__dirname, 'index.js'),
    mode: 'development',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 't-chain-payment.js',
        library: 'Payment'
    },
    plugins: [
        new UglifyJsPlugin({
            exclude: [/\.min\.js$/gi] // skip pre-minified libs
        })
    ]
}