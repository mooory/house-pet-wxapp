// pages/myEquip/myEquip.js
var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    phone: ''
  },
  init() {
    const myPhone = wx.getStorageSync('phone');
    if (myPhone) {
      this.setData({
        phone: myPhone
      });
    };
    try {
      api.post({
        url: 'user/selectUserDevice',
        success: data => {
          if (data.code == 0) {
            this.setData({
              list: data.data
            })
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
        title: '获取我的设备失败',
        icon: 'none'
      });
    }
  },
  todevice(e) {
    wx.setStorageSync('petid', e.currentTarget.dataset.petid);
    wx.setStorageSync('deviceid', e.currentTarget.dataset.deviceid);
    wx.switchTab({
      url: '../home/home'
    });
  },
  logout() {
    wx.showModal({
      title: '',
      confirmColor: '#FA3252',
      content: '您确认要退出当前账号吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('login');
          wx.removeStorageSync('token');
          wx.removeStorageSync('phone');
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.init();
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