import {useState, useEffect} from 'react';
import {getItems} from '../functions/items';

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
      setLoading(false);
      setData(result.data.data);
    });
  }

  return [data, setData, loading];
};

export default useGetItems;
