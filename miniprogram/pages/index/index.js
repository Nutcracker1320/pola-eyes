//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    fileID: '',
    imagePath: '',
    aimgurl: "", // //临时图片的路径
    countIndex: 1, // 可选图片剩余的数量
    imageData: [] // 所选上传的图片数据
  },


  onReady: function(options){
    console.log('refresh')
  },


  browse: function (e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.doUpload('album');
          } else if (res.tapIndex == 1) {
            that.doUpload('camera');
          }
        }
      }
    })
  },




  chooseWxImage: function (type) {
    let that = this;
    wx.chooseImage({
      count: that.data.countIndex,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        // 选择图片后的完成确认操作
        that.setData({
          aimgurl: res.tempFilePaths
        });
        let cloudPath = "usrPhoto/" + 
        wx.cloud.uploadFile({
          cloudPath:'testphoto.png',
          filePath:res.tempFilePaths[0],
          success:function(res){
            console.log('上传成功',res)
          }
        })
        console.log(that.data.aimgurl);
      }
    })
  },



  // onLoad: function() {
  //   if (!wx.cloud) {
  //     wx.redirectTo({
  //       url: '../chooseLib/chooseLib',
  //     })
  //     return
  //   }

  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             this.setData({
  //               avatarUrl: res.userInfo.avatarUrl,
  //               userInfo: res.userInfo
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  // onGetOpenid: function() {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid)
  //       app.globalData.openid = res.result.openid
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole',
  //       })
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions',
  //       })
  //     }
  //   })
  // },

//上传到服务器
  // upload_file: function (url, filePath) {
  //   var that = this;
  //   wx.uploadFile({
  //     url: url,
  //     filePath: filePath,
  //     name: 'uploadFile',
  //     header: {
  //       'content-type': 'multipart/form-data'
  //     }, // 设置请求的 header
  //     formData: { 'shopId': wx.getStorageSync('shopId') }, // HTTP 请求中其他额外的 form data
  //     success: function (res) {
  //       wx.showToast({
  //         title: "图片修改成功",
  //         icon: 'success',
  //         duration: 700
  //       })
  //     },
  //     fail: function (res) {
  //     }
  //   })
  // },




  //上传图片
  doUpload: function (type) {
    // 选择图片
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        
        var filePath, cloudPath = NaN

        
        filePath = res.tempFilePaths[0]
        
        // 上传图片
        
        cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`

        // wx.uploadFile({
        //   url: '',
        //   filePath: '',
        //   name: 'uploadFile',
        //   header: {
        //     'content-type': 'multipart/form-data'
        //   },
        //   success:function(res){
        //     console.log('上传到服务器成功')
        //     wx.showToast({
        //       title: '图片上传成功',
        //       icon: 'success',
        //       duration: 700
        //     })
        //   },
        //   fail: function(e){
        //     console.error('上传到服务器失败',e)
        //     wx.showToast({
        //       icon: 'none',
        //       title: '上传失败'
        //     })
        //   },
        //   complete: () => {
        //     wx.hideLoading()
        //   }
        // })
        // wx.cloud.uploadFile().then((res) => {
        //   cloudPath,
        //   filePath,
        //   console.log('上传状况', res)
        //   that.setData({
        //     fileID: res.fileID
        //   })
        // })
        wx.cloud.uploadFile({
          
          cloudPath,
          filePath,
          
          success: res => {
            var that = this
            console.log('文件路径: ', filePath)
            console.log('[上传文件] 成功：', res)
            
            //app.globalData.fileID = res.fileID
            //app.globalData.cloudPath = cloudPath
            //app.globalData.imagePath = filePath

            // console.log(app.globalData.imagePath)
            console.log('location1')
            // that.setData({
            //   fileID: res.fileID
            // })
            that.setData({
              fileID: res.fileID,
            })
            console.log('location2')
            // that.data.imagePath = filePath
            // console.log('location3')
            // console.log('图片路径', filePath, 'and', this.data.imagePath)
            this.onReady()
            console.log('location3') 
            


            // wx.navigateTo({
            //   url: '../index/index'
            // })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
