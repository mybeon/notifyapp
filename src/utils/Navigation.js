import React from 'react';
import Home from '../screens/Home';
import Map from '../screens/Map';
import AddList from '../screens/AddList';
import List from '../screens/List';
import Edit from '../screens/Edit';
import {createStackNavigator} from '@react-navigation/stack';

const Navigation = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="AddList" component={AddList} />
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="Edit" component={Edit} />
    </Stack.Navigator>
  );
};

export default Navigation;
