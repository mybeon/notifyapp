import QRCode from 'react-native-qrcode-svg';
import Logo from '../../docs/icon-sh.png';
import React from 'react';
import {StyleSheet, Dimensions, Pressable} from 'react-native';

const {height, width} = Dimensions.get('window');

const QRcodeGenerator = props => {
  const value = `${props.data.id}+${props.data.shareKey}+${props.data.name}`;
  return (
    <Pressable style={styles.container} onPress={props.onClose}>
      <QRCode value={value} logo={Logo} size={250} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRcodeGenerator;
