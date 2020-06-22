/*
 * @description: 重置 webpack 配置
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-07 17:13:35
 * @LastEditTime: 2019-09-17 18:20:47
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const path = require('path')
const fs = require('fs')
const { override, fixBabelImports, addLessLoader, addWebpackAlias, overrideDevServer, addTslintLoader } = require('customize-cra')

const rewireStylus = require('react-app-rewire-stylus-modules')
const rewirePlugin = require('./webpack.plugins')
const rewireDefinePlugin = require('./webpack.definePlugins')
const rewireLoader = require('./webpack.loader')

const themes = require('./theme')

const resolvePath = dir => path.join(__dirname, '..', dir)

const devServerConfig = () => config => {
  config.port = 2019,
  config.hot = true
  return config
}

const overrideWebpackConfig = () => (config, env) => {
  const { mode, resolve: { extensions } } = config
  const isDev = mode === 'development'
  config.entry.push('react-hot-loader/patch')
  isDev && (config.output.path = resolvePath(''))
  config.devtool = isDev ? 'cheap-module-source-map' : false
  config.resolve.extensions = [...extensions, '.less', '.css', '.styl', '.json']
  isDev && (rewirePlugin(config))
  rewireLoader(config)
  rewireDefinePlugin(config)
  rewireStylus(config, env)
  // fs.writeFile('webpack.config.json', JSON.stringify(config), () => {})
  return config
}

exports.override = override

// 重置 devServer 配置
exports.devServerConfig = overrideDevServer(devServerConfig())

// 动态导入配置
exports.babelImportsConfig = fixBabelImports('import', {
  libraryName: 'antd',
  libraryDirectory: 'es',
  style: true
})

// antd less 文件配置
exports.lessLoaderConfig = addLessLoader({ javascriptEnabled: true, modifyVars: themes })

// alias 配置
exports.webpackAliasConfig = addWebpackAlias({
  '@': resolvePath('src'),
  components: resolvePath('src/components'),
  shared: resolvePath('src/container/shared'),
  pages: resolvePath('src/container/pages'),
  utils: resolvePath('src/utils'),
  routes: resolvePath('src/routes'),
  assets: resolvePath('src/assets'),
  service: resolvePath('src/service'),
  store: resolvePath('src/store')
})

// 重置一些 webpack 配置
exports.webpackConfig = overrideWebpackConfig()

exports.addTslintLoader = addTslintLoader()
