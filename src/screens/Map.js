import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {StateContext, DispatchContext} from '../utils/context';
import BackBtn from '../../assets/svg/back-map.svg';
import SaveMap from '../../assets/svg/save-map.svg';
import {COLORS, TYPO} from '../utils/constants';
import axios from 'axios';
import Loader from '../components/Loader';
import config from 'react-native-config';

const {height, width} = Dimensions.get('window');
const Map = ({navigation, route}) => {
  const {currentPosition} = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [markerPosition, setMarkerPosition] = useState(undefined);
  const [disableBtn, setDisableBtn] = useState(false);
  function onMapPress(e) {
    if (disableBtn) return;
    setMarkerPosition(e.nativeEvent.coordinate);
  }

  useEffect(() => {
    if (route.params?.position) {
      setMarkerPosition({
        latitude: route.params.position[0],
        longitude: route.params.position[1],
      });
    }
  }, []);

  function saveLocation() {
    if (markerPosition) {
      setDisableBtn(true);
      const {latitude, longitude} = markerPosition;
      axios
        .get(
          `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude}%2C${longitude}&lang=fr-FR&apiKey=${config.GEO_API}`,
        )
        .then(res => {
          appDispatch({type: 'setListPosition', value: [latitude, longitude]});
          appDispatch({
            type: 'locationChange',
            value: res.data.items[0].title,
            search: true,
          });
          navigation.goBack();
          setDisableBtn(false);
        })
        .catch(err => console.log(err));
    }
  }

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={style.backBtn}
        onPress={() => navigation.goBack()}
        disabled={disableBtn}>
        <BackBtn />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={saveLocation}
        activeOpacity={0.8}
        style={style.save}
        disabled={disableBtn}>
        {disableBtn ? (
          <Loader height={30} />
        ) : (
          <>
            <Text style={style.saveText}>Save</Text>
            <SaveMap />
          </>
        )}
      </TouchableOpacity>
      <MapView
        onPress={onMapPress}
        provider={PROVIDER_GOOGLE}
        style={style.map}
        initialRegion={{
          latitude: route.params?.position
            ? route.params.position[0]
            : currentPosition[0],
          longitude: route.params?.position
            ? route.params.position[1]
            : currentPosition[1],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={false}>
        {markerPosition && <Marker coordinate={markerPosition} />}
      </MapView>
    </View>
  );
};

const style = StyleSheet.create({
  map: {
    height,
    width,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: COLORS.lightColor,
    borderRadius: 50,
    elevation: 35,
  },
  save: {
    position: 'absolute',
    bottom: 42,
    right: 16,
    zIndex: 10,
    backgroundColor: COLORS.lightColor,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 35,
    alignItems: 'center',
    borderRadius: 8,
  },
  saveText: {
    marginRight: 10,
    ...TYPO.medium,
    color: COLORS.accentColor,
  },
});

export default Map;
