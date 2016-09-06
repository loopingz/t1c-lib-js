var webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            'node_modules/jquery/dist/jquery.js',
            'src/test/**/*.ts'
        ],
        exclude: [
        ],
        preprocessors: {
            'src/test/**/*.ts': ['webpack']
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome','Opera','IE','Safari'],
        singleRun: false,
        concurrency: Infinity
    })
};