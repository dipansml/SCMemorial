import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import ImmersiveMode from 'react-native-immersive-mode';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StorageManager from '../services/StorageManager';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  LandingStudent: undefined;
};

type SplashProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'Splash'
  >;
};

const SplashScreen = ({ navigation }: SplashProps) => {
  useEffect(() => {
    // Hide both status bar & navigation bar
    StatusBar.setHidden(true);
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarMode('Full');

    console.log('Checking login status on Splash Screen...', StorageManager.isLoggedIn());

    const timer = setTimeout(async () => {
      if(await StorageManager.isLoggedIn()){
        navigation.replace('LandingStudent');
      } else {
        navigation.replace('Login');
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      // Restore bars when leaving splash
      StatusBar.setHidden(false);
      ImmersiveMode.setBarMode('Normal');
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash.png')}
        style={styles.logo}
        resizeMode="cover"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});