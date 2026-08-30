import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
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

import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import Colors from '../theme/colors';
import {FontSize, FontFamily} from '../theme/fonts_dimen';
import {Api} from '../services/Api';

type RootStackParamList = {
  Login: undefined;
  LandingStudent: undefined;

  ResetPassword: {
    email: string;
    userId: string;
  };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResetPassword'
>;

const ResetPassword = ({
  navigation,
  route,
}: Props) => {
  const {email, userId} = route.params;

  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showVerifyPassword, setShowVerifyPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    password?: string;
    verifyPassword?: string;
  }>({});

  /* ============================================
     VALIDATE PASSWORD
  ============================================ */

  const validatePassword = () => {
    const newErrors: {
      password?: string;
      verifyPassword?: string;
    } = {};

    if (!password.trim()) {
      newErrors.password =
        'Please enter new password';
    }

    if (!verifyPassword.trim()) {
      newErrors.verifyPassword =
        'Please verify your password';
    }

    if (
      password.trim() &&
      verifyPassword.trim() &&
      password !== verifyPassword
    ) {
      newErrors.verifyPassword =
        'Passwords do not match';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ============================================
     RESET PASSWORD
  ============================================ */

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      /*
       * Add your actual reset password API here.
       *
       * Example:
       *
       * const res = await Api.resetPassword({
       *   user_id: userId,
       *   email: email,
       *   password: password.trim(),
       *   confirm_password: verifyPassword.trim(),
       * });
       */

      console.log('Reset Password Data:', {
        userId,
        email,
        password,
      });

      Alert.alert(
        'Password Updated',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Login',
                  },
                ],
              });
            },
          },
        ],
      );
    } catch (error: any) {
      console.log(
        'Reset Password Error:',
        error?.response?.data ||
          error?.message,
      );

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>

      {/* ==========================================
          MAIN SCREEN
      ========================================== */}

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 80 : 0
        }>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          nestedScrollEnabled={true}
          automaticallyAdjustKeyboardInsets={
            false
          }>

          <View style={styles.content}>

            {/* ==================================
                TOP IMAGE
            ================================== */}

            <ImageBackground
              source={require('../assets/images/login_top.png')}
              style={styles.curve}
              resizeMode="cover">

              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />

            </ImageBackground>

            {/* ==================================
                FORM
            ================================== */}

            <View style={styles.container}>

              <Text style={styles.title}>
                Set New Password
              </Text>

              <Text style={styles.titleNormal}>
                Create a new password for your
                account.
              </Text>

              {/* =================================
                  NEW PASSWORD
              ================================= */}

              <Text style={styles.inputHeader}>
                New Password
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  errors.password &&
                    styles.errorInput,
                ]}>

                <Image
                  source={require('../assets/images/ic_password.png')}
                  style={styles.inputIcon}
                  resizeMode="contain"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  placeholderTextColor={
                    Colors.text_hint
                  }
                  secureTextEntry={
                    !showPassword
                  }
                  value={password}
                  onChangeText={text => {
                    setPassword(text);

                    if (errors.password) {
                      setErrors(previous => ({
                        ...previous,
                        password: undefined,
                      }));
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() =>
                    setShowPassword(
                      previous => !previous,
                    )
                  }
                  disabled={loading}
                  activeOpacity={0.7}>

                  <Image
                    source={
                      showPassword
                        ? require('../assets/images/pass_visible.png')
                        : require('../assets/images/pass_invisible.png')
                    }
                    style={styles.eyeImage}
                    resizeMode="contain"
                  />

                </TouchableOpacity>

              </View>

              <View
                style={styles.errorContainer}>

                {errors.password ? (
                  <Text style={styles.errorText}>
                    {errors.password}
                  </Text>
                ) : null}

              </View>

              {/* =================================
                  VERIFY PASSWORD
              ================================= */}

              <Text style={styles.inputHeader}>
                Verify Password
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  errors.verifyPassword &&
                    styles.errorInput,
                ]}>

                <Image
                  source={require('../assets/images/ic_password.png')}
                  style={styles.inputIcon}
                  resizeMode="contain"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor={
                    Colors.text_hint
                  }
                  secureTextEntry={
                    !showVerifyPassword
                  }
                  value={verifyPassword}
                  onChangeText={text => {
                    setVerifyPassword(text);

                    if (
                      errors.verifyPassword
                    ) {
                      setErrors(previous => ({
                        ...previous,
                        verifyPassword:
                          undefined,
                      }));
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() =>
                    setShowVerifyPassword(
                      previous => !previous,
                    )
                  }
                  disabled={loading}
                  activeOpacity={0.7}>

                  <Image
                    source={
                      showVerifyPassword
                        ? require('../assets/images/pass_visible.png')
                        : require('../assets/images/pass_invisible.png')
                    }
                    style={styles.eyeImage}
                    resizeMode="contain"
                  />

                </TouchableOpacity>

              </View>

              <View
                style={styles.errorContainer}>

                {errors.verifyPassword ? (
                  <Text style={styles.errorText}>
                    {
                      errors.verifyPassword
                    }
                  </Text>
                ) : null}

              </View>

              {/* =================================
                  SET PASSWORD BUTTON
              ================================= */}

              <TouchableOpacity
                style={[
                  styles.button,
                  loading &&
                    styles.buttonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={loading}
                activeOpacity={0.8}>

                <Text style={styles.buttonText}>
                  Set Password
                </Text>

              </TouchableOpacity>

              {/* =================================
                  BACK
              ================================= */}

              <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                  navigation.goBack()
                }
                disabled={loading}
                activeOpacity={0.7}>

                <Text
                  style={
                    styles.backButtonText
                  }>
                  Back
                </Text>

              </TouchableOpacity>

            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ==========================================
          FULL SCREEN LOADER

          IMPORTANT:
          OUTSIDE KeyboardAvoidingView
      ========================================== */}

      {loading && (
        <View
          style={styles.loaderOverlay}
          pointerEvents="auto">

          <View
            style={styles.loaderCenter}>

            <ActivityIndicator
              size="large"
              color="#007AFF"
            />

            <Text
              style={styles.loaderText}>
              Loading...
            </Text>

          </View>

        </View>
      )}

    </SafeAreaView>
  );
};

