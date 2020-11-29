const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");

module.exports = {
    entry: "./src/js/app.ts",
    output: {
        filename: "bundle.min.js",
        path: path.resolve(__dirname, "./dist")
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
                    'postcss-loader',
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpe?g|gif|webp|awif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: { //grafiki chcemy w katalogu dist/images
                            context: 'public',
                            name: '/images/[name]-[hash].[ext]',
                            publicPath: '/',
                        },
                    },
                ],
            },
        ]
    },

}