import {useEffect, useState, useContext} from 'react';
import {getListsCount} from '../functions/storage';
import {AppContext} from '../utils/context';

const useGetListsCount = () => {
  const {state} = useContext(AppContext);
  const [count, setCount] = useState({local: 0, shared: 0});
  function getCount(type) {
    getListsCount(type).then(res => {
      setCount(prev => ({...prev, [type]: res}));
    });
  }
  useEffect(() => {
    if (state.local === null) {
      getCount('local');
    } else {
      setCount(prev => ({...prev, local: state.local.length}));
    }
    if (state.shared === null) {
      getCount('shared');
    } else {
      setCount(prev => ({...prev, shared: state.shared.length}));
    }
  }, [state.local, state.shared]);

  return count;
};

export default useGetListsCount;
