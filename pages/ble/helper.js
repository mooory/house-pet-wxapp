var api = require('../../utils/api.js');

// 连接/保存
function saveBleDevice(data){
 // pet_id: 53
 // device_id: 1
 // light_tab: 1
 // light_pattern: 3
 // direction: 1
 // speed: 1
 // custom_1, custom_2, custom_3, custom_4, custom_5

  console.log('保存设备参数: ', data)
  let tab = data.light_tab
  let pattern = data.light_pattern
  let direction = data.direction
  let speed = data.speed

  // 颜色参数
  let writeStr2Arr = convertColor(tab, data)
  writeStr2Arr = convertToHexArr(writeStr2Arr)
  let writeStr2 = writeStr2Arr.join('')
  console.log("设置颜色为: ", writeStr2Arr)

  // 模型参数
  pattern = convertPattern(tab, pattern)
  speed = convertRatio(speed)
  let writeStr3Arr = [
    pattern, speed, speed, speed, direction
  ]
  writeStr3Arr = convertToHexArr(writeStr3Arr)
  let writeStr3 = writeStr3Arr.join('')
  console.log("设置模型为: ", writeStr3Arr)

  // 发送数据
  let sendToBleData = {}
  // sendToBleData.deviceId = 'C4D78093-DE97-84D0-3A7D-C0E6A3F5B7CD'
  sendToBleData.deviceId = data.device_ble_name
  sendToBleData.writeStr2 = writeStr2
  sendToBleData.writeStr3 = writeStr3

  handleBleDevice(sendToBleData)
 // closeConnect(sendToBleData)

}

function convertColor(tab, data){
  // custom_1: 1
  // custom_2: 12
  // custom_3: 13
  // custom_4: 17
  // custom_5: 2
  let color = []
  // 蓝粉跑马
  if(tab == 1){
    color = [
      12, 12, 12, 12, 
      12, 12, 12, 12, 
      12, 12, 12, 12, 
      18, 18, 18, 18, 
      18, 18, 18, 18, 
    ]
  }
  // 红色呼吸, 红色常量 
  if(tab == 2 || tab == 4){
    color = [ 
      20, 20, 20, 20,
      20, 20, 20, 20, 
      20, 20, 20, 20,
      20, 20, 20, 20,
      20, 20, 20, 20,
    ]
  }
  // 绿色闪烁
  if(tab == 3){
    color = [ 
      9, 9, 9, 9,  
      9, 9, 9, 9,  
      9, 9, 9, 9,  
      9, 9, 9, 9,  
      9, 9, 9, 9,  
    ]
  }
  if(tab == 5){
    color = [
      0, 1, 2, 3,
      4, 5, 6, 7,
      8, 9, 10, 11,
      12, 13, 14, 15,
      16, 17, 18, 19
    ]
  }

  if(tab == 6){
    let c1 = data.custom_1 - 1 
    let c2 = data.custom_2 - 1 
    let c3 = data.custom_3 - 1 
    let c4 = data.custom_4 - 1 
    let c5 = data.custom_5 - 1 
    color = [
      c1, c1, c1, c1,
      c2, c2, c2, c2,
      c3, c3, c3, c3,
      c4, c4, c4, c4,
      c5, c5, c5, c5
    ]
  }

  return color
}


function convertRatio(r){

  if(r == 1){
    return 10
  }
  if (r == 3) {
    return 50
  }
  return 30
}

function convertPattern(tab, p){
  // 呼吸    1 -> 1  
  // 跑马灯  2 -> 0 
  // 闪烁    3 -> 2 
  // 常量    4 -> 4

  // 5个固定模式
  if (tab == 1) {
    return 2
  }
  if(tab == 2){
    return 1
  }
  if(tab == 3){
    return 3
  }
  if(tab == 4){
    return 4
  }
  if(tab == 5){
    return 2
  }

  // 自定义模式
  if(p == 2){
    return 0
  }
  if(p == 3){
    return 2
  }
  return p
}




