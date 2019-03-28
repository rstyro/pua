// pages/me/about/about.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      userPath: "https://avatars2.githubusercontent.com/u/16098932?s=460&v=4",
      nickName: "帅大叔",
    },
      aboutInfo: [
        { text: "编写这个小程序呢，先是感兴趣，其次就是为了学习！" },
        { text: "好听的情话，说多了也不会腻，你还对你的爱人吝啬你的赞美吗？" },
      ],
      aboutMe: [{ text:"性别男，身高173，体重60kg，一个码农界的打杂大叔"}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.request();
  },
  request:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + '/public/about',
      data: {},
      header: app.globalData.header,
      success: function (res) {
        console.log("requestData:", res);
        if (res.statusCode == 200) {
          console.log("me",res.data.me);
          console.log("program", res.data.program);
          that.setData({
            aboutMe: res.data.me,
            aboutInfo: res.data.program
          });
        }

      }
    })
  }

})