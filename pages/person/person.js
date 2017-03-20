// pages/person/person.js
var app = getApp();
Page({
  data: {
    userInfo: null,
    showLogin: 'show',
    showPerson: 'hide',
    bindPhone: ''
  },
  onHeadClicked: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        var formData = new FormData();
        formData.append('img', tempFilePaths[0]);

        var parameter = new Object();
        parameter.api_key = 'AaLAVv-OM4N02JUsnP-vvQELCqtd3_zB';
        parameter.api_secret = 'ZCyXoZMxdRJF4RU_21SBzIO6GZJV8LdE';

        wx.request({
          url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
          data: parameter,
          method: 'POST',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            console.log(res)
          },
        })
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
                userInfo: userInfo,
                bindPhone: app.globalData.ipcApp.getBindPhone()
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