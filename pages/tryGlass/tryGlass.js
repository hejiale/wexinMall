// pages/tryGlass/tryGlass.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onCameraAction: function(){
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res){
        console.log(res)
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function(res){
            console.log(res)
          },
        })
      }
    })
  }
})