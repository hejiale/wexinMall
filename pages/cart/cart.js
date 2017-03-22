// pages/cart/cart.js
var app = getApp();

Page({
  data: {
    showContent: 'hide',
    showLogin: 'hide',
    allCartList: [],
    canEdit: false,
    isChooseAll: false,
    totalPrice: 0
  },
  onLoad: function (options) {
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

    var value = wx.getStorageSync('isBindPhone');
    if (!value) {
      that.setData({
        showContent: 'hide',
        showLogin: 'show'
      })
    }

    wx.getStorage({
      key: 'isBindPhone',
      success: function (res) {
        if (res) {
          that.setData({
            showContent: 'show',
            showLogin: 'hide'
          })
        }

        if (res.data) {
          if (app.globalData.ipcApp.getSessionID() == '' || !app.globalData.ipcApp.getSessionID()) {
            app.onLogin(function () {
            })
          }
        }
      },
    })

    wx.getStorage({
      key: 'allCart',
      success: function (res) {
        that.setData({ allCartList: res.data })
        that.onTotalPrice();

        if (res.data.length <= 0) {
          that.setData({
            canEdit: false,
            isChooseAll: false
          })
        } else {
          var selectCount = 0;
          for (var i = 0; i < res.data.length; i++) {
            var cart = res.data[i];
            if (cart.isSelected) {
              selectCount++;
            }
          }
          if (selectCount == res.data.length) {
            that.setData({ isChooseAll: true });
          } else {
            that.setData({ isChooseAll: false });
          }
        }
      },
    })
  },
  onTapEdit: function () {
    this.setData({
      canEdit: !this.data.canEdit
    })
  },
  onSelected: function (event) {
    var that = this;
    var value = event.currentTarget.dataset.key;
    value.isSelected = !value.isSelected;
    var allCart = wx.getStorageSync('allCart');
    if (allCart.length > 0) {
      var cartIndex = 0;
      for (var i = 0; i < allCart.length; i++) {
        var cart = allCart[i];
        if (cart.productId == value.productId) {
          cartIndex = i;
        }
      }
      allCart.splice(cartIndex, 1, value);
      wx.setStorageSync('allCart', allCart);
      that.onShow();
    }
  },
  onTotalPrice: function () {
    var that = this;
    that.setData({ totalPrice: 0 });
    var allCart = wx.getStorageSync('allCart');
    var totalValue = 0;
    for (var i = 0; i < allCart.length; i++) {
      var cart = allCart[i];
      if (cart.isSelected) {
        totalValue = totalValue + (cart.price * cart.count);
      }
    }
    that.setData({ totalPrice: totalValue });
  },
  onChooseAll: function () {
    var that = this;
    that.setData({
      isChooseAll: !that.data.isChooseAll
    })
    var allCart = wx.getStorageSync('allCart');
    for (var i = 0; i < allCart.length; i++) {
      var cart = allCart[i];
      cart.isSelected = that.data.isChooseAll;
      allCart.splice(i, 1, cart);
    }
    wx.setStorageSync('allCart', allCart);
    that.onShow();

  },
  onCancel: function () {
    this.setData({
      canEdit: !this.data.canEdit
    })
  },
  onReduce: function (event) {
    var that = this;
    var value = event.currentTarget.dataset.key;
    if (value.count <= 1) {
      value.count = 0;
    } else {
      value.count--;
    }

    var allCart = wx.getStorageSync('allCart');
    if (allCart.length > 0) {
      var cartIndex = 0;
      for (var i = 0; i < allCart.length; i++) {
        var cart = allCart[i];
        if (cart.productId == value.productId) {
          cartIndex = i;
        }
      }
      if (value.count == 0) {
        allCart.splice(cartIndex, 1);
      } else {
        allCart.splice(cartIndex, 1, value);
      }

      wx.setStorageSync('allCart', allCart);
      that.onShow();
    }
  },
  onCrease: function (event) {
    var that = this;
    var value = event.currentTarget.dataset.key;
    value.count++;

    var allCart = wx.getStorageSync('allCart');
    if (allCart.length > 0) {
      var cartIndex = 0;
      for (var i = 0; i < allCart.length; i++) {
        var cart = allCart[i];
        if (cart.productId == value.productId) {
          cartIndex = i;
        }
      }
      allCart.splice(cartIndex, 1, value);
      wx.setStorageSync('allCart', allCart);
      that.onShow();
    }
  },
  onDelete: function () {
    var that = this;
    var allCart = wx.getStorageSync('allCart');
    if (allCart.length > 0) {
      for (var index in allCart) {
        var cart = allCart[index];
        if (cart.isSelected) {
          allCart.splice(index, 1)
        }
      }
      for (var index in allCart) {
        var cart = allCart[index];
        if (cart.isSelected) {
          allCart.splice(index, 1)
        }
      }
      wx.setStorageSync('allCart', allCart);
      that.onShow();
    }
  },
  onBook: function () {
    var that = this;
    var selectedCount = 0;

    var allCart = wx.getStorageSync('allCart');
    if (allCart.length > 0) {
      for (var index in allCart) {
        var cart = allCart[index];
        if (cart.isSelected) {
          selectedCount++;
        }
      }
    }
    if (selectedCount > 0) {
      wx.navigateTo({
        url: '../bookOrder/bookOrder?hasDetail=0&isCart=1'
      })
    } else {
      wx.showToast({
        title: '未选中任何商品!'
      })
    }
  }
})