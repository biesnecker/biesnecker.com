const path = require("path");
const SplitChunksPlugin = require("webpack/lib/optimize/SplitChunksPlugin");

module.exports = {
  entry: {
    app: path.resolve("src", "app.js"),
  },
  output: {
    path: path.resolve("static", "assets"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new SplitChunksPlugin({
      name: ["app", "vendor"],
      minChunks: Infinity,
    }),
  ],
  devtool: "source-map",
};
