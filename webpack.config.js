const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

function getFormattedDate() {
    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12; // Convert to 12-hour format and handle midnight

    return `${month}${day}_${formattedHour}_${minutes}${ampm}`;
}

module.exports = {
    mode: 'development',
    entry: {
        'content': './src/content.ts', // Assuming TypeScript files are in 'src' folder
        'popup': './src/popup.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist/xdash-extension-release'),
        filename: '[name].js' // Output filename based on entry name
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'] // Resolve these file extensions
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, // Regex for TypeScript files
                use: 'ts-loader',
                exclude: /node_modules/
            },
            // ... other rules ...
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'manifest.json', to: 'manifest.json' },
                { from: 'icons', to: 'icons' }, // Copy entire 'images' folder
                { from: 'src/popup.html', to: 'popup.html' },
                { from: 'css', to: 'css' }
                // ... add other files or directories as needed
            ],
        }),
        new ZipPlugin({
            path: '../', // Put the zip file outside of the dist folder
            filename: `xdash-extension-release-${getFormattedDate()}.zip`
        })
    ],
    devtool: 'source-map' // Source map configuration
};