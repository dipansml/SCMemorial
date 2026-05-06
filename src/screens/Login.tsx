import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import Colors from '../theme/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontSize, FontFamily } from '../theme/fonts_dimen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Api } from '../services/Api';
import StorageManager from '../services/StorageManager';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  StudentSelection: undefined;
  LandingStudent: undefined;
};
 
  type LoginProps = {
    navigation: NativeStackNavigationProp<
      RootStackParamList,
      'StudentSelection'
    >;
  };

const Login = ({ navigation }: LoginProps) =>  {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<'student' | 'parent'>('student');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ studentId?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

 const validateLogin = () => {
      const newErrors: { studentId?: string; password?: string } = {};
      console.log('studentId:', studentId)
      if (!studentId.trim()) newErrors.studentId = 'Please enter student ID';
      if (!password.trim()) newErrors.password = 'Please enter password';
      setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    console.log('login click')
    if (selected === 'parent') {
      navigation.replace('StudentSelection');
    } else {
       callStudentLoginApi();
    }
 }

 const forgotPassClick = () => {
  console.log("Forgot pass click")
};

const callStudentLoginApi = async () => {
  if (loading) return; // prevent multiple clicks

  setLoading(true);

  try {
    const res = await Api.studentLogin({
      username: studentId.trim(),
      password: password.trim(),
    });

    console.log('Login API Response:', res);

    // ✅ Validate response safely
    if (res && res.status === 200 && res.data) {
      const token = res.data.token;
      const user = res.data.user;

      console.log('Token:', token);
      console.log('User:', user?.name);

      // ✅ Save token (important for future APIs)
      if (token) {
          await StorageManager.setToken(token);
      }

      if (user) {
          await StorageManager.setUser(user);
      }

      // ✅ Navigate after success
      navigation.replace('LandingStudent');

    } else {
      // ❌ API returned failure
      Alert.alert(
        'Login Failed',
        res?.message || 'Invalid username or password'
      );
    }

  } catch (error: any) {
    console.log('Login Error:', error?.response?.data || error.message);

    // ❌ Network / server error
    Alert.alert(
      'Login Error',
      error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.'
    );

  } finally {
    setLoading(false);
  }
};

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
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
              <FullScreenLoader visible={loading} />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.title_normal}>Please select your account type to continue.</Text>
              <View style={styles.toggleContainer}>
        
                    <TouchableOpacity
                      style={[
                        styles.buttonToggle,
                        selected === 'student' && styles.activeButton,
                        ]}
                        onPress={() => setSelected('student')}
                    >
                      <View style={styles.row}>
                        <Image
                          source={require('../assets/images/student.png')}
                          style={[
                            styles.toggleIconImage,
                              { tintColor: selected === 'student'
                                ? Colors.text_theme
                                : Colors.inactive_text }
                          ]}
                          resizeMode="contain"
                        />

                        <Text
                          style={[
                            styles.inactiveText,
                            selected === 'student' && styles.activeText,
                          ]}
                        >
                          {' '}Student
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.buttonToggle,
                        selected === 'parent' && styles.activeButton,
                        ]}
                        onPress={() => setSelected('parent')}
                    >
                      <View style={styles.row}>
                        <Image
                          source={require('../assets/images/parent.png')}
                          style={[
                            styles.toggleIconImage,
                            styles.toggleIconImage,
                              { tintColor: selected === 'parent'
                                ? Colors.text_theme
                                : Colors.inactive_text }
                          ]}
                          resizeMode="contain"
                        />

                        <Text
                          style={[
                            styles.inactiveText,
                            selected === 'parent' && styles.activeText,
                          ]}
                        >
                          {' '}Parent
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                    <Text style={styles.input_header}>Student ID</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                          <Image
                            source={require('../assets/images/student_id.png')}
                            style={styles.inputIcon}
                          />
                          <TextInput
                            style={[styles.input, errors.studentId && styles.errorInput]}
                            placeholder="Enter your ID"
                            placeholderTextColor={Colors.text_hint}
                            value={studentId}
                            onChangeText={t => {
                              setStudentId(t);
                              setErrors({ ...errors, studentId: undefined });
                            }}
                          />
                        </View>
                        {errors.studentId && <Text style={styles.errorText}>{errors.studentId}</Text>}
                    </View>
                    <Text style={styles.input_header}>Password</Text>
                      <View style={styles.inputContainer}>
                      <View style={styles.inputWrapper}>
                        <Image
                          source={require('../assets/images/ic_password.png')}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[styles.input, errors.password && styles.errorInput]}
                          placeholder="******"
                          secureTextEntry={!showPassword}
                          value={password}
                          onChangeText={t => {
                            setPassword(t);
                            if (errors.password) {
                                setErrors(prev => ({ ...prev, password: undefined }));
                            }
                          }}
                        />
                        <TouchableOpacity
                              style={[styles.eyeIcon, loading && { opacity: 0.5 }]}
                              onPress={() => !loading && setShowPassword(p => !p)}
                              disabled={loading}
                            >
                              <Image
                                source={
                                  showPassword
                                    ? require('../assets/images/pass_visible.png')
                                    : require('../assets/images/pass_invisible.png')
                                }
                                style={styles.eyeImage}
                              />
                            </TouchableOpacity>
                      </View>
                       <Text style={styles.errorText1}>
                          {errors.password ? errors.password : ''} {/* 👈 keeps space */}
                        </Text>
                    <View style={styles.container_horizontal_without_space}>
                      <TouchableOpacity
                            style={styles.rememberMeContainer}
                            onPress={() => setRememberMe(p => !p)}
                          >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                              {rememberMe && (
                                <Image
                                  source={require('../assets/images/check.png')}
                                  style={styles.checkIcon}
                                />
                              )}
                            </View>
                            <Text style={styles.rememberMeText}>Remember me</Text>
                          </TouchableOpacity>
                        <Text style={styles.forget_pass} onPress={forgotPassClick}>
                          Forgot Password?
                        </Text>
                    </View>
                    </View>  
 
                      <TouchableOpacity
                              style={[styles.button, loading && { opacity: 0.7 }]}
                              onPress={handleLogin}
                              disabled={loading}>
                              
                              <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
            </ScrollView>
            </KeyboardAvoidingView>
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
      backgroundColor: 'Colors.background_login',
},
    container: {
      flex: 1,
      backgroundColor: 'Colors.background_login',
      justifyContent: 'flex-start',
      padding: 20,
},
    
 scrollContent: {
    padding: 0,
    flexGrow: 1,
  },
 
  title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        color: Colors.text,
        fontFamily: FontFamily.bold,
  },
  title_normal: {
        fontSize: 12,
        textAlign: 'center',
        marginTop:10,
        marginBottom: 20,
        color: Colors.text_light,
        fontFamily: FontFamily.regular,
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
  fontSize: FontSize.regular,
  fontFamily: FontFamily.bold,
  textAlignVertical: 'center',
},
 
 
buttonText_black: {
  color: '#000',
  fontSize: FontSize.regular,
  fontFamily: FontFamily.bold,
  textAlignVertical: 'center',
},
button: {
    height: 40,
    backgroundColor: Colors.button_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
},
toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.toggleContainer,
    borderRadius: 16,
    marginTop:20,
    padding: 4,
  },

  buttonToggle: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeButton: {
    backgroundColor: Colors.white,
    // elevation: 2, // Android shadow
    // shadowColor: '#000', // iOS shadow
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
  },

  inactiveText: {
    color: Colors.inactive_text,
    fontSize: FontSize.regular,
    fontFamily: FontFamily.bold,
  },

  activeText: {
    color: Colors.text_theme,
    fontFamily: FontFamily.bold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // optional (RN 0.71+)
},
toggleIconImage: {
  width: 16,
  height: 16,
  marginRight: 5,
},
input_header: {
        fontSize: 12,
        textAlign: 'left',
        marginBottom: 5,
        color: Colors.text,
        fontFamily: FontFamily.bold,
        width: '100%',
        marginTop: 20,
  },
 
