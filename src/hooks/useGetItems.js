import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

  async function getLocalItems() {
    try {
      const items = await AsyncStorage.getItem(`items-${id}`);
      setLoading(false);
      if (items) {
        setData(JSON.parse(items));
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function getSharedItems() {
    const result = await axios.get(
      'http://10.0.2.2:5001/notify-grocery-list/us-central1/items',
      {params: {id: id, shareKey: shareKey}},
    );
    setLoading(false);
    setData(result.data.data);
  }

  return [data, setData, loading];
};

export default useGetItems;
