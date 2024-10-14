const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const fs = require('fs');

module.exports = function (env, argv) {
    return {
        entry: {
            'jscheduler': ['./src/index.js', ],
            'examples':   ['./src/examples.js']
        },
        devServer: {
            static: { 
                directory: path.join(__dirname, 'public'),
            }
        },
        output: {
            filename: '[name].js',
            library: '[name]',
            libraryTarget: 'umd'
        },
        resolve: {
            alias: {
                '@src': path.resolve(__dirname, 'src'),
            },
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { 
                        from: './public', 
                        to: '.',  
                        globOptions: {
                            ignore: ['**/temp', '**/tests.html']
                        }
                    },
                ]
            }),
            new webpack.DefinePlugin({
                '__EXAMPLES_SOURCES__': JSON.stringify(get_examples_sources()),
                '__WEBPACK_MODE__': JSON.stringify( argv.mode )
            })
        ]
    }
}

function get_examples_sources() {
    const folder = path.join(__dirname, 'public', 'examples');
    return Object.fromEntries(
        fs.readdirSync(folder).map( filename => [
            filename.split('.')[0],
            fs.readFileSync(path.join(folder, filename), 'utf8')
        ])
    );
}
