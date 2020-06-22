/*
 * @description: Echarts 图形所需数据
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-09-05 16:33:44
 * @LastEditTime: 2020-06-04 11:05:36
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const shopOptions: any = {
  color: ['#FACC14', '#E9E9E9'],
  tooltip: {
    trigger: 'item',
    formatter: '{a}{b}: {c}'
  },
  series: [{
    name: '',
    type: 'pie',
    radius: ['50%', '80%'],
    avoidLabelOverlap: true,
    hoverOffset: 8,
    label: {
      show: false
    },
    data: [
      {
        value: 0,
        name: '在线',
        emphasis: {
          itemStyle: {
            color: '#FACC14'
          }
        }
      },
      {
        value: 0,
        name: '离线',
        emphasis: {
          itemStyle: {
            color: '#E9E9E9'
          }
        }
      }
    ]
  }]
}
const moneyOptions: any = {
  color: ['#3399FF', '#E9E9E9'],
  tooltip: {
    trigger: 'item',
    formatter: '{a}{b}: {c}'
  },
  series: [{
    name: '',
    type: 'pie',
    radius: ['50%', '80%'],
    avoidLabelOverlap: true,
    hoverOffset: 8,
    label: {
      show: false
    },
    data: [
      {
        value: 0,
        name: '实收金额',
        emphasis: {
          itemStyle: {
            color: '#3399FF'
          }
        }
      },
      {
        value: 0,
        name: '退单金额',
        emphasis: {
          itemStyle: {
            color: '#E9E9E9'
          }
        }
      }
    ]
  }]
}
const orderOptions: any = {
  color: ['#19BC9C', '#E9E9E9'],
  tooltip: {
    trigger: 'item',
    formatter: '{a}{b}: {c}'
  },
  series: [{
    name: '',
    type: 'pie',
    radius: ['50%', '80%'],
    avoidLabelOverlap: true,
    hoverOffset: 8,
    label: {
      show: false
    },
    data: [
      {
        value: 0,
        name: '有效订单',
        emphasis: {
          itemStyle: {
            color: '#19BC9C'
          }
        }
      },
      {
        value: 0,
        name: '取消订单',
        emphasis: {
          itemStyle: {
            color: '#E9E9E9'
          }
        }
      }
    ]
  }]
}
const salesOptions1: any = {
  color: ['#FF6633', '#3FA1FE'],
  tooltip: {
    trigger: 'item',
    formatter: '{a}{b}: {c}'
  },
  title: {
    text: '消费金额构成',
    textStyle: {
      color: '#333',
      fontSize: 14,
      fontWeight: 400
    },
    left: 'center',
    top: 4
  },
  // legend: {
  //   textStyle: {
  //     color: '#666666',
  //     fontSize: 10
  //   },
  //   data: [{
  //     name: '堂食金额',
  //     icon: 'circle'
  //   }, {
  //     name: '外带金额',
  //     icon: 'circle'
  //   }]
  // },
  series: [{
    center: ['50%', '50%'],
    clockwise: false,
    name: '',
    type: 'pie',
    radius: ['60%', '75%'],
    avoidLabelOverlap: true,
    hoverOffset: 2,
    label: {
      normal: {
        show: false,
        position: 'center',
        color: '#333',
        fontSize: 10,
        rich: { a: { fontSize: 20, color: '#333' } },
        padding: [6, 0, 0, 0],
        lineHeight: 20,
        formatter: (params: any) => `{a|${params.data.totalNum}}\n总金额`
      }
    },
    itemStyle: {
      normal: {
        borderColor: '#fff',
        borderWidth: 1
      }
    },
    data: [
      {
        value: 0,
        totalNum: 0,
        name: '堂食金额',
        label: {
          normal: {
            show: true
          }
        },
        emphasis: {
          itemStyle: {
            color: '#FF6633'
          }
        }
      },
      {
        value: 0,
        name: '外带金额',
        emphasis: {
          itemStyle: {
            color: '#3FA1FE'
          }
        }
      }
    ]
  }]
}
const salesOptions2: any = {
  color: ['#FF6633', '#3FA1FE'],
  tooltip: {
    trigger: 'item',
    formatter: '{a}{b}: {c}'
  },
  title: {
    text: '消费订单构成',
    textStyle: {
      color: '#333',
      fontSize: 14,
      fontWeight: 400
    },
    left: 'center',
    top: 4
  },
  series: [{
    center: ['50%', '50%'],
    clockwise: false,
    name: '',
    type: 'pie',
    radius: ['60%', '75%'],
    avoidLabelOverlap: true,
    hoverOffset: 2,
    label: {
      normal: {
        show: false,
        position: 'center',
        color: '#333',
        fontSize: 10,
        rich: { a: { fontSize: 20, color: '#333' } },
        padding: [6, 0, 0, 0],
        lineHeight: 20,
        formatter: (params: any) => `{a|${params.data.totalNum}}\n总订单`
      }
    },
    itemStyle: {
      normal: {
        borderColor: '#fff',
        borderWidth: 1
      }
    },
    data: [
      {
        value: 0,
        totalNum: 0,
        name: '堂食订单',
        label: {
          normal: {
            show: true
          }
        },
        emphasis: {
          itemStyle: {
            color: '#FF6633'
          }
        }
      },
      {
        value: 0,
        name: '外带订单',
        emphasis: {
          itemStyle: {
            color: '#3FA1FE'
          }
        }
      }
    ]
  }]
}
const goodsOptions: any = {
  color: ['#45B5E5', '#FBD436', '#4ECB73', '#975FE5', '#36CBCB'],
  tooltip: {
    trigger: 'item',
    formatter: '{a}{b}: {c}'
  },
  itemStyle: {
    normal: {
      borderColor: '#fff',
      borderWidth: 2
    }
  },
  legend: {
    orient: 'vertical',
    right: 0,
    textStyle: {
      color: '#666666',
      fontSize: 10
    },
    itemWidth: 30,
    itemHeight: 12,
    itemGap: 12,
    data: [{}]
  },
  series: [{
    name: '',
    type: 'pie',
    avoidLabelOverlap: true,
    label: { show: false },
    hoverOffset: 8,
    data: [{}]
  }]
}
const vipOptions: any = {
  color: ['#46A6FF', '#FACC14'],
  tooltip: {
    trigger: 'item',
    formatter: '{a}{b}: {c}'
  },
  series: [{
    name: '',
    type: 'pie',
    radius: ['50%', '80%'],
    avoidLabelOverlap: true,
    hoverOffset: 8,
    label: {
      show: false
    },
    data: [
      {
        value: 0,
        name: '总会员',
        emphasis: {
          itemStyle: {
            color: '#46A6FF'
          }
        }
      },
      {
        value: 0,
        name: '新增会员',
        emphasis: {
          itemStyle: {
            color: '#FACC14'
          }
        }
      }
    ]
  }]
}
// const vipOptions = {
//   series: [{
//       type: 'liquidFill',
//       radius: '50%',
//       data: [0.6],
//       label: {
//         normal: {
//           color: '#fff',
//           insideColor: 'transparent',
//           textStyle: {
//             fontSize: 16
//           }
//         }
//       },
//       outline: {
//         itemStyle: {
//           borderColor: 'rgba(67,209,100,1)',
//           borderWidth: 0
//         }
//       },
//       backgroundStyle: {
//         color: 'rgba(67,209,100, .3)'
//       }
//   }]

// }

export {
  shopOptions,
  moneyOptions,
  orderOptions,
  salesOptions1,
  salesOptions2,
  goodsOptions,
  vipOptions
}
