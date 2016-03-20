
const path = require('path');
const babelPresets = ['es2015'];



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
                loader: 'style!css?sourceMap'
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            {
                test: /\.json$/,
                loader: 'raw'
            },
            {
                test: /.*\.svg$/,
                loader: 'raw'
            },
            {
                test: /\.ejs$/,
                loader: 'ejs'
            },
            {
                test: /\.png$/,
                loader: 'file?name=../assets/[name].[ext]'
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?mimetype=application/font-woff&name=../assets/[name].[ext]"
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?mimetype=application/font-woff2&name=../assets/[name].[ext]"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?mimetype=application/octet-stream&name=../assets/[name].[ext]"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file?mimetype=application/vnd.ms-fontobject&name=../assets/[name].[ext]"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /img/,
                loader: "file?mimetype=image/svg+xml&name=../assets/[name].[ext]"
            }
        ]
    },
    devtool: 'source-map',
    debug: true
};
