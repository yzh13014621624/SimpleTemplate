/*
 * @description: 添加 webpack 配置项
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-09-07 13:35:57
 * @LastEditTime: 2019-09-16 19:19:32
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

function rewirePlugin (config) {
  config.plugins = (config.plugins || []).concat([
    new HardSourceWebpackPlugin({
      cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
      configHash: function (webpackConfig) {
        return require('node-object-hash')({ sort: false }).hash(webpackConfig)
      },
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock']
      },
      info: {
        mode: 'none',
        level: 'debug'
      },
      cachePrune: {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        sizeThreshold: 50 * 1024 * 1024
      }
    })
  ])
  return config
}

module.exports = rewirePlugin
