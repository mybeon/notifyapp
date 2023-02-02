import {createContext} from 'react';
import {useImmerReducer} from 'use-immer';
import React from 'react';

export const AppContext = createContext();

const initialState = {
  lists: null,
  sharedListsCount: 0,
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
      draft.lists = action.data;
      break;
    case 'updateLists':
      draft.lists = [action.data, ...draft.lists];
      break;
    case 'updateSharedListsCount':
      draft.sharedListsCount++;
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
