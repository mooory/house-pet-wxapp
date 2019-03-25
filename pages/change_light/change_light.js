// pages/change_light/change_light.js
// pages/addPet/addPet.js
var api = require('../../utils/api.js')
var helper = require('../ble/helper.js');
var justifyPosition = {
  1: '8',
  2: '5',
  3: '6',
  4: '7',
  5: '3',
  6: '2',
  7: '1',
  8: '4'
};
/*
var justifyOrder = {
  1: '13',
  2: '19',
  3: '14',
  4: '15',
  5: '16',
  6: '17',
  7: '18',
  8: '1',
  9: '3',
  10: '2',
  11: '4',
  12: '5',
  13: '21',
  14: '6',
  15: '7',
  16: '8',
  17: '9',
  18: '10',
  19: '11',
  20: '12',
  21: '00',
  22: '20'
}
*/

var justifyOrder = {
  0: '2',
  1: '4',
  2: '5',
  3: '21',
  4: '6',
  5: '7',
  6: '8',
  7: '9',
  8: '10',
  9: '10',
  10: '11',
  11: '12',
  12: '13',
  13: '19',
  14: '14',
  15: '15',
  16: '16',
  17: '17',
  18: '18',
  19: '1',
  20: '3',
  21: '20',
  22: '00'
}

var showColor1 = [{
    data: 0,
    color: '#EB0B03'
  },{
  data: 1,
    color: '#FF5303'
  }, {
    data: 2,
    color: '#FDB400'
  }, {
    data: 3,
    color: '#FEF105'
  }, {
    data: 4,
    color: '#C0FF00'
  }, {
    data: 5,
    color: '#8CFC0C'
  }, {
    data: 6,
    color: '#49FB01'
  }];

var showColor2 = [{
  data: 7,
  color: '#01FD12'
}, {
  data: 8,
  color: '#00FF63'
},  {
  data: 9,
  color: '#00FF63'
}, {
  data: 10,
  color: '#03FEB7'
}, {
  data: 11,
    color: '#02E5FD'
}, {
  data: 12,
    color: '#00B3FA'
}, {
  data: 13,
    color: '#035AFF'
}];

var showColor3 = [{
  data: 14,
  color: '#0203FD'
}, {
  data: 15,
  color: '#4701F4'
}, {
  data: 16,
    color: '#8400FC'
}, {
  data: 17,
    color: '#D101FF'
}, {
  data: 18,
    color: '#FE03E1'
}, {
  data: 19,
    color: '#FF0198'
}, {
  data: 20,
  color: '#FD0350'
}];

// var showColor4 = [{
//   data: 22,
//   color: '#FFFFFF'
// }];

function getImageUrl(position, order) {
  // if(order == 22 || (!order)) {
  //   return '../../images/light_part/empty'+ position + '.png'
  // } else {
  //   return '../../images/light_part/Path' + justifyPosition[position] + 'Copy' + justifyOrder[order] +'@2x.png'
  // }
  if (!order && order != 0) {
    return '../../images/diy/path00-' + position + '@2x.png'
  } else {
    return '../../images/diy/path' + justifyOrder[order] + '-' + position + '@2x.png'
  }
}

