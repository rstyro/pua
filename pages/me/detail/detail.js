// pages/me/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.userInfo
    });
  },
  onShow:function(){
    this.setData({
      userInfo: app.userInfo
    });
  },
  editInfo:function(){
    if (this.data.userInfo.user_id != '') {
      wx.navigateTo({
        url: '../edituser/edit'
      })

    }
  },
  viewPath:function(e){
    var paths = e.currentTarget.dataset.path;
    wx.previewImage({
      urls: [paths]
    })
  }

})