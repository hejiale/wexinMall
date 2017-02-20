// pages/orderDetail/orderDetail.js
var app = getApp();

Page({
  data: {
    currentOrderNum: '',
    orderDetail: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({ currentOrderNum: options.orderNum })

    wx.request({
      url: app.HostURL + '/wechat/webapp/user/getOrderDetail',
      data: {
        sessionId: app.globalData.ipcApp.getSessionID(),
        orderNumber: this.data.currentOrderNum
      },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res)
        that.setData({orderDetail: res.data.result})
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})