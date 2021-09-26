const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// let mode = process.env.NODE_ENV;
let mode = 'production';

module.exports = {
    mode,

    module: {
        rules: [
            {
                test:/\.s?css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test:/\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ]
    },

    plugins: [new MiniCssExtractPlugin()],

    devtool: "source-map",
    devServer: {
        static: "./dist",
        hot: true,
    }
}