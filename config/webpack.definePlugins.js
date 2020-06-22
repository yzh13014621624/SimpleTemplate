/*
 * @description: 重写 webpack.DefinePlugin
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-09-07 10:35:39
 * @LastEditTime: 2020-05-21 15:09:44
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const path = require('path')
const Dotenv = require('dotenv-webpack')
const moment = require('moment')
const toJson = d => JSON.stringify(d)
const version = toJson(require('../package.json').version)

const resolvePath = dir => path.join(__dirname, '..', dir)

const mode = process.argv[2].split('--')[1]
const isDev = process.env.NODE_ENV === 'development'

const envPath = isDev ? resolvePath('.env.development') : resolvePath(`.env.${mode}`)
const build = toJson(moment(new Date()).format('YYYY.MM.DD HHmmss'))
const envVars = {}

const definitions = new Dotenv({
  path: envPath
}).definitions

Object.keys(definitions).forEach(key => {
  const [, api] = key.split('process.env.')
  envVars[api] = definitions[key]
})

function rewireDefinePlugin (config) {
  config.plugins.some(p => {
    if (
      p.definitions &&
      p.definitions['process.env']
    ) {
      p.definitions['process.env'] = { ...envVars, version, build }
      return true
    }
  })
  return config
}

module.exports = rewireDefinePlugin
