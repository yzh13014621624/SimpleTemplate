/*
 * @description: 基础信息模块相关接口
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-08-23 10:48:23
 * @LastEditTime: 2020-03-18 17:54:22
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  postDepartmentList:{ // 部门信息列表
    type:'post',
    path:'/dubrovnik2/basicDepartment/v1/queryDepartmentList'
  },
  postDepartmentAdd:{ // 添加部门信息
    type:'post',
    path:'/dubrovnik2/basicDepartment/v1/insertDepartmentInfo'
  },
  postDepartmentUpdate:{ // 修改部门信息
    type:'post',
    path:'/dubrovnik2/basicDepartment/v1/updateDepartmentInfo'
  },
  getDepartmentInfo:{  // 部门信息详情
    type:'get',
    path:'/dubrovnik2/basicDepartment/v1/getDepartmentInfo'
  },
  getDepartmentDeleted:{  // 删除部门信息
    type:'get',
    path:'/dubrovnik2/basicDepartment/v1/deleteDepartmentInfo'
  },
  postGoodsmanagementList:{  // 商品单位列表
    type:'post',
    path:'/dubrovnik2/basicUnit/v1/findAllBasicUnit'
  },
  postGoodsmanagementAdd:{  // 添加商品单位
    type:'post',
    path:'/dubrovnik2/basicUnit/v1/addBasicUnit'
  },
  postGoodsmanagementDeleted:{  // 删除商品单位
    type:'post',
    path:'/dubrovnik2/basicUnit/v1/deleteBasicUnit'
  },
  postGoodsmanagementUpdate:{  // 修改商品单位
    type:'post',
    path:'/dubrovnik2/basicUnit/v1/updateBasicUnit'
  },
  postLabelmanagementList:{  // 标签列表
    type:'post',
    path:'/dubrovnik2/goodsLabels/v1/findAllGoodsLabels'
  },
  postLabelmanagementAdd:{  // 添加商品标签
    type:'post',
    path:'/dubrovnik2/goodsLabels/v1/addGoodsLabels'
  },
  postLabelmanagementUpdate:{  // 修改商品标签
    type:'post',
    path:'/dubrovnik2/goodsLabels/v1/updateGoodsLabels'
  },
  postLabelmanagementDeleted:{  // 删除商品标签
    type:'post',
    path:'/dubrovnik2/goodsLabels/v1/deleteGoodsLabels'
  },
}