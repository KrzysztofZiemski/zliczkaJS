const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");

module.exports = {
    entry: {
        app: "./src/js/app.ts",
        login: "./src/js/login.ts",
    },
    output: {
        filename: "[name].min.js",
        path: path.resolve(__dirname, "./dist")
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        publicPath: '/',
    },
    plugins: [ //odpalamy odpowiednie pluginy
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: path.resolve(__dirname, 'build'),
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({
            title: 'zliczka',
            template: path.resolve(__dirname, './src/templates/index.html'),
            filename: 'index.html',
            chunks: ['zliczka'],
        }),
        new HtmlWebpackPlugin({
            title: 'zliczka login',
            template: path.resolve(__dirname, './src/templates/login.html'),
            filename: 'login.html',
            chunks: ['login'],
        })
    ],
    resolve: {
        extensions: ['.ts', '.js', '.tsx',]
    },
    watch: false,
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js|\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-typescript"]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        require('tailwindcss'),
                                        require('autoprefixer')
                                    ],
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    'css-loader',
                    "postcss-loader",
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpe?g|gif|webp|awif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            context: 'public',
                            name: 'images/[name]-[hash].[ext]',
                            publicPath: "",
                        },
                    },
                ],
            },
        ]
    },

}