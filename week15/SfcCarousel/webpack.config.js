module.exports = {
  mode: 'development',
  entry: './main.js',
  watch: ['myloader.js'],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-react-jsx', { pragma: 'create' }],
            ]
          }

        }
      },
      {
        test: /\.vue/,
        use: {
          loader: require.resolve("./myloader.js")
        }
      }
    ]
  },
  optimization: {
    minimize: false
  }
}