let currentPart = 0;
// let custom_1 = '22', custom_2 = '22', custom_3 = '22', custom_4 = '22', custom_5 = '22', custom_6 = '22', custom_7 = '22', custom_8 = '22';
let custom_1 = 22, custom_2 = 22, custom_3 = 22, custom_4 = 22, custom_5 = 22;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pet_id: '',
    device_id: '',
    light_tab: 6,
    imageBack: '',
    speed: '1',
    direction: 1,
    color: '#fff',
    open: true,
    light_pattern: '1',
    showModal: false,
    showColor1: showColor1,
    showColor2: showColor2,
    showColor3: showColor3,
    currentColor: 1,
    image1: getImageUrl(1, 22),
    image2: getImageUrl(2, 22),
    image3: getImageUrl(3, 22),
    image4: getImageUrl(4, 22),
    image5: getImageUrl(5, 22),
    // image6: getImageUrl(6, 22),
    // image7: getImageUrl(7, 22),
    // image8: getImageUrl(8, 22)
  },
  toBack: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  changemode: function (e) {
    if (this.data.open) {
      this.setData({
        light_tab: e.currentTarget.dataset.type
      });
      this.tabeightpart(e.currentTarget.dataset.type);
    }
  },
  changeColor: function (e) {
    if (this.data.open && this.data.light_tab == 6) {
      currentPart = e.currentTarget.dataset.type;
      let temp = -1;
      switch(currentPart) {
        case 1: temp = custom_1;break;
        case 2: temp = custom_2; break;
        case 3: temp = custom_3; break;
        case 4: temp = custom_4; break;
        case 5: temp = custom_5; break;
        default: break;
      }
      if(temp != -1) {
        this.setData({
          currentColor: temp
        });
      }  
      this.changeShowModal();
    }
  },
  changespeed: function (e) {
    if (this.data.open) {
      this.setData({
        speed: e.currentTarget.dataset.type
      });
    }
  },
  changelight: function (e) {
    if (this.data.open) {
      this.setData({
        light_pattern: e.currentTarget.dataset.type
      });
    }
  },
  changeShowModal() {
    this.setData({
      showModal: !this.data.showModal
    });
  },
  pickColor(e) {
    var data = {
      currentColor: e.currentTarget.dataset.type,
      showModal: !this.data.showModal
    };
    if(currentPart) {
      data['image' + currentPart] = getImageUrl(currentPart, e.currentTarget.dataset.type);
      if (currentPart == 1) custom_1 = e.currentTarget.dataset.type;
      else if (currentPart == 2) custom_2 = e.currentTarget.dataset.type;
      else if (currentPart == 3) custom_3 = e.currentTarget.dataset.type;
      else if (currentPart == 4) custom_4 = e.currentTarget.dataset.type;
      else if (currentPart == 5) custom_5 = e.currentTarget.dataset.type;
      // else if (currentPart == '6') custom_6 = e.currentTarget.dataset.type;
      // else if (currentPart == '7') custom_7 = e.currentTarget.dataset.type;
      // else if (currentPart == '8') custom_8 = e.currentTarget.dataset.type;
      this.setData(data);
    }
  },
  switchChange: function(e) {
    if (this.data.open) {
      if (this.data.direction == 0) {
        this.setData({
          direction: 1
        })
      } else {
        this.setData({
          direction: 0
        })
      }
    }
  },
  tabeightpart: function(mode) {
    var imageBack;
    switch(mode) {
      case 1: 
        this.setData({
          imageBack: '../../images/light_bluepink.png'
        })
        break;
      case 2:
      case 4:
        this.setData({
          imageBack: '../../images/light_red.png'
        })
        break;
      case 3:
        this.setData({
          imageBack: '../../images/light_green.png'
        })
        break;
      case 5:
        this.setData({
          imageBack: '../../images/light_colorful.png'
        })
        break;
      case 6:
        // part1 = getImageUrl(1, 22);
        // part3 = getImageUrl(3, 22);
        // part5 = getImageUrl(5, 22);
        // part7 = getImageUrl(7, 22);
        // part2 = getImageUrl(2, 22);
        // part4 = getImageUrl(4, 22);
        // part6 = getImageUrl(6, 22);
        // part8 = getImageUrl(8, 22);
        // this.setData({
        //   image1: part1,
        //   image2: part2,
        //   image3: part3,
        //   image4: part4,
        //   image5: part5,
        //   image6: part6,
        //   image7: part7,
        //   image8: part8
        // })
        break;
      default:
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.openBluetoothAdapter({
      success: function (res) {
        
      },
      fail(res) {
        console.log('设备蓝牙未打开，请打开蓝牙功能');
        // wx.showModal({
        //   showCancel: false,
        //   confirmColor: '#FA3252',
        //   title: '',
        //   content: '请链接蓝牙',
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定后再干什么')
        //       // 退出小程序
        //       // wx.navigateBack({
        //       //   delta: 1
        //       // });
        //     }
        //   }
        // });
      }
    });
    custom_1 = 22, custom_2 = 22, custom_3 = 22, custom_4 = 22, custom_5 = 22;
    this.setData({
      pet_id: options.pet_id,
      device_id: options.device_id
    });
    try {
      api.get({
        url: 'user/lightSetting',
        data: {
          pet_id: options.pet_id,
          device_id: options.device_id
        },
        success: data => {
          if (data.code == 0) {
            helper.saveBleDevice(data.data);
            if(data.data) {
              if(data.data.light_tab == 6) {
                custom_1 = data.data.custom_1;
                custom_2 = data.data.custom_2;
                custom_3 = data.data.custom_3;
                custom_4 = data.data.custom_4;
                custom_5 = data.data.custom_5;
                // custom_6 = data.data.custom_6;
                // custom_7 = data.data.custom_7;
                // custom_8 = data.data.custom_8;
                this.setData({
                  light_tab: data.data.light_tab || 1,
                  light_pattern: data.data.light_pattern || 1,
                  direction: data.data.direction || 1,
                  speed: data.data.speed || 1,
                  image1: getImageUrl(1, data.data.custom_1),
                  image2: getImageUrl(2, data.data.custom_2),
                  image3: getImageUrl(3, data.data.custom_3),
                  image4: getImageUrl(4, data.data.custom_4),
                  image5: getImageUrl(5, data.data.custom_5),
                })
              } else {
                this.setData({
                  light_tab: data.data.light_tab || 1,
                  light_pattern: data.data.light_pattern || 1,
                  direction: data.data.direction || 1,
                  speed: data.data.speed || 1
                })
              }
              this.tabeightpart(data.data.light_tab);
            } else {
              this.setData({
                pet_id: options.pet_id,
                device_id: options.device_id
              })
            }
          } else {
            wx.showToast({
              title: '请求设备灯光信息失败',
              icon: 'none'
            });
          }
        },
        fail(res) {
          wx.showToast({
            title: '请求设备灯光信息失败',
            icon: 'none'
          });
        }
      });
    } catch (e) {
      wx.showToast({
        title: '请求设备灯光信息失败',
        icon: 'none'
      });
      // Do something when catch error
    }
  },
  
  save() {
    const data = this.data;
    wx.showModal({
      title: '',
      confirmColor: '#FA3252',
      content: '您想保存当前的选择吗？',
      success(res) {
        if (res.confirm) {
          let temp = {
            pet_id: data.pet_id,
            device_id: data.device_id,
            light_tab: data.light_tab || 1,
            light_pattern: data.light_pattern || 1,
            direction: data.direction || 1,
            speed: data.speed || 1
          }
          if (data.light_tab == 6) {
            temp.custom_1 = custom_1;
            temp.custom_2 = custom_2;
            temp.custom_3 = custom_3;
            temp.custom_4 = custom_4;
            temp.custom_5 = custom_5;
          }
          try {
            api.post({
              url: 'user/submitlightSetting',
              data: temp,
              success: data => {
                if (data.code == 0) {
                  helper.saveBleDevice(data.data);
                  wx.showToast({
                    title: '灯光设置成功!',
                    icon: 'success',
                    duration: 2000
                  });

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
              title: '保存灯光信息失败',
              icon: 'none'
            });
            // Do something when catch error
          }
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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