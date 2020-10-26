const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  output: {
    publicPath: "",
    filename: 'bundle.js'
  },

  plugins: [new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    chunkFilename: "chunks/[id].[hash].css",
  }),
  new HtmlWebpackPlugin({
    template: './src/index.pug',
    inject: true,
    cache: true,
    hash: true,
    filename: 'index.html'
  }), new HtmlWebpackPlugin({
    template: './src/search.pug',
    inject: true,
    cache: true,
    hash: true,
    filename: 'search.html'
  }), new HtmlWebpackPlugin({
    template: './src/room.pug',
    inject: true,
    cache: true,
    hash: true,
    filename: 'room.html'
  }), new HtmlWebpackPlugin({
    template: './src/register.pug',
    inject: true,
    cache: true,
    hash: true,
    filename: 'register.html'
  }), new HtmlWebpackPlugin({
    template: './src/login.pug',
    inject: true,
    cache: true,
    hash: true,
    filename: 'login.html'
  })],
  
  module: {
    rules: [
      {
        test: /\.js$/,

        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.pug$/,
        use: ['html-loader','pug-html-loader']

        
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|woff2)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
        },
      },
    ]
  }
}