function handleBleDevice(data) {
  console.log('connBleDevice 连接数据 data ', data)
  let deviceInfo = {}
  deviceInfo.deviceId = data.deviceId
  deviceInfo.writeStr2 = data.writeStr2
  deviceInfo.writeStr3 = data.writeStr3

  console.log('初始化设备信息为: ', deviceInfo);

  // 先关闭
  // closeConnect(deviceInfo)

  // 检测本机蓝牙是否可用
  if (!wx.openBluetoothAdapter) {
    wx.showModal({ showCancel: false, title: '提示', content: '不支持蓝牙设备', });
    return
  }

  // 初始化蓝牙
  wx.openBluetoothAdapter({
    success: function (res) {
      /* 获取本机的蓝牙状态 */
      getBluetoothAdapterState(deviceInfo)
    },
    fail(res) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '设备蓝牙未打开，请打开蓝牙功能',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定后再干什么')
          }
        }
      });
    }
  })
}

// 检查蓝牙状态
function getBluetoothAdapterState(deviceInfo) {
  console.log('检查蓝牙状态')
  wx.getBluetoothAdapterState({
    success: function (res) {
      startBluetoothDevicesDiscovery(deviceInfo)
    },
    fail(res) {
      console.log(res)
    }
  })
}

// 开始搜索蓝牙设备
function startBluetoothDevicesDiscovery(deviceInfo) {
  console.log('开始搜索蓝牙设备 startBluetoothDevicesDiscovery')
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        getBluetoothDevices(deviceInfo)
      },
      fail(res) {
      }
    })
}

// 获取蓝牙设备列表 
function getBluetoothDevices(deviceInfo){
  console.log('获取蓝牙设备列表 getBluetoothDevices')
  let deviceId = deviceInfo.deviceId

  wx.getBluetoothDevices({
    services: [],
    allowDuplicatesKey: false,
  //  interval: 0,
    success: function (res) {
      console.log("获取蓝牙设备列表 res: ", res)
      if (res.devices.length > 0) {
        if (JSON.stringify(res.devices).indexOf(deviceId) !== -1) {
          for (let i = 0; i < res.devices.length; i++) {
            let device = res.devices[i]
            if (deviceId === device.deviceId) {
              let adverData = arrayBufferToHexString(device.advertisData)
              console.log("device adverData: ", adverData)
              /* 根据指定的蓝牙设备名称匹配到deviceId */
              connectToDevice(deviceInfo)
            };
          };
        }
      }else{
        wx.showToast({
          title: '蓝牙连接丢失..',
          icon: 'none'
        });
      }
    },
    fail(res) {
      console.log(res, '获取蓝牙设备列表失败')
    }
  })

}

// 连接蓝牙
function connectToDevice(deviceInfo){

  console.log("连接蓝牙 createBLEConnection ", deviceInfo)

  // 先停止扫描
  console.log("连接蓝牙 stopBluetoothDevicesDiscovery first")
  wx.stopBluetoothDevicesDiscovery({
    success: function (res) {
    },
  });

  const deviceId = deviceInfo.deviceId
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function (res) {
      /* 4.获取连接设备的service服务 */
      console.log('连接成功 : ', res)
      getBLEDeviceServices(deviceInfo);
      /*
      // 调试使用
      wx.showToast({
        title: '连接成功',
      });
      */

    },
    fail: function (res) {
      console.log('连接失败 : ', res)
     // console.log('连接失败 -> 准备关闭蓝牙模块')
     // closeBluetoothAdapter()
    }
  })

}

// 获取蓝牙设备的service服务,获取的serviceId有多个
// 要试着连接最终确定哪个是稳定版本的service 获取服务完后获取设备特征值
function getBLEDeviceServices(deviceInfo){
  console.log("获取蓝牙设备的service服务 getBLEDeviceServices", deviceInfo)

  let deviceId = deviceInfo.deviceId

  wx.getBLEDeviceServices({
    deviceId: deviceId,
    success: function (res) {
      console.log('获取蓝牙设备的service服务 res ', res.services)
      let services = res.services
      for (let index in services) {
        let service = services[index]
        if (service.uuid === '0000FFF0-0000-1000-8000-00805F9B34FB') {
          console.log("匹配到服务 uuid: " + service.uuid)
          handleBleServiceChart(deviceInfo, service)
        }
      }
    },
    fail: (res) => {
    }
  })
}

