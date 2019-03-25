// pages/light/light.js
function str_pad(hex) {
  var zero = '00';
  var tmp = 2 - hex.length;
  return zero.substr(0, tmp) + hex;
}
// const center_icon = require('../../images/center_icon.png');
// import colorful_round from '../../images/colorful_round';
// import slide_button from '../../images/slide_button';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 'auto',
    color: '#fff',
    open: false
  },
  toBack: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  changemode: function(e) {
    if(this.data.open) {
      this.setData({
        mode: e.currentTarget.dataset.type
      });
    }
  },
  checkboxChange: function(e) {
    if(e.detail.value.length) {
      wx.showToast({
        title: '只能在设备中打开哦！',
        icon: 'none'
      });
      // this.setData({
      //   open: true
      // });
    } else {
      this.setData({
        open: false
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const ctx = wx.createCanvasContext('canvas');
    this.context = ctx;
    this.dealDrag(500);
    this.drawPicture(240, -1, ctx);
  },
  drawPicture(x, y, ctx) {
    //范围在20~300之间
    if(x<20) {
      x=20;
    }
    if(x>300) {
      x=300;
    }
    if(y<20) {
      y=20;
    }
    if(y>300) {
      y=300;
    }
    //重构x,y值
    let direction = 1;
    if(x<260 && x>70) {
      direction = y > 160 ? -1 : 1;
      y = Math.sqrt(19600 - (x - 160) * (x - 160));
      y = 160 - direction * y;
    } else {
      direction = x > 160 ? -1 : 1;
      x = Math.sqrt(19600 - (y - 160) * (y - 160));
      x = 160 - direction * x;
    }
    if(x>270) {
      wx.showModal({
        title: '提示',
        content: '蓝色系对宠物视觉有伤害',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#A545A1'
      })
    }
    ctx.clearRect(0, 0, 320, 320);
    ctx.beginPath();
    ctx.moveTo(160, 160);
    ctx.lineTo(x, y);
    ctx.setLineWidth(1);
    ctx.setStrokeStyle('#D8D8D8');
    ctx.stroke();

    //画外圈圆
    ctx.beginPath();
    ctx.arc(160, 160, 52, 0, 2 * Math.PI);
    ctx.setStrokeStyle('#f3acd1');
    ctx.setLineWidth(6)
    ctx.stroke();

    //画内圈圆
    ctx.beginPath();
    ctx.arc(160, 160, 49, 0, 2 * Math.PI);
    ctx.setFillStyle('#cb207a');
    ctx.fill();
    // ctx.draw(true);
    //画内侧图标
    ctx.drawImage('../../images/center_icon.png', 121, 141, 78, 39);
    //画交互点
    ctx.drawImage('../../images/colorful_round.png', 10, 10, 300, 300);
    const that = this;
    ctx.draw(true, () => {
      wx.canvasGetImageData({
        canvasId: 'canvas',
        x: x,
        y: y,
        width: 1,
        height: 1,
        success(res) {
          ctx.drawImage('../../images/slide_button.png', x - 20, y - 20, 40, 40);
          ctx.draw(true);
          let color = '#' + str_pad(res.data[0].toString(16)) + str_pad(res.data[1].toString(16)) + str_pad(res.data[2].toString(16));
          ctx.beginPath();
          ctx.arc(x, y, 11, 0, 2 * Math.PI);
          ctx.setFillStyle(color);
          ctx.fill();
          ctx.draw(true);
          that.setData({
            color
          });
        },
        fail(res) {
          console.log(res);
        }
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  dealDrag (delay) {
    var last = 0;
    
    this.toDrag = (e) => {
      if(!this.data.open) {
        wx.showToast({
          title: '灯光暂未开启, 不能设置颜色哦',
          icon: 'none'
        });
        return false;
      }
      var curr = +new Date();
      if (curr - last > delay) {
        last = curr;
        this.changeposition(e);
      }
    };
  },
  changeposition(e) {
    const {x,y} = e.touches[0];
    let r = Math.sqrt((x - 160) * (x - 160) + (y - 160) * (y - 160));
    let isRange = ((r-140) <= 20) && ((r-140) >= -20) ? true: false;
    if(isRange) {
      this.drawPicture(x, y, this.context);
    }
  },
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