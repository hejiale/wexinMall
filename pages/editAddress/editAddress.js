// pages/editAddress/editAddress.js
// var utils = require('../../utils/util')
var dataC; // 保存所有城市列表

var allCity; // 保存所有城市列表
var currentProvince; // 滚轮当前指向的省
var currentCity;
var currentArea;
var enterProvince; // 按下确定键后，保存到这里，用于发送请求
var enterCity;
var enterArea;
var app = getApp();

Page({
  data: {
    provinces: [],
    citys: [],
    areas: [],
    showOrHide: 'hide',
    contacter: '',
    contactPhone: '',
    locationStr: '',
    contactAddress: '',
    addressId: '',
    currentAddressObject: null
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      addressId: options.id
    })
    // var dataC = utils.getData();
    // currentProvince = dataC.p[0];

    console.log(this.data.addressId)
    if (this.data.addressId) {
      wx.request({
        url: app.HostURL + '/wechat/webapp/user/getAddress',
        data: {
          id: this.data.addressId,
          sessionId: app.globalData.ipcApp.getSessionID(),
        },
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log(res)
          that.setData({ currentAddressObject: res.data.result })
        },
      })
    }
  },

  onSaveAddress: function () {
    var contactName = this.data.contacter.length > 0 ? this.data.contacter : this.data.currentAddressObject.contactorName
    var phone = this.data.contactPhone.length > 0 ? this.data.contactPhone : this.data.currentAddressObject.contactorPhone
    var address = this.data.contactAddress.length > 0 ? this.data.contactAddress : this.data.currentAddressObject.detailAdress

    if (contactName.length > 0 && phone.length > 0 && address.length > 0) {
      if (this.data.currentAddressObject) {
        wx.request({
          url: app.HostURL + '/wechat/webapp/user/updateAddress',
          data: {
            sessionId: app.globalData.ipcApp.getSessionID(),
            contactorName: contactName,
            contactorPhone: phone,
            detailAdress: address,
            id: this.data.addressId
          },
          method: 'POST',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            console.log(res)
            if (res.data.retCode == 0) {
              wx.showToast({
                title: '更新地址成功'
              })
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      } else {
        console.log(app.globalData.ipcApp.getSessionID())

        wx.request({
          url: app.HostURL + '/wechat/webapp/user/saveAddress',
          data: {
            sessionId: app.globalData.ipcApp.getSessionID(),
            contactorName: contactName,
            contactorPhone: phone,
            detailAdress: address
          },
          method: 'POST',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            console.log(res)
            if (res.data.retCode == 0) {
              wx.showToast({
                title: '新建地址成功'
              })
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    }
  },
  onSetDefaultAddress: function (event) {
    wx.request({
      url: app.HostURL + '/wechat/webapp/user/setCurrentAddress',
      data: {
        sessionId: app.globalData.ipcApp.getSessionID(),
        id: this.data.addressId
      },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res)
        if (res.data.retCode == 0) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },

  onDeleteAddress: function () {
    wx.request({
        url: app.HostURL + '/wechat/webapp/user/deleteAddress',
        data: {
          sessionId: app.globalData.ipcApp.getSessionID(),
          id: this.data.addressId
        },
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log(res)
          if (res.data.retCode == 0) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
  },

  bindContacterInput: function (e) {
    var that = this;
    that.setData({ contacter: e.detail.value })
  },

  bindContacterPhoneInput: function (e) {
    var that = this;
    that.setData({ contactPhone: e.detail.value })
  },

  bindContacterAddressInput: function (e) {
    var that = this;
    that.setData({ contactAddress: e.detail.value })
  }

  // choosearea: function () { // 页面弹框触发事件
  //   var dataC = utils.getData();

  //   if (!currentProvince) {
  //     currentProvince = dataC.p[0];
  //     console.log(currentProvince);
  //     currentCity = dataC.c[currentProvince][0];
  //     currentArea = dataC.a[currentCity][0];
  //   }
  //   this.setData({
  //     showOrHide: 'show',
  //     provinces: dataC.p,
  //     citys: dataC.c[currentProvince],
  //     areas: dataC.a[currentCity]
  //   })
  // },

  // scrollProvince: function (e) {
  //   var dataC = utils.getData();
  //   var dY = e.detail.scrollTop;
  //   var a = Math.round(dY / 20); // 移动的整位
  //   currentProvince = dataC.p[a]; // 选中的省
  //   currentCity = dataC.c[currentProvince][0] // 选中的城市
  //   currentArea = dataC.a[currentCity][0]; // 选中的区
  //   this.setData({
  //     citys: dataC.c[currentProvince],
  //     areas: dataC.a[currentCity]
  //   })
  // },
  // scrollCity: function (e) {
  //   var dataC = utils.getData();
  //   var dY = e.detail.scrollTop;
  //   var a = Math.round(dY / 20); // 移动的整位
  //   currentCity = dataC.c[currentProvince][a] // 选中的城市
  //   currentArea = dataC.a[currentCity][0]; // 选中的区
  //   this.setData({
  //     areas: dataC.a[currentCity]
  //   })
  // },
  // scrollArea: function (e) {
  //   var dataC = utils.getData();
  //   var dY = e.detail.scrollTop;
  //   var a = Math.round(dY / 20); // 移动的整位
  //   currentArea = dataC.a[currentCity][a]; // 选中的区
  // },
  // cancelPick: function () {
  //   this.setData({
  //     showOrHide: 'hide'
  //   })
  // },
  // enterPick: function () {
  //   enterProvince = currentProvince;
  //   enterCity = currentCity;
  //   enterArea = currentArea;
  //   this.setData({
  //     showOrHide: 'hide',
  //     locationStr: enterProvince + "  " + enterCity + "  " + enterArea
  //   })
  // }
})