// 获取连接设备的所有特征值
function handleBleServiceChart(deviceInfo, service) {
  console.log("获取蓝牙设备的service的特征值 getBLEDeviceCharacteristics ", deviceInfo)

  let deviceId = deviceInfo.deviceId
  let serviceId = service.uuid

  wx.getBLEDeviceCharacteristics({
    deviceId: deviceId,
    serviceId: serviceId,
    success: function (res) {

      console.log('获取蓝牙设备的service的特征值 res: ', res.characteristics)
      let characteristics = res.characteristics
      for (let index in characteristics) {
        let characteristic = characteristics[index]
        let currUuid = characteristic.uuid;
        let characteristicId = currUuid;
        let charUuidFlag = getUuidFlag(currUuid)
                //  console.log(characteristic)
        //  console.log("charUuid flag " + charUuidFlag);
        switch (charUuidFlag) {
          // 读: 该特征值长度为6字节，具有只读权限，表示设备具有的唯一ID；
          case 'FFF1':
            readBLECharacteristicValue(deviceId, serviceId, characteristicId)
            break;

          // FFF2 读写
          // 该特征值长度为20字节，表示LED颜色的代号，表示颜色范围为：0 - 19，代表20种颜色。
          case 'FFF2':
            readBLECharacteristicValue(deviceId, serviceId, characteristicId)
            onWriteChange(deviceId, serviceId, currUuid, deviceInfo.writeStr2);
            break;

          // FFF3 读写，
          // 字段0: 工作模式 0-跑马灯，1-呼吸，2-闪烁，3-多彩渐变，4-常亮。
          // 字段1：呼吸灯的频率，单位为0.1Hz，最小为0.1Hz，最小为0，最大为5Hz。
          // 字段2：跑马灯的速率，单位为0.1r / s，最小为0.1r / s，最小为0，最大为5r / s。
          // 字段3：闪烁灯的频率，单位为0.1Hz，最小为0.1Hz，最小为0，最大为5Hz。
          // 字段4：旋转方向，0为正方向，1为反方向。
          case 'FFF3':
            readBLECharacteristicValue(deviceId, serviceId, characteristicId)
            onWriteChange(deviceId, serviceId, currUuid, deviceInfo.writeStr2);
            break;

          // 读, 该特征值长度为1字节，具有只读权限，表示设备剩余电量值，单位为 %，范围0 - 100；
          case 'FFF4':
            readBLECharacteristicValue(deviceId, serviceId, characteristicId)
            break;

          // 读,  该特征值长度为4字节，具有只读权限，表示设备累计运行时间，单位为秒  
          case 'FFF5':
            readBLECharacteristicValue(deviceId, serviceId, characteristicId)
            break;
          default:
            console.log('char uuid default: no need action');
            break;
        }
      }
    }
  })
}

// 读取值
function readBLECharacteristicValue(deviceId, serviceId, characteristicId){
  let charUuidFlag = getUuidFlag(characteristicId)
  wx.readBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: serviceId,
    characteristicId: characteristicId,
    success: function (res) {
      onReadChange(deviceId, charUuidFlag)
    },
  })
}

