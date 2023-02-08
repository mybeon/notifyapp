/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import {LogBox} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import './src/utils/i18n';

if (__DEV__) {
  firestore().useEmulator('localhost', 8080);
}
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
