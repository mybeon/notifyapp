import {useState, useEffect} from 'react';
import {getItems} from '../functions/storage';

const useGetItems = (id, shared, shareKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shared) {
      getSharedItems();
    } else {
      getLocalItems();
    }
  }, []);

  function getLocalItems() {
    getItems(id).then(res => {
      setLoading(false);
      setData(res);
    });
  }

  function getSharedItems() {
    getItems(id, shareKey).then(result => {
      console.log(result.data);
      setLoading(false);
      setData(result.data.items);
    });
  }

  return [data, setData, loading];
};

export default useGetItems;
