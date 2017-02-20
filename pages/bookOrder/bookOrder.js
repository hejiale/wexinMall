// pages/bookOrder/bookOrder.js
var app = getApp();

Page({
  data: {
    userInfo: {},
    hasDetail: false,
    bookDetail: null,
    showFoot: 'hide',
    productList: [],
    bindPhone: '',
    storeId: '',
    storeName: '',
    storeAddress: '',
    storePhone: '',
    isBookOpmetory: true,
    isFromCart: false,
    customerGenger: '',
    customerName: '',
    customerPhoto: '',
    isShowOpmetory: 'hide',
    defaultOpmetory: null
  },
  onLoad: function (options) {
    var that = this;
    if (options.hasDetail == '1') {
      //我的预约 订单详情
      that.setData({ showFoot: 'hide', hasDetail: true })
      wx.request({
        url: app.HostURL + '/wechat/webapp/order/getOrder',
        data: {
          sessionId: app.globalData.ipcApp.getSessionID(),
          id: options.id
        },
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          // success
          console.log(res)
          that.setData({
            bookDetail: res.data.result,
            bindPhone: res.data.result.customerPhone,
            customerName: res.data.result.customerName,
            customerPhoto: res.data.result.photoURL,
            storeName: res.data.result.storeName,
            storeAddress: res.data.result.storeAddress,
            storePhone: res.data.result.storePhone
          })

          if (res.data.result.customerGenger != 'NOTSET') {
            that.setData({
              customerGenger: (res.data.result.customerGenger == 'MALE' ? '男' : '女')
            })
          }

          if (res.data.result.appointmentOrderType == 'WITH_OPTOMETRY') {
            var opmetory = new Object();
            opmetory.distance = res.data.result.distance;
            opmetory.sphLeft = res.data.result.sphLeft;
            opmetory.sphRight = res.data.result.sphRight;
            opmetory.cylLeft = res.data.result.cylLeft;
            opmetory.cylRight = res.data.result.cylRight;
            opmetory.axisLeft = res.data.result.axisLeft;
            opmetory.axisRight = res.data.result.axisRight;
            opmetory.addLeft = res.data.result.addLeft;
            opmetory.addRight = res.data.result.addRight;
            opmetory.correctedVisionLeft = res.data.result.correctedVisionLeft;
            opmetory.correctedVisionRight = res.data.result.correctedVisionRight;
            that.setData({ isBookOpmetory: false, defaultOpmetory: opmetory,isShowOpmetory:'show'});
          } else {
            that.setData({ isBookOpmetory: true })
          }

          var products = res.data.result.orderDetails;
          var list = new Array();

          for (var i = 0; i < products.length; i++) {
            var product = products[i]
            var productObj = new Object()
            productObj.thumbURL = product.thumbURL;
            productObj.name = product.productDesc;
            productObj.price = product.productPrice;
            productObj.count = product.productCount;
            list.push(productObj)
          }
          that.setData({ productList: list })
        }
      })
    } else {
      that.setData({ showFoot: 'show', hasDetail: false })
      wx.getStorage({
        key: 'store',
        success: function (res) {
          that.setData({
            bindPhone: app.globalData.ipcApp.getBindPhone(),
            storeId: res.data.storeId,
            storeName: res.data.storeName,
            storeAddress: res.data.storeAddress,
            storePhone: res.data.storePhone
          })
        }
      })

      if (options.isCart == '1') {
        //购物车加入的商品
        wx.getStorage({
          key: 'allCart',
          success: function (res) {
            var value = res.data;
            var list = new Array();
            for (var i = 0; i < value.length; i++) {
              var cart = value[i];
              if (cart.isSelected) {
                var productObj = new Object()
                productObj.thumbURL = cart.image;
                productObj.name = cart.name;
                productObj.price = cart.price;
                productObj.count = cart.count;
                productObj.type = cart.type;
                productObj.proId = cart.productId;
                list.push(productObj);
                that.setData({ productList: list, isFromCart: true });
              }
            }
          },
        })
      } else {
        //立即预约时加入的商品
        wx.getStorage({
          key: 'product',
          success: function (res) {
            console.log(res)
            var list = new Array();
            var productObj = new Object()
            productObj.thumbURL = res.data.photos['缩略图'].photoLinkNormal;
            productObj.name = res.data.name;
            productObj.price = res.data.suggestPrice;
            productObj.count = 1;
            productObj.proId = res.data.id;
            if (res.data.glassesType == 'LENS' || res.data.glassesType == 'CONTACT_LENSES') {
              productObj.type = 'lens'
            }
            else if (res.data.glassesType == 'ACCESSORY') {
              productObj.type = 'accessory'
            } else {
              productObj.type = 'glasses'
            }
            list.push(productObj)
            that.setData({ productList: list })
          },
        })
      }
      app.getUserInfo(function (userInfo) {
        console.log(userInfo);
        if (userInfo.gender == 1) {
          that.setData({ customerGenger: '男' });
        } else {
          that.setData({ customerGenger: '女' });
        }
        that.setData({
          userInfo: userInfo,
          customerName: userInfo.nickName,
          customerPhoto: userInfo.avatarUrl,
        })
      })
    }
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'opmetory',
      success: function (res) {
        var opmetory = res.data;
        if (opmetory && !that.data.isBookOpmetory) {
          that.setData({ isShowOpmetory: 'show', isBookOpmetory: false, defaultOpmetory: opmetory })
        } else {
          that.setData({ isShowOpmetory: 'hide', isBookOpmetory: true, defaultOpmetory: null })
        }
      }
    })
  },
  onBookOpmetory: function () {
    var that = this;
    if (!that.data.hasDetail) {
      that.setData({ isBookOpmetory: true });
    }
    that.onShow();
  },
  onSelectOpmetory: function () {
    var that = this;
    if (!that.data.hasDetail) {
      that.setData({ isBookOpmetory: false })
      wx.navigateTo({
        url: '../opmetory/opmetory?isSelect=1'
      })
    }
  },
  onBookOrderClicked: function () {
    var that = this;
    var list = that.data.productList;
    var totalPrice = 0;
    var productDetails = new Array();

    for (var i = 0; i < list.length; i++) {
      var product = list[i];
      totalPrice = totalPrice + (product.price * product.count);

      var proObject = new Object();
      proObject.productType = product.type;
      proObject.productCount = product.count;
      proObject.productPrice = product.price;
      proObject.productId = product.proId;
      productDetails.push(proObject);
    }
    //判断是否已选择验光单
    if (that.data.isBookOpmetory) {
      //预约验光
      var responseObject = {
        sessionId: app.globalData.ipcApp.getSessionID(),
        storeId: that.data.storeId,
        customerName: that.data.userInfo.nickName,
        customerPhone: that.data.bindPhone,
        photoURL: that.data.userInfo.avatarUrl,
        totalPrice: totalPrice,
        orderDetails: productDetails,
        customerGenger: (that.data.userInfo.gender == 1 ? 'MALE' : 'FEMALE'),
        appointmentOrderType: 'NO_OPTOMETRY'
      };

      wx.request({
        url: app.HostURL + '/wechat/webapp/order/addOrder',
        data: responseObject,
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log(res)
          if (res.data.retCode == 0) {
            that.onBack(productDetails);
          }
        }
      })
    } else {
      //已有验光
      wx.getStorage({
        key: 'opmetory',
        success: function (res) {
          var opmetory = res.data;
          if (opmetory && !that.data.isBookOpmetory) {
            var responseObject = {
              sessionId: app.globalData.ipcApp.getSessionID(),
              storeId: that.data.storeId,
              customerName: that.data.userInfo.nickName,
              customerPhone: that.data.bindPhone,
              photoURL: that.data.userInfo.avatarUrl,
              totalPrice: totalPrice,
              orderDetails: productDetails,
              customerGenger: (that.data.userInfo.gender == 1 ? 'MALE' : 'FEMALE'),
              appointmentOrderType: 'WITH_OPTOMETRY',
              distance: opmetory.distance,
              sphLeft: opmetory.sphLeft,
              sphRight: opmetory.sphRight,
              cylLeft: opmetory.cylLeft,
              cylRight: opmetory.cylRight,
              axisLeft: opmetory.axisLeft,
              axisRight: opmetory.axisRight,
              addLeft: opmetory.addLeft,
              addRight: opmetory.addRight,
              correctedVisionLeft: opmetory.correctedVisionLeft,
              correctedVisionRight: opmetory.correctedVisionRight
            };
            wx.request({
              url: app.HostURL + '/wechat/webapp/order/addOrder',
              data: responseObject,
              method: 'POST',
              header: { 'content-type': 'application/json' },
              success: function (res) {
                console.log(res)
                if (res.data.retCode == 0) {
                  that.onBack(productDetails);
                }
              }
            })
          } else {
            wx.showToast({
              title: '请选择有效的验光单',
              duration: 2000
            })
          }
        }
      })
    }
  },
  onBack: function (productDetails) {
    var that = this;
    wx.showToast({
      title: '预约成功',
      icon: 'success',
      duration: 2000
    })

    wx.navigateBack({
      delta: 1,
      success: function (res) {
        if (that.data.isFromCart) {
          wx.getStorage({
            key: 'allCart',
            success: function (res) {
              var allCart = res.data;
              for (var i = 0; i < productDetails.length; i++) {
                var product = productDetails[i];
                for (var j = 0; j < allCart.length; j++) {
                  var cart = allCart[j];
                  if (product.productId == cart.productId) {
                    allCart.splice(j, 1);
                  }
                }
              }
              wx.setStorageSync('allCart', allCart);
            }
          })
        }
      }
    })
  }
})