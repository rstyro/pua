// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWith:0,
    screenHeight:0,
    imgWith:0,
    imgHeight:0,
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenWith:res.windowWidth,
          screenHeight:res.windowHeight
        });
      },
    })
    console.log("screenWith:", that.data.screenWith);
  },
  imageLoad: function(e){
    var that = this;
    var width = e.detail.width;
    var heith = e.detail.height;
    var ratio=width/heith;
    var imgWidth = that.data.screenWith;
   
    var imgHeight = imgWidth/ratio;
    console.log("imgWidth:", imgWidth);
    console.log("imgHeight:", imgHeight);
    this.setData({
      imgWidth: imgWidth,
      imgHeight: imgHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})