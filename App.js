import React, {useEffect} from 'react';
import Navigation from './src/utils/Navigation';
import SplashScreen from 'react-native-splash-screen';
import {ContextProvider} from './src/utils/context';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ContextProvider>
      <Navigation />
    </ContextProvider>
  );
};

export default App;
