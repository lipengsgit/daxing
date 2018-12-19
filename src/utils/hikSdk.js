import request from './request';

/**
 * 显示接口调用结果
 * @param methodName
 * @param ret
 * @param OCXobj
 */
function showRetMessage(methodName, ret, OCXobj){
  if(ret === 0) console.log(`${methodName}接口调用成功！`);
  else if(ret === -1) console.log(`${methodName}接口调用失败！错误码：${OCXobj.GetLastError()}`);
}

/**
 * 海康ocx公共接口
 * @type {{}}
 */
export const hikPlayCommon = {
  /**
   * 登录CMS
   * @param ocxEleId
   */
  loginCMS: (ocxEleId) => {
    request('/api/v1/getHikSetting').then((response) => {
      if(response.success === 'success'){
        const {ipAdd, port, userName, pw} = response.data;
        const OCXobj = document.getElementById(ocxEleId);
        const ret = OCXobj.Login(ipAdd, port, userName, pw);
        showRetMessage('Login', ret, OCXobj);
      }
    });
  },

  /**
   * 登出CMS
   * @param ocxEleId
   */
  logoutCMS: (ocxEleId) => {
    const OCXobj = document.getElementById(ocxEleId);
    const ret = OCXobj.Logout();
    showRetMessage('Logout', ret, OCXobj);
  },
};

/**
 * 实时播放相关接口
 * @type {{}}
 */
