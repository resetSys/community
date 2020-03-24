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

/*
  封装请求状态码操作
  1、当状态码为 -1 的时候跳转路由
  2、当状态吗为 0 的时候显示报错信息
  3、当状态吗为 1 时将正常数据返回
  每个判断都会有返回值，当返回值不为false时处理
*/
function handleRequest(data) {
  // window.console.log(this)
  if (data.status === -1) {
    // window.console.log(this.$router.replace)
    this.$router.replace(data.msg)
    // window.console.log("跳转")
    return false
  } else if(data.status === 0) {
    this.$message({
      message:data.msg,
      type:"warning"
    })
    return false
  } else if(data.status === 1) {
    return data.respond;
  }
}

/*
  封装一个h:s转为分钟的工具方法
  思路，将该字符串截取为数组，使用arr[1]*60+arr[2]
*/
function formatMinutes(time){
  if (time) {
    let arr = time.split(":");
    let minute = arr[0]*60+parseInt(arr[1]);
    return minute;
  } else {
    return 0
  }
  
}

/*
  封装一个分钟转为h:s字符串的工具方法
  思路，将该数值除以60，整数为小时数，再将该数字%60，余数为分钟数
  最后进行拼接
*/
function formatHS(time){
  if (time) {
    let hour = Math.floor(time/60)>10? Math.floor(time/60):'0'+Math.floor(time/60);//向下取整
    let minute = time%60 >10? time%60: '0' + time%60;
    let hs = hour+ ":"+ minute;
    return hs;
  } else {
    return 0;
  }
}

export {
  transform,
  formatTime,
  handleRequest,
  formatMinutes,
  formatHS
}