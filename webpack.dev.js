const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./",
        watchContentBase: true,
        open: "Google Chrome"
    },
    node: {
        fs: "empty",
        child_process: 'empty',
        net: 'empty',
        tls: 'empty'
    }
});
