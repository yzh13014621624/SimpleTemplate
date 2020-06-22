/*
 * @description: 重置 webpack config 文件
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-07 14:47:23
 * @LastEditTime: 2019-09-09 15:38:59
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const {
  override,
  devServerConfig,
  babelImportsConfig,
  lessLoaderConfig,
  webpackAliasConfig,
  webpackResolveConfig,
  webpackConfig
} = require('./config/webpack.override')

module.exports = {
  webpack: override(
    babelImportsConfig,
    lessLoaderConfig,
    webpackAliasConfig,
    webpackResolveConfig,
    webpackConfig
  ),
  devServer: devServerConfig
}
