var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'assets/js/bundle.js',
        assetModuleFilename: 'assets/images/[name][ext][query]',
        publicPath: ''
    },
    /*optimization: {
        minimize: false
    },*/

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
                            options: { sourceMap: true,
                                sassOptions: {
                                    minimize: false,
                                    outputStyle: 'expanded'
                                }
                            }
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
            filename: 'html/deploy/index.html',
            minify: false
        }),
        // new HtmlWebpackPlugin({
        //     template: './src/html/i5.html', 
        //     filename: 'i5/deploy/index.html',
        //     minify: false
        // }),

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
                {from:'src/assets/images',to:'assets/images'},
            ],
        }),
        
        new FileManagerPlugin({
            events: {
                onEnd: [{
                    copy: [
                        //Se crea la carpeta source-code con los archivos correspondientes
                        {source: 'src', destination: 'dist/source-code/src'},
                        {source: 'package.json', destination: 'dist/source-code/package.json'},
                        {source: 'webpack.config.js', destination: 'dist/source-code/webpack.config.js'},
                        //Se copian los assets en cada carpeta
                        // > agregar las carpetas necesarias
                        {source:'dist/assets', destination:'dist/html/deploy/assets'},
                        // {source:'dist/assets', destination:'dist/i5/deploy/assets'},
                        //Se agrega la guía de implementación a cada carpeta
                        // > agregar las carpetas necesarias
                        {source:'Implementation_Guide_Intel_ProductPage.docx', destination:'dist/html/'},
                        //{source:'Implementation_Guide_Intel_ProductPage.docx', destination:'dist/i5/'},
                    ],
                    //Se comprime la carpeta source-code y se agrega a cada carpeta
                    // > agregar las carpetas necesarias
                    archive: [
                        {source: 'dist/source-code', destination: 'dist/html/source-code.zip'},
                        //{source: 'dist/source-code', destination: 'dist/i5/source-code.zip'},
                    ],
                    //Se eliminan los assests y la carpeta source-code sin comprimir
                    delete: ['dist/assets', 'dist/source-code']
                }]
            }
        }),
    ],
};

