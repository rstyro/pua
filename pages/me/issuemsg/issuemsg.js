// pages/me/issueMsg/issuemsg.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //提交
  submitSystemsg: function (e) {
    console.log(e);
    var pushId = e.detail.value.push_id;
    var title = e.detail.value.title;
    var content = e.detail.value.content;
    var time = e.detail.value.create_time;
    if (content) {
      this.requestContent(pushId,title, content, time);
    } else {
      app.alertToast("请写点内容");
    }

  },
  requestContent: function (pushId,title,content,time) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/public/saveSystemMsg',
      data: {
        push_id: pushId,
        title: title,
        msg_content: content,
        create_time:time
      },
      dataType: "json",
      method: "POST",
      header: app.globalData.header,
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          that.setData({
            content: ''
          })
          app.alertToast("你的话已送达，我会尽快给你回复");
        } else {
          app.alertToast(res.msg);
        }
      }
    })
  }
})