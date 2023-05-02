const common = require('./webpack.common.js')
const {merge} = require('webpack-merge')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require("webpack");
// 环境变量配置
const envConfig = require('./loadoptions').getEnvConfig()
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      process: JSON.stringify(envConfig)
    })]
})