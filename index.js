/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import {LogBox} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {URLS} from './src/utils/constants';
import axios from 'axios';

let url = URLS.prod;
if (__DEV__) {
  url = URLS.dev;
  firestore().useEmulator('localhost', 8080);
}
export const axiosFunctions = axios.create({baseURL: url});

LogBox.ignoreLogs(['Require cycle', 'react-native-gesture-handler']);

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
  {
    channelId: 'my-channel',
    channelName: 'My channel',
  },
  created => console.log(`CreateChannel returned '${created}'`),
);

AppRegistry.registerComponent(appName, () => App);
