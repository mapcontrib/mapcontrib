
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const extractCSS = new ExtractTextPlugin('../css/bundle.css');

var plugins = [
    extractCSS
];

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    plugins.push(
        new webpack.optimize.DedupePlugin()
    );

    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: true,
            output: {
              comments: false
            },
            compress: {
              warnings: false
            }
        })
    );
}


module.exports = {
    devtool: 'source-map',
    debug: true,
    plugins: plugins,
    context: path.join(__dirname, 'src', 'public'),
    entry: {
        home: './js/home',
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
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: extractCSS.extract(['css'])
            },
            {
                test: /\.less$/,
                loader: extractCSS.extract(['css', 'less'])
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
                loader: "file?mimetype=application/font-woff&name=../assets/[name].[ext]"
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file?mimetype=application/font-woff2&name=../assets/[name].[ext]"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file?mimetype=application/octet-stream&name=../assets/[name].[ext]"
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
};
