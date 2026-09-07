import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { card, container, FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { changeDateFormat } from '../utils/helper';
import { CommonStyles } from '../style/CommonStyles';
import { CCAvenueService } from '../services/ccavenue/CCAvenueService';
import type { CCAvenuePaymentResponse } from '../services/ccavenue/CCAvenueTypes';
import { generateOrderId } from '../utils/orderId';
import StorageManager from '../services/StorageManager';
import { Api} from '../services/Api';
import { PaymentData } from '../Model/PaymentEvent/PaymentInitiateResponse';
import FullScreenLoader from '../view/FullScreenLoader';


type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

const EventDetail = ({ navigation, route }: Props) => {
  const { event } = route.params;
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);
  const [remarksError, setRemarksError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [initiatePaymentData, setInitiatePaymentData] = useState<PaymentData | null>(
      null,
    );

  useEffect(() => {
    const fetchUser = async () => {
      const user = await StorageManager.getUser();
      if (user?.name) {
        setUserName(user.name);
      }
    };
    fetchUser();
  }, []);

  const handleProceedToPay = () => {
    if (processing) {
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    if (processing) {
      return;
    }

    setShowConfirmModal(false);
    setProcessing(true);

    try {
      const orderId = generateOrderId();
      //const amount = Number(event?.event_fee ?? 0).toFixed(2);
      const amount = Number(1).toFixed(2);

      const response: CCAvenuePaymentResponse = await CCAvenueService.startPayment({
        orderId,
        amount,
        currency: 'INR',
        customerName: userName || 'Student',
        merchantParam1: '',
        merchantParam2: '',
        merchantParam3: amount,
        merchantParam4: '',
        merchantParam5: userName || 'Student',
      });

      setProcessing(false);

      if (response.orderStatus === 'Success') {
        Alert.alert(
          'Payment Successful',
          `Order ID: ${response.orderId}\nTracking ID: ${response.trackingId}\nAmount: ₹${response.amount}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }],
        );
      } else if (response.orderStatus === 'Aborted') {
        await CCAvenueService.postAbortedResponseToPhp(response);
      } else {
        // Alert.alert(
        //   'Payment Failed',
        //   `Status: ${response.orderStatus}\n${response.failureMessage || response.statusMessage || 'Unknown error'}`,
        // );
      }
    } catch (error: any) {
      setProcessing(false);
      Alert.alert('Payment Error', error?.message || 'Something went wrong');
    }
  };


  const initiatePaymentForEvent = async (remarks : string) => {
    try {
      setLoading(true);
      const response = await Api.initiatePaymentForEvent({
        user_id: await StorageManager.getStudentId(),
        remarks: remarks,
        event_id: event.id,
      });
      console.log('Attendance Response:', response);
      if (response && response.status === 200 && response.data) {
        setInitiatePaymentData(response.data);
        handleProceedToPay();
      } else {
        Alert.alert('Error', response?.message || 'Failed to load attendance');
      }
    } catch (error: any) {
      console.log('Attendance Error:', error?.response?.data || error?.message);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />{' '}
      <AppHeader
        title="Event Details"
        showBack= {true}
        onMenuPress={navigation.goBack}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.content}>
         <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
        {/* Banner Card */}
        <View style={styles.card}>
          {/* <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
            }}
            style={styles.banner}
          /> */}

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{event.event_name}</Text>

            <View style={styles.dateRow}> 
                {/* <Image
                    source={require('../assets/images/icons/attendance.png')}
                    style={styles.smallIcon}
                    resizeMode="contain"/>

              <Text style={styles.dateText}>
                {changeDateFormat(event.event_date)}
              </Text> */}

              {/* Participated - aligned with fee */}
                {/* Participated - aligned with fee */}
                    { event.is_registered === 1 && (
                      <View style={styles.participatedContainer}>
                          <View style={styles.participatedDot} />
                          <Text style={styles.participatedText}>
                            Participated
                          </Text>
                      </View>
                      )}          
            </View>
          </View>
        </View>

        {/* Venue */}
        {/* <View style={styles.infoCard}>
           <View style={styles.iconBack}>
            <Image
                source={require('../assets/images/icons/location.png')}
                style={styles.icon}
                resizeMode="contain"/>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Venue</Text>
            <Text style={styles.infoSubtitle}>
              Grand Science Hall, Building B
            </Text>
          </View>
        </View> */}

        {/* Organizer */}
        <View style={styles.infoCard}>
          <View style={styles.iconBack}>
            <Image
                source={require('../assets/images/icons/attendance.png')}
                style={styles.icon}
                resizeMode="contain"/>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Event Date</Text>
            <Text style={styles.infoSubtitle}>
              {changeDateFormat(event.event_date)}
            </Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About the Event</Text>

          <Text style={styles.aboutText}>{event.event_description}</Text>
        </View>
         {/* Event Fees */}
        <View style={styles.infoCard}>
          <View style={styles.iconBack}>
            <Image
                source={require('../assets/images/icons/fees.png')}
                style={styles.icon}
                resizeMode="contain"/>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Event Fees</Text>
            <Text style={styles.infoSubtitle}>
              ₹{event.event_fee}
            </Text>
          </View>
        </View>
        { event.is_registered === 0 &&
          (event.online_payment === '1') && (
          <TouchableOpacity
              style={[
              CommonStyles.button,
                { marginBottom: 20 },
              ]}
                onPress={() => setJoinModalVisible(true)}
            >
                <Text style={CommonStyles.buttonText}>
                     Register Now
                </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Modal
          visible={joinModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setJoinModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>

              <View style={styles.modalContainer}>

                <Text style={styles.modalTitle}>
                  Register Event
                </Text>

                <Text style={styles.modalSubtitle}>
                  Please enter your remarks
                </Text>

                <TextInput
                    value={remarks}
                    onChangeText={(text) => {
                      setRemarks(text);
                      if (text.trim()) {
                        setRemarksError('');
                      }
                    }}
                    placeholder="Enter remarks..."
                    placeholderTextColor={Colors.text_hint}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={[
                      styles.remarksInput,
                      remarksError && { borderColor: 'red' },
                    ]}
                  />

                  {remarksError ? (
                    <Text style={{ color: 'red', marginTop: 5 }}>
                      {remarksError}
                    </Text>
                  ) : null}

                <View style={styles.modalButtons}>

                  {/* Cancel */}
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setJoinModalVisible(false);
                      setRemarks('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  {/* Submit */}
                 <TouchableOpacity
                    style={[styles.submitButton, processing && { opacity: 0.6 }]}
                    disabled={processing}
                    onPress={() => {
                      if (!remarks.trim()) {
                        setRemarksError('Please enter your remarks.');
                        return;
                      }

                      setRemarksError('');
                      setJoinModalVisible(false);
                      initiatePaymentForEvent(remarks);
                      setRemarks('');
                    }}
                  >
                    <Text style={styles.submitButtonText}>
                      {processing ? 'PROCESSING...' : 'Submit'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {showConfirmModal && (
          <Pressable
            style={styles.overlay}
            onPress={() => setShowConfirmModal(false)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardAvoid}
            >
              <Pressable
                style={styles.confirmCard}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.confirmHeader}>
                  <Text style={styles.confirmTitle}>Confirm Payment</Text>
                  <TouchableOpacity
                    onPress={() => setShowConfirmModal(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.confirmCloseIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.confirmSection}>
                  <Text style={styles.confirmLabel}>Payment Type</Text>
                  <Text style={styles.confirmValue}>Event Fee</Text>
                </View>

                <View style={styles.confirmSection}>
                  <Text style={styles.confirmLabel}>Total Amount</Text>
                  <Text style={styles.confirmTotalAmount}>
                    {`₹${Number(event?.event_fee ?? 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  </Text>
                </View>

                <View style={styles.confirmNote}>
                  <Text style={styles.confirmNoteTitle}>Important Note</Text>
                  <Text style={styles.confirmNoteText}>
                    Please ensure all details are correct before proceeding with the payment.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.confirmPayButton, processing && { opacity: 0.6 }]}
                  activeOpacity={0.85}
                  onPress={handleConfirmPayment}
                  disabled={processing}
                >
                  <Text style={styles.confirmPayButtonText}>
                    {processing ? 'PROCESSING...' : 'CONFIRM AND PAY'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmCancelButton}
                  activeOpacity={0.85}
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={styles.confirmCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </Pressable>
            </KeyboardAvoidingView>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EventDetail;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: Colors.background,},
  content: { flex: 1 },
  
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    overflow: 'hidden',
    marginBottom: card.margin_bottom,
  },

  banner: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },

  contentContainer: {
    padding: container.container_padding,
  },

  title: {
    fontSize: FontSize.large,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.bold,
    marginBottom: 2,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  calendarIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  dateText: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
  },

  dot: {
    marginHorizontal: 6,
    color: Colors.text_light,
  },

  timeText: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
  },

  infoCard: {
    backgroundColor: Colors.background_list_item,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background_list_item,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: FontSize.regular,
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
    marginBottom: 2,
  },

  infoSubtitle: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
  },

  aboutCard: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: card.padding,
    marginBottom: card.margin_bottom,
  },

  aboutTitle: {
    fontSize: FontSize.large,
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
    marginBottom: 10,
  },

  aboutText: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
    marginBottom: 10,
  },
  smallIcon: {
    width: 14,
    height: 14,
    marginRight: 3,
    tintColor: Colors.text_light,
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

  icon: {
    width: 22,
    height: 22,
    tintColor: Colors.theme_color,
},

participatedContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
},

participatedDot: {
  width: 7,
  height: 7,
  borderRadius: 4,
  backgroundColor: Colors.success,
  marginRight: 5,
},

participatedText: {
  fontSize: FontSize.small,
  fontFamily: FontFamily.medium,
  color: Colors.success,
},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
  },

  modalTitle: {
    fontSize: FontSize.large,
    fontFamily: FontFamily.bold,
    color: Colors.textColorInpuHeader,
    marginBottom: 5,
  },

  modalSubtitle: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: Colors.text_hint,
    marginBottom: 15,
  },

  remarksInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border_color,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FontSize.regular,
    fontFamily: FontFamily.regular,
    color: Colors.textColorInpuHeader,
    backgroundColor: Colors.background,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },

  cancelButton: {
    paddingHorizontal: 20,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border_color,
  },

  cancelButtonText: {
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.regular,
  },

  submitButton: {
    paddingHorizontal: 22,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.theme_color,
  },

  submitButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.regular,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  confirmCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: '85%',
    width: '90%',
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  confirmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: FontSize.large,
    color: Colors.textColorInpuHeader,
  },
  confirmCloseIcon: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.large,
    color: Colors.text_light,
    padding: 4,
  },
  confirmSection: {
    marginBottom: 12,
  },
  confirmLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    marginBottom: 4,
  },
  confirmValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.text,
  },
  confirmTotalAmount: {
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: FontSize.regular,
    color: Colors.textColorInpuHeader,
  },
  confirmNote: {
    backgroundColor: Colors.instruction_box,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginTop: 4,
  },
  confirmNoteTitle: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.small,
    color: Colors.instruction_text,
    marginBottom: 4,
  },
  confirmNoteText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.very_small,
    color: Colors.instruction_text,
    lineHeight: 16,
  },
  confirmPayButton: {
    height: 46,
    backgroundColor: Colors.theme_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmPayButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.regular,
  },
  confirmCancelButton: {
    height: 46,
    backgroundColor: Colors.white,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.iconBackGrey,
  },
  confirmCancelButtonText: {
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.regular,
  },
});