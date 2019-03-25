var api = require('../../utils/api.js')
var app = getApp()
Page({
    data: {
      second: 0,
      phone: '',
      code: ''
    },
    onLoad() {
      try {
        // wx.setStorageSync('login', '1');
        // wx.setStorageSync('token', '3835c2f11b3a650d020a5c99744d1b6e86f28c77284f5622a0f83c1c79560160');
        // wx.setStorageSync('token', 'e604562928eafdb773735b18f9a30f53fe8c09de6d6cc0f01bc38d3d9fb90054');
        var isLogin = wx.getStorageSync('login');
        if(isLogin) {
          wx.switchTab({
            url: '../home/home',
          });
          return;
        }
      } catch (e) {
        console.log(e);
      }
    },
    onUnload() {

    },
    bindKeyInput(e) {
      this.setData({
        phone: e.detail.value
      })
    },
    bindVerify(e) {
      this.setData({
        code: e.detail.value
      })
    },
    getVerify: function(){
      if(!this.data.phone) {
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none'
        });
        return false;
      }
      if (!/^1\d{10}$/.test(this.data.phone)) {
        wx.showToast({
          title: '手机号不正确',
          icon: 'none'
        });
        return false;
      }
      api.post({
        url: 'Verification_code/send',
        data: {
          mobile: this.data.phone
        },
        success: data => {
          if(data.code == 0) {
              var self = this;
              this.setData({
                second: 90,
                code: data.data.code
              }, function () {
                self.timer = setInterval(function () {
                  if (self.data.second) {
                    self.setData({
                      second: self.data.second - 1
                    });
                  } else {
                    clearInterval(self.timer);
                  }
                }, 1000);
              });
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none'
            });
          }
        },
        fail: err => {
          wx.showToast({
            title: '验证码发送失败，请重新获取',
            icon: 'none'
          });
        }
      })
      
    },
    formSubmit: function (e) {
      console.log(e);
        api.post({
            url: '/user/wxLogin',
            data: e.detail.value,
            success: data => {
                if (data.code == 0) {
                    wx.showToast({
                        title: '登录成功!',
                        icon: 'success',
                        duration: 2000
                    });

                    try {
                        wx.setStorageSync('login', '1');
                        wx.setStorageSync('token', data.data.token);
                        wx.setStorageSync('phone', e.detail.value.mobile);
                        wx.switchTab({
                          url: '../home/home',
                        });
                    } catch (e) {
                        console.log(e);
                        // Do something when catch error
                    }
                } else {
                    wx.showToast({
                      title: data.msg,
                      icon: 'none'
                    });
                }
            }
        });
    },
    handleGetUserInfo(){
        api.login();
    }
})
