// pages/home/home.js
var app = getApp()

Page({
  data: {
    currentStoreID: 0,
    showAlert: 'show',
    showContent: 'hide',
    indicator: false,
    template: [],
    detailStyle: null,
    deviceWidth: 0,
    deviceHeight: 0,
    showFirstStyle: null,
    showSecondStyle: null,
    showThirdStyle: null,
    showFourStyle: null,
    recommendProducts: null
  },
  onLoad: function (options) {
    var ipcApp = app.globalData.ipcApp;
    ipcApp.setSessionID('');

    var that = this;
    app.getSystemInfo(function (systemInfo) {
      var winWidth = systemInfo.windowWidth;
      var winHeight = systemInfo.windowHeight;
      that.setData({
        deviceWidth: winWidth, deviceHeight: winHeight
      })
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    wx.getStorage({
      key: 'store',
      success: function (res) {
        if (res) {
          var storeID = res.data.storeId;
          that.setData({
            showAlert: 'hide',
            showContent: 'show',
            currentStoreID: storeID,
          })
          if (storeID > 0) {
            wx.showToast({
              title: '加载中...',
              icon: 'loading',
              duration: 10000
            })

            var ipcApp = app.globalData.ipcApp
            if (app.globalData.ipcApp.getSessionID() != '' && app.globalData.ipcApp.getSessionID()) {
              that.onShowTemplate(storeID);
            } else {
              app.onLogin(function () {
                that.onShowTemplate(storeID);
              })
            }
          } else {
            that.setData({
              showAlert: 'show',
              showContent: 'hide',
            })
          }
        }
      }
    })
  },
  onShowTemplate: function (storeID) {
    var that = this;

    wx.request({
      url: app.HostURL + '/wechat/webapp/mall/getTemplate',
      data: {
        sessionId: app.globalData.ipcApp.getSessionID(),
        id: storeID
      },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data.result.templates)
        var templates = res.data.result.templates;
        that.setData({ template: templates })

        //获取查看详情的css样式
        var style = templates[2].templateDetails[0].imageContentStyle;
        var jsonStyle = JSON.parse(style);
        that.setData({ detailStyle: jsonStyle });

        //-------获取show四格页面css样式-------//

        //-----第一组show
        var window = templates[5].windowmageTemplateDetails[0].imageContentStyle;
        var titles = templates[5].windowmageTemplateDetails[0].titles;
        var jsonWindow = JSON.parse(window);
        var jsonTitles = JSON.parse(titles);
        var showProductInfo = new Object();
        showProductInfo.image = jsonWindow.backgroundImage;
        showProductInfo.title = jsonTitles.title_1;

        that.setData({ showFirstStyle: showProductInfo });

        //-----第二组show
        var window = templates[5].windowmageTemplateDetails[1].imageContentStyle;
        var jsonWindow = JSON.parse(window);
        that.setData({ showSecondStyle: jsonWindow });

        //------第三组show
        var window = templates[5].windowmageTemplateDetails[2].imageContentStyle;
        var jsonWindow = JSON.parse(window);
        that.setData({ showThirdStyle: jsonWindow });

        //------第四组show
        var window = templates[5].windowmageTemplateDetails[3].imageContentStyle;
        var jsonWindow = JSON.parse(window);
        that.setData({ showFourStyle: jsonWindow });

        //----推荐商品-----//
        var recommends = templates[6].templateDetails;
        that.setData({ recommendProducts: recommends });

        wx.hideToast();
      }
    })
  },
  onStoreSelected: function () {
    wx.navigateTo({
      url: '../store/store'
    })
  },
  onClassClicked: function (e) {
    wx.navigateTo({
      url: '../productList/productList'
    })
  },
  onProductDetail: function (event) {
    var value = event.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../productDetail/productDetail?id=' + value.glassId
    })
  }
})