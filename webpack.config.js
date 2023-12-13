const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

// Function to format the current date and time
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
            filename: `xdash-extension-release-${getFormattedDate()}.zip`
        })
    ],
    devtool: 'source-map' // Add this line for source map
    // ... (other configurations)
};
