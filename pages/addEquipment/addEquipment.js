// pages/addEquipment/addEquipment.js
var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  toscan(e) {
    wx.scanCode({
      success: res => {
        const code = res.result;
        if(code) {
          try {
            api.post({
              url: 'user/deviceInfo',
              data: {
                device_num: code
              },
              success: data => {
                if (data.code == 0) {
                  const { device_id, device_name } = data.data;
                  if(device_id) {
                    api.post({
                      url: 'user/submitPetDevice',
                      data: {
                        pet_id: this.data.pet_id,
                        device_id: device_id,
                        device_name: device_name
                      },
                      success: data => {
                        if (data.code == 0) {
                          wx.showToast({
                            title: '添加设备成功!',
                            icon: 'success',
                            duration: 2000
                          });
                          wx.setStorageSync('petid', data.data.pet_id);
                          wx.setStorageSync('deviceid', data.data.device_id);
                          let t1 = setTimeout(function () {
                            clearTimeout(t1);
                            wx.switchTab({
                              url: '../home/home'
                            });
                          }, 2000);
                        } else {
                          wx.showToast({
                            title: data.msg,
                            icon: 'none'
                          });
                        }
                      }
                    });
                  } else {
                    wx.showToast({
                      title: '获取设备号异常',
                      icon: 'none'
                    });
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
              title: '获取设备信息失败',
              icon: 'none'
            });
          }
        } else {
          wx.showToast({
            title: '扫码失败',
            icon: 'none'
          });
        }
      },
      fail: res => {
      }
    })
  },
  toBack: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      console.log(options);
      api.post({
        url: 'user/deviceInformation',
        success: data => {
          if (data.code == 0 ) {
            this.setData({
              pet_id: options.pet_id,
              list: data.data
            })
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none'
            });
            this.setData({
              pet_id: options.pet_id
            })
          }
        }
      });
    } catch (e) {
      wx.showToast({
        title: data.msg,
        icon: 'none'
      });
    }
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