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
  TouchableOpacity,
} from 'react-native';
import Colors from '../theme/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  DashboardParents: undefined;
};
 
  type LoginProps = {
    navigation: NativeStackNavigationProp<
      RootStackParamList,
      'DashboardParents'
    >;
  };

const Login = ({ navigation }: LoginProps) =>  {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    console.log('login click')
    navigation.replace('DashboardParents');
 }
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
              <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={handleLogin}
                  disabled={loading}>
                  
                  <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
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
button_border: {
    height: 40,
    borderColor: Colors.button_color,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
},
 
buttonContent: {
  flexDirection: 'row',
  alignItems: 'center',   // 👈 vertical center
  justifyContent: 'center', // 👈 horizontal center
},
 
buttonText: {
  color: '#fff',
  fontSize: 14,
  fontFamily: Platform.OS === 'ios' ? 'Roboto Bold' : 'Roboto-Bold',
  textAlignVertical: 'center',
},
 
 
buttonText_black: {
  color: '#000',
  fontSize: 14,
  fontFamily: Platform.OS === 'ios' ? 'Roboto Bold' : 'Roboto-Bold',
  textAlignVertical: 'center',
},
button: {
    height: 40,
    backgroundColor: Colors.button_color,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
},
});
