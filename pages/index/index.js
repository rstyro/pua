//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    list: [],
    // 这个是以前的版本，不要了
    typeListOld:[
      { id: 0, name: "全部", key: "all" },
      { id: 1, name: "段子", key:"episode"},
      { id: 2, name: "情话", key: "sayLove" },
      { id: 3, name: "搭讪", key: "accost" },
      { id: 4, name: "鸡汤", key: "chickenSoup" },
      { id: 5, name: "套路", key: "tricks" },
      { id: 6, name: "冷读", key: "coolRead" },
      { id: 7, name: "互动", key: "interact" },
      { id: 8, name: "游戏", key: "game" }
    ],
    typeList: [
      { id: 0, name: "情话", key: "sayLove" }
    ],
    kw: "",
    speechcraftType: 'sayLove',
    url: app.globalData.url + '/speechcraft/list',
    page: { page_no: 1, page_size: 20, page_total: 1 },
    isEnd: false,
    currentTab: 'sayLove', //预设当前项的值
    scrollLeft:0, //设定scroll view 向左滑动的距离
    hasData:true,
    slideWidth:150,//滑动的距离
    id:0 //当前的导航栏的 第几项
  },
  onLoad: function () {
    wx.showLoading();
    var that = this;
    if (app.userInfo) {
        that.requestData(that.data.url, that.data.page.page_no, that.data.page.page_size, that.data.kw, that.data.speechcraftType);    
      } else {
        app.autoLogin(function (flag) {
          if (flag) {
            that.requestData(that.data.url, that.data.page.page_no, that.data.page.page_size, that.data.kw, that.data.speechcraftType);
          } else {
            that.alertToast('登陆失败');
          }
          wx.hideLoading();
        });
      }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.requestData(that.data.url, that.data.page.page_no, that.data.page.page_size, that.data.kw, that.data.speechcraftType);
  },
  //更新数据
  changeListData: function (data, kw, speechcraftType) {
    this.setData({
      list: data,
      kw: kw,
      speechcraftType: speechcraftType
    });

  },
  requestData: function (url, pageNo, pageSize, kw, speechcraftType) {
    var that = this;
    if (!this.data.isEnd) {
      if (pageNo > that.data.page.page_total) {
        this.data.isEnd = true;
        app.alertToast("我是有底线的");
        return;
      }
    }
    if (this.data.isEnd) {
      return;
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: {
        page_no: pageNo,
        page_size: pageSize,
        kw: kw,
        type: speechcraftType
      },
      header: app.globalData.header,
      success: function (res) {
        console.log("requestData:",res);
        if (res.data.status == 200) {
          that.data.page.page_total = res.data.page.totalPage;
          if (pageNo > 1) {
            that.data.list = that.data.list.concat(res.data.data);
          } else {
            that.data.list = res.data.data;
          }
          if (that.data.list.length > 0){
           that.setData({
             hasData: true
           });
          }else{
            that.setData({
              hasData:false
            });
          }
          that.changeListData(that.data.list, kw, speechcraftType);
        } else {
          if (res.msg) {
            app.alertToast(res.msg);
          } else {
            app.alertToast("网络异常");
          }
        }

      },
      complete: function () {
        // console.log("请求结束");
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    })



  },
  //点赞操作
  praiseMe: function (event) {
    var _that = this;
    var _tempList = this.data.list;
    var speechcraftId = event.currentTarget.dataset.speechcraft_id;
    var _id = event.currentTarget.dataset._id;
    let currentIndex = this.data.list.findIndex(item => item.speechcraft_id === speechcraftId);
    if (_tempList[currentIndex].praise_flag == 1) {
      app.alertToast('不能重复点赞');
      return;
    }
    var num = _tempList[currentIndex].praise_num;
    _tempList[currentIndex].praise_num = num + 1;
    wx.request({
      url: app.globalData.url + '/public/praise',
      data: {
        table_type: 'speechcraft',
        table_id: speechcraftId,
        _id: _id
      },
      dataType: "json",
      method: "POST",
      header: app.globalData.header,
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          _tempList[currentIndex].praise_flag = !_tempList[currentIndex].praise_flag;
          _that.updateFlag(_tempList, "点赞成功");
        } else {
          app.alertToast(res.msg);
        }
      }
    })

  },
  updateFlag: function (_tempList, msg) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 2000
    })
    this.setData({
      list: _tempList
    });
  },
  //收藏
  collectMe: function (event) {
    var that = this;
    var speechcraftId = event.currentTarget.dataset.speechcraft_id;
    let currentIndex = this.data.list.findIndex(item => item.speechcraft_id === speechcraftId);
    var _tempList = this.data.list;
    wx.request({
      url: app.globalData.url + '/public/collect',
      data: {
        speechcraft_id: speechcraftId
      },
      dataType: "json",
      method: "POST",
      header: app.globalData.header,
      success: function (res) {
        console.log(res.data);
        console.log("code", res.data.status);
        if (res.data.status == 200) {
          // _tempList[currentIndex].collect_flag = !_tempList[currentIndex].collect_flag;
          _tempList[currentIndex].collect_flag = res.data.data.collect_flag;
          if (_tempList[currentIndex].collect_flag) {
            that.updateFlag(_tempList, "收藏成功");
          } else {
            that.updateFlag(_tempList, "取消收藏");
          }
        } else if (res.data.status == 403) {
          console.log("403");
          app.wxLogin();
        } else {
          app.alertToast(res.msg);
          console.log("else");
        }
      }
    });

  },
  shareMe: function (event) {
    app.alertToast("该功能开放");
  },
  searchTab: function () {
    var that = this;
    wx.navigateTo({
      url: '../search/search?kw=' + that.data.kw
    })
  },
  //上拉加载
  onReachBottom: function () {
    this.data.page.page_no = this.data.page.page_no + 1;
    this.requestData(this.data.url, this.data.page.page_no, this.data.page.page_size, this.data.kw, this.data.speechcraftType, this.changeListData);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading();
    this.initParame();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    console.log("swichNav even",e);
    var speechcraftType = e.currentTarget.dataset.current;
    let currentIndex = this.data.typeList.findIndex(item => item.key === speechcraftType);
    this.updateStatus(currentIndex, speechcraftType);
  },
  initParame:function(){
    this.data.list = [];
    this.data.page.page_no = 1;
    this.data.page.page_total = 1;
    this.data.kw = '';
    this.data.isEnd = false;
    this.requestData(this.data.url, this.data.page.page_no, this.data.page.page_size, this.data.kw, this.data.speechcraftType, this.changeListData);
    wx.stopPullDownRefresh();
  },
  updateStatus: function (id,speechcraftType){
    console.log("id=",id);
    if (this.data.currentTab == speechcraftType) {
      return false;
    } else {
      this.setData({
        currentTab: speechcraftType,
        speechcraftType: speechcraftType,
        id, id
      })
    }
    if (speechcraftType == 'all') {
      this.setData({
        speechcraftType: '',
        scrollLeft: 0
      })
    } else if (id >= 4) {
      this.setData({
        scrollLeft: 500
      });
    } else {
      this.setData({
        scrollLeft: 0
      });
    }
    this.initParame();
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

  // 手指触摸动作结束
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      console.log("endX", endX);
      console.log("startX", this.data.startX);
      var slideWidth = this.data.slideWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var id = this.data.id;

      if (disX > 0){//左移
        console.log("左移");
        if (disX > slideWidth/2){
          var next = id + 1;
          console.log("next",next);
          if (next > this.data.typeList.length-1) {
            next = 0;
          }
          var key = this.data.typeList[next].key;
          this.updateStatus(next, key);
        }
      }else if(disX < 0){//右移
        console.log("右移");
        console.log("(0-disX)", (0 - disX));
        console.log("(0-disX) > slideWidth / 2", (0 - disX) > slideWidth / 2);
        if ((0-disX) > slideWidth / 2) {
          var last = id - 1;
          if(last < 0){
            last = this.data.typeList.length-1;
          }
          var key = this.data.typeList[last].key;
          this.updateStatus(last, key);
        } 
      }
      
    }
  },
  onShareAppMessage: function (options){
    var that = this;
    var shareObject = {
      // 默认是小程序的名称(可以写slogan等)
        title:"聊不到另一半算我输",
      shareTicket:"聊不到另一半算我输",
        // 默认是当前页面，必须是以‘/’开头的完整路径
        path:"/pages/study/study",
        success:function(res){
          // 转发成功之后的回调
　　　　　　if (res.errMsg == 'shareAppMessage:ok') {
              console.log("ok share");
　　　　　　}
        },fail: function(){
　　　　　　// 转发失败之后的回调
　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
　　　　　　　　// 用户取消转发
　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
　　　　　　}
　　　　},
        complete: function(){
          console.log("!!!!!");
        }
　　　　
    };
    // 来自页面内的按钮的转发
  　　if (options.from == 'button') {
    　　　　var eData = options.target.dataset;
            console.log("eData:",eData);
    　　　　console.log(eData.name);     // shareBtn
    　　　　// 此处可以修改 shareObj 中的内容
            shareObj.path = '/pages/index/index?id=' + eData.name;
  　　}
    return shareObj;
  }
})
