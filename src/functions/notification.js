import PushNotification from 'react-native-push-notification';

const scheduleNotification = (date, id, title) => {
  PushNotification.localNotificationSchedule({
    id,
    channelId: 'my-channel',
    vibrate: true,
    vibration: 300,
    priority: 'high',
    visibility: 'private',
    ignoreInForeground: false,
    message: `your ${title} list is waiting for you`,
    playSound: false,
    soundName: 'default',
    date: new Date(date),
  });
};

const cancelNotification = id => {
  PushNotification.cancelLocalNotification(id);
};

export {scheduleNotification, cancelNotification};