export const hikPlayView = {
  /**
   * 设置窗口数量
   * @param wndIndex
   * @param OCXobj
   */
  setWndNumByIndex: (wndIndex, OCXobj) => {
    const wndNum = OCXobj.GetWndNum();
    if(wndIndex >= wndNum)
      if(wndIndex > 3 && wndIndex <= 8) OCXobj.SetwndNum(9);
      else if(wndIndex > 9 && wndIndex <= 15) OCXobj.SetwndNum(16);
      else OCXobj.SetwndNum(25);
  },

  /**
   * 根据监控点ID预览
   * @constructor
   */
  StartPlayView: (ocxEleId, cameraId) => {
    const OCXobj = document.getElementById(ocxEleId);
    if(!(parseInt(cameraId, 10) >= 1 && parseInt(cameraId, 10) <= 2147483647) || cameraId.length === 0 || isNaN(cameraId) || cameraId === '') return;
    const ret = OCXobj.StartTask_Preview(cameraId);
    showRetMessage('StartTask_Preview', ret, OCXobj);
  },

  /**
   * 根据监控点ID指定预览
   * @param ocxEleId
   * @param cameraId
   * @param wndIndex
   * @constructor
   */
  StartPlayView_InWnd: (ocxEleId, cameraId, wndIndex) => {
    const OCXobj = document.getElementById(ocxEleId);
    this.setWndNumByIndex(wndIndex, OCXobj);
    if(cameraId === '' || cameraId.length === 0 || isNaN(cameraId)) return;
    const ret = OCXobj.StartTask_Preview_InWnd(cameraId, wndIndex);
    showRetMessage('StartTask_Preview_InWnd', ret, OCXobj);
  },

  /**
   * 根据监控点ID空闲预览
   * @param ocxEleId
   * @param cameraId
   * @constructor
   */
  StartPlayView_Free: (ocxEleId, cameraId) => {
    const OCXobj = document.getElementById(ocxEleId);
    if(cameraId === '' || cameraId.length === 0 || isNaN(cameraId)) return;
    const ret = OCXobj.StartTask_Preview_FreeWnd(cameraId);
    showRetMessage('StartTask_Preview_FreeWnd', ret, OCXobj);
  },

  /**
   * 根据监控点索引预览
   * @param ocxEleId
   * @param camerIndexCode
   * @constructor
   */
  StartPreviewByIndexCode: (ocxEleId, camerIndexCode) => {
    const OCXobj = document.getElementById(ocxEleId);
    if(camerIndexCode === '') return;
    const ret = OCXobj.StartPreviewByIndexCode(camerIndexCode);
    showRetMessage('StartPreviewByIndexCode', ret, OCXobj);
  },

  /**
   * 根据监控点索引指定预览
   * @param ocxEleId
   * @param camerIndexCode
   * @param wndIndex
   * @constructor
   */
   StartInWndByIndexCode: (ocxEleId, camerIndexCode, wndIndex) => {
    const OCXobj = document.getElementById(ocxEleId);
    this.setWndNumByIndex(wndIndex, OCXobj);
    if (camerIndexCode === '') {
      return;
    }
    const ret = OCXobj.StartInWndByIndexCode(wndIndex, camerIndexCode);
    return showRetMessage('StartInWndByIndexCode', ret, OCXobj);
  },

  /**
   * 根据监控点索引空闲预览
   * @param ocxEleId
   * @param camerIndexCode
   * @constructor
   */
  StartFreeWndByIndexCode: (ocxEleId, camerIndexCode) => {
    const OCXobj = document.getElementById(ocxEleId);
    if (camerIndexCode === '') {
      return;
    }
    const ret = OCXobj.StartFreeWndByIndexCode(camerIndexCode);
    return showRetMessage('StartFreeWndByIndexCode', ret, OCXobj);
  },

  /**
   * 停止所有窗口预览
   * @param ocxEleId
   * @returns {*}
   * @constructor
   */
  StopPlayView: (ocxEleId) => {
    const OCXobj = document.getElementById(ocxEleId);
    const ret = OCXobj.StopAllPreview();
    showRetMessage('StopAllPreview', ret, OCXobj)
  },

  /**
   * 停止指定窗口预览
   * @param ocxEleId
   * @param stopWndIndex
   * @constructor
   */
  StopPreviewInWnd: (ocxEleId, stopWndIndex) => {
    const OCXobj = document.getElementById(ocxEleId);
    const ret = OCXobj.StopPreview(stopWndIndex);
    return showRetMessage('StopPreview', ret, OCXobj);
  },

  /**
   * 云台控制
   *
   接口说明：StartTask_PTZ(云台控制命令, 云台运动速度)
   控制命令代码如下：
   PLAT_ACTION_START         0       // 云台控制开始
   PLAT_ACTION_STOP          1       // 云台控制停止
   PLAT_SET_PRESET           8       // 设置预置位
   PLAT_CLE_PRESET           9       // 删除预置位
   PLAT_ZOOM_IN              11      // 镜头拉近
   PLAT_ZOOM_OUT             12      // 镜头移远
   PLAT_FOCUS_NEAR           13      // 焦点前调
   PLAT_FOCUS_FAR            14      // 焦点后调
   PLAT_IRIS_OPEN            15      // 光圈扩大
   PLAT_IRIS_CLOSE           16      // 光圈缩小
   PLAT_TILT_UP              21      // 镜头向上
   PLAT_TILT_DOWN            22      // 镜头向下
   PLAT_PAN_LEFT             23      // 镜头向左
   PLAT_PAN_RIGHT            24      // 镜头向右
   PLAT_UP_LEFT              25      // 云台上仰和左转
   PLAT_UP_RIGHT             26      // 云台上仰和右转
   PLAT_DOWN_LEFT            27      // 云台下俯和左转
   PLAT_DOWN_RIGHT           28      // 云台下俯和右转
   PLAT_PAN_AUTO             29      // 云台左右自动扫描
   *
   * @param ocxEleId
   * @param funcName
   * @constructor
   */
  PTZControl: (ocxEleId, funcName) => {
    const OCXobj = document.getElementById(ocxEleId);
    let ret = null;
    switch (funcName) {
      case 'PTZLeftUp': // 云台：左上
        ret = OCXobj.StartTask_PTZ(25, 4);
        break;
      case 'PTZUp': // 云台：上
        ret = OCXobj.StartTask_PTZ(21, 4);
        break;
      case 'PTZRightUp': // 云台：右上
        ret = OCXobj.StartTask_PTZ(26, 4);
        break;
      case 'PTZLeft': // 云台：左
        ret = OCXobj.StartTask_PTZ(23, 4);
        break;
      case 'PTZAuto': // 云台：自转
        ret = OCXobj.StartTask_PTZ(29, 4);
        break;
      case 'PTZRight': // 云台：右
        ret = OCXobj.StartTask_PTZ(24, 4);
        break;
      case 'PTZLeftDown': // 云台：左下
        ret = OCXobj.StartTask_PTZ(27, 4);
        break;
      case 'PTZDown': // 云台：下
        ret = OCXobj.StartTask_PTZ(22, 4);
        break;
      case 'PTZRightDown': // 云台：右下
        ret = OCXobj.StartTask_PTZ(28, 4);
        break;
      case 'PTZStop': // 云台：停止
        ret = OCXobj.StartTask_PTZ(1, 4);
        break;
      case 'PTZAddTimes': // 云台：焦距+
        ret = OCXobj.StartTask_PTZ(11, 4);
        break;
      case 'PTZMinusTimes': // 云台：焦距-
        ret = OCXobj.StartTask_PTZ(12, 4);
        break;
      case 'PTZFarFocus': // 云台：焦点+
        ret = OCXobj.StartTask_PTZ(13, 4);
        break;
      case 'PTZNearFocus': // 云台：焦点-
        ret = OCXobj.StartTask_PTZ(14, 4);
        break;
      case 'PTZLargeAperture': // 云台：光圈+
        ret = OCXobj.StartTask_PTZ(15, 4);
        break;
      case 'PTZSmallAperture': // 云台：光圈-
        ret = OCXobj.StartTask_PTZ(16, 4);
        break;
      default:
        return;
    }
    showRetMessage('StartTask_PTZ', ret, OCXobj);
  },

  /**
   * 设置本地化参数
   * @param ocxEleId
   * @constructor
   */
  SetlocalParam: (ocxEleId) => {
    let cRet;
    let rRet;
    const OCXobj = document.getElementById(ocxEleId);

    // 抓图参数设置
    // 图片类型 0：JPEG  1：BMP
    const PicType = 0;
    // 图片保存路径
    const PicPath = "";
    // 抓图类型 0：按时间 1：按帧
    const PicCapType = 1;
    // 连续抓图间隔时间，不能为负数(单位毫秒)
    const PicSpanTime = 500;
    // 连续抓图张数，不能为负数
    const PicCounts = 5;
    if (PicCapType === 1) {
      cRet = OCXobj.SetCaptureParam(PicType, PicPath, PicCapType, 0, PicCounts);
    } else {
      cRet = OCXobj.SetCaptureParam(PicType, PicPath, PicCapType, PicSpanTime, PicCounts);
    }
    showRetMessage('SetCaptureParam', cRet, OCXobj);

    // 录像参数设置
    // 录像保存路径
    const RecordPath = '';
    // 按大小分包时候分包大小，不能为负数
    const RecordSize = 10;
    // 按时间分包时候分包大小，不能为负数(单位为秒)
    const RecordTimes = 1800;
    // 分包类型 0按时间分包，其他按大小分包(单位为字节)
    const RecordType = 0;
    if (RecordType === 0) {
      rRet = OCXobj.SetRecordParam(RecordPath, 10, RecordTimes, RecordType);
    } else {
      rRet = OCXobj.SetRecordParam(RecordPath, RecordSize, 10, RecordType);
    }
    return showRetMessage('SetRecordParam', rRet, OCXobj);
  },

  /**
   * 设置本地化参数
   * @param ocxEleId
   * @returns {*}
   * @constructor
   */
  SetDefaultlocalParam: (ocxEleId) => {
    const OCXobj = document.getElementById(ocxEleId);
    OCXobj.SetCaptureParam(0, "C:\vedioPic", 0, 500, 10);
    OCXobj.SetRecordParam("C:\vedioRecord", 10, 1800, 0);
  },
}


