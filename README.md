# Wechat_MiniProgram

## 解决微信小游戏用canvas.toTempFilePathSync返回临时文件路径转base64问题

由于项目功能需要，我们需要将小程序通过Canvas截多张图存入临时文件后再转base64传给后台，看了很多博客，都是只能在wx.chooseIamge方法中操作canvas.toTempFilePathSync返回的临时文件路径，但是我们要的不是从相册里选择一张图片的临时路径，我们是需要Canvas截后的图存入临时文件后，再把这个临时路径转为base64格式，网上有博客说canvas.toTempFilePathSync返回的临时文件路径只能用于wx.shareAppMessage（转发功能）里，所以通过几天的查找，这个可能是由于微信的开放数据域的安全限制，如果想要使用可以这个返回值的，可以把这个开放数据域给关闭。

开放数据域名是在微信小游戏的game.json文件中，看下图！！！！！

![image](https://github.com/nobody19921117/Wechat_MiniProgram/blob/master/image/image1.png)

如果打开开放数据域，控制台输出的canvas.toTempFilePathSync返回的临时文件路径，如下图！！！当用这个临时路径转为base64时，会报文件找不到的错误。

![image](https://github.com/nobody19921117/Wechat_MiniProgram/blob/master/image/image4.png)

如果关闭数据域，控制台输出的canvas.toTempFilePathSync返回的临时文件路径并且转为base64后返回的值，如下图！！！

![image](https://github.com/nobody19921117/Wechat_MiniProgram/blob/master/image/image3.png)

* 让我们来看看微信数据域是个什么鬼东西-

开放数据域-就是一个封闭并且独立的JavaScript作用域，主要是为了保护其社交关系链数据，这个作用域中的资源，引擎，程序斗和主游戏完全隔离，开发者只有在开放数据域中才能访问微信提供的 wx.getFriendCloudStorage() 和 wx.getGroupCloudStorage() 两个 API。如果让代码运行在开放数据域，那就得要在game.jso添加openDataContext配置代码，添加后就启用了开放数据域，如果没有此配置项就代表关闭了小游戏的开放数据域。

由于开放数据域是一个封闭、独立的 JavaScript 作用域，所以开发者需要创建两个项目：
1. 主域项目工程（正常的游戏项目）
2. 开放数据域项目工程（通过微信 API 获取用户数据来做排行榜等功能的项目）

开启后开放数据域的限制：
1. 主域和开放数据域中的代码不能相互 require
2. wx.getUserCloudStorage、wx.getFriendCloudStorage() 和 wx.getGroupCloudStorage() 只能在 开放数据域 中调用。
3. wx.setUserCloudStorage() 和 wx.removeUserCloudStorage() 可以同时在 主域 和开放数据域中调用。
4. 开放数据中不能修改sharedCanvas的宽高，如有需要，请在上屏canvas修改sharedCanvas的宽高。
5. sharedCanvas只能被上屏canvas渲染。
6. 开放数据域不能向主域发送消息。
7. sharedCanvas 不能调用 toDataURL 和 getContext。
8. 开放数据域的所有 canvas 只支持 2d 渲染模式。
9. 开放数据域的 Image 只能使用本地或微信 CDN 的图片，不能使用开发者自己服务器上的图片。

* 如何将小游戏的图片转为base64格式？

 wx.getFileSystemManager().readFileSync(图片路径, "base64");
 
 * 具体完整代码：
 
canvas.toTempFilePathSync返回临时文件路径转base64
 ```javascript
     let tempFilePath = canvas.toTempFilePathSync({
      fileType: "png",
      quality: 1,
      x: canvas.width * xscale,
      y: canvas.height * yscale,
      width: canvas.width * widthscale,
      height: canvas.height * heightscale,
      destWidth: 200,
      destHeight: 200 * (size.destWidth / size.destHeight)
    });

    let base64 = 'data:image/png;base64,'+ wx.getFileSystemManager().readFileSync  (tempFilePath, "base64");
 ```
完整代码可git clone，在game.js文件中

但是请注意！！！关闭了微信小游戏开放数据域就代表不能调取用户的社交关系去做游戏的排行榜等功能了。

### 参考文档

1. [微信小程序开放数据域官方文档](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/open-data.html)
