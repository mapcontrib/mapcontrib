
var path = require('path'),
babelPresets = ['es2015'];

module.exports = {
    context: path.join(__dirname, 'src', 'public'),
    entry: {
        theme: './js/theme'
    },
    output: {
        path: path.join(__dirname, 'src', 'public', 'js'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /public\/js\/.*\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.json$/,
                loader: 'raw'
            },
            {
                test: /\.svg$/,
                loader: 'raw'
            },
            {
                test: /\.ejs$/,
                loader: 'ejs'
            }
        ]
    },
    devtool: 'source-map',
    debug: true
};
