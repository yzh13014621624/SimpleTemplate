/*
 * @description: antd 的样式重置
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-07 16:06:48
 * @LastEditTime: 2019-08-13 16:31:56
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const themeColor = '#19BC9C'
const whiteColor = '#ffffff'

module.exports = {
  'primary-color': themeColor, // 全局主色
  'link-color': themeColor, // 链接色
  'success-color': '#3BB200', // 成功色
  'warning-color': '#F7A400', // 警告色
  'error-color': '#FF3D3D', // 错误色
  'font-size-base': '12px', // 主字号
  'heading-color': '#333333', // 标题色
  'text-color': 'rgba(0, 0, 0, .65)', // 主文本色
  'text-color-secondary': 'rgba(0, 0, 0, .45)', // 次文本色
  'disabled-color': '#DCDDDE', // 失效色
  'border-radius-base': '5px', // 组件/浮层圆角
  'border-color-base': '#d9d9d9', // 边框色
  'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)', // 浮层阴影
  // -----------------------------------------------
  'layout-header-height': '40px',
  'layout-body-background': '#F0F2F5',
  'layout-header-background': whiteColor,
  'layout-sider-background': '#394761',
  'layout-sider-background-light': whiteColor,
  // -----------------------------------------------
  'menu-bg': themeColor,
  'menu-popup-bg': themeColor,
  'menu-item-color': whiteColor, // 字体颜色
  'menu-highlight-color': whiteColor, // 高亮字体颜色
  'menu-item-active-bg': '#0CAC8D', // 设置 menu 选中的背景为
  'menu-inline-toplevel-item-height': '64px', // 高度
  'menu-item-height': '64px', // 高度
  'menu-item-active-border-width': '0px',
  'menu-collapsed-width': '40px',
  //  -----------------------------------------------
  'btn-height-base': '32px',
  'input-height-base': '32px',
  'pagination-item-size': '32px',
  'btn-padding-base': '0 11px 1px',
  'form-item-margin-bottom': '25px',
  'modal-body-padding': '20px',
  // ---------------------------------------------------
  'table-row-hover-bg': '#FFF7E9',
  'input-hover-border-color': themeColor,
  // --------------------------------------
  'tabs-card-head-background': whiteColor,
  'tabs-card-height': '38px',
  'tabs-card-active-color': '#FF9E00',
  'tabs-title-font-size': '14px',
  // 'tabs-bar-margin': '',
  'tabs-scrolling-size': '16px',
  // 'tabs-highlight-color': '',
  'tabs-hover-color': '#FF9E00',
  'tabs-active-color': '#FF9E00',
  // ---------------------定位z-index-----------------
  'zindex-modal': 1053,
  'zindex-modal-mask': 1053,
  'zindex-message': 1054
}
