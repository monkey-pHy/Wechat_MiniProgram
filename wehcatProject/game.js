import './libs/weapp-adapter'


//保存图片到临时文件转base64的代码

function savePictures(target, size){

  var xscale = size.x / size.width;
  var yscale = size.y / size.height;
  var widthscale = size.destWidth / size.width;
  var heightscale = size.destHeight / size.height;
  var view = target;
  var fileManager = wx.getFileSystemManager();
  var filePath = wx.env.USER_DATA_PATH;

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

  let base64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(tempFilePath, "base64");


}


//上传base图片到后台代码片段
function savePicturesToServer(){
  var picdata = {};
  for (var i = 0; i < platform.base64Picture.length; i++) {
    picdata['media[' + i + ']'] = platform.base64Picture[i];
  }
  picdata.pic_count = platform.base64Picture.length;
  console.log(picdata);
  wx.request({
    url: 'test.php',
    method: 'POST',
    header: {

      "content-type": "application/x-www-form-urlencoded  "

    },
    data: picdata,
    success(res) {

      wx.showToast({
        title: '图片存储完成',
      })

      console.log(platform.base64Picture);
    },
    fail(res) {
      console.log(res);
    }
  });
}




