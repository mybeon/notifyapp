import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {FONTS, COLORS} from '../utils/constants';
import TopIcon from '../../assets/svg/mainIcon.svg';
import {
  cameraPermission,
  managePermission,
} from '../functions/requestPermission';
import {AppContext} from '../utils/context';
import AddListBtn from '../components/AddListBtn';
import TabContainer from '../components/TabContainer';
import Camera from '../../assets/svg/Camera';

const {height} = Dimensions.get('window');

const Home = ({navigation}) => {
  const {dispatch} = useContext(AppContext);
  useEffect(() => {
    managePermission()
      .then(res => {
        if (res.status !== 'granted') return;
        dispatch({
          type: 'currentPosition',
          value: [res.latitude, res.longitude],
        });
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  async function onCameraPress() {
    cameraPermission().then(res => {
      if (res) {
        navigation.navigate('QRscanner');
      }
    });
  }

  return (
    <View style={style.container}>
      <View style={style.upperSection}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TopIcon />
          <Text style={style.upperText}>Lists</Text>
        </View>
        <TouchableOpacity onPress={onCameraPress}>
          <Camera />
        </TouchableOpacity>
      </View>
      <TabContainer navigation={navigation} />
      <AddListBtn navigation={navigation} />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: COLORS.mainColor,
    height,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 42,
  },
  upperSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  upperText: {
    fontFamily: FONTS.medium,
    fontSize: 32,
    letterSpacing: 5,
    marginLeft: 4,
    color: 'white',
  },
});

export default Home;
