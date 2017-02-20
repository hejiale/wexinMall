// pages/store/store.js
var app = getApp();

Page({
  data: {
    storeList: [],
    showLogin: 'show',
    showStore: 'hide'
  },
  onShow: function () {
    // 页面显示
    var that = this;
    wx.getStorage({
      key: 'isBindPhone',
      success: function (res) {
        console.log(res)
        that.setData({
          showStore: res.data ? 'show' : 'hide',
          showLogin: res.data ? 'hide' : 'show'
        })

        if (res.data) {
          app.onLogin(function () {
            wx.request({
              url: app.HostURL + '/wechat/webapp/store/listStore',
              data: {
                sessionId: app.globalData.ipcApp.getSessionID(),
              },
              method: 'POST',
              header: { 'content-type': 'application/json' },
              success: function (res) {
                that.setData({ storeList: res.data.result })
              }
            })
          })
        }
      },
    })
  },
  onSelectStore: function (event) {
    var value = event.currentTarget.dataset.key;
    console.log(value)
    wx.setStorage({
      key: 'store',
      data: value,
      complete: function () {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  onLogin: function () {
    wx.navigateTo({
      url: '../login/login'
    })
  }
})