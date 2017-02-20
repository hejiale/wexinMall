// pages/productDetail/productDetail.js

var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();

Page({
  data: {
    DetailObject: null,
    images: [],
    indicator: false,
    specifications: []
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'store',
      success: function (res) {
        var storeID = res.data.storeId;
        if (storeID > 0) {
          wx.request({
            url: app.HostURL + '/wechat/webapp/mall/getProductDetail',
            data: {
              sessionId: app.globalData.ipcApp.getSessionID(),
              storeId: storeID,
              prodId: options.id,
              productType: 'glasses'
            },
            method: 'POST',
            header: { 'content-type': 'application/json' },
            success: function (res) {
              console.log(res)
              that.setData({ DetailObject: res.data.result })
              WxParse.wxParse('article', 'html', res.data.result.desc, that, 5);
              var photos = res.data.result.photos;
              var cemianImage = '';
              var zhengmianImage = '';
              var thumbilImage = '';

              if (photos['侧面展示']) {
                cemianImage = photos['侧面展示'].photoLinkNormal;
              }
              if (photos['正面展示']) {
                zhengmianImage = photos['正面展示'].photoLinkNormal;
              }
              if (photos['缩略图']) {
                thumbilImage = photos['缩略图'].photoLinkNormal;
              }

              var imageList = new Array();
              if (cemianImage != '') {
                imageList.push(cemianImage);
              }
              if (zhengmianImage != '') {
                imageList.push(zhengmianImage);
              }
              if (cemianImage == '' && zhengmianImage == '') {
                imageList.push(thumbilImage);
              }
              that.setData({
                images: imageList,
                indicator: (imageList.length > 1 ? true : false)
              });

              var specificationArray = new Array();
              var productDetail = res.data.result;
              if (productDetail.glassesType == 'FRAMES') {
                specificationArray.push({ 'key': '商品货号', 'name': productDetail.stockNumber });
                specificationArray.push({ 'key': '颜色', 'name': productDetail.color });
                specificationArray.push({ 'key': '供应商', 'name': productDetail.supplierName });
                specificationArray.push({ 'key': '边框', 'name': productDetail.frame });
                specificationArray.push({ 'key': '材质', 'name': productDetail.material });
                specificationArray.push({ 'key': '品牌', 'name': productDetail.brand });
                specificationArray.push({ 'key': '款式', 'name': productDetail.style });
              } else if (productDetail.glassesType == 'SUNGLASSES') {
                specificationArray.push({ 'key': '商品货号', 'name': productDetail.stockNumber });
                specificationArray.push({ 'key': '功能', 'name': productDetail.function });
                specificationArray.push({ 'key': '供应商', 'name': productDetail.supplierName });
                specificationArray.push({ 'key': '材质', 'name': productDetail.material });
                specificationArray.push({ 'key': '镜片颜色', 'name': productDetail.lensColor });
                specificationArray.push({ 'key': '品牌', 'name': productDetail.brand });
                specificationArray.push({ 'key': '款式', 'name': productDetail.style });
                specificationArray.push({ 'key': '镜架颜色', 'name': productDetail.frameColor });
              } else if (productDetail.glassesType == 'CUSTOMIZED') {
                specificationArray.push({ 'key': '商品货号', 'name': productDetail.stockNumber });
                specificationArray.push({ 'key': '镜片颜色', 'name': productDetail.lensColor });
                specificationArray.push({ 'key': '供应商', 'name': productDetail.supplierName });
                specificationArray.push({ 'key': '镜架材质', 'name': productDetail.material });
                specificationArray.push({ 'key': '镜片颜色', 'name': productDetail.lensColor });
                specificationArray.push({ 'key': '品牌', 'name': productDetail.brand });
                specificationArray.push({ 'key': '镜片片型', 'name': productDetail.lensType });
                specificationArray.push({ 'key': '镜架颜色', 'name': productDetail.frameColor });
              } else if (productDetail.glassesType == 'READING_GLASSES') {
                specificationArray.push({ 'key': '商品货号', 'name': productDetail.stockNumber });
                specificationArray.push({ 'key': '颜色', 'name': productDetail.color });
                specificationArray.push({ 'key': '边框', 'name': productDetail.frame });
                specificationArray.push({ 'key': '材质', 'name': productDetail.material });
                specificationArray.push({ 'key': '供应商', 'name': productDetail.supplierName });
                specificationArray.push({ 'key': '品牌', 'name': productDetail.brand });
                specificationArray.push({ 'key': '瞳距', 'name': productDetail.pd });
                specificationArray.push({ 'key': '款式', 'name': productDetail.style });
                specificationArray.push({ 'key': '度数', 'name': productDetail.degree });
              } else if (productDetail.glassesType == 'LENS') {
                specificationArray.push({ 'key': '商品货号', 'name': productDetail.stockNumber });
                specificationArray.push({ 'key': '颜色', 'name': productDetail.color });
                specificationArray.push({ 'key': '膜层', 'name': productDetail.layer });
                specificationArray.push({ 'key': '供应商', 'name': productDetail.supplierName });
                specificationArray.push({ 'key': '品牌', 'name': productDetail.function });
                specificationArray.push({ 'key': '功能', 'name': productDetail.pd });
                specificationArray.push({ 'key': '折射率', 'name': productDetail.refractiveIndex });
                specificationArray.push({ 'key': '球镜(SPH)', 'name': productDetail.sph });
                specificationArray.push({ 'key': '柱镜(CYL)', 'name': productDetail.cyl });
              } else if (productDetail.glassesType == 'CONTACT_LENSES') {
                specificationArray.push({ 'key': '商品货号', 'name': productDetail.stockNumber });
                specificationArray.push({ 'key': '颜色', 'name': productDetail.color });
                specificationArray.push({ 'key': '供应商', 'name': productDetail.supplierName });
                specificationArray.push({ 'key': '品牌', 'name': productDetail.brand });
                specificationArray.push({ 'key': '度数', 'name': productDetail.degree });
                specificationArray.push({ 'key': '包装规格', 'name': productDetail.packingSpec });
                specificationArray.push({ 'key': '含水量', 'name': productDetail.watercontent });
                specificationArray.push({ 'key': '基弧', 'name': productDetail.baseOfArc });
                specificationArray.push({ 'key': '周期', 'name': productDetail.period });
              } else if (productDetail.glassesType == 'ACCESSORY') {
                specificationArray.push({ 'key': '品牌', 'name': productDetail.brand });
                specificationArray.push({ 'key': '供应商', 'name': productDetail.supplierName });
                specificationArray.push({ 'key': '类型', 'name': productDetail.type });
                specificationArray.push({ 'key': '商品名称', 'name': productDetail.name });
                specificationArray.push({ 'key': '商品货号', 'name': productDetail.stockNumber });

              }

              that.setData({ specifications: specificationArray })
            }
          })
        }
      }
    })
  },
  onBook: function (event) {
    wx.setStorage({
      key: 'product',
      data: this.data.DetailObject
    })
    wx.navigateTo({
      url: '../bookOrder/bookOrder?hasDetail=0&isCart=0'
    })
  },
  onCart: function () {
    var that = this;
    //创建购物车商品类
    var cartObject = new Object();
    cartObject.productId = that.data.DetailObject.id;
    cartObject.price = that.data.DetailObject.suggestPrice;
    cartObject.image = that.data.DetailObject.photos['缩略图'].photoLinkNormal;
    cartObject.name = that.data.DetailObject.name;
    cartObject.count = 1;
    cartObject.isSelected = false;
    cartObject.productId = that.data.DetailObject.id;
    if (that.data.DetailObject.glassesType == 'LENS' || that.data.DetailObject.glassesType == 'CONTACT_LENSES') {
      cartObject.type = 'lens'
    }
    else if (that.data.DetailObject.glassesType == 'ACCESSORY') {
      cartObject.type = 'accessory'
    } else {
      cartObject.type = 'glasses'
    }

    //判断本地购物车
    var value = wx.getStorageSync('allCart')
    console.log(value)

    if (value && value.length > 0) {
      var exitIndex = 0;
      var cartList = value;
      var isExit = false;
      for (var i = 0; i < cartList.length; i++) {
        var cart = cartList[i];
        if (cart.productId != that.data.DetailObject.id) {
          isExit = false;
        } else {
          isExit = true;
          exitIndex = i;
        }
      }

      if (isExit) {
        var exitCart = cartList[exitIndex];
        exitCart.count++;
      } else {
        cartList.push(cartObject);
      }
      wx.setStorageSync('allCart', cartList);
    }
    else {
      var cartList = new Array();
      cartList.push(cartObject);
      wx.setStorage({
        key: 'allCart',
        data: cartList
      })
    }

    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
  },
  onToCart: function (){
  }
})