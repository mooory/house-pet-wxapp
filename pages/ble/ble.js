var api = require('../../utils/api.js')
Page({
    data: {
      testDeviceServiceUuid: '0000FFF0-0000-1000-8000-00805F9B34FB',
      testCharacteristicUuid: '0000FFF2-0000-1000-8000-00805F9B34FB',
      bleStatus: "蓝牙未打开",
      bleAdapterStatus: "未初始化",
      bleChipInfo: {},
      bleChips: [],
      bleConnSuccess: false,
      bleNotifyData: "未读取数据"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
      if (wx.openBluetoothAdapter) {
        wx.openBluetoothAdapter()
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      // 监听蓝牙
      this.bleStatusListener()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      // 初始化蓝牙
      this.bleInit()
    },

    backToHome() {
      wx.switchTab({
        url: '../home/home',
      });
    },

    onScanClick(){
      console.log('扫描开始');
      let self = this
      console.log(self.testDeviceServiceUuid)
      wx.openBluetoothAdapter({
        success: function (res) {
          // 扫描蓝牙
          self.bleDisCovery()
          console.log('初始化成功');
          self.setData({
            bleAdapterStatus: "初始化成功",
            bleStatus: "蓝牙已打开",
          })
        },
        fail(res) {
          console.log('设备蓝牙未打开，请打开蓝牙功能');
          self.setData({
            bleAdapterStatus: "初始化失败"
          })
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '设备蓝牙未打开，请打开蓝牙功能',
            success: function (res) {
              if (res.confirm) {
                 console.log('用户点击确定后再干什么')
                // 退出小程序
              }
            }
          });
        },
        complete(res) {
          // IOS里面蓝牙状态变化以后不能马上开始搜索，否则会搜索不到设备，必须要等待2秒以上。
          wx.onBluetoothAdapterStateChange(function (res) {
            if (res.available) {
              setTimeout(function () {
                 self.bleDisCovery();
              }, 2000);
            }
          })

          //开始搜索  
        }
      })
    },

    /**
     * 扫描设备
     */
    bleDisCovery() {
      let t = (new Date()).format("yyyy-MM-dd hh:mm:ss.S")
      console.log("扫描设备1..." + t)
      let self = this
      wx.startBluetoothDevicesDiscovery({
        interval: 1000,
        success: function (res) {
          self.bleFound();
        }
      })
    },

    /**
     * 发现设备信息
     */
    bleFound() {
      console.log("发现设备信息")
      let self = this
      wx.onBluetoothDeviceFound(function (res) {
        let devices = res.devices
        console.log(devices)

        let length = self.data.bleChips.length
        let devicesLength = devices.length
        if (devicesLength > length) {
          self.data.bleChips = devices
          self.setData({
            bleChips: devices
          });
        }
        console.log(self.data.bleChips)
      });
      console.log("发现设备信息 end")
    },

    /**
     * 连接设备
     */
    onConnBle: function(e) {
      console.log('conn ble')
      // 停止扫描
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
        },
      });

      // 接收点击事件的参数
      let device = e.currentTarget.dataset.item
      console.log(`conn ble >> ${device}`)
      this.setData({
        bleChipInfo: device
      })
      let deviceId = device.deviceId
      let self = this
      // 连接设备
      console.log("连接设备中...")
      wx.createBLEConnection({
        deviceId: deviceId,
        success: function (res) {
          wx.showToast({
            title: '连接成功',
          });
          // 连接成功，打开 notify
          console.log('连接成功， 开始打开 notify');
          setTimeout(function () {
            self.bleServices(deviceId)
          }, 1500)
        },
        fail: function (errMsg) {
          wx.showToast({
            title: `连接失败:${errMsg}`,
          })
        }
      });
  },
  bleServices(deviceId) {
    let self = this
    wx.getBLEDeviceServices({
      deviceId: deviceId,
      success: function (res) {
        wx.showToast({
          title: 'service success',
        })
        let services = res.services
        for (let index in services) {
          let service = services[index]
          console.log('service ' + index)
          console.log(service)
          if (service.uuid === '0000FFF0-0000-1000-8000-00805F9B34FB') {
            console.log("have service: " + service.uuid)
            self.bleServiceChart(deviceId, service.uuid)
          }
        }
        console.log('device services:', res.services)
      }
    })
  },
  /**
   * 获取服务特征值
   * 每个服务都包含了一组特征值用来描述服务的一些属性，比如是否可读，是否可写，是否可以开启notify通知等等，
   * 当跟蓝牙通信时需要这些特征值ID来传递数据。
   */
  bleServiceChart(deviceId, serviceId) {
    let self = this;
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      success: function (res) {
        console.log('device getBLEDeviceCharacteristics:', res.characteristics)
        let characteristics = res.characteristics
        let writeStr2 = '2'
        for (let index in characteristics) {
          let characteristic = characteristics[index]
          console.log(characteristic)
          let currUuid = characteristic.uuid;
          let charUuidFlag = self.getUuidFlag(currUuid)

          console.log("charUuid flag " + charUuidFlag);

          switch(charUuidFlag){
            // 读: 该特征值长度为6字节，具有只读权限，表示设备具有的唯一ID；
            case 'FFF1':
              wx.readBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: currUuid,
                success: function (res) { 
                  console.log('read from FFF1: ',res)
                //  console.log(res)
                  self.onReadChange()
                  wx.showToast({
                    title: 'read success',
                  });
                },
              })
              break;

            // 读写
            // 该特征值长度为20字节，具有可读可写权限，表示LED颜色的代号，表示颜色范围为：0 - 19，代表20种颜色。
            case 'FFF2':
              wx.readBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: currUuid,
                success: function (res) {
                  console.log('read from FFF2: ', res)
                  self.onReadChange()
                  wx.showToast({
                    title: 'read success',
                  });
                },
              })
              // 写
             // writeStr2 = '0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9';
              writeStr2 = '5,0,0,0,0,9,0,0,0,0,3,0,0,0,0,8,0,0,0,0';
             // 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
              self.onWriteChange(deviceId, serviceId, currUuid, writeStr2);
              break;  

            // FFF3 可读写，
            // 字段0: 工作模式 0-跑马灯，1-呼吸，2-闪烁，3-多彩渐变，4-常亮。
            // 字段1：呼吸灯的频率，单位为0.1Hz，最小为0.1Hz，最小为0，最大为5Hz。
            // 字段2：跑马灯的速率，单位为0.1r / s，最小为0.1r / s，最小为0，最大为5r / s。
            // 字段3：闪烁灯的频率，单位为0.1Hz，最小为0.1Hz，最小为0，最大为5Hz。
            // 字段4：旋转方向，0为正方向，1为反方向。
            case 'FFF3':
              wx.readBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: currUuid,
                success: function (res) {
                  console.log('read from FFF3: ', res)
                  self.onReadChange()
                  wx.showToast({
                    title: 'read success',
                  });
                },
              })
              // 写
             // let writeStr3 = '3,20,20,20,1';
             // let writeStr3 = '0,0,0,0,0';
              let writeStr3 = '1,5,0,0,0';
              writeStr3 = '0,2,0,0,0';
              self.onWriteChange(deviceId, serviceId, currUuid, writeStr3);
              break;    

            //  读, 该特征值长度为1字节，具有只读权限，表示设备剩余电量值，单位为 %，范围0 - 100；
            case 'FFF4':
              wx.readBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: currUuid,
                success: function (res) {
                  console.log('read from FFF4: ', res)
                  self.onReadChange()
                  wx.showToast({
                    title: 'read success',
                  });
                },
              })
              break;  

            // 读,  该特征值长度为4字节，具有只读权限，表示设备累计运行时间，单位为秒  
            case 'FFF5':
              wx.readBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: currUuid,
                success: function (res) {
                  console.log('read from FFF5: ', res)
                  self.onReadChange()
                  wx.showToast({
                    title: 'read success',
                  });
                },
              })
              break;   
            default :
              console.log('char uuid default: no need action');
              break;
          }
        }
      }
    })
  },

  openNotify: function (deviceId, serviceId, characteristicUuid) {
    this.setData({
      bleConnSuccess: true
    });
    let self = this
    wx.notifyBLECharacteristicValueChange({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicUuid,
      state: true,
      success: function (res) {
        console.log('notify success')
        self.onNotifyChange()
        wx.showToast({
          title: 'notify success',
        });
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          title: 'notify fail',
        });
      }
    });
  },
  
  // 接收数据
  onNotifyChange: function () {
    let self = this
    wx.onBLECharacteristicValueChange(function (res) {
      console.log(res.characteristicId)
      let byteDatas = Array.from(new Int8Array(res.value))
      console.log(byteDatas)
      const data = byteDatas.join(',')
      self.setData({
        bleNotifyData: data
      });
      console.log(data)
    });
  },

  // 读取数据  FFF1
  onReadChange: function () {
    let self = this
    wx.onBLECharacteristicValueChange(function (res) {
      console.log('read from : ',res)
      let byteDatas = Array.from(new Int8Array(res.value))
    //  console.log(byteDatas)
      const data = byteDatas.join(',')
      self.setData({
        bleNotifyData: data
      });
      console.log('onReadChange data : ', data)
    });
  },

  // 写入数据
  onWriteChange: function (deviceId, serviceId, characteristicId, buf) {
    let self = this

    let bufArr = self.hexStringToArrayBuffer(buf)
    console.log("write bufArr: ", bufArr);

    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      // 这里的value是ArrayBuffer类型
      value: bufArr,
      success: function (res) {
        console.log(res)
      },
      fail(res) {
        console.log(res);
      }

    });
  },

  /**
   * 初始化蓝牙
   */
  bleInit: function () {
    console.log('初始化蓝牙')
    let self = this
    wx.openBluetoothAdapter({
      success: function (res) {
        self.setData({
          bleAdapterStatus: "初始化成功",
          bleStatus: "蓝牙已打开",
        })
      },
      fail: function (msg) {
        self.setData({
          bleAdapterStatus: "初始化失败"
        })
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '设备蓝牙未打开，请打开蓝牙功能',
          success: function (res) {
            if (res.confirm) {
              //console.log('用户点击确定')
              // 退出小程序
            }
          }
        });
      }
    });
  },
  /**
   * 蓝牙设备监听
   */
  bleStatusListener: function () {
    // 监听蓝牙状态
    let slef = this
    wx.onBluetoothAdapterStateChange(function (res) {
      console.log(`adapterState changed, now is`, res)
      if (res.available) {
        // 是否可用
        console.log("蓝牙状态以改变！")
        slef.setData({
          bleStatus: "蓝牙已打开"
        });
      } else {
        slef.setData({
          bleStatus: "蓝牙已关闭"
        });
        // 不可用时
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '设备蓝牙未打开，请打开蓝牙功能',
          success: function (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              // 退出小程序
            }
          }
        });
      }
    });
  },
  getUuidFlag: function(rawUuid){
    let rawArr = rawUuid.split('-');
    if(rawArr.length > 0 && rawArr[0].length == 8){
      return rawArr[0].substr(4)
    }
    return '';
  },
  arrayBufferToHexString(buffer) {
    let bufferType = Object.prototype.toString.call(buffer)
    if (buffer != '[object ArrayBuffer]') {
      return
    }
    let dataView = new DataView(buffer)

    var hexStr = '';
    for (var i = 0; i < dataView.byteLength; i++) {
      var str = dataView.getUint8(i);
      var hex = (str & 0xff).toString(16);
      hex = (hex.length === 1) ? '0' + hex : hex;
      hexStr += hex;
    }

    return hexStr.toUpperCase();
  },

  hexStringToArrayBuffer(str) {
    if (!str) {
      return new ArrayBuffer(0);
    }

    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)

    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }

    return buffer;
  }
})