// 读取数据  FFF1
function onReadChange(deviceId, charUuidFlag) {
  wx.onBLECharacteristicValueChange(function (res) {

    let flag = getUuidFlag(res.characteristicId)
    let byteDatas = Array.from(new Int8Array(res.value))
    // const data = byteDatas.join(',')
    const data = arrayBufferToHexString(res.value)

    console.log('flag  : ', flag)
    console.log('read result : ', res)
    console.log('onReadChange data : ', data)


    let req = true
    if (flag == 'FFF4' && req) {
      const power = parseInt(data, 16)
      console.log("send FFF4 data to api: ", power)
      if (power < 10) {
        return
      }
      try {
        api.get({
          url: 'user/devicePower',
          data: {
            device_name: deviceId,
            device_power: power,
          },
          success: data => {
            console.log('send device power done')
          }
        });
      } catch (e) {
        wx.showToast({
          title: '请求设备数据失败',
          icon: 'none'
        });
      }
    }
    if (flag == 'FFF5' && req) {
      const totalTime = parseInt(data, 16)
      console.log("send FFF5 data to api: ", totalTime)
      if (totalTime < 10) {
        return;
      }
      try {
        api.get({
          url: 'user/deviceTimeLog',
          data: {
            device_name: deviceId,
            total_time: totalTime,
          },
          success: data => {
            console.log('send device total time done')
          }
        });
      } catch (e) {
        wx.showToast({
          title: '请求设备数据失败',
          icon: 'none'
        });
      }
    }
  });
}

// 写入数据
function onWriteChange(deviceId, serviceId, characteristicId, buf) {
  console.log("write buf: ", buf)
  let bufArr = hexStringToArrayBuffer(buf)
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
}


// 获取 FFF2 随机值
function randomFFF2(){
  let writeStr2Arr = []
  for (let i = 0; i < 20; i++) {
    let n = randomNum(1, 18)
    writeStr2Arr.push(n)
  }
  writeStr2Arr = convertToHexArr(writeStr2Arr)

  let writeStr2 = writeStr2Arr.join('')
  //  writeStr2 = '0101010101050505050509090909091010101010'
  console.log('writeStr 2 arr : ', writeStr2Arr)
  console.log('writeStr 2 str : ', writeStr2)
  return writeStr2;
}
 
function randomFFF3(){
  let writeStr3Arr = [
    randomNum(0, 4),
    randomNum(17, 50),
    randomNum(17, 50),
    randomNum(17, 50),
    randomNum(0, 1),
  ];

  writeStr3Arr = convertToHexArr(writeStr3Arr)

  let writeStr3 = writeStr3Arr.join('')
  // writeStr3 = '0310101001'
  console.log('writeStr 3 arr ', writeStr3Arr)
  console.log('writeStr 3 str ', writeStr3)
  return writeStr3
} 

function convertToHexArr(arr){
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    let n = arr[i]
    let hn = 0
    if (n < 16) {
      hn = '0'.concat(n.toString(16))
    } else {
      hn = n.toString(16)
    }
    console.log("convert 10 to 16 : ", n, ' => ', hn)

    newArr.push(hn)
  }
  return newArr
}


//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}

function getUuidFlag(rawUuid) {
  let rawArr = rawUuid.split('-');
  if (rawArr.length > 0 && rawArr[0].length == 8) {
    return rawArr[0].substr(4)
  }
  return '';
}

function arrayBufferToHexString(buffer) {
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
}

function hexStringToArrayBuffer(str) {
  if (!str) {
    return new ArrayBuffer(0);
  }

 // var buffer = new ArrayBuffer(str.length);
  var buffer = new ArrayBuffer(str.length/2);
  let dataView = new DataView(buffer)

  let ind = 0;
  for (var i = 0, len = str.length; i < len; i += 2) {
    let code = parseInt(str.substr(i, 2), 16)
    dataView.setUint8(ind, code)
    ind++
  }

  return buffer;
}


// 断开设备连接
function closeConnect(deviceInfo) {
  let deviceId = deviceInfo.deviceId
  if (deviceId) {
    wx.closeBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        closeBluetoothAdapter()
      },
      fail(res) {
      }
    })
  } else {
    closeBluetoothAdapter()
  }
}

// 关闭蓝牙模块
function closeBluetoothAdapter() {
  wx.closeBluetoothAdapter({
    success: function (res) {
      console.log("蓝牙模块关闭")
    },
    fail: function (err) {
    }
  })
}

module.exports = {
  saveBleDevice: saveBleDevice,
}