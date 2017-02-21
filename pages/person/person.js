// pages/person/person.js
var app = getApp();
Page({
  data: {
    userInfo: null,
    showLogin: 'show',
    showPerson: 'hide',
  },

  onLoad: function (options) {
  },

  onHeadClicked: function () {
    wx.chooseImage({
      count: 9, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
      }
    })
  },

  onLogin: function () {
    wx.navigateTo({
      url: '../login/login'
    })
  },
  onShow: function () {
    // 页面显示
    var that = this;
    var ipcApp = app.globalData.ipcApp

    wx.getStorage({
      key: 'isBindPhone',
      success: function (res) {
        if (res) {
          that.setData({
            showPerson: 'show',
            showLogin: 'hide'
          })
        } else {
          that.setData({
            showPerson: 'hide',
            showLogin: 'show'
          })
        }

        if (res.data) {
          if (that.data.userInfo == null) {
            wx.showToast({
              title: '加载中...',
              icon: 'loading',
              duration: 10000
            })

            app.getUserInfo(function (userInfo) {
              that.setData({
                userInfo: userInfo
              })
              wx.hideToast();
            })

            app.onLogin(function () {

            })
          }
        }
      },
    })
  }
})