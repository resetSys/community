var currWin = 0;//当前操作窗口
var deviceData = [//设备数据
  {
    title: "分组1",
    child: [
      {
        name: "item1",
        ip: "192.168.1.249",
        port: "80",
        user: "admin",
        pass: "admin123",
      },
      {
        name: "item1",
        ip: "192.168.1.141",
        port: "80",
        user: "admin",
        pass: "admin123",
      },
      {
        name: "item1",
        ip: "192.168.1.199",
        port: "80",
        user: "admin",
        pass: "admin123",
      },
    ]
  }
];
/*****************插件初始化*********************/
$(function () {
  /**
   获取屏幕的宽高
   计算容器的宽高 
   */
  var screenW = document.documentElement.clientWidth;
  var screenH = document.documentElement.clientHeight;
  // console.log(screenW,screenH);
  var pluginW = screenW - 200;
  var pluginH = screenH - 50;
  $("#video").width(pluginW);
  $("#video").height(screenH);

  /**
    检测插件是否安装
    返回值：
      0：已安装
      -1：未安装插件
      -2：chrome版本过高   
   */
  var pluginStatus = WebVideoCtrl.I_CheckPluginInstall();
  if (pluginStatus == -1) {
    showLog("系统检测未安装插件", false);
    return;
  } else if (pluginStatus == -2) {
    showLog("Chrome 浏览器版本过高，不支持 NPAPI", false);
    return;
  }

  //初始化插件参数
  WebVideoCtrl.I_InitPlugin(pluginW, pluginH, {
    //szColorProperty: "plugin-background:ffffff;sub-background:#f0f0f0;sub-border:#ffffff;sub-border-select:#409EFF",//插件窗口的样式
    iWndowType: 1,//分屏类型
    bWndFull: true,//单窗口双击全屏
    bDebugMode: true,//调试模式，在控制台打印信息
    cbDoubleClickWnd: function (curr, full) {//窗口双击回调函数
      console.log("双击窗口回调:" + curr + "_" + full);
    },
    cbSelWnd: function (xml) {//窗口选中事件回调信息
      currWin = parseInt($(xml).find("SelectWnd").eq(0).text(), 10);
    },
    cbInitPluginComplete: function () {//插件初始化完成回调
      showLog("插件初始化完成", true);
      var insertStatus = I_InsertOBJECTPlugin("video-plugin");
      console.log(insertStatus);
    }
  });
  autoLogin();//调用自动登录
});

/*****************获取设备信息*********************/
/**
 * 自动登录
 */
function autoLogin() {
  for (let i = 0,list = deviceData[i].child; i < list.length; i++) {
    WebVideoCtrl.I_Login(list[i].ip, 1, list[i].port, list[i].user, list[i].pass, {
      success: function (xmlDoc) { //成功的回调函数
        showLog("登录成功", true);
      },
      error: function () { //失败的回调函数
        showLog("登陆失败", false);
      }
    });
  }
}

/**
 * 创建设备树
 */
createDeviceList();
function createDeviceList() {
  var deviceList = $(".NL-ul");
  var html = "";
  for (let i = 0; i < deviceData.length; i++) {
    html += "<li class='NL-ul-li'><p class='NL-ul-li-tit'>" + deviceData[i].title + "</p><ul class='NL-ul-li-ul'>";
    for (let j = 0; j < deviceData[i].child.length; j++) {
      html += "<li><label><input class='selectIp' type='radio' name='select' data-ip='" + deviceData[i].child[j].ip + "'>" + deviceData[i].child[j].ip + "</label></li>";
    }
    html += "</ul></li>";
  }
  deviceList.html(html);
  /*绑定toggle事件*/
  $('.NL-ul-li-tit').click(function (e) {
    e.preventDefault();
    $(this).next('.NL-ul-li-ul').slideToggle();
  });
}

/**
  登录
 */
function clickLogin() {
  var szIP = $('#szIP').val();
  var iPrototocol = 1;
  var iPort = $('#iPort').val();
  var szUserName = $('#szUserName').val();
  var szPassword = $('#szPassword').val();
  WebVideoCtrl.I_Login(szIP, iPrototocol, iPort, szUserName, szPassword, {
    success: function (xmlDoc) { //成功的回调函数
      console.log(xmlDoc);
    },
    error: function () { //失败的回调函数
      console.log("登录失败");
    }
  });
}

/**
  登出
 */
function clickLogout() {
  var szIP = $('#szIP').val();
  var status = I_Logout(szIP);
  alert(status);
}



/*****************播放及播放控制*********************/
/**
 * 点击开始回放
 */
function playBack() {
  /**
    需要的参数:
    设备IP
    开始日期、截止日期
    码流类型
   */
  var type = $("#stream option:selected").val();
  var szIp = $('.selectIp:checked').data('ip');
  var startTime = $("#nav-col-startTime").val();
  var endTime = $("#nav-col-endTime").val();
  I_StartPlayback(szIp,{
    szStartTime:startTime,//起始时间
    szEndTime:endTime,//截止时间
    iStreamType:type,//码流类型
    success:function () {
      showLog("回放中...",true);
    },
    error:function () {
      showLog("回放失败",false);
    }
  });
}

