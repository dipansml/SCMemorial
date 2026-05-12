import React, { useState } from 'react';
import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Alert,} from 'react-native';
import AppHeader from '../component/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Colors from '../theme/colors';
import { card, FontFamily, FontSize } from '../theme/fonts_dimen';
import { CommonStyles } from '../style/CommonStyles';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { RouteProp } from '@react-navigation/native';

type FeePaymentRouteProp = RouteProp<
  {
    FeePayment: {
      outstanding_amount: string;
    };
  },
  'FeePayment'
>;

type Props = {
  navigation: any;
  route: FeePaymentRouteProp;
};

const FeePayment = ({ navigation, route }: Props) => {
const [selectedAmount, setSelectedAmount] = useState('full');
const [paymentMode, setPaymentMode] = useState('online');
const [receiptImage, setReceiptImage] = useState<string | null>(null);
const { outstanding_amount } = route.params;

 const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
          buttonPositive: 'OK',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert('Permission denied');
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.8,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        console.log('Camera Image:', response.assets);
        if (response.assets && response.assets.length > 0) {
          setReceiptImage(response.assets[0].uri || null);
        }
      }
    });
  };

  const openGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
      } else if (response.errorCode) {
        console.log('Gallery Error: ', response.errorMessage);
      } else {
        console.log('Gallery Image:', response.assets);
        if (response.assets && response.assets.length > 0) {
          setReceiptImage(response.assets[0].uri || null);
        }
      }
    });
  };

  const showImagePicker = () => {
    Alert.alert(
      'Upload Receipt',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: openCamera,
        },
        {
          text: 'Gallery',
          onPress: openGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Complete Payment"
        showBack={true}
        onMenuPress={() => navigation.goBack()}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.content}>
         <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
        {/* Amount Section */}
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.rowBetween}
                onPress={() => setSelectedAmount('full')}
                >
                <View>
                    <Text style={styles.title}>Pay Full Amount</Text>
                    <Text style={styles.amount}>₹{outstanding_amount}</Text>
                </View>
                <View style={[styles.radio, selectedAmount === 'full' && styles.radioActive]} />
            </TouchableOpacity>
        </View>

        {/* <View style={styles.card}>
            <TouchableOpacity
            style={styles.rowBetween}
            onPress={() => setSelectedAmount('partial')}
            >
            <View>
                <Text style={styles.title}>Partial Amount</Text>
                <Text style={styles.link}>Choose your own value</Text>
            </View>
            <View style={[styles.radio, selectedAmount === 'partial' && styles.radioActive]} />
            </TouchableOpacity>

            {selectedAmount === 'partial' && (
            <TextInput
                placeholder="₹ 5500"
                style={styles.input}
                keyboardType="numeric"
            />
            )}
        </View> */}

        {/* Payment Mode */}
        <Text style={styles.sectionTitle}>Payment Mode</Text>

        <View style={styles.row}>
            <TouchableOpacity
                style={[
                    styles.modeCard,
                    paymentMode === 'online' && styles.modeActive,
                ]}
            onPress={() => setPaymentMode('online')}
            >
            {/* <Text style={styles.icon}>🌐</Text> */}
             <Image
                source={require('../assets/images/icons/online.png')}
                style={[
                styles.icon,
                {
                    tintColor:
                    paymentMode === 'online'
                        ? Colors.theme_color   // active color
                        : Colors.text_light,  // inactive color
                },
                ]}
                resizeMode="contain"
            />
            <Text style={[styles.modeText, paymentMode === 'online' && styles.modeTextActive]}>Online</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[
                styles.modeCard,
                paymentMode === 'offline' && styles.modeActive,
            ]}
            onPress={() => setPaymentMode('offline')}
            >
            {/* <Text style={styles.icon}>💵</Text> */}
            <Image
                source={require('../assets/images/icons/offline.png')}
                style={[
                styles.icon,
                {
                    tintColor:
                    paymentMode === 'offline'
                        ? Colors.theme_color   // active color
                        : Colors.text_light,  // inactive color
                },
                ]}
                resizeMode="contain"
            />
            <Text style={[styles.modeText, paymentMode === 'offline' && styles.modeTextActive]}>Offline</Text>
            </TouchableOpacity>
        </View>

        {/* Online Options */}
        {paymentMode === 'online' && (
            <>
            <View style={[styles.optionCard , { marginTop: 10 }]}>
                <View style={styles.rowCard}>
                    <View style={styles.iconBack}>
                        <Image
                            source={require('../assets/images/icons/qr_icon.png')}
                            style={styles.icon}
                            resizeMode="contain"/>
                    </View>
                    <View style={styles.columnCard}>
                        <Text style={styles.optionTitle}>UPI / QR Scan</Text>
                        <Text style={styles.optionSub}>
                            Instant processing via Google Pay, PhonePe
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.optionCard}>
               <View style={styles.rowCard}>
                    <View style={styles.iconBack}>
                        <Image
                            source={require('../assets/images/icons/online_banking.png')}
                            style={styles.icon}
                            resizeMode="contain"/>
                    </View>
                    <View style={styles.columnCard}>
                        <Text style={styles.optionTitle}>Card / Net Banking</Text>
                        <Text style={styles.optionSub}>
                            Debit, Credit Cards or direct bank login
                        </Text>
                    </View>
                </View>
            </View>
            </>
        )}

        {/* Offline Section */}
        {paymentMode === 'offline' && (
            <>
            <Text style={styles.sectionTitle}>Offline Details</Text>

            <View style={styles.card}>
                <Text style={styles.labelDark}>Receipt Number</Text>
                <View style={[CommonStyles.inputWrapper, { marginTop: 8}]}>
                  <TextInput style={CommonStyles.input} />
                </View>

                <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.labelDark}>Bank Name</Text>
                     <View style={[CommonStyles.inputWrapper, { marginTop: 8}]}>
                  <TextInput style={CommonStyles.input} />
                </View>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.labelDark}>Payment Date</Text>
                <View style={[CommonStyles.inputWrapper, { marginTop: 8}]}>
                    <TextInput style={CommonStyles.input} />
                </View>
                </View>
                </View>

                <TouchableOpacity 
                  style={styles.uploadBox}
                  onPress={showImagePicker}>
                     <Image
                        source={receiptImage ? { uri: receiptImage } : require('../assets/images/icons/upload.png')}
                        style={receiptImage ? styles.receiptImage : styles.iconLarge}
                        resizeMode="cover"/>
                    {!receiptImage && <Text style={styles.labelDarkLarge}>Upload Receipt Photo</Text>}
                </TouchableOpacity>
            </View>
            </>
        )}

        {/* Button */}
        <TouchableOpacity style={[CommonStyles.button, {marginTop: 0}]}>
            <Text style={CommonStyles.buttonText}>PAY NOW</Text>
        </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FeePayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, 
},
  content: { 
    flex: 1, 
    padding: 10,
},
 card: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: card.padding,
    marginBottom: card.margin_bottom,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },

  title: {
    fontSize: FontSize.regular,
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
  },

  amount: {
    marginTop: 6,
    color: Colors.text_light,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
  },

  link: {
    color: Colors.theme_color,
    marginTop: 5,
    textDecorationLine: 'underline',
  },

  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.theme_color,
  },

  radioActive: {
    backgroundColor: Colors.theme_color,
    borderColor: Colors.theme_color,
  },

  input: {
    backgroundColor: '#F1F2F6',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },

  sectionTitle: {
    marginVertical: 10,
    fontSize: FontSize.regular,
    fontFamily: FontFamily.medium,
  },

  modeCard: {
    flex: 1,
    backgroundColor: Colors.card_background_grey,
    borderRadius: card.border_radius_card_medium,
    padding: 20,
    alignItems: 'center',
  },

  modeActive: {
    borderWidth: 1,
    borderColor: Colors.theme_color,
    backgroundColor: Colors.white,
  },

  icon: {
    width: 24,
    height: 24,
  },

  iconLarge: {
    width: 40,
    height: 40,
  },

  modeText: {
    marginTop: 8,
    color: Colors.text_light,
    fontFamily: FontFamily.medium,
  },

  modeTextActive: {
    marginTop: 8,
    color: Colors.theme_color,
    fontFamily: FontFamily.medium,
  },

  optionCard: {
    backgroundColor: Colors.background_list_item,
    padding: card.padding,
    borderRadius: card.border_radius_card,
    marginBottom: 10,
  },

  optionTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.regular,
    color: Colors.textColorInpuHeader,
  },

  optionSub: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    marginTop: 4,
  },

  label: {
    marginTop: 10,
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.medium,
  },

  labelDark: {
    marginTop: 10,
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.medium,
  },

  labelDarkLarge: {
    marginTop: 10,
    fontSize: FontSize.regular,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.medium,
  },

  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.text_light,
    borderRadius: card.border_radius_card_medium,
    padding: 20,
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'column',
  },

 
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
columnCard: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  iconBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.iconBackGrey,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: card.border_radius_card_medium,
  },
});