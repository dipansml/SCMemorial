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
  Modal,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import Colors from '../theme/colors';
import {FontSize, FontFamily} from '../theme/fonts_dimen';
import {Api} from '../services/Api';

type RootStackParamList = {
  StudentSelection: undefined;
  LandingStudent: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    email: string;
    userId: string;
  };
};

type ForgotPasswordProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'ForgotPassword'
  >;
};

const ForgotPassword = ({
  navigation,
}: ForgotPasswordProps) => {
  const [studentCode, setStudentCode] = useState('');
  const [studentCodeError, setStudentCodeError] =
    useState('');

  const [loading, setLoading] = useState(false);

  const [verificationVisible, setVerificationVisible] =
    useState(false);

  const [verificationCode, setVerificationCode] =
    useState('');

  const [verificationError, setVerificationError] =
    useState('');

  const [email, setEmail] = useState('');

  const validateStudentCode = () => {
    if (!studentCode.trim()) {
      setStudentCodeError(
        'Please enter student code',
      );
      return false;
    }

    setStudentCodeError('');
    return true;
  };

  const handleSendCode = async () => {
    if (!validateStudentCode()) {
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const res =
        await Api.forgetPasswordSendCode({
          email: studentCode.trim(),
        });

      console.log(
        'Forget Password Response:',
        res,
      );

      if (
        res &&
        res.status === 200 &&
        res.data
      ) {
        const registeredEmail =
          res.data.email;

        setEmail(registeredEmail);

        setVerificationCode('');
        setVerificationError('');

        setVerificationVisible(true);
      } else {
        Alert.alert(
          'Failed',
          res?.message ||
            'Unable to send verification code. Please try again.',
        );
      }
    } catch (error: any) {
      console.log(
        'Forget Password Error:',
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

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError(
        'Please enter verification code',
      );
      return;
    }

    if (
      verificationCode.trim().length !== 6
    ) {
      setVerificationError(
        'Verification code must be 6 digits',
      );
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const res =
        await Api.validateVerificationCode({
          email: email,
          verification_code:
            verificationCode.trim(),
        });

      console.log(
        'Verification Response:',
        res,
      );

      if (
        res &&
        res.status === 200 &&
        res.data
      ) {
        setVerificationVisible(false);

        navigation.navigate(
          'ResetPassword',
          {
            email: res.data.email,
            userId: res.data.user_id,
          },
        );
      } else {
        setVerificationError(
          res?.message ||
            'Invalid verification code',
        );
      }
    } catch (error: any) {
      console.log(
        'Verification Error:',
        error?.response?.data ||
          error?.message,
      );

      setVerificationError(
        error?.response?.data?.message ||
          error?.message ||
          'Invalid verification code. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>

      {/* ========================================
          MAIN SCREEN
      ======================================== */}
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
          nestedScrollEnabled={true}>

          <View style={styles.content}>

            {/* Top Image */}
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

            {/* Form */}
            <View style={styles.container}>

              <Text style={styles.title}>
                Forgot Password?
              </Text>

              <Text style={styles.titleNormal}>
                Enter your student code to receive
                a verification code on your
                registered email.
              </Text>

              {/* Student Code Label */}
              <Text style={styles.inputHeader}>
                Student Code
              </Text>

              <View
                style={styles.inputContainer}>

                <View
                  style={[
                    styles.inputWrapper,
                    studentCodeError &&
                      styles.errorInput,
                  ]}>

                  <Image
                    source={require('../assets/images/student_id.png')}
                    style={styles.inputIcon}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter your student code"
                    placeholderTextColor={
                      Colors.text_hint
                    }
                    value={studentCode}
                    onChangeText={text => {
                      setStudentCode(text);

                      if (studentCodeError) {
                        setStudentCodeError('');
                      }
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />

                </View>

                {studentCodeError ? (
                  <Text style={styles.errorText}>
                    {studentCodeError}
                  </Text>
                ) : null}

              </View>

              {/* Send Code */}
              <TouchableOpacity
                style={[
                  styles.button,
                  loading &&
                    styles.buttonDisabled,
                ]}
                onPress={handleSendCode}
                disabled={loading}
                activeOpacity={0.8}>

                <Text style={styles.buttonText}>
                  Send Verification Code
                </Text>

              </TouchableOpacity>

              {/* Back */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                  navigation.goBack()
                }
                disabled={loading}>

                <Text
                  style={
                    styles.backButtonText
                  }>
                  Back to Login
                </Text>

              </TouchableOpacity>

            </View>
          </View>

        </ScrollView>

        {/* ========================================
            VERIFICATION MODAL
        ======================================== */}
        <Modal
          visible={verificationVisible}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setVerificationVisible(false)
          }>

          <View
            style={styles.modalOverlay}>

            <View
              style={styles.modalContainer}>

              <Text
                style={styles.modalTitle}>
                Verify Code
              </Text>

              <Text
                style={styles.modalSubtitle}>
                Enter the 6-digit verification
                code sent to your registered
                email.
              </Text>

              {email ? (
                <Text
                  style={styles.emailText}>
                  {email}
                </Text>
              ) : null}

              <TextInput
                style={[
                  styles.codeInput,
                  verificationError &&
                    styles.codeInputError,
                ]}
                placeholder="Enter 6-digit code"
                placeholderTextColor={
                  Colors.text_hint
                }
                value={verificationCode}
                onChangeText={text => {
                  const numericText =
                    text.replace(
                      /[^0-9]/g,
                      '',
                    );

                  setVerificationCode(
                    numericText.slice(
                      0,
                      6,
                    ),
                  );

                  if (verificationError) {
                    setVerificationError('');
                  }
                }}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />

              {verificationError ? (
                <Text
                  style={styles.errorText}>
                  {verificationError}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.button,
                  loading &&
                    styles.buttonDisabled,
                ]}
                onPress={handleVerifyCode}
                disabled={loading}
                activeOpacity={0.8}>

                <Text
                  style={styles.buttonText}>
                  Verify Code
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setVerificationVisible(
                    false,
                  )
                }
                disabled={loading}>

                <Text
                  style={styles.cancelText}>
                  Cancel
                </Text>

              </TouchableOpacity>

            </View>
          </View>

        </Modal>

      </KeyboardAvoidingView>

      {/* ========================================
          FULL SCREEN LOADER
          IMPORTANT:
          This is OUTSIDE KeyboardAvoidingView
      ======================================== */}
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

export default ForgotPassword;

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
    paddingBottom: 30,
  },

  content: {
    flexGrow: 1,
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
    marginBottom: 10,
    color: Colors.text,
    fontFamily: FontFamily.bold,
  },

  titleNormal: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
    lineHeight: 18,
  },

  inputHeader: {
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 5,
    marginTop: 15,
    color: Colors.text,
    fontFamily: FontFamily.bold,
  },

  inputContainer: {
    width: '100%',
  },

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

  errorInput: {
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
  },

  button: {
    height: 40,
    width: '100%',
    backgroundColor:
      Colors.button_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
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

  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 5,
  },

  backButtonText: {
    color: Colors.text_orange,
    fontSize: FontSize.small,
    fontFamily: FontFamily.bold,
  },

  /* ========================================
     VERIFICATION MODAL
  ======================================== */

  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    width: '100%',
    backgroundColor:
      Colors.background_login,
    borderRadius: 20,
    padding: 25,
  },

  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.text,
    fontFamily: FontFamily.bold,
  },

  modalSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
    marginTop: 10,
    lineHeight: 18,
  },

  emailText: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.text_theme,
    fontFamily: FontFamily.bold,
    marginTop: 8,
  },

  codeInput: {
    height: 48,
    borderWidth: 1,
    borderColor:
      Colors.inputBorder,
    backgroundColor:
      Colors.inputBackground,
    borderRadius: 16,
    marginTop: 20,
    paddingHorizontal: 16,
    textAlign: 'center',
    letterSpacing: 4,
    fontSize: 16,
    color:
      Colors.textColorInpuHeader,
    fontFamily: FontFamily.bold,
  },

  codeInputError: {
    borderColor: 'red',
  },

  cancelText: {
    textAlign: 'center',
    marginTop: 10,
    color: Colors.text_light,
    fontSize: FontSize.small,
    fontFamily: FontFamily.bold,
  },

  /* ========================================
     FULL SCREEN LOADER
  ======================================== */

  loaderOverlay: {
    position: 'absolute',

    /*
     * Cover the COMPLETE SafeAreaView.
     * Do not use flex: 1 here.
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

  /*
   * This guarantees that the ActivityIndicator
   * is centered inside the overlay.
   */
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