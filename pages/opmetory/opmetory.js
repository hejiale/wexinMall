// pages/person/opmetory/opmetory.js
var app = getApp();

Page({
  data: {
    opmetoryList: [],
    isSelect: 'hide',
    selectOpmetory: ''
  },
  onLoad: function (options) {
    if (options.isSelect == 1) {
      this.setData({ isSelect: 'show' })
    }
  },

  onShow: function () {
    var that = this;

    wx.getStorage({
      key: 'opmetory',
      success: function (res) {
        if (res.data) {
          that.setData({ selectOpmetory: res.data.id });
        }
      }
    })


    wx.request({
      url: app.HostURL + '/wechat/webapp/user/listOptometry',
      data: {
        pageNo: '1',
        maxPageSize: '10000',
        sessionId: app.globalData.ipcApp.getSessionID(),
      },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res)
        if (res.data.retCode == 0) {
          that.setData({ opmetoryList: res.data.result.resultList })
        }
      }
    })
  },
  onSelectOpmetory: function (event) {
    var value = event.currentTarget.dataset.key;
    wx.setStorage({
      key: 'opmetory',
      data: value,
      success: function (res) {
        wx.navigateBack({ delta: 1 })
      },
    })
  }
})