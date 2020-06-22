/*
 * @description: 静态资源类型定义文件
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 15:26:39
 * @LastEditTime: 2019-08-08 15:28:02
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
declare module '*.less' {
  const content: any
  export = content
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

// @types/ 中的文件的信息 自定义可一个分装组件 时使用
declare module 'rc-upload'
