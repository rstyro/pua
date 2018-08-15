// pages/me/about/about.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      userPath: "https://lrshuai.top/images/logo.jpg",
      nickName: "帅大叔",
    },
      aboutInfo: [
        { text: "编写这个小程序呢，先是感兴趣，其次就是为了学习，最后是帮我自己找到女朋友！" },
        { text: "2018年 全球怎么也有大约70-80亿的人口，你说就认识那么几个人，你甘心吗？？？" },
        { text: "美国著名成功学大师戴尔•卡耐基经过长期研究得出结论说：'专业知识在一个人成功中的作用只占15％，而其余的85％则取决于人际关系。'" },
        { text: "很多行业在工作中本来接触的圈子就很小了，平常的时候也没主动出去接触，那么长期下来可能说话能力退化，害怕与陌生人接触，内向，孤僻....." },
        { text: "为什么呢，因为和别人聊天的时候，你除了聊工作然后就没有然后了，独来独往习惯了你说能不内向吗，不错说的就是我自己。" },
        { text: "别人见光死，我是聊天死。这个小程序的就是为了解决不会聊天而产生的！！！" }
      ],
      aboutMe: [{ text:"性别男，身高173，体重60kg，来自广西壮族自治区90后的白羊座。性格，话不多但好相处。"}]
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