const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: '#eval-source-map',
  devServer: {
    stats: {
      children: false,
      maxModules: 0,
    },
    port: 1337,
  },
});
