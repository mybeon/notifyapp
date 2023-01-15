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
          {message: 'hey we would like to access your location'},
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
