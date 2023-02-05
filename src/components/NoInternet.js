import {View} from 'react-native';
import LottieView from 'lottie-react-native';
import NoInternetLottie from '../../assets/lotties/no-internet.json';
import React, {useEffect, useRef} from 'react';

const NoInternet = ({height}) => {
  const lottieRef = useRef(null);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      lottieRef.current.play();
    }, 300);
    return () => {
      clearTimeout(timeOut);
      lottieRef.current.reset();
    };
  }, []);
  return (
    <View style={{alignItems: 'center', marginTop: 50}}>
      <LottieView
        ref={lottieRef}
        source={NoInternetLottie}
        loop={false}
        style={{height}}
      />
    </View>
  );
};

export default NoInternet;
