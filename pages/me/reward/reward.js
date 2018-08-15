// pages/me/reward/reward.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: app.globalData.url +"/upload/images/reward.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  viewImg: function (e) {
    wx.previewImage({
      current:  this.data.path,
      urls: [ this.data.path]
    })
  }
})