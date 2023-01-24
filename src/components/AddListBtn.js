import {TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../utils/constants';
import AddListSvg from '../../assets/svg/addList.svg';
import React from 'react';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const {height} = Dimensions.get('window');

const AddListBtn = props => {
  const xAxis = useSharedValue(0);
  const yAxis = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_event, ctx) => {
      ctx.startX = xAxis.value;
      ctx.startY = yAxis.value;
    },
    onActive: (event, ctx) => {
      xAxis.value = ctx.startX + event.translationX;
      yAxis.value = ctx.startY + event.translationY;
    },
    onEnd: event => {
      if (event.absoluteY < 50 || event.absoluteY > height - 50) {
        yAxis.value = withSpring(0);
      }
      xAxis.value = withSpring(0);
    },
  });
  const animateStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: xAxis.value}, {translateY: yAxis.value}],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[style.addListContainer, animateStyle]}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('AddList');
          }}
          activeOpacity={0.7}>
          <AddListSvg />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const style = StyleSheet.create({
  addListContainer: {
    backgroundColor: 'red',
    height: 70,
    width: 70,
    borderRadius: 70,
    backgroundColor: COLORS.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    right: 18,
    zIndex: 10,
    elevation: 10,
  },
});

export default AddListBtn;
