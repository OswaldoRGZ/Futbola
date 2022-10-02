const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        login: './src/login.js',
        dashboard: './src/dashboard.js',
        config: './src/config.js',
        setup: './src/setup.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
};
