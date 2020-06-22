/*
 * @description: 接口定义文件
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-08-28 16:05:07
 * @LastEditTime: 2019-09-10 11:12:40
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

type Api = {
    type?: string
    readonly path: string
  }
  
  declare const ServerList: [
    /* <<<<<<<< 基础信息 >>>>>>>> */
    /* <<<<<<<< 标签管理 >>>>>>>> */
    'postLabelmanagementList','postLabelmanagementAdd','postLabelmanagementUpdate','postLabelmanagementDeleted',
    /* <<<<<<<< 标签管理 >>>>>>>> */
    /* <<<<<<<< 商品单位管理 >>>>>>>> */
    'postGoodsmanagementList','postGoodsmanagementAdd','postGoodsmanagementDeleted','postGoodsmanagementUpdate',
    /* <<<<<<<< 商品单位管理 >>>>>>>> */
    /* <<<<<<<< 部门管理 >>>>>>>> */
    'postDepartmentList','postDepartmentAdd','postDepartmentUpdate','getDepartmentInfo','getDepartmentDeleted',
    /* <<<<<<<< 部门管理 >>>>>>>> */

    /* <<<<<<<< 运营管理 >>>>>>>> */
     /* <<<<<<<< 广告管理 >>>>>>>> */
     'postAdvertisementList','getAdvertisementDeleted','postAdvertisementAdd','getAdvertisementInfo','getAdvertisementPosition','getAdvertisementBannerStatus',
    /* <<<<<<<< 广告管理 >>>>>>>> */
    /* <<<<<<<< 商品统计 >>>>>>>> */
     'goodsStatisticsPostList',
    /* <<<<<<<< 商品统计 >>>>>>>> */
    /* <<<<<<<< 营业额总计 >>>>>>>> */
    'shopStatisticPostBusinessReceipt','postExportBusinessReceipt','postExportSalesVolume','postExportVolumeTrend','postExportGoodsStatistics',
    /* <<<<<<<< 营业额总计 >>>>>>>> */
  ]
  
  type ServerQY = {
    [api in (typeof ServerList)[number]]: Api
  }
  
  export default ServerQY