import Geolocation from 'react-native-geolocation-service';

export default function () {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => {
        resolve({latitude, longitude});
      },
      err => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
        forceRequestLocation: true,
      },
    );
  });
}
