// pages/login/login.js
var app = getApp()

Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '微信授权登录'
    })
  },
  onCancle: function () {
    wx.navigateBack({
      delta: 0,
    })
  },
  onSure: function () {
    wx.showToast({
      title: '登录中...',
      icon: 'loading',
      duration: 10000
    })

    var that = this;
    app.onBindLogin(function (loginInfo) {
      if (loginInfo.data.retCode == 0) {
        //保存全局变量
        if (loginInfo.data.result.phone == '') {
          wx.showModal({
            title: '',
            content: '检测到您的帐号还未绑定手机号，请绑定手机号',
            confirmText: '绑定手机',
            confirmColor: '#63a0d4',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../bindPhone/bindPhone'
                })
              }
            }
          })
        } else {
          wx.setStorage({
            key: 'isBindPhone',
            data: true
          })
          wx.navigateBack({
            delta: 1
          })
        }
        wx.hideToast();

        var ipcApp = app.globalData.ipcApp
        ipcApp.setSessionID(loginInfo.data.result.sessionId)

      } else {
        wx.showToast({
          title: '登录失败'
        })
      }
    })
  }
})