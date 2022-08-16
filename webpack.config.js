const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const devServer = (isDev) =>
  !isDev
    ? {}
    : {
        devServer: {
          open: true,
          port: 8080,
          static: {
            directory: path.join(__dirname),
          },
        },
      };

module.exports = ({ dev }) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'inline-source-map' : false,
  entry: {
    main: './src/index.ts',
  },
  output: {
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    new ESLintPlugin({ extensions: ['ts', 'js'] }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  ...devServer(dev),
});
