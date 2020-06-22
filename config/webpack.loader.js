/*
 * @description: 拓展 webpack loader 配置文件
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-08-24 16:35:47
 * @LastEditTime: 2019-09-16 19:12:33
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
function rewireLoader (config) {
  config.module.rules.forEach(rule => {
    if (
      rule.oneOf &&
      rule.oneOf.length
    ) {
      rule.oneOf.forEach(loader => {
        if (loader.options && loader.options.cacheDirectory) {
          loader.options.cacheDirectory = false // 关闭 bable-loaer 的 缓存
        }
      })
    }
  })
  return config
}

module.exports = rewireLoader
