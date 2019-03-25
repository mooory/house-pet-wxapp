// pages/home/home.js
// import * as echarts from '../../ec-canvas/echarts';
var api = require('../../utils/api.js');

function getPowerImage(percentage) {
  let temp = 0;
  if(percentage > 75) {
    temp = 100;
  } else if(percentage > 50) {
    temp = 75;
  } else if(percentage > 25) {
    temp = 50;
  } else if(percentage > 0) {
    temp = 25
  };
  return '../../images/power' + percentage + '.png';
}

var helper = require('../ble/helper.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    petList: [],
    petindex: 0,
    currentIndex: 0,
    petId: '',
    deviceList: [],
    show: true,
    img:[],
    ec: {
      lazyLoad: true,
      silent: true
    }
  },
  toAddPet(e) {
    wx.navigateTo({
      url: '../addPet/addPet',
    });
  },
  gotolight(e) {
    wx.setStorageSync('deviceid', e.currentTarget.dataset.id);
    
    wx.navigateTo({
      url: '../change_light/change_light?device_id=' + e.currentTarget.dataset.id + '&pet_id=' + this.data.petId,
    });
  },
  swiperchange(e) {
    if (e.currentTarget.dataset.id == this.data.petId) {
      return false;
    }
    wx.setStorageSync('petid', e.currentTarget.dataset.id);
    this.setData({
      petIndex: e.currentTarget.dataset.petindex,
      petId: e.currentTarget.dataset.id
    });
    this.choose(e.currentTarget.dataset.id);
  },
  choose(pet_id) {
    try {
      api.get({
        url: 'user/selectPetDevice',
        data: {
          pet_id: pet_id
        },
        success: data => {
          if (data.code == 0) {
            this.setData({
              deviceList: data.data
            });
            if (data.data.length) {
              let imageList = data.data.map(item => getPowerImage(item.device_power));
              let id = wx.getStorageSync('deviceid');
              let temp = 0;
              for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].device_id == id) {
                  temp = i;
                  break;
                }
              }
              this.setData({
                currentIndex: temp,
                img: imageList
              });
              // 去除canvas
              // let temp = [];
              // function draw(i) {
              //   that.item.setOption(that.getOption(data.data[i].device_power, data.data[i].lock_status), {
              //     notMerge: true
              //   });
              //   that.echartsComponnet.canvasToTempFilePath({
              //     success: res => {
              //       if (i == data.data.length - 1) {
              //         temp.push(res.tempFilePath);
              //         that.setData({ img: temp, show: false });
              //       } else {
              //         temp.push(res.tempFilePath);
              //         draw(++i);
              //       };

              //       // wx.saveImageToPhotosAlbum({
              //       //   filePath: res.tempFilePath,   //这个只是测试路径，没有效果
              //       //   success(res) {
              //       //     console.log("success");
              //       //   },
              //       //   fail: function (res) {
              //       //     console.log(res);
              //       //   }
              //       // })
              //     },
              //     fail: res => console.log(res)
              //   });
              // }
              // draw(0);
            } else {
              // that.setData({ show: false });
            }
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none'
            });
          }
        }
      });
    } catch (e) {
      wx.showToast({
        title: '请求设备数据失败',
        icon: 'none'
      });
    }
  },
  toAddEquipment(e) {
    wx.navigateTo({
      url: '../addEquipment/addEquipment?pet_id=' + this.data.petId
    });
    // wx.navigateTo({
    //   url: '../light/light'
    // });
  },

  toBleTest(e) {
    wx.navigateTo({
      url: '../ble/ble'
    });
  },

  toTip(e) {
    wx.showToast({
      title: '请先添加宝贝资料',
      icon: 'none'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  // //初始化图表
  // init_echarts: function (power, isopen) {
  //   this.echartsComponnet.init((canvas, width, height) => {
  //     // 初始化图表      
  //     const Chart = echarts.init(canvas, null, {
  //       width: width,
  //       height: height
  //     });      
  //     this.item = Chart;     
  //     // 注意这里一定要返回 chart 实例，否则会影响事件处理等   
  //     return Chart;   
  //   });
  // },

  // //获取画图的参数
  // getOption: function (percentage, isopen) {
  //   if(percentage < 0) {
  //     percentage = 0;
  //   } else if(percentage > 100) {
  //     percentage = 100;
  //   }
  //   let option = {};
  //   if(isopen) {
  //     option = {
  //       backgroundColor: "#ffffff",
  //       series: [{
  //         //外层最浅色圈
  //         type: 'gauge',
  //         radius: '62%',
  //         startAngle: 0,
  //         endAngle: 180,
  //         splitNumber: 0,
  //         silent: true,
  //         detail: {
  //           show: false
  //         },
  //         axisLine: {
  //           show: true,
  //           lineStyle: {
  //             width: 50,
  //             color: [[0.66, '#fff8fa'], [1, '#fff8fa']],
  //           }
  //         },
  //         splitLine: {
  //           show: false
  //         },
  //         axisTick: {
  //           show: false
  //         },
  //         axisLabel: {
  //           show: false
  //         },
  //         pointer: {
  //           show: false
  //         },
  //         data: [{
  //           name: '',
  //         }]
  //       }, {
  //         //第二层圈
  //         type: 'gauge',
  //         radius: '40%',
  //         startAngle: 0,
  //         endAngle: 180,
  //         splitNumber: 0,
  //         silent: true,
  //         detail: {
  //           show: false
  //         },
  //         axisLine: {
  //           show: true,
  //           lineStyle: {
  //             width: 50,
  //             color: [[0.66, '#ffe6ec'], [1, '#ffe6ec']],
  //           }
  //         },
  //         splitLine: {
  //           show: false
  //         },
  //         axisTick: {
  //           show: false
  //         },
  //         axisLabel: {
  //           show: false
  //         },
  //         pointer: {
  //           show: false
  //         },
  //         data: [{
  //           name: '',
  //         }]
  //       }, {
  //         //第三层圈
  //         type: 'gauge',
  //         radius: '26%',
  //         startAngle: 0,
  //         endAngle: 180,
  //         splitNumber: 0,
  //         silent: true,
  //         detail: {
  //           show: false
  //         },
  //         axisLine: {
  //           show: true,
  //           lineStyle: {
  //             width: 50,
  //             color: [[0.66, '#fed1dc'], [1, '#fed1dc']],
  //           }
  //         },
  //         splitLine: {
  //           show: false
  //         },
  //         axisTick: {
  //           show: false
  //         },
  //         axisLabel: {
  //           show: false
  //         },
  //         pointer: {
  //           show: false
  //         },
  //         data: [{
  //           name: '',
  //         }]
  //       }, {
  //         //内层刻度
  //         type: 'gauge',
  //         radius: '52%',
  //         splitNumber: 4,
  //         silent: true,
  //         detail: {
  //           show: false,
  //           formatter: '{value}%'
  //         },
  //         axisLine: {
  //           show: false,
  //           lineStyle: {
  //             opacity: 0
  //           }
  //         },
  //         splitLine: {
  //           show: true,
  //           length: 8,
  //           lineStyle: {
  //             width: 2,
  //             color: '#e6e6e6'
  //           }
  //         },
  //         axisTick: {
  //           // 刻度长度与轴线宽度一致，达到分隔的效果
  //           length: 4,
  //           // 增加刻度密度
  //           splitNumber: 10,
  //           lineStyle: {
  //             // 增加刻度宽度
  //             width: 2,
  //             color: '#e6e6e6'
  //           }
  //         },
  //         axisLabel: {
  //           show: true,
  //           formatter: '{value}%',
  //           distance: 6,
  //           color: '#d5d6d9',
  //           fontSize: 14
  //         },
  //         pointer: {
  //           show: false
  //         },
  //         data: [{
  //           name: '',
  //         }]
  //       }]
  //     };
  //     //刻画
  //     let arrow_side = 225 - 2.7 * percentage;
  //     let gray_side = 225 - 2.7 * Math.floor(parseInt(percentage / 2) * 2 + 2);
  //     let gray_number = Math.ceil((100 - percentage) / 2);
  //     option.series.push({
  //       //最外层刻度
  //       type: 'gauge',
  //       endAngle: gray_side > -45 ? gray_side : -45,
  //       splitNumber: 1,
  //       silent: true,
  //       detail: {
  //         show: false,
  //         formatter: '{value}%'
  //       },
  //       axisLine: {
  //         show: false,
  //         lineStyle: {
  //           opacity: 0
  //         }
  //       },
  //       splitLine: {
  //         show: true
  //       },
  //       axisTick: {
  //         // 刻度长度与轴线宽度一致，达到分隔的效果
  //         length: '20%',
  //         // 增加刻度密度
  //         splitNumber: 51 - gray_number,
  //         lineStyle: {
  //           // 增加刻度宽度
  //           width: 2,
  //           color: '#FB3353'
  //           // image: document.getElementById('linear-pic'),
  //           // repeat: 'no-repeat'
  //         }
  //       },
  //       axisLabel: {
  //         show: false
  //       },
  //       pointer: {
  //         show: false
  //       },
  //       data: [{
  //         name: '',
  //       }]
  //     });
  //     option.series.push({
  //       type: 'gauge',
  //       startAngle: gray_side > -45 ? gray_side : -45,
  //       splitNumber: 1,
  //       silent: true,
  //       axisLine: {
  //         show: false,
  //         lineStyle: {
  //           opacity: 0
  //         }
  //       },
  //       splitLine: { show: false },
  //       axisTick: {
  //         length: '21%',
  //         splitNumber: gray_number,
  //         lineStyle: {
  //           color: '#e6e6e6',
  //           shadowColor: '#e6e6e6',
  //           width: 2
  //         }
  //       },
  //       axisLabel: { show: false },
  //       pointer: { show: false },
  //       // 指针样式
  //       itemStyle: {},
  //       title: { show: false },
  //       detail: { show: false }
  //     });
  //     //中间刻度线
  //     option.series.push({
  //       type: 'gauge',
  //       startAngle: arrow_side,
  //       endAngle: arrow_side + 2,
  //       radius: '83%',
  //       splitNumber: 1,
  //       silent: true,
  //       detail: {
  //         show: false
  //       },
  //       axisLine: {
  //         show: false,
  //         lineStyle: {
  //           opacity: 0
  //         }
  //       },
  //       splitLine: {
  //         show: true
  //       },
  //       axisTick: {
  //         // 刻度长度与轴线宽度一致，达到分隔的效果
  //         length: '28%',
  //         // 增加刻度密度
  //         splitNumber: 0,
  //         lineStyle: {
  //           // 增加刻度宽度
  //           width: 2,
  //           color: '#FB3353',
  //           shadowBlur: 10,
  //           shadowColor: '#fea8b5'
  //         }
  //       },
  //       axisLabel: {
  //         show: false
  //       },
  //       pointer: {
  //         show: false
  //       }
  //     });
  //   } else {
  //     option = {
  //       backgroundColor: "#ffffff",
  //       series: [{
  //         //内层刻度
  //         type: 'gauge',
  //         radius: '52%',
  //         splitNumber: 4,
  //         silent: true,
  //         detail: {
  //           show: false,
  //           formatter: '{value}%'
  //         },
  //         axisLine: {
  //           show: false,
  //           lineStyle: {
  //             opacity: 0
  //           }
  //         },
  //         splitLine: {
  //           show: true,
  //           length: 8,
  //           lineStyle: {
  //             width: 2,
  //             color: '#e6e6e6'
  //           }
  //         },
  //         axisTick: {
  //           // 刻度长度与轴线宽度一致，达到分隔的效果
  //           length: 4,
  //           // 增加刻度密度
  //           splitNumber: 10,
  //           lineStyle: {
  //             // 增加刻度宽度
  //             width: 2,
  //             color: '#e6e6e6'
  //           }
  //         },
  //         axisLabel: {
  //           show: true,
  //           formatter: '{value}%',
  //           distance: 6,
  //           color: '#d5d6d9',
  //           fontSize: 14
  //         },
  //         pointer: {
  //           show: false
  //         },
  //         data: [{
  //           name: '',
  //         }]
  //       }]
  //     };
  //     //刻画
  //     let arrow_side = 225 - 2.7 * percentage;
  //     option.series.push({
  //       type: 'gauge',
  //       splitNumber: 1,
  //       silent: true,
  //       axisLine: {
  //         show: false,
  //         lineStyle: {
  //           opacity: 0
  //         }
  //       },
  //       splitLine: { show: false },
  //       axisTick: {
  //         length: '21%',
  //         splitNumber: 50,
  //         lineStyle: {
  //           color: '#e6e6e6',
  //           shadowColor: '#e6e6e6',
  //           width: 2
  //         }
  //       },
  //       axisLabel: { show: false },
  //       pointer: { show: false },
  //       // 指针样式
  //       itemStyle: {},
  //       title: { show: false },
  //       detail: { show: false }
  //     });
  //     //中间刻度线
  //     option.series.push({
  //       type: 'gauge',
  //       startAngle: arrow_side,
  //       endAngle: arrow_side + 2,
  //       radius: '83%',
  //       silent: true,
  //       splitNumber: 1,
  //       detail: {
  //         show: false
  //       },
  //       axisLine: {
  //         show: false,
  //         lineStyle: {
  //           opacity: 0
  //         }
  //       },
  //       splitLine: {
  //         show: true
  //       },
  //       axisTick: {
  //         // 刻度长度与轴线宽度一致，达到分隔的效果
  //         length: '28%',
  //         // 增加刻度密度
  //         splitNumber: 0,
  //         lineStyle: {
  //           // 增加刻度宽度
  //           width: 2,
  //           color: '#d9d9d9'
  //         }
  //       },
  //       axisLabel: {
  //         show: false
  //       },
  //       pointer: {
  //         show: false
  //       },
  //       data: [{
  //         value: 40,
  //         name: '',
  //       }]
  //     });
  //   }
    
  //   return option;
  // }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    try {
      api.post({
        url: 'user/getUserInfo',
        success: data => {
          if (data.code == 0) {
            this.setData({
              petList: data.data
            });
            if (data.data.length) {
              // 去除canvas
              // this.echartsComponnet = this.selectComponent('#mychart-dom');
              // this.init_echarts();
              let pet_id = wx.getStorageSync('petid');
              let petIndex = 0;
              for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].pet_id == pet_id) {
                  petIndex = i;
                  break;
                }
              }
              this.setData({
                petIndex: petIndex,
                petId: pet_id || data.data[0].pet_id
              });
              this.choose(pet_id || data.data[0].pet_id);
            }
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none'
            });
          }
        }
      });
    } catch (e) {
      wx.showToast({
        title: '请求宝贝数据失败',
        icon: 'none'
      });
      // Do something when catch error
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})