import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Ring from './Ring';
import LottieView from 'lottie-react-native';
import Animated from 'react-native-reanimated';

const { Value } = Animated;

export default function App() {
  const animation = useRef();
  const [finish, setfinish] = useState(0);

  const handlePress = () => {
    setfinish(1);
    animation.current.play();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <>
          <LottieView
            ref={animation}
            style={{
              width: 50,
              height: 50,
              position: 'absolute',
              alignSelf: 'center',
              zIndex: 10,
            }}
            source={require('./data.json')}
            autoPlay={false}
            loop={false}
          />
          <Ring
            size={75}
            colorBigCircle={'rgba(0,26,112,0.8)'}
            colorSmallCircle={'rgba(0,26,112,1)'}
            finish={finish}
          />
        </>
      </View>

      <Button onPress={handlePress} title="Finish" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
