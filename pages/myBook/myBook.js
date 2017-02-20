// pages/myBook/myBook.js
var app = getApp();

Page({
  data:{
    bookList:[]
  },
  onLoad:function(options){
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;

    wx.request({
      url: app.HostURL + '/wechat/webapp/order/listOrder',
      data: {
        sessionId: app.globalData.ipcApp.getSessionID(),
        pageNo: '1',
        maxPageSize: '10000'
      },
      method: 'POST', 
      header: { 'content-type': 'application/json' }, 
      success: function(res){
        console.log(res)
        that.setData({bookList: res.data.result.resultList})
      }
    })
  },
  onTapBookInfoDetail:function(event){
    console.log(event)
    var value = event.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../bookOrder/bookOrder?hasDetail=1&id=' + value.id
    })
  },
  onCancel: function (event){
    var that = this;
    var value = event.currentTarget.dataset.key;
    wx.request({
      url: app.HostURL + '/wechat/webapp/order/cancelOrder',
      data: {
        id: value.id,
      },
      method: 'POST', 
      header: { 'content-type': 'application/json' },
      success: function(res){
        console.log(res);
        // success
        if(res.data.retCode == 0){
          that.onShow();
        }
      }
    })
  }
})