import React from 'react';
import SwipeList from './SwipeList';

const SharedList = props => {
  const listIds = props.data?.filter(item => item.shared);
  return <SwipeList data={listIds} navigation={props.navigation} />;
};

export default SharedList;