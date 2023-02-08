import React, {useEffect} from 'react';
import Navigation from './src/utils/Navigation';
import SplashScreen from 'react-native-splash-screen';
import {ContextProvider} from './src/utils/context';
import Notification from './src/components/Notification';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ContextProvider>
      <Notification />
      <Navigation />
    </ContextProvider>
  );
};

export default App;
