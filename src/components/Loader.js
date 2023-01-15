import {View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import LoaderJson from '../../assets/lotties/bloader.json';

const Loader = ({height}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <LottieView source={LoaderJson} autoPlay loop style={{height}} />
    </View>
  );
};

export default Loader;
