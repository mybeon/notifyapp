import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {memo} from 'react';
import {COLORS, FONTS} from '../utils/constants';
import CheckedSvg from '../../assets/svg/checked.svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const Item = ({item, itemDelete, pressedItem}) => {
  const timing = val => {
    const duration = val || 400;
    return {
      duration,
      easing: Easing.bezier(0, 0.52, 0.5, 1),
    };
  };
  const checked = item.checked;
  const checkOpacity = useSharedValue(checked ? 1 : 0);
  const checkScale = useSharedValue(checked ? 1 : 0);
  const circleBorderColor = useSharedValue(
    checked ? COLORS.accentColor : COLORS.mainColor,
  );
  const textColor = useSharedValue(
    checked ? COLORS.lightText : COLORS.mainText,
  );
  const lineWidth = useSharedValue(checked ? 100 : 0);
  const checkStyle = useAnimatedStyle(() => {
    return {
      opacity: checkOpacity.value,
      transform: [{scale: checkScale.value}],
    };
  });
  const circleStyle = useAnimatedStyle(() => {
    return {
      borderColor: circleBorderColor.value,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: textColor.value,
    };
  });

  const lineStyle = useAnimatedStyle(() => {
    return {
      width: `${lineWidth.value}%`,
    };
  });

  const itemMargin = useSharedValue(22);
  const x = useSharedValue(0);

  const dragStyle = useAnimatedStyle(() => {
    return {
      marginBottom: itemMargin.value,
      transform: [{translateX: x.value}],
    };
  });

  function deleteItem() {
    itemMargin.value = withTiming(-28, timing(600));
    x.value = withTiming(-600, timing(600));
    setTimeout(() => {
      itemDelete(item.id);
    }, 600);
  }

  async function itemPressed() {
    if (!checked) {
      textColor.value = withTiming(COLORS.lightText);
      checkOpacity.value = withSpring(1);
      checkScale.value = withSpring(1);
      circleBorderColor.value = withTiming(COLORS.accentColor);
      lineWidth.value = withTiming(100, timing());
    } else {
      textColor.value = withTiming(COLORS.mainText);
      checkOpacity.value = withSpring(0);
      checkScale.value = withSpring(0);
      circleBorderColor.value = withTiming(COLORS.mainColor);
      lineWidth.value = withTiming(0, timing());
    }
    pressedItem(item.id);
  }

  function rightAction() {
    return <View style={{width: '50%'}} />;
  }

  return (
    <Swipeable
      renderRightActions={rightAction}
      onSwipeableRightOpen={deleteItem}>
      <Animated.View style={dragStyle}>
        <Pressable onPress={itemPressed} style={style.container}>
          <View style={style.innerContainer}>
            <Animated.View style={[style.circle, circleStyle]}>
              <Animated.View style={checkStyle}>
                <CheckedSvg />
              </Animated.View>
            </Animated.View>
            <View>
              <Animated.Text
                numberOfLines={1}
                style={[style.itemText, textStyle]}>
                {item.label}
              </Animated.Text>
              <Animated.View
                style={[style.lineThrough, lineStyle]}></Animated.View>
            </View>
          </View>
          {item.number !== '' && (
            <Text style={[style.itemText, {color: COLORS.lightText}]}>
              {item.number} {item.units}
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </Swipeable>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  circle: {
    height: 28,
    width: 28,
    borderWidth: 2,
    borderColor: COLORS.mainColor,
    borderRadius: 28,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineThrough: {
    position: 'absolute',
    height: 2,
    backgroundColor: COLORS.lightText,
    left: 0,
    borderRadius: 20,
    top: 8,
    width: '100%',
  },
});

export default memo(Item);