/**
 * 选择码流类型
 */
function handleStream() {
  //获取窗口信息
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  //如果窗口信息不为空,先停止播放
  if (oWndInfo != null) {
    handleStop();
    handleStream();
  } else {
    playBack();
  }

}

/**
 * 点击播放按钮
 */
function handlePlay() {
  //获取设备ip
  var szIp = $('.selectIp:checked').data('ip');
  if (szIp == undefined) {
    alert("请选择要预览设备");
    return;
  } else {
    playBack();
  }
}

/**
 * 停止播放或者停止回放
 */
function handleStop() {
  WebVideoCtrl.I_Stop({
    success: function () {
      showLog("停止播放成功", true);
    },
    error: function () {
      showLog("停止播放失败", false);
    },
  });
}

/**
 * 播放和暂停切换
 */
function pauseResume() {
  $('#video-pause').toggle();
  $('#video-resume').toggle();
}

/**
 * 暂停播放，回放和倒放
 */
function pause() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (oWndInfo != null) {
    pauseResume();
    WebVideoCtrl.I_Pause({
      success: function () {
        showLog("暂停播放", true);
      },
      error: function () {
        showLog("暂停播放失败", false);
      }
    });
  } else {
    showLog("请选择要操作视频窗口", false);
    alert("请选择要操作视频窗口");
  }
}

/**
 * 恢复播放，把播放状态从单帧/暂停恢复到正常播放状态
 */
function resume() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (oWndInfo != null) {
    pauseResume();
    WebVideoCtrl.I_Resume({
      success: function () {
        showLog("恢复播放", true);
      },
      error: function () {
        showLog("恢复播放失败", false);
      }
    });
  } else {
    showLog("请选择要操作视频窗口", false);
    alert("请选择要操作视频窗口");
  }
}

/**
 * 加速播放
 */
function handlePlayFast() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (oWndInfo != null) {
    I_PlayFast({
      success:function (res) {
        showLog("快放成功", true);
      },
      error:function () {
        showLog("快放失败", false);
      }
    })
  } else {
    showLog("请选择要操作视频窗口", false);
    alert("请选择要操作视频窗口");
  }
}

/**
 * 减速播放
 */
function handlePlaySlow() {
  var oWndInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (oWndInfo != null) {
    I_PlaySlow({
      success:function (res) {
        showLog("慢放成功", true);
      },
      error:function () {
        showLog("慢放失败", false);
      }
    })
  } else {
    showLog("请选择要操作视频窗口", false);
    alert("请选择要操作视频窗口");
  }
}


/**
 * 打开声音
 */
var voice = 50;
function handleOpenSound() {
  //判断是否有操作窗口
  var winInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (winInfo == null) {
    alert("请选择操作窗口");
    return;
  }
  //获取所有窗口，关闭其他的声音通道
  var allWinInfo = WebVideoCtrl.I_GetWindowStatus();
  for (let i = 0; i < allWinInfo.length; i++) {
    if (allWinInfo[i].bSound) {
      WebVideoCtrl.I_CloseSound(allWinInfo[i].iIndex);
    }
  }
  var status = WebVideoCtrl.I_OpenSound();
  if (status == 0) {
    showLog("打开声音成功...", true);
    handleSetSound(0);//设置音量
    $(".col-voice-btn").attr("disabled", "");//按钮可点击
  } else {
    showLog("打开声音失败", false);
  }
}

/**
 * 关闭声音
 */
function handleCloseSound() {
  var winInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (winInfo == null) {
    alert("请选择操作窗口");
    return;
  }
  var status = WebVideoCtrl.I_CloseSound();
  if (status == 0) {
    showLog("声音已关闭", true);
    $(".col-voice-btn").attr("disabled", "disabled");//按钮不可点击
  } else {
    showLog("声音已关闭失败", false);
  }
}

/**
 * 设置音量
 */
function handleSetSound(num) {
  var winInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (winInfo == null) {
    alert("请选择操作窗口");
    return;
  }

  var num = parseInt(num, 10);
  voice += num;
  if (voice >= 100) {
    voice = 100;
  } else if (voice <= 0) {
    voice = 0;
  }
  var status = WebVideoCtrl.I_SetVolume(voice);
  if (status == 0) {
    showLog("声音" + num, true);
    $(".voice-pro-bar").width(voice + "px");
  } else {
    showLog("声音设置失败", false);
  }
}

/**
 * 抓图 
 */
function screenShot() {
  var capturePath = "";
  //获取插件的本地参数配置
  var xmlDoc = WebVideoCtrl.I_GetLocalCfg();
  var szCaptureFileFormat = "0";//抓图格式
  if (xmlDoc != null) {
    //获取抓图的格式
    szCaptureFileFormat = $(xmlDoc).find("CaptureFileFormat").eq(0).text();
    capturePath = $(xmlDoc).find("DeviceCapturePath").eq(0).text();
  }
  //文件名
  var szPicName = "抓图_" + currTime('h时m分s秒');
  szPicName += ("0" === szCaptureFileFormat) ? ".jpg" : ".bmp";
  var iRet = WebVideoCtrl.I_CapturePic(szPicName, {
    bDateDir: true  //是否生成日期文件
  });
  if (0 == iRet) {
    showLog("抓图成功" + capturePath, true);
  } else {
    showLog("抓图失败", false);
  }
}

