// pages/me/edituser/edit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    region: ['广东省', '深圳市', ''],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.userInfo,
      region: [app.userInfo.province, app.userInfo.city, '']
    });
  },
  bindSign: function (e) {
    var tempUserInfo = this.data.userInfo;
    tempUserInfo.sign = e.detail.value;
    this.setData({
      userInfo: tempUserInfo
    })
  },
  bindName:function(e){
    var tempUserInfo = this.data.userInfo;
    tempUserInfo.nick_name = e.detail.value;
    this.setData({
      userInfo: tempUserInfo
    })
  },
  bindEmail: function (e) {
    var tempUserInfo = this.data.userInfo;
    tempUserInfo.email = e.detail.value;
    this.setData({
      userInfo: tempUserInfo
    })
  },
  bindPhone: function (e) {
    var tempUserInfo = this.data.userInfo;
    tempUserInfo.phone = e.detail.value;
    this.setData({
      userInfo: tempUserInfo
    })
  },
  //性别改变
  radioChange: function (e) {
    var tempUserInfo = this.data.userInfo;
    tempUserInfo.sex = e.detail.value;
    this.setData({
      userInfo: tempUserInfo
    })
  },
  //地址改变
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var tempUserInfo = this.data.userInfo;
    tempUserInfo.province = e.detail.value[0];
    tempUserInfo.city = e.detail.value[1];
    this.setData({
      region: e.detail.value,
      userInfo: tempUserInfo
    })
  },
  //日期改变
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var tempUserInfo = this.data.userInfo;
    tempUserInfo.birthday = e.detail.value;
    this.setData({
      userInfo: tempUserInfo
    })

  },
  //表单提交
  submitInfo: function (e) {
    console.log("e", e);
    // var nick_name = e.detail.value.nick_name;
    // var sex = e.detail.value.sex;
    // var sign = e.detail.value.sign;
    // var email = e.detail.value.email;
    // var phone = e.detail.value.phone;
    // var birthday = this.data.userInfo.birthday;
    // var province = this.data.region[0];
    // var city = this.data.region[1];
    var that = this;
    wx.request({
      url: app.globalData.url + '/user/updateUserInfo',
      data: {
        nick_name: e.detail.value.nick_name,
        sex: e.detail.value.sex,
        sign: e.detail.value.sign,
        email: e.detail.value.email,
        phone: e.detail.value.phone,
        birthday: that.data.userInfo.birthday,
        province: that.data.region[0],
        city: that.data.region[1]
      },
      dataType: "json",
      method: "POST",
      header: app.globalData.header,
      success: function (res) {
        console.log("res:", res);
        if (res.data.status == 200) {
          app.userInfo = that.data.userInfo;
          wx.navigateBack({});
        }
      }
    })
  },
  //更换头像
  changeImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
        var uploadHead = { 'Cookie': '', "content-Type": "multipart/form-data" };
        uploadHead.Cookie = app.globalData.header.Cookie;
        wx.uploadFile({
          url: app.globalData.url + '/user/uplaodImg', 
          filePath: _this.data.tempFilePaths[0],
          name: 'file',
          header: uploadHead,
          success: function (res) {
            //成功
            var data = res.data;
            if(data){
              var tempUserInfo = _this.data.userInfo;
              tempUserInfo.pic_path = app.globalData.url +　data;
              _this.setData({
                userInfo: tempUserInfo
              })
              app.userInfo = _this.data.userInfo;
            }
          }
        })

      }
    })
  }
})