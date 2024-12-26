const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './app.js', // Make sure this points to your entry point
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'public'), // Ensure this is the correct path
    filename: 'server.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
