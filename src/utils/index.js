//封装一个将图片转换成为base64转码的函数
//参数:接收一个input type = file的对象
//首先要在input标签上面做一些限制，限制选择的文件类型
//限制大小
function transform(file,size){
  return new Promise((resolve,reject)=>{
    // window.console.log(file)
    if (file.size>(size*1024)) {
      reject("文件大小不能超过"+size+"kb")
    }else{
      let reader = new FileReader()
      reader.addEventListener("load", function () {
        resolve(reader.result)
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  })
}
/*
  转换时间戳
  需要传入 毫秒时间戳 日期格式('Y年M月D日 h:m:s')
  
*/
function formatTime(timeStape,format){
  // let format = 'Y年M月D日 h:m:s';
  let time = new Date(timeStape)
  let newArr = [];
  let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
  newArr.push(time.getFullYear());
  newArr.push((time.getMonth() + 1) < 10? "0" + (time.getMonth() + 1):time.getMonth() + 1);
  newArr.push(time.getDate() < 10?"0" + time.getDate():time.getDate());
  newArr.push(time.getHours() < 10?"0" + time.getHours():time.getHours());
  newArr.push(time.getMinutes() < 10?"0" + time.getMinutes():time.getMinutes());
  newArr.push(time.getSeconds() < 10?"0" + time.getSeconds():time.getSeconds());
  for (let i in newArr) {
      format = format.replace(formatArr[i], newArr[i]);
  }
  return format;
}
export {transform,formatTime}