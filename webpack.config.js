const path = require('path');

module.exports = {
  entry: './app.js', // Your main server file
  target: 'node',    // Specify Node.js runtime
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'public'),
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
