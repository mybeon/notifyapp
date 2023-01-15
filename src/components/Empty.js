import {View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import empty from '../../assets/lotties/void.json';

const Loader = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <LottieView
        source={empty}
        autoPlay
        loop
        style={{width: '100%', marginTop: 50}}
      />
    </View>
  );
};

export default Loader;