export default ResetPassword;

/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      Colors.background_login,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  content: {
    flexGrow: 1,
  },

  /* ==============================================
     TOP IMAGE
  ============================================== */

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

  /* ==============================================
     FORM CONTAINER
  ============================================== */

  container: {
    backgroundColor:
      Colors.background_login,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 30,
  },

  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
    color: Colors.text,
    fontFamily: FontFamily.bold,
  },

  titleNormal: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
    lineHeight: 18,
  },

  /* ==============================================
     INPUT LABEL
  ============================================== */

  inputHeader: {
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 5,
    marginTop: 12,
    color: Colors.text,
    fontFamily: FontFamily.bold,
  },

  /* ==============================================
     INPUT
  ============================================== */

  inputWrapper: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:
      Colors.inputBorder,
    backgroundColor:
      Colors.inputBackground,
    borderRadius: 16,
    paddingHorizontal: 10,
  },

  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color:
      Colors.textColorInpuHeader,
  },

  inputIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
    tintColor: Colors.tintColor,
  },

  /* ==============================================
     EYE BUTTON
  ============================================== */

  eyeIcon: {
    width: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  eyeImage: {
    width: 20,
    height: 20,
    tintColor: Colors.tintColor,
  },

  /* ==============================================
     ERRORS
  ============================================== */

  errorInput: {
    borderColor: 'red',
  },

  errorContainer: {
    minHeight: 4,
    width: '100%',
  },

  errorText: {
    color: 'red',
    fontSize: FontSize.small,
    marginTop: 3,
    fontFamily: FontFamily.regular,
  },

  /* ==============================================
     BUTTON
  ============================================== */

  button: {
    height: 40,
    width: '100%',
    backgroundColor:
      Colors.button_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#fff',
    fontSize: FontSize.regular,
    fontFamily: FontFamily.bold,
    textAlignVertical: 'center',
  },

  /* ==============================================
     BACK BUTTON
  ============================================== */

  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 5,
  },

  backButtonText: {
    color: Colors.text_orange,
    fontSize: FontSize.small,
    fontFamily: FontFamily.bold,
  },

  /* ==============================================
     FULL SCREEN LOADER
  ============================================== */

  loaderOverlay: {
    position: 'absolute',

    /*
     * Explicitly cover the complete SafeAreaView.
     * This is more reliable than flex: 1 here.
     */
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor:
      'rgba(0, 0, 0, 0.35)',

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 99999,
    elevation: 99999,
  },

  loaderCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
    fontFamily: FontFamily.regular,
  },
});
