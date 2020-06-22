/*
 * @description: 运营管理
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-08-28 18:17:18
 * @LastEditTime: 2020-03-25 15:33:58
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
    postAdvertisementList: { // 广告管理列表
        type: 'post',
        path: '/dubrovnik2/banner/v1/findBannerList'
    },
    getAdvertisementDeleted: { // 广告删除
        type: 'get',
        path: '/dubrovnik2/banner/v1/delBannerInfo'
    },
    postAdvertisementAdd: { // 广告新增/修改
        type: 'post',
        path: '/dubrovnik2/banner/v1/addBanner'
    },
    getAdvertisementInfo: { // 广告详情
        type: 'get',
        path: '/dubrovnik2/banner/v1/getBannerInfo'
    },
    getAdvertisementPosition: { // 轮播位选择列表
        type: 'get',
        path: '/dubrovnik2/banner/v1/getPositionList'
    },
    getAdvertisementBannerStatus: { // banner启用/停用
        type: 'get',
        path: '/dubrovnik2/banner/v1/updateBannerStatus'
    },
    ApicouponList: { // 优惠券列表
        type: 'post',
        path: '/dubrovnik2/couponManager/v1/listByPage'
    },
    ApicouponStatus: { // 优惠券状态
        type: 'post',
        path: '/dubrovnik2/couponManager/v1/setStatus'
    },
    ApicouponaddOrEdit: { // 优惠券新增和编辑
        type: 'post',
        path: '/dubrovnik2/couponManager/v1/addOrEdit'
    },
    ApicouponDetail: { // 优惠券详情
        type: 'post',
        path: '/dubrovnik2/couponManager/v1/editDetail'
    },
    ApiccountList: { // 优惠券明细
        type: 'post',
        path: '/dubrovnik2/couponManager/v1/accountList'
    },
    ApiccountListExport: { // 优惠券导出
        type: 'post',
        path: '/dubrovnik2/couponManager/v1/accountListExport'
    }
}
