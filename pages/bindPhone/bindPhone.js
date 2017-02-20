// pages/bindPhone/bindPhone.js
var total_micro_second = 60 * 1000;

/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second),
  });

  if (total_micro_second <= 0) {
    total_micro_second = 60 * 1000;
    that.setData({
      clock: "获取验证码",
      isSendCode: false
    });
  } else {
    setTimeout(function () {
      total_micro_second -= 10;
      count_down(that);
    }
      , 10)
  }
}

function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  return sec + 'S'
}

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

var app = getApp();

Page({
  data: {
    isSendCode: false,
    isCanBind: false,
    bindPhone: '',
    bindCode: '',
    clock: '获取验证码'
  },
  onBindPhone: function (e) {
    var that = this;
    if (that.data.isCanBind) {
      wx.request({
        url: app.HostURL + '/wechat/webapp/bindPhone',
        data: {
          validateCode: that.data.bindCode,
          phone: that.data.bindPhone,
          sessionId: app.globalData.ipcApp.getSessionID()
        },
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          // success
          console.log(res)
          if (res.data.retCode == 0) {
            wx.setStorage({
              key: 'isBindPhone',
              data: true
            })
            wx.navigateBack({
              delta: 2
            })
          } else {
            wx.showToast({
              title: res.data.retMsg
            })
          }
        }
      })
    }
  },
  onSendCode: function () {
    if (this.data.bindPhone.length == 0) {
      wx.showToast({ title: '请输入有效手机号' })
      return
    }
    var that = this;
    if (!that.data.isSendCode) {
      wx.request({
        url: app.HostURL + '/wechat/webapp/sendCode',
        data: {
          phone: that.data.bindPhone,
          sessionId: app.globalData.ipcApp.getSessionID()
        },
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log(res)
          if (res.data.retCode == 0) {
            count_down(that);
            that.setData({ isSendCode: true })
            wx.showModal({
              showCancel: false,
              content: '手机验证码发送成功，请注意查收短信!'
            })
          } else {
            wx.showToast({
              title: res.data.retMsg
            })
          }
        }
      })
    }
  },
  onPhoneTextFieldChange: function (e) {
    var that = this;
    that.setData({ bindPhone: e.detail.value })
    that.onCheckBindStatus()
  },
  onCodeTextFieldChange: function (e) {
    var that = this;
    that.setData({ bindCode: e.detail.value })
    that.onCheckBindStatus()
  },
  onCheckBindStatus: function () {
    var that = this;
    if (this.data.bindPhone.length > 0 && this.data.bindCode.length > 0) {
      that.setData({ isCanBind: true })
    } else {
      that.setData({ isCanBind: false })
    }
  },
  onUnload: function () {
    // 页面关闭
    var that = this;
    that.setData({
      isCanBind: false,
      isSendCode: false,
      bindPhone: '',
      bindCode: '',
      clock: '获取验证码'
    })
  }
})