inputContainer: {
    width: '100%',
    backgroundColor: Colors.transparent,
    marginTop: 3,
},
 
inputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: Colors.inputBorder,
  backgroundColor: Colors.inputBackground,
  borderRadius: 16,
  paddingHorizontal: 10,
},
 input: {
    padding: 4,
    fontSize: FontSize.small,
    width: '100%',
    height: 40,
    flex: 1,
    paddingVertical: 12,
    fontFamily: FontFamily.regular,
    color: Colors.textColorInpuHeader,
},
 
  errorInput: {
    borderColor: 'red',
},
inputIcon: {
  width: 16,
  height: 16,
  marginRight: 4,
  tintColor: Colors.tintColor,
},
eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
eyeImage: {
    width: 20,
    height: 20,
    tintColor: Colors.tintColor,
    resizeMode: 'contain',
  },
errorText: {
   color: 'red',
   marginTop: 4,
   fontSize: FontSize.small,
   flexWrap: 'wrap',
   fontFamily: FontFamily.regular,
  },  
container_horizontal_without_space: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
},
 
errorText1: {
  color: 'red',
  fontSize: FontSize.small,
  flex: 1,  
  marginRight: 10,
  marginTop:5,
  marginBottom: 5,
  fontFamily: FontFamily.regular,
},
 
forget_pass: {
  fontSize: FontSize.small,
  color : Colors.text_orange,
  fontFamily: FontFamily.bold,
},  
rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: Colors.text_light,
    backgroundColor: Colors.inputBackground,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  checkboxChecked: {
    backgroundColor: Colors.inputBackground,
  },
 
  checkIcon: {
    width: 12,
    height: 12,
    tintColor: Colors.text_hint,
    resizeMode: 'contain',
  },
 
  rememberMeText: {
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.semiBold,
  },
});
