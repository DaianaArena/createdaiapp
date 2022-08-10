var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'assets/js/bundle.js',
        assetModuleFilename: 'assets/images/[name][ext][query]'
    },
    /*optimization: {
        minimize: false
    },*/

    //servidor de desarrollo
    devServer : {
        port: 5001,
    },

    module: {
        rules: [
            //transpilador de swc
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: 'swc-loader' }
            },
            //procesamiento de stilos en sass
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            publicPath: '../../',
                        },
                    },
                    // Translates CSS into CommonJS
                    {
                        loader: 'css-loader', 
                            options: { sourceMap: true,}
                    },
                    {
                        loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                plugins: [
                                        [
                                            "postcss-preset-env",
                                            {
                                                // Options
                                            },
                                        ],
                                    ],
                                },
                            // options: {
                            //     sourceMap: true,
                            //     config: { path: 'postcss.config.js'}
                            // }
                        },
                    },
                    // Compiles Sass to CSS
                    {
                        loader: 'sass-loader',
                            options: { sourceMap: true }
                    },
                ],
            },
            //procesamiento de imagenes
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                type: 'asset/resource'
            },
            //tipografias
            {
                test: /\.(woff|woff2|otf|eot|ttf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name][ext][query]'
                }
            }
        ]
    },

    plugins: [
        //copia los html
        new HtmlWebpackPlugin({
            template: './src/html/index.html', 
        }),
        /*new HtmlWebpackPlugin({
            template: './src/html/about.html', 
            filename: 'about.html'
        }),*/

        //procesamiento de css, para que arme un archivo css separado
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: 'assets/css/style.css',
            //chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        
        //copia la carpeta de imagenes
        new CopyWebpackPlugin({
            patterns: [
                {from:'src/assets/images',to:'assets/images'} 
            ],
        }), 
    ],
};