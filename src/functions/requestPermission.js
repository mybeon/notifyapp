import {request, check, PERMISSIONS} from 'react-native-permissions';
import getLocation from './getLocation';

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
