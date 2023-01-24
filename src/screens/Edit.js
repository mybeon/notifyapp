import CreateList from '../components/CreateList';
import React from 'react';

const AddList = ({navigation, route}) => {
  return <CreateList route={route} navigation={navigation} type="edit" />;
};

export default AddList;
