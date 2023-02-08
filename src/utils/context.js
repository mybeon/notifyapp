import {createContext} from 'react';
import {useImmerReducer} from 'use-immer';
import React from 'react';

export const AppContext = createContext();

const initialState = {
  local: null,
  shared: null,
  firstLoad: false,
  notification: null,
  addListData: {
    name: '',
    location: '',
    fromSearch: false,
    position: [],
    date: null,
  },
  currentPosition: [],
};

function ourReducer(draft, action) {
  switch (action.type) {
    case 'setLists':
      draft[action.listType] = action.data;
      break;
    case 'updateLists':
      if (draft[action.listType] === null) {
        draft[action.listType] = [action.data];
      } else {
        draft[action.listType] = [action.data, ...draft[action.listType]];
      }
      break;
    case 'loaded':
      draft.firstLoad = true;
      break;
    case 'dateChange':
      draft.addListData.date = action.value;
      break;
    case 'locationChange':
      draft.addListData.fromSearch = false;
      if (action.search) {
        draft.addListData.fromSearch = true;
      }
      draft.addListData.location = action.value;
      break;
    case 'nameChange':
      draft.addListData.name = action.value;
      break;
    case 'setListPosition':
      draft.addListData.position = action.value;
      break;
    case 'clearList':
      draft.addListData.location = '';
      draft.addListData.name = '';
      draft.addListData.position = [];
      draft.addListData.date = null;
      break;
    case 'currentPosition':
      draft.currentPosition = action.value;
      break;
    case 'notification':
      draft.notification = {success: action.success, message: action.message};
      break;
    case 'clearNotification':
      draft.notification = null;
      break;
    default:
  }
}

export const ContextProvider = props => {
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  return (
    <AppContext.Provider value={{state, dispatch}}>
      {props.children}
    </AppContext.Provider>
  );
};
