// webpack.config.js

const { resolve } = require('path');

module.exports = {
    entry: resolve(__dirname, 'index.js'),
    target: 'web',
    mode: 'development',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 't-chain-payment.js',
        library: 'Payment',
    },
};