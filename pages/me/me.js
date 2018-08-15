// pages/me/me.js
const app = getApp();
Page({
  data: {
    userInfo: {
      "nick_name": "帅大叔",
      "pic_path": "/resource/images/default.png",
      "sex": 1
    },
    msgList: [],
    msgNum: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.userInfo.user_id);
    this.reloadUesrInfo();
    console.log(this.data.userInfo);
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.getSysMsgList();
    this.setData({
      userInfo: app.userInfo
    });
    if (this.data.msgNum) {
      wx.hideTabBarRedDot({ index: 2 });
    }
  },
  //加载用户信息
  reloadUesrInfo: function () {
    var that = this;
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    if (app.userInfo) {
      that.setUserData();
    } else {
      app.autoLogin(function (flag) {
        if (flag) {
          that.setUserData();
        } else {
          that.alertToast('登陆失败');
        }

      });
    }
  },
  setUserData:function(){
    this.setData({
      userInfo: app.userInfo
    });
    this.getSysMsgList();
    if (app.globalData.hasMsg) {
      this.showRedDot(2);
    } else {
      this.hideRedDot(2);
    }
    wx.hideNavigationBarLoading();
  },
  showRedDot: function (index) {
    wx.showTabBarRedDot({
      index: index,
    });
  },
  hideRedDot:function(index){
    wx.showTabBarRedDot({
      index: index,
    });
  },

  //下拉刷新"
  onPullDownRefresh: function () {
    this.reloadUesrInfo();
  },

  cleanStorage: function () {
    try {
      wx.clearStorageSync();
      app.alertToast("已清空数据缓存");
    } catch (e) {
      console.log(e);
    }
  },
  getSysMsgList: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/public/getSysMsgList',
      data: {
        page_no: 1,
        page_size: 50
      },
      dataType: "json",
      method: "GET",
      header: app.globalData.header,
      success: function (res) {
        var items = res.data.data;
        var num = 0;
        for (var i = 0; i < items.length; i++) {
          var readFlag = items[i].read_flag;
          if (readFlag == 0) {
            num = num + 1;
          }
        }
        that.setData({
          msgList: items,
          msgNum: num
        });
        // console.log("getSysMsgList - msgList",that.data.msgList);
      }
    })
  },
  meDetail: function () {
    console.log("我的详情");
    if (this.data.userInfo.user_id) {
      wx.navigateTo({
        url: 'detail/detail'
      })
    }
  },
  meCollect: function () {
    console.log(this.data.userInfo.user_id);
    if (this.data.userInfo.user_id) {
      wx.navigateTo({
        url: 'collect/collect'
      })

    }
  },
  meContribut: function () {
    if (this.data.userInfo.user_id) {
      wx.navigateTo({
        url: 'contribut/contribut'
      })

    }
  },
  systemMsg: function () {
    if (this.data.userInfo.user_id) {
      wx.navigateTo({
        url: 'message/message'
      })
    }
  },
  issueMsg: function () {
    if (this.data.userInfo.user_id) {
      wx.navigateTo({
        url: 'issuemsg/issuemsg'
      })
    }
  },
  rewardAuther: function () {
    wx.navigateTo({
      url: 'reward/reward'
    })
  },
  feedbackForMe: function () {
    if (this.data.userInfo.user_id) {
      wx.navigateTo({
        url: 'feedback/feedback'
      })
    }

  },
  aboutProgram: function () {
    wx.navigateTo({
      url: 'about/about'
    })
  }

})