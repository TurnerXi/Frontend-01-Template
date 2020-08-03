module.exports = {
  mode: 'development',
  entry: {
    tab: './tab/script.js',
    tpl: './tpl/script.js'
  },
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
        test: /\.css$/,
        loader: require.resolve('./css-loader.js'),
      }
    ]
  },
  optimization: {
    minimize: false
  }
}