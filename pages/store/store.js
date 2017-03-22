// pages/store/store.js
var app = getApp();

Page({
  data: {
    storeList: [],
    showLogin: 'hide',
    showStore: 'hide'
  },
  onShow: function () {
    // 页面显示
    var that = this;

    var value = wx.getStorageSync('isBindPhone');
    if (!value) {
      that.setData({
        showStore: 'hide',
        showLogin: 'show'
      })
    }

    wx.getStorage({
      key: 'isBindPhone',
      success: function (res) {
        console.log(res)

        if (res.data) {
          that.setData({
            showStore: 'show',
            showLogin: 'hide'
          })

          app.onLogin(function () {
            wx.request({
              url: app.HostURL + '/wechat/webapp/store/listStore',
              data: {
                sessionId: app.globalData.ipcApp.getSessionID(),
              },
              method: 'POST',
              header: { 'content-type': 'application/json' },
              success: function (res) {
                console.log(res)
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