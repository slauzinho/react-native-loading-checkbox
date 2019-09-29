import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { useMemoOne } from 'use-memo-one';
import PropTypes from 'prop-types';

const {
  Value,
  set,
  useCode,
  cond,
  eq,
  Clock,
  timing,
  startClock,
  clockRunning,
  stopClock,
  block,
  lessOrEq,
  debug,
  color,
  interpolate,
  and,
  not,
} = Animated;

const loop = loopConfig => {
  const { clock, easing, duration, boomerang, autoStart } = {
    clock: new Clock(),
    easing: Easing.linear,
    duration: 500,
    boomerang: false,
    autoStart: true,
    ...loopConfig,
  };
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    toValue: new Value(1),
    duration,
    easing,
  };

  return block([
    cond(and(not(clockRunning(clock)), autoStart ? 1 : 0), startClock(clock)),
    timing(clock, state, config),
    cond(state.finished, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      boomerang
        ? set(config.toValue, cond(eq(config.toValue, 1), 0, 1))
        : set(state.position, 0),
    ]),
    state.position,
  ]);
};

function runTiming({ from, toValue, duration }) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    duration,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  const reset = [
    set(state.finished, 0),
    set(state.time, 0),
    set(state.position, from),
    set(state.frameTime, 0),
    set(config.toValue, toValue),
    startClock(clock),
  ];

  return [
    cond(clockRunning(clock), 0, [...reset, startClock(clock)]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

const Ring = props => {
  const { animation, clock } = useMemoOne(
    () => ({
      animation: new Value(0),
      clock: new Clock(),
    }),
    []
  );

  const from = {
    r: 222,
    g: 222,
    b: 222,
  };
  const to = {
    r: 0,
    g: 26,
    b: 112,
  };

  useCode(
    cond(
      eq(props.finish, 1),
      set(
        animation,
        runTiming({
          from: animation,
          toValue: 0.5,
          duration: 500,
        })
      ),
      set(
        animation,
        debug(
          'run loop',
          loop({
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            boomerang: true,
          })
        )
      )
    ),

    [props.finish]
  );

  const dimensions = {
    width: props.size,
    height: props.size,
    borderRadius: props.size / 2,
  };
  const scaleLight = interpolate(animation, {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 1.5],
  });

  return (
    <View>
      <Animated.View
        style={[
          style.bigCircle,
          {
            transform: [{ scale: scaleLight }],
            borderColor: props.finish
              ? 'rgba(0,26,112,1)'
              : 'rgba(222,222,222,1)',
            ...dimensions,
          },
        ]}
      />
    </View>
  );
};

Ring.propTypes = {
  size: PropTypes.number,
  colorBigCircle: PropTypes.string,
  colorSmallCircle: PropTypes.string,
};

Ring.defaultProps = {
  colorBigCircle: 'rgba(222,222,222, 0.3)',
  colorSmallCircle: 'rgba(222, 222, 222, 1)',
  size: 50,
};

const style = StyleSheet.create({
  smallCircle: {
    width: 1,
    height: 1,
    borderRadius: 50,
    borderWidth: 4,
    alignSelf: 'center',
  },
  bigCircle: {
    width: 1,
    height: 1,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default Ring;
