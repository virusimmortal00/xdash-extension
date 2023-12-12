const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './content.js', // Your entry file
    output: {
        path: path.resolve(__dirname, 'dist/xdash-extension-release'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'manifest.json', to: 'manifest.json' },
                { from: 'icons', to: 'icons' }, // Copy entire 'images' folder
                { from: 'popup.js', to: 'popup.js' },
                { from: 'popup.html', to: 'popup.html' },
                { from: 'css', to: 'css' }
                // ... add other files or directories as needed
            ],
        }),
        new ZipPlugin({
            path: '../', // Put the zip file outside of the dist folder
            filename: 'xdash-extension-release.zip'
        })
    ],
    devtool: 'source-map' // Add this line for source map
    // ... (other configurations)
};
