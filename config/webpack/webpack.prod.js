const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const CURRENT_WORKING_DIR = process.cwd();
const { BASE_API_URL, NODE_ENV } = require("../../server/constants");

module.exports = {
  mode: "production",
  output: {
    path: path.join(CURRENT_WORKING_DIR, "/dist"),
    filename: "js/[name].[hash].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("cssnano"), require("autoprefixer")],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "/assets/images",
              publicPath: "../assets/images",
              name: "[name].[hash].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "/assets/fonts",
              publicPath: "../assets/fonts",
              name: "[name].[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  optimization: {
    minimize: true,
    nodeEnv: "production",
    sideEffects: true,
    concatenateModules: true,
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        styles: {
          test: /\.css$/,
          name: "styles",
          chunks: "all",
          enforce: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false,
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(NODE_ENV),
        BASE_API_URL: JSON.stringify(BASE_API_URL),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(CURRENT_WORKING_DIR, "/client/public/index.html"),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
  ],
};
