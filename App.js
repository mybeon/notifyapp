import React, {useEffect} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {getReducer} from './src/utils/reducer';
import Navigation from './src/utils/Navigation';
import {StateContext, DispatchContext} from './src/utils/context';
import {COLORS} from './src/utils/constants';
import SplashScreen from 'react-native-splash-screen';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.lightColor,
    text: COLORS.mainText,
  },
};

const App = () => {
  const [state, dispatch] = getReducer();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <NavigationContainer theme={theme}>
          <Navigation />
        </NavigationContainer>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default App;
