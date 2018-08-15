
var WxSearch = require('../templates/wxSearchView/wxSearchView.js');
const app = getApp();
Page({
  data: {

  },
  onLoad: function (options) {
    console.log("options", options);
    // 2 搜索栏初始化
    var that = this;
    WxSearch.init(
      that,  // 本页面一个引用
      [], // 热点搜索推荐，[]表示不使用
      ['笑话', '嫁给你', '丑不丑'],// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction, //提供一个返回回调函数
      options.kw
    );
  },
  // 3 转发函数，固定部分，直接拷贝即可
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 4 搜索回调函数  
  mySearchFunction: function (value) {
    console.log("search-key:"+value);
    wx.navigateBack({
      url: '../index/index',
      complete: this.reloadListData(value)
    })
  },

  // 5 返回回调函数
  myGobackFunction: function () {
    wx.navigateBack({
      url: '../index/index',
      complete: this.reloadListData("")
    })
  },
  //刷新上一个页面的数据
  reloadListData: function (kw) {
    console.log("reload kw:"+kw);
    var pages = getCurrentPages();
    console.log("pages", pages);
    var prePage = null;
    if (pages.length > 1) {
      //上一个页面实例对象
      prePage = pages[pages.length - 2];
    } else {
      prePage = pages[0];
    }
    prePage.data.list = [];
    prePage.data.url = app.globalData.url + '/speechcraft/list';
    prePage.data.page.page_no = 1;
    prePage.data.page.page_total = 1;
    prePage.data.kw = kw;
    prePage.data.isEnd=false; 
    prePage.requestData(prePage.data.url, prePage.data.page.page_no, prePage.data.page.page_size, kw, prePage.data.speechcraftType);
  }

  
})