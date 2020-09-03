import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import {Image} from 'react-native-elements';

import {FLOWER_IMAGE} from '@env';

const {height, width} = Dimensions.get('window');

function SwipeableCard({action}) {
  const horizonatialSlide = useRef(new Animated.Value(0)).current;
  const verticalSlide = useRef(new Animated.Value(0)).current;
  const verticalVelocity = useRef(new Animated.Value(0)).current;
  const horizontalVelocity = useRef(new Animated.Value(0)).current;

  const leftAction = React.useCallback(() => action(), [action]);
  const rightAction = React.useCallback(() => action(), [action]);
  const upAction = React.useCallback(() => action(), [action]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, {dx, dy, vy, vx}) => {
        horizonatialSlide.setValue(dx);
        horizontalVelocity.setValue(vx);
        verticalSlide.setValue(dy);
        verticalVelocity.setValue(vy);
      },
      onPanResponderRelease: () => {
        if (verticalSlide._value < -100) {
          Animated.spring(verticalSlide, {
            toValue: -height,
            useNativeDriver: false,
            velocity: verticalVelocity._value * 2,
            damping: 100,
          }).start(upAction);
          Animated.spring(horizonatialSlide, {
            toValue: 0,
            useNativeDriver: false,
            velocity: 10,
            damping: 50,
            overshootClamping: false,
          }).start();
        } else if (horizonatialSlide._value > width / 2) {
          Animated.spring(horizonatialSlide, {
            toValue: 1000,
            useNativeDriver: false,
            velocity: horizontalVelocity._value * 2,
            damping: 50,
            overshootClamping: false,
          }).start(rightAction);
          Animated.spring(verticalSlide, {
            toValue: 0,
            useNativeDriver: false,
            velocity: 10,
            damping: 100,
          }).start();
        } else if (horizonatialSlide._value < -width / 2) {
          Animated.spring(horizonatialSlide, {
            toValue: -1000,
            useNativeDriver: false,
            velocity: horizontalVelocity._value * 2,
            damping: 50,
            overshootClamping: false,
          }).start(leftAction);
          Animated.spring(verticalSlide, {
            toValue: 0,
            useNativeDriver: false,
            velocity: 10,
            damping: 100,
          }).start();
        } else {
          Animated.spring(horizonatialSlide, {
            toValue: 0,
            useNativeDriver: false,
            velocity: horizontalVelocity._value * 2,
            damping: 50,
            overshootClamping: false,
          }).start();
          Animated.spring(verticalSlide, {
            toValue: 0,
            useNativeDriver: false,
            velocity: 10,
            damping: 100,
          }).start();
        }
      },
    }),
  ).current;

  const rotate = horizonatialSlide.interpolate({
    inputRange: [-width, width],
    outputRange: ['-20deg', '20deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.cardsConatiner,
        {
          transform: [
            {translateX: horizonatialSlide},
            {translateY: verticalSlide},
            {rotateZ: rotate},
          ],
        },
      ]}
      {...panResponder.panHandlers}>
      <Image
        placeholderStyle={styles.containerStyles}
        PlaceholderContent={
          <View>
            <ActivityIndicator size="large" color={'black'} />
          </View>
        }
        transition={true}
        fadeDuration={1000}
        source={{uri: FLOWER_IMAGE}}
        style={styles.imageStyles}
        containerStyle={styles.containerStyles}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardsConatiner: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    elevation: 100,
    left: 30,
    top: 50,
    width: width - 60,
    maxHeight: height - 200,
    borderRadius: 8,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  containerStyles: {
    flex: 1,
  },
});

export default SwipeableCard;
