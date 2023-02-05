import React, {useEffect, useContext} from 'react';
import SwipeList from './SwipeList';
import {getLists} from '../../functions/storage';
import {AppContext} from '../../utils/context';
const LocalList = props => {
  const {state, dispatch} = useContext(AppContext);
  useEffect(() => {
    getLists().then(data => {
      dispatch({type: 'setLists', data, listType: 'local'});
    });
  }, []);
  return <SwipeList data={state.local} navigation={props.navigation} />;
};

export default LocalList;