/**
 * 窗口分割数
 * @param {分割数} iType 
 */
function changeWndNum(iType) {
  iType = parseInt(iType, 10);
  WebVideoCtrl.I_ChangeWndNum(iType);
}

/*****************本地录像*********************/

/**
 * 开启录像
 */
function handleStartRecord() {
  var winInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (winInfo == null) {
    alert("请选择操作窗口");
    return;
  }
  var fileName = "录像_" + currTime('h时m分s秒');
  console.log(fileName);
  
  WebVideoCtrl.I_StartRecord(fileName,{
    bDateDir:true,
    success:function () {
      showLog("开始录像...",true);
    },
    error:function () {
      showLog("开启录像失败",false);
    }
  });
}

/**
 * 停止录像
 */
function handleStopRecord() {
  var winInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (winInfo == null) {
    alert("请选择操作窗口");
    return;
  }
  WebVideoCtrl.I_StopRecord({
    success:function () {
      showLog("录像停止",true);
    },
    error:function () {
      showLog("录像停止失败",false);
    }
  });
}


/**
  设置全屏
*/
function clickFullScreen() {
  WebVideoCtrl.I_FullScreen(true);
}

/*****************图像放大*********************/
/**
 * 启用电子放大
 */
function handleOpenZoom() {
  var winInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (winInfo == null) {
    alert("请选择操作窗口");
    return;
  }
  var status = WebVideoCtrl.I_EnableEZoom();
  if (status == 0) {
    showLog("启用电子放大...", true);
  } else {
    showLog("启用电子放大失败", false);
  }
}

/**
 * 禁用电子放大
 */
function handleCloseZoom() {
  var winInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (winInfo == null) {
    alert("请选择操作窗口");
    return;
  }
  var status = WebVideoCtrl.I_DisableEZoom();
  if (status == 0) {
    showLog("禁用电子放大", true);
  } else {
    showLog("禁用电子放大失败", false);
  }
}

/**
 * 启用3D放大
 */
function handleOpen3DZoom() {
  var winInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (winInfo == null) {
    alert("请选择操作窗口");
    return;
  }
  var status = WebVideoCtrl.I_Enable3DZoom();
  if (status == 0) {
    showLog("启用3D放大...", true);
  } else {
    showLog("启用3D放大失败", false);
  }
}

/**
 * 禁用3D放大
 */
function handleClose3DZoom() {
  var winInfo = WebVideoCtrl.I_GetWindowStatus(currWin);
  if (winInfo == null) {
    alert("请选择操作窗口");
    return;
  }
  var status = WebVideoCtrl.I_Disable3DZoom();
  if (status == 0) {
    showLog("禁用3D放大", true);
  } else {
    showLog("禁用3D放大失败", false);
  }
}

/*****************工具方法*********************/
/**
 * 打印日志文件
 * @param {描述:string} text 
 * @param {样式:boo} type 
 */
function showLog(text, type) {
  var html = "";
  if (type) {
    html += "<p style='color:#409EFF;'>";
  } else {
    html += "<p style='color:#F56C6C;'>";
  }
  html += "<span style='color:#000'>" +currTime('Y-M-D h:m:s') + "</span>" + text + "<p>"
  $("#log").prepend(html);
}

/**
 * 返回当前日期
 */
function currTime(format) {
  //如果参数为null，会隐式的转换为0
  // let format = 'Y-M-D h:m:s';
  let time = new Date();
  let newArr = [];
  let formatArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  newArr.push(time.getFullYear());
  newArr.push((time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1);
  newArr.push(time.getDate() < 10 ? "0" + time.getDate() : time.getDate());
  newArr.push(time.getHours() < 10 ? "0" + time.getHours() : time.getHours());
  newArr.push(time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
  newArr.push(time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds());
  for (let i in newArr) {
    format = format.replace(formatArr[i], newArr[i]);
  }
  return format;
}

/**
 * 获取系统信息
 */
function getSysInfo() {
  var locator = new ActiveXObject("WbemScripting.SWbemLocator");
  var service = locator.ConnectServer(".");
  //CPU信息 
  var cpu = new Enumerator(service.ExecQuery("SELECT * FROM Win32_Processor")).item();
  // var cpuType = cpu.Name, hostName = cpu.SystemName;
  showLog(cpu.LoadPercentage)

  // //内存信息 
  // var memory = new Enumerator(service.ExecQuery("SELECT * FROM Win32_PhysicalMemory"));
  // for (var mem = [], i = 0; !memory.atEnd(); memory.moveNext()) mem[i++] = { cap: memory.item().Capacity / 1024 / 1024, speed: memory.item().Speed }
  // console.log(memory);

}