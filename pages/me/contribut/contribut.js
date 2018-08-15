// pages/me/feedback/feedback.js
const app = getApp();
Page({

  data: {
    content: '',
    typeList: [
      { id: "0", name: "", key: "" },
      { id: "1", name: "段子", key: "episode" },
      { id: "2", name: "情话", key: "sayLove" },
      { id: "3", name: "搭讪", key: "accost" },
      { id: "4", name: "鸡汤", key: "chickenSoup" },
      { id: "5", name: "套路", key: "tricks" },
      { id: "6", name: "冷读", key: "coolRead" },
      { id: "7", name: "互动", key: "interact" },
      { id: "8", name: "游戏", key: "game" }
    ],
    index:0
  },
  onLoad: function (options) {

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //提交
  submitContribute: function (e) {
    if(this.data.index == 0){
      app.alertToast("请选择稿子类型");
      return false;
    }
    console.log(e);
    var content = e.detail.value.content;
    if (content) {
      var typeValue = this.data.typeList[this.data.index].key;
      console.log("typeValue",typeValue);
      this.requestContent(content, typeValue);
    } else {
      app.alertToast("请写点内容");
    }

  },
  requestContent: function (content, typeValue) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/public/contribute',
      data: {
        content: content,
        type: typeValue
      },
      dataType: "json",
      method: "POST",
      header: app.globalData.header,
      success: function (res) {
        console.log(res.data);
        if (res.data.status == 200) {
          that.setData({
            content: '',
            index:0
          });
          app.alertModal("感谢您的投稿","审核成功将以系统消息的形式，通知给您。");
          //app.alertToast("感谢您的投稿，审核成功，将以系统通知到您");
        } else {
          app.alertModal("投稿失败",res.msg);
          //app.alertToast(res.msg);
        }
      }
    })
  }

})