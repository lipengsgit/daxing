import { hikPlayCommon, hikPlayView, hikPlayBack } from './hikSdk';

export const playView = {
  initOcx: (ocxEleId) => {
    hikPlayCommon.loginCMS(ocxEleId);
    hikPlayView.SetDefaultlocalParam(ocxEleId);
  },
  destoryOcx: (ocxEleId) => {
    hikPlayCommon.logoutCMS(ocxEleId);
  },
  changePlay: (ocxEleId, devices) => {
    if(devices === undefined || devices === null) return;

    hikPlayView.StopPlayView(ocxEleId);
    hikPlayView.setWndNumByIndex(devices.length - 1, document.getElementById(ocxEleId));

    if(Array.isArray(devices)){
      devices.forEach((item, i) => {
        hikPlayView.StartInWndByIndexCode(ocxEleId, item, i);
      });
    }else{
      hikPlayView.StartInWndByIndexCode(ocxEleId, devices, 1);
    }
  },
  videoControl: (ocxEleId, funName) => {
    hikPlayView.PTZControl(ocxEleId, funName);
  },
}

export const playBack = {
  initOcx: (ocxEleId) => {
    hikPlayCommon.loginCMS(ocxEleId);
    hikPlayBack.SetlocalParamPlayBack(ocxEleId);
  },
  destoryOcx: (ocxEleId) => {
    hikPlayCommon.logoutCMS(ocxEleId);
  },
  changePlay: (ocxEleId, deviceIndexCode) => {
    if(deviceIndexCode === 'undefined' || deviceIndexCode === undefined) return;
    hikPlayBack.StartQueryRecordByIndex(ocxEleId, deviceIndexCode)
  },
}
