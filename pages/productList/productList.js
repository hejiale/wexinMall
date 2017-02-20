// pages/productList/productList.js
var app = getApp()

Page({
  data: {
    productList: [],
    showOrHide: 'hide',
    showContent: 'show',
    classList: ['镜架',
      '太阳眼镜',
      '定制类眼镜',
      '老花眼镜'],
    currentStoreID: 0,
    currentType: '',
    currentTypeName: '',
    allProperty: [],
    categoryNameList: [],
    propertyNameList: [],
    currentPage: 1,
    keyWord: '',
    startPrice: '',
    endPrice: '',
    selectedPropertys: [],
    animationData: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({ currentTypeName: "镜架" });
  },
  onShow: function () {
    // 页面显示
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 0,
      transformOrigin: '50% 50% 0',
    })
    this.animation = animation;
    this.setData({
      animationData: this.animation.export()
    })

    var that = this;
    wx.getStorage({
      key: 'store',
      success: function (res) {
        var storeID = res.data.storeId;
        that.setData({
          currentStoreID: storeID
        })
        if (storeID > 0) {
          that.queryCategorys();
        }
      }
    })
  },
  onProductDetail: function (event) {
    var value = event.currentTarget.dataset.key;
    var proId = value.id.split("-")
    wx.navigateTo({
      url: '../productDetail/productDetail?id=' + proId[1]
    })
  },
  onClassClicked: function (e) {
    this.setData({ showOrHide: 'show' });
    this.setData({ showClass: 'show' });

    this.animation.translateX(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  onSearchProduct: function (event) {
    var that = this
    that.setData({ keyWord: event.detail.value })
    that.queryCategorys();
  },
  onBgClicked: function () {
    this.setData({ showOrHide: 'hide' });
  },
  //---------------选择类别----------------//
  onUnSelectedClass: function (event) {
    var value = event.currentTarget.dataset.key;
    var that = this;
    that.setData({ currentTypeName: value, startPrice: '', endPrice: '' });
    that.data.selectedPropertys.splice(0, that.data.selectedPropertys.length);
    that.queryCategorys();
  },
  onSelectedClass: function (event) {

  },
  //----------------选择属性参数-----------------//
  onSelectProperty: function (event) {
    var that = this;
    var value = event.currentTarget.dataset.key;
    value.isSelected = !value.isSelected;
    if (!value.isSelected) {
      for (var i = 0; i < this.data.selectedPropertys.length; i++) {
        var property = this.data.selectedPropertys[i];
        if (property.title == value.title) {
          this.data.selectedPropertys.splice(i, 1);
        }
      }
    } else {
      var isHas = false;
      for (var i = 0; i < this.data.selectedPropertys.length; i++) {
        var property = this.data.selectedPropertys[i];
        if (property.title == value.title) {
          isHas = true;
        }
      }
      if (!isHas) {
        if (value.isSelected) {
          this.data.selectedPropertys.push(value);
        }
      }
    }
    that.queryCategorys();
  },
  //--------------输入价格操作----------------//
  onStartPriceClicked: function (event) {
    if (parseFloat(event.detail.value) > parseFloat(this.data.endPrice)) {
      this.setData({ startPrice: '' });
      return;
    }
    this.setData({ startPrice: event.detail.value });
  },
  onEndPriceClicked: function (event) {
    this.setData({ endPrice: event.detail.value });
  },
  onSureFilterProducts: function () {
    var that = this;
    this.setData({ showOrHide: 'hide' });
    that.queryCategorys();
  },
  //-------------------类型名称-----------------//
  getTypeName: function () {
    var typeName = '';
    if (this.data.currentTypeName == '镜架') {
      typeName = 'FRAMES';
    } else if (this.data.currentTypeName == '太阳眼镜') {
      typeName = 'SUNGLASSES';
    } else if (this.data.currentTypeName == '定制类眼镜') {
      typeName = 'CUSTOMIZED';
    } else if (this.data.currentTypeName == '老花眼镜') {
      typeName = 'READING_GLASSES';
    }
    this.setData({ currentType: typeName })
  },
  //-------------获取商品分类参数---------------//
  queryCategorys: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })

    var filterValue = new Map();
    var selectValue = new Array();

    for (var i = 0; i < this.data.selectedPropertys.length; i++) {
      var selectProperty = this.data.selectedPropertys[i];
      var value = new Array();
      filterValue.set(selectProperty.key, value);
    }

    var that = this;
    filterValue.forEach(function (item, key, mapObj) {
      for (var i = 0; i < that.data.selectedPropertys.length; i++) {
        var selectProperty = that.data.selectedPropertys[i];
        if (selectProperty.key == key) {
          item.push(selectProperty.title);
        }
      }
    });
    that.getTypeName();
    var filterObject = new Object();
    filterValue.forEach(function (item, key, mapObj) {
      filterObject[key] = item;
    });

    filterObject.type = that.data.currentType;
    filterObject.searchSupplier = true;
    filterObject.proAvailable = true;
    filterObject.sessionId = app.globalData.ipcApp.getSessionID();
    filterObject.storeId = that.data.currentStoreID;

    wx.request({
      url: app.HostURL + '/wechat/webapp/mall/getCategory',
      data: JSON.stringify(filterObject),
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data.result)
        var objectList = res.data.result;

        var propertyList = new Array();
        for (var key in objectList) {
          if (objectList[key].length > 0) {
            var propertyObject = new Object();
            propertyObject.title = key;

            var valueList = new Array();
            var value = objectList[key];

            for (var i = 0; i < value.length; i++) {
              var valueObject = new Object();
              valueObject.title = value[i];
              valueObject.isSelected = false;
              valueObject.key = key;
              valueList.push(valueObject);
            }
            propertyObject.value = valueList;
            propertyList.push(propertyObject);
          }
        }

        for (var j = 0; j < that.data.selectedPropertys.length; j++) {
          var selectObject = that.data.selectedPropertys[j];
          for (var i = 0; i < propertyList.length; i++) {
            var property = propertyList[i];
            for (var a = 0; a < property.value.length; a++) {
              var value = property.value[a];
              if (value.title == selectObject.title) {
                value.isSelected = true;
              }
            }
          }
        }
        that.setData({ allProperty: propertyList });
        that.queryProducts(filterValue);
      },
    })
  },
  //-------------筛选商品-------------//
  queryProducts: function (filterValue) {
    var that = this;

    var filterObject = new Object();
    filterValue.forEach(function (item, key, mapObj) {
      filterObject[key] = item;
    });
    filterObject.keyword = that.data.keyWord;
    filterObject.type = that.data.currentType;
    filterObject.searchSupplier = true;
    filterObject.proAvailable = true;
    filterObject.sessionId = app.globalData.ipcApp.getSessionID();
    filterObject.storeId = that.data.currentStoreID;
    filterObject.start = that.data.currentPage;
    filterObject.limit = 1000;
    filterObject.hot = false;
    filterObject.startPrice = parseFloat(that.data.startPrice);
    filterObject.endPrice = parseFloat(that.data.endPrice);

    wx.request({
      url: app.HostURL + '/wechat/webapp/mall/searchProduct',
      data: JSON.stringify(filterObject),
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res)
        if (res.data.result.list.length == 0) {
          wx.showToast({
            title: '未查询到商品!',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.hideToast();
        }
        that.setData({
          productList: res.data.result.list
        })
      }
    })
  }
})