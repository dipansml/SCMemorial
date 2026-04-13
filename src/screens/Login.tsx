import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Colors from '../theme/colors';

const { width } = Dimensions.get('window');

const Login = () => {
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
         <ImageBackground
            source={require('../assets/images/login_top.png')} 
            style={styles.curve}
            resizeMode="cover">
            <Image
                source={require('../assets/images/logo.png')} // your logo
                style={styles.logo}
                resizeMode="contain"
            />    
          </ImageBackground>
          <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
              <FullScreenLoader visible={loading} />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.title_normal}>Please select your account type to continue.</Text>
            </ScrollView>
          </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const FullScreenLoader = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;
 
  return (
    <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loaderText}>Loading...</Text>
    </View>
  );
};
 

const styles = StyleSheet.create({
  screen: {
      flex: 1,
      backgroundColor: '#FFFFFF',
},
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 10,
      margin: 10,
},
 
 scrollContent: {
    padding: 0,
  },
 
  title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        color: Colors.text,
        fontFamily: Platform.OS === 'ios' ? 'Roboto Bold' : 'Roboto-Bold',
  },
  title_normal: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
        color: Colors.text_light,
        fontFamily: Platform.OS === 'ios' ? 'Roboto Regular' : 'Roboto-Regular',
  },
  content: {
    flex: 1,
  },
   curve: {
    height: 250,
    width: '100%',
    justifyContent: 'center',  
    alignItems: 'center', 
  },
  logo: {
    width: 150,
    height: 150,
},
loaderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
},
 
loaderText: {
        marginTop: 12,
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
},
});
