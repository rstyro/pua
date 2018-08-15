// pages/me/feedback/feedback.js
const app = getApp();
Page({

  data: {
    content:''
  },
  onLoad: function (options) {
  
  },
  //提交
  submitFeedback:function(e){
    console.log(e);
    var content = e.detail.value.content;
    if (content){
      this.requestContent(content);
    }else{
      app.alertToast("请写点内容");
    }

  },
  requestContent:function(content){
    var that = this;
    wx.request({
      url: app.globalData.url + '/public/feedback',
      data: {
        content: content
      },
      dataType: "json",
      method: "POST",
      header: app.globalData.header,
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          that.setData({
            content:''
          });
          app.alertModal("反馈成功","感谢你的宝贵意见,我会尽快给你回复");
        } else {
          app.alertModal("反馈失败",res.msg);
        }
      }
    })
  }

})