export const hikPlayBack = {
  /**
   * 历史回放：设置本地化参数
   * @constructor
   */
  SetlocalParamPlayBack: (ocxEleId) => {
    const OCXobj = document.getElementById(ocxEleId);
    // 抓图参数设置
    // 图片类型 0：BMP  1：JPEG
    const PicType = 1;
    // 图片保存路径
    const PicPath = "";
    // 录像保存路径
    const RecordPath = "";
    const strXML = `<?xml version='1.0'?><Parament><CappicMode>${PicType}</CappicMode><CappicPath>${PicPath}</CappicPath><CutPath>${RecordPath}</CutPath><CutFileSize>2</CutFileSize></Parament>`;
    const ret = OCXobj.SetLocalParam(strXML);
    showRetMessage('SetlocalParamPlayBack', ret, OCXobj);
  },

  /**
   * 根据监控点ID查询并回放
   * @param ocxEleId
   * @param cameraId
   * @constructor
   */
  StartRecord: (ocxEleId, cameraId) => {
    const OCXobj = document.getElementById(ocxEleId);
    if (!(parseInt(cameraId, 10) >= 1 && parseInt(cameraId, 10) <= 2147483647) || cameraId.length === 0 || isNaN(cameraId) || cameraId === '') return;
    const ret = OCXobj.StartRecord(cameraId, 1);
    showRetMessage('StartRecord', ret, OCXobj);
  },


  /**
   * 根据监控点索引查询并回放
   * @param ocxEleId
   * @param camerIndexCode
   * @constructor
   */
  StartQueryRecordByIndex: (ocxEleId, camerIndexCode) => {
    const OCXobj = document.getElementById(ocxEleId);
    if(camerIndexCode === '') return;
    const ret = OCXobj.StartQueryRecordByIndex(camerIndexCode, 1);
    showRetMessage('StartQueryRecordByIndex', ret, OCXobj);
  },

}
