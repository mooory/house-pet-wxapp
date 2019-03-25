// pages/addPet/addPet.js
var api = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    ages: [],
    breed: [],
    sex: [],
    ageIndex: 0,
    breedIndex: 0,
    sexIndex: 0
  },
  chooseAvatar: function(e) {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        api.uploadFile({
          url: 'upload/avatar',
          filePath: tempFilePaths[0],
          name: 'avatar',
          success(data) {
            console.log(that);
            that.setData({
              avatar: data.data.avatar
            });
          }
        })
        // that.setData({
        //   avatar: tempFilePaths[0]
        // });
      }
    })
  },
  bindPickerAge: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ageIndex: e.detail.value
    })
  },
  bindPickerSex: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
  },
  bindPickerBreed: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      breedIndex: e.detail.value
    })
  },
  toBack:function(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.post({
      url: 'user/petContent',
      success: data => {
        if (data.code == 0) {
          // var breedArray = [];
          // for(var i in data.data.breed) {
          //    breedArray.push({
          //      id: i,
          //      name: data.data.breed[i]
          //    });
          // }
          this.setData({
            ages: Object.values(data.data.birthday),
            breed: Object.values(data.data.breed),
            sex: Object.values(data.data.sex),
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none'
          });
        }
      }
    });
  },
  formSubmit: function (e) {
    
    var check = [{
      type: 'name',
      info: '宝贝姓名'
    }, {
      type: 'birthday',
      info: '年龄'
    }, {
      type: 'sex',
      info: '性别'
    }, {
      type: 'pet_breed',
      info: '品种'
    }];
    if(!this.data.avatar) {
      wx.showToast({
        title: '先上传头像哦~',
        icon: 'none'
      });
      return false;
    }
    for(var i = 0; i < check.length; i++) {
      console.log(check[i].type);
      if(!e.detail.value[check[i].type]){
        wx.showToast({
          title: '请输入' + check[i].info,
          icon: 'none'
        });
        return false;
      }
    }
    const {name, birthday, pet_breed, sex} = e.detail.value;
    api.post({
      url: 'user/submitPet',
      data: {
        avatar: this.data.avatar,
        name,
        birthday: this.data.ages[birthday],
        pet_breed: this.data.breed[pet_breed],
        sex: this.data.sex[sex]        
      },
      success: data => {
        if (data.code == 0) {
          try {
            wx.showToast({
              title: '添加宝贝资料成功!',
              icon: 'success',
              duration: 2000
            });
            wx.switchTab({
              url: '../home/home',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            });
          } catch (e) {
            wx.showToast({
              title: '返回页面失败!',
              icon: 'none',
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