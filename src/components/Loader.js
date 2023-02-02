import {View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import LoaderJson from '../../assets/lotties/bloader.json';
import LoaderJsonLight from '../../assets/lotties/bloader-light.json';

const Loader = ({height, light = false}) => {
  const lottie = light ? LoaderJsonLight : LoaderJson;
  return (
    <View style={{alignItems: 'center'}}>
      <LottieView source={lottie} autoPlay loop style={{height}} />
    </View>
  );
};

export default Loader;
