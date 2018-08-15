// pages/me/message/message.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    operateWidth: 350,
    lastIndex:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMsgList();
    this.initEleWidth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getMsgList:function(){
    var pages = getCurrentPages();
    console.log("pages", pages);
    var prePage = null;
    if (pages.length > 1) {
      //上一个页面实例对象
      prePage = pages[pages.length - 2];
    } else {
      prePage = pages[0];
    }
    console.log("pre list:",prePage.data.msgList);
    var msgList = prePage.data.msgList;
    for(var i=0;i<msgList.length;i++){
      msgList[i].txtStyle="";
    }
    this.setData({
      list: msgList
    });
    console.log("data-list",this.data.list);
  },
  openMsg:function(e){
    var index = e.currentTarget.dataset.index;
    var temList = this.data.list;
   var that =this;
    console.log("obj=",this.data.list[index]);
    wx.showModal({
      title: temList[index].title,
      content: temList[index].msg_content,
      showCancel:false,
      success: function (res) {
        if (res.confirm) {
          temList[index].read_flag = 1;
          that.setData({
            list: temList
          });
          //发送请求标记为已读
          that.tabSysMsgRead(temList[index].msg_id,'')
        } 
      }
    })
  },
  tabSysMsgRead:function(msgId,isDel){
    wx.request({
      url: app.globalData.url + '/public/tabSysMsgRead',
      data: {
        msg_id: msgId,
        is_del: isDel
      },
      dataType: "json",
      method: "POST",
      header: app.globalData.header,
      success: function (res) {
        if(res.data.status != 200){
          app.alertToast(res.data.msg);
        }else{
          console.log("ok");
        }
      }
    })
  },
  tabMsgRead:function(e){
    var index = e.currentTarget.dataset.index;
    var temList = this.data.list;
    console.log("tab temList=",temList[index]);
    //发送请求标记为已读
    this.tabSysMsgRead(temList[index].msg_id, '')
    temList[index].read_flag = 1;
    temList[index].txtStyle = "left:0px";
    this.setData({
      list: temList
    });
  },
  delMsgRead:function(e){
    var index = e.currentTarget.dataset.index;
    var temList = this.data.list;
    console.log("del temList=", temList[index]);
    this.tabSysMsgRead(temList[index].msg_id, 1);
    temList.splice(index, 1);
    this.setData({
      list: temList
    });
  },
  //手指触摸动作开始
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });

    }

  },
  //手指触摸后移动
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var operateWidth = this.data.operateWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if(disX > 0){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= operateWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + operateWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },

 // 手指触摸动作结束
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var operateWidth = this.data.operateWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > operateWidth / 2 ? "left:-" + operateWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      if (this.data.lastIndex != -1 && this.data.lastIndex != index){
        try{
          list[this.data.lastIndex].txtStyle = "left:0px";
        }catch(e){
          this.data.lastIndex = -1
        }
      }
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list,
        lastIndex: index
      });
    }
  },
  //获得自适应高度的比例，然后返回真正的宽度
   getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      //以宽度750px设计稿做宽度的自适应
      var scale = (700 / 2) / (w / 2);
      real = Math.floor(res / scale);
     return real;
    } catch (e) {
      return false;
    }

  },
  //赋值真正的宽度
  initEleWidth: function () {
    var operateWidth = this.getEleWidth(this.data.operateWidth);
    this.setData({
      operateWidth: operateWidth
    });

  },

})