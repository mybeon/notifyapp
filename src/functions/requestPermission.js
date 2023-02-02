import {request, check, PERMISSIONS} from 'react-native-permissions';
import getLocation from './getLocation';
import {Camera} from 'react-native-vision-camera';

export function managePermission() {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPermission = await check(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (checkPermission === 'granted') {
        const {latitude, longitude} = await getLocation();
        resolve({status: 'granted', latitude, longitude});
        return;
      } else {
        const requestPermission = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          {
            message:
              "The app needs access to your location in order to fully take advantage of it's features. No data will be collected or sent to any server. Feel free to decline the request.",
            buttonNeutral: 'I understand',
            title: 'Note',
          },
        );
        if (requestPermission !== 'granted') resolve({status: 'denied'});
        const {latitude, longitude} = await getLocation();
        resolve({status: 'granted', latitude, longitude});
      }
    } catch (e) {
      reject(e);
    }
  });
}

export function cameraPermission() {
  return new Promise(async (res, rej) => {
    try {
      const checkPermission = await Camera.getCameraPermissionStatus();
      switch (checkPermission) {
        case 'authorized':
          res(true);
          break;
        case 'denied':
          const request = await Camera.requestCameraPermission();
          if (request === 'authorized') {
            res(true);
          } else {
            res(false);
          }
          break;
        default:
          break;
      }
    } catch (e) {
      rej(e);
    }
  });
}
