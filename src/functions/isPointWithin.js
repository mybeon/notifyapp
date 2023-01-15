import AsyncStorage from '@react-native-async-storage/async-storage';
import {isPointWithinRadius} from 'geolib';

export default function ({latitude, longitude}) {
  return new Promise(async (resolve, reject) => {
    try {
      const positionMatches = [];
      const [locations, settings] = await AsyncStorage.multiGet([
        'lists',
        'settings',
      ]);
      const {radius} = JSON.parse(settings[1]);
      if (!locations[1]) return reject('Empty list');
      const locArr = JSON.parse(locations[1]);
      for (let i = 0; i < locArr.length; i++) {
        const isIn = isPointWithinRadius(
          {latitude: locArr[i].position[0], longitude: locArr[i].position[1]},
          {latitude, longitude},
          radius * 1000,
        );
        if (isIn) {
          positionMatches.push(locArr[i].locationName);
        }
      }
      const pusheStorage = await AsyncStorage.getItem('pushStorage');
      if (positionMatches.length) {
        if (!pusheStorage) {
          await AsyncStorage.setItem(
            'pushStorage',
            JSON.stringify({positions: positionMatches, time: Date.now()}),
          );
          resolve(positionMatches);
          return;
        }
        const notifToSend = [];
        const parsePushStorage = JSON.parse(pusheStorage);
        const hoursDiff =
          (Date.now() - parsePushStorage.time) / (1000 * 60 * 60);
        if (hoursDiff >= 12) {
          await AsyncStorage.setItem(
            'pushStorage',
            JSON.stringify({positions: [], time: Date.now()}),
          );
          parsePushStorage.positions = [];
        }
        for (let i = 0; i < positionMatches.length; i++) {
          if (!parsePushStorage.positions.includes(positionMatches[i])) {
            notifToSend.push(positionMatches[i]);
          }
        }
        if (notifToSend.length) {
          await AsyncStorage.setItem(
            'pushStorage',
            JSON.stringify({
              positions: [...notifToSend, ...parsePushStorage.positions],
              time: Date.now(),
            }),
          );
        }
        resolve(notifToSend);
      } else {
        resolve([]);
      }
    } catch (e) {
      reject(e);
    }
  });
}
