import React from 'react';
import Home from '../screens/Home';
import Map from '../screens/Map';
import AddList from '../screens/AddList';
import List from '../screens/List';
import Edit from '../screens/Edit';
import QRscanner from '../screens/QRscanner';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {COLORS} from './constants';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.lightColor,
    text: COLORS.mainText,
  },
};

const Navigation = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="AddList" component={AddList} />
        <Stack.Screen name="List" component={List} />
        <Stack.Screen name="Edit" component={Edit} />
        <Stack.Screen name="QRscanner" component={QRscanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
