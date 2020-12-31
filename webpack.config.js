const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        app: "./src/js/app.ts",
        login: "./src/js/login.ts",
        admin: "./src/js/admin.ts",
        adminUsers: "./src/js/adminUsers.ts",
        adminTasks: "./src/js/adminTasks.ts",
    },
    output: {
        filename: "[name].min.js",
        path: path.resolve(__dirname, "./build")
    },
    devServer: {
        contentBase: path.join(__dirname, './build'),
        compress: true,
        publicPath: '/',
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx',]
    },
    watchOptions: {
        ignored: ['node_modules/**']
    },
    mode: "production",
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
                test: /\.css/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", "postcss-loader",
                ],
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
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new HtmlWebpackPlugin({
            title: 'zliczka',
            template: path.resolve(__dirname, './src/templates/index.html'),
            filename: 'dashboard/index.html',
            chunks: ['zliczka'],
        }),
        new HtmlWebpackPlugin({
            title: 'zliczka_login',
            template: path.resolve(__dirname, './src/templates/login.html'),
            filename: 'login/index.html',
            chunks: ['login'],
        }),
        new HtmlWebpackPlugin({
            title: 'zliczka_admin',
            template: path.resolve(__dirname, './src/templates/admin.html'),
            filename: 'management/admin.html',
            chunks: ['admin'],
        }),
        new HtmlWebpackPlugin({
            title: 'zliczka_admin-users',
            template: path.resolve(__dirname, './src/templates/admin-users.html'),
            filename: 'management/admin-users.html',
            chunks: ['adminUsers'],
        }),
        new HtmlWebpackPlugin({
            title: 'zliczka_admin-tasks',
            template: path.resolve(__dirname, './src/templates/admin-tasks.html'),
            filename: 'management/admin-tasks.html',
            chunks: ['adminTasks'],
        }),

    ],
    optimization: {
        minimize: true,
        minimizer: [
            // new CssMinimizerPlugin(), for prod
        ],
    },
}