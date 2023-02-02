import {View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';
import empty from '../../assets/lotties/void.json';

const Loader = () => {
  const lottieRef = useRef(null);
  useEffect(() => {
    lottieRef.current?.play();
    return () => lottieRef.current?.reset();
  }, []);
  return (
    <View style={{alignItems: 'center'}}>
      <LottieView
        ref={lottieRef}
        source={empty}
        autoPlay={false}
        loop
        style={{width: '100%', marginTop: 50}}
      />
    </View>
  );
};

export default Loader;
