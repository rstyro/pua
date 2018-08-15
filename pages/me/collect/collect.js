// pages/me/collect/collect.js
const app = getApp();

Page({
  data: {
    page: { page_no: 1, page_size: 5, page_total: 1 },
    items: [],
    hasItem:false,
    startX: 0, //开始坐标
    startY: 0

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollectData()
  },
  //获取收藏的数据
  getCollectData: function () {
    console.log("app.globalData.header", app.globalData.header);
    var that = this;
    wx.request({
      url: app.globalData.url + '/speechcraft/getUserCollectList',
      dataType: "json",
      data: {
        page_no: that.data.page.page_no,
        page_size: that.data.page.page_size
      },
      method: "GET",
      header: app.globalData.header,
      success: function (res) {
        console.log("collect-data=", res);
        var list = res.data.data;
        var hasItem=false;
        if(list.length > 0){
          hasItem=true;
        }
        that.setData({
          items: list,
          hasItem: hasItem
        });
      }
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var speechcraftId = e.currentTarget.dataset.speechcraft_id;
          var delIndex = e.currentTarget.dataset.index;
          // 用户点击了确定 可以调用删除方法了     
          that.delCollect(speechcraftId, delIndex);
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  delCollect: function (speechcraftId, delIndex){
    var that = this;
    console.log("speechcraftId:",speechcraftId);
    wx.request({
      url: app.globalData.url + '/public/collect',
      data: {
        speechcraft_id: speechcraftId
      },
      dataType: "json",
      method: "POST",
      header: app.globalData.header,
      success: function (res) {
        console.log("delCollect res:",res);
        if(res.data.status == 200){
          that.data.items.splice(delIndex, 1)
          that.setData({
            items: that.data.items
          });
        }else{
          app.alertToast(res.data.msg);
        }
      }
    });
  }

})