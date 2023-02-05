import 'react-native-reanimated';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {AppContext} from '../utils/context';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import BackSvg from '../../assets/svg/back-map.svg';
import {COLORS} from '../utils/constants';
import {storeList} from '../functions/storage';

const {width} = Dimensions.get('window');

const QRscanner = props => {
  const {dispatch} = useContext(AppContext);
  const [isActive, setIsActive] = useState(true);
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    if (barcodes.length && barcodes[0].content.data.includes('+')) {
      const qrData = barcodes[0].content.data.split('+');
      const id = qrData[0];
      const shareKey = qrData[1];
      const name = qrData[2];
      const newList = {
        id,
        shareKey,
        name,
        shared: true,
      };
      storeList(newList, 'shared')
        .then(() => {
          dispatch({type: 'updateLists', data: newList, listType: 'shared'});
          setIsActive(false);
          props.navigation.goBack();
        })
        .catch(err => {
          console.log('QRscanner useEffect error', err);
        });
    }
  }, [barcodes]);

  if (device == null) {
    return (
      <ActivityIndicator
        size={50}
        color={COLORS.mainColor}
        style={styles.activity}
      />
    );
  }
  return (
    <>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          setIsActive(false);
          props.navigation.goBack();
        }}>
        <BackSvg />
      </TouchableOpacity>
      <Camera
        style={styles.camera}
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        frameProcessorFps={1}
      />
      <BarcodeMask width={300} height={300} />
    </>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width,
  },
  backBtn: {
    zIndex: 10,
    position: 'absolute',
    top: 16,
    left: 16,
    elevation: 35,
    backgroundColor: COLORS.lightColor,
    borderRadius: 50,
  },
  activity: {
    flex: 1,
  },
});

export default QRscanner;
