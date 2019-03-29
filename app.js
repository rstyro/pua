//app.js
App({
  // onLaunch: function () {
  //  this.autoLogin();
  // },

  globalData: {
    header: { 'Cookie': '', "content-Type": "application/x-www-form-urlencoded" },
    url: "https://lrshuai.top/pua",
    imgurl: "https://www.lrshuai.top",
    hasMsg:false
  },
  userInfo: false,
  //自动登陆
  autoLogin: function (callback) {
    console.log("自动登陆");
    var that = this;
    try {
      let login_token = wx.getStorageSync('login_token');
      if (login_token) {
        wx.request({
          url: this.globalData.url + '/user/autoLogin',
          data: {
            token: login_token
          },
          dataType: "json",
          method: "POST",
          header: this.globalData.header,
          success: function (res) {
            if (res.data.status == 200) {
              console.log("autologin data", res);
              that.setCookie(res.data.data.session_id);
              that.setUserInfo(res.data.data.userInfo);
              that.globalData.hasMsg = res.data.data.hasMsg;
              //that.showRedDot(res.data.data.hasMsg);
              callback(true);
            } else if (res.data.status == 500){
              callback(false);
            }else{
              //当token 过期时跳登陆
              that.wxLogin(callback);
            }
          },
          fail: function (res) {
            console.log("error", res);
          }
        });
      } else {
        that.wxLogin(callback);
      }
    } catch (e) {
      console.log(e);
    }
  },
  //微信登陆
  wxLogin: function (callback){
    console.log("登录");
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          that.userLogin(res.code, callback);
        } else {
          callback(false);
        }
      }
    });

    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          // 没有授权 去授权
            wx.navigateTo({
              url: '../auth/auth'
            })          
        }
      }
    })
  },
  //用户登录
  userLogin: function (loginCode, callback){
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo;
        wx.request({
          url: that.globalData.url + '/user/login',
          data: {
            code: loginCode,
            nick_name: userInfo.nickName,
            user_url: userInfo.avatarUrl,
            sex: userInfo.gender,
            country: userInfo.country,
            province: userInfo.province,
            city: userInfo.city
          },
          dataType: "json",
          method: "POST",
          header: that.globalData.header,
          success: function (res) {
            if (res.data.status == 200) {
              that.setGlobalData(res.data.data);
              callback(true);
            } else if (res.data.status == 500) {
              callback(false);
            }
          },
          fail: function (res) {
            console.log("error", res);
          }
        });
      }
    })
   
  },
  setGlobalData: function (data) {
    this.setUserInfo(data.userInfo);
    this.setToken(data.token);
    this.setCookie(data.session_id);
    this.globalData.hasMsg = data.hasMsg;
    //this.showRedDot(data.hasMsg);
    console.log("login finish init app.js"); 
  },
  setCookie: function (sessionid) {
    if (!this.globalData.header.Cookie) {
      this.globalData.header.Cookie = "JSESSIONID=" + sessionid;
    }
  },
   setUserInfo: function (userInfo) {
    this.userInfo = userInfo;
    this.userInfo.pic_path = this.globalData.imgurl + this.userInfo.pic_path;
  },
  setToken: function (token) {
    try {
      wx.setStorageSync('login_token', token);
    } catch (e) {

    }
  },
  alertToast: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  alertModal:function(title,content){
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  }
  

})
// polyfill for Android before app starts
if (!Array.prototype.findIndex) {
  require('./utils/Arrays')
}