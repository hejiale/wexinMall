//app.js
var ipcApp = require('utils/icepointcloud.js')

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


  },
  onLogin: function (cb) {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.HostURL + '/wechat/webapp/login',
          data: { code: res.code },
          method: 'POST',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            if (res.data.result) {
              that.globalData.ipcApp.setSessionID(res.data.result.sessionId)
              that.globalData.ipcApp.setBindPhone(res.data.result.phone)
            }
            typeof cb == "function" && cb()
          }
        })
      }
    })
  },
  onBindLogin: function (cb) {
    var that = this;
    if (that.globalData.loginInfo) {
      typeof cb == "function" && cb(that.globalData.loginInfo)
    } else {
      wx.login({
        success: function (res) {
          wx.request({
            url: that.HostURL + '/wechat/webapp/login',
            data: { code: res.code },
            method: 'POST',
            header: { 'content-type': 'application/json' },
            success: function (res) {
              that.globalData.loginInfo = res
              typeof cb == "function" && cb(that.globalData.loginInfo)
            }
          })
        }
      })
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getSystemInfo: function (cb) {
    var that = this;
    if (this.globalData.systemInfo) {
      typeof cb == "function" && cb(this.globalData.systemInfo)
    }
    else {
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.systemInfo = res;
          typeof cb == "function" && cb(that.globalData.systemInfo)
        }
      })
    }
  },

  HostURL: 'https://wechat.icepointcloud.com',

  globalData: {
    userInfo: null,
    systemInfo: null,
    ipcApp: ipcApp,
    loginInfo: null,
  }
})