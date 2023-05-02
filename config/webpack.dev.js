const common = require('./webpack.common.js')
const {merge} = require('webpack-merge')
// 美化控制台输出
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const webpack = require("webpack");
// 环境变量配置
const envConfig = require('./loadoptions').getEnvConfig()


module.exports = merge(common, {
  mode: 'development',
  devtool: "source-map",
  devServer: {
    port: 8080,
    hot: true,
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: { // 美化样式
        messages: ['You application is running here http://localhost:8080']
      }
    }),
    new webpack.DefinePlugin({
      process: JSON.stringify(envConfig)
    })
  ]
})


