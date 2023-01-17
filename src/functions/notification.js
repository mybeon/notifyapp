import PushNotification from 'react-native-push-notification';

const scheduleNotification = (date, id, title) => {
  PushNotification.localNotificationSchedule({
    id,
    title: 'List reminder',
    channelId: 'my-channel',
    vibrate: true,
    vibration: 300,
    priority: 'high',
    message: `it's time to have a look at your ${title} list`,
    playSound: false,
    soundName: 'default',
    date: new Date(date),
  });
};

const cancelNotification = id => {
  PushNotification.cancelLocalNotification(id);
};

export {scheduleNotification, cancelNotification};
