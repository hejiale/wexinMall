// pages/person/order/order.js
var app = getApp();

Page({
  data: {
    orderList: []
  },
  onLoad: function (options) {
  },

  onOrderDetail: function (event) {
    var value = event.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderNum=' + value.orderNumber
    })

  },
  onShow: function () {
    var that = this;

    wx.request({
      url: app.HostURL + '/wechat/webapp/user/listHistoryOrders',
      data: {
        pageNo: '1',
        maxPageSize: '1000000',
        sessionId: app.globalData.ipcApp.getSessionID(),
      },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res)
        that.setData({ orderList: res.data.result.resultList })
      }
    })
  }
})