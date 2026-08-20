import React, { useState } from 'react';
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
  Keyboard,} from 'react-native';
import AppHeader from '../component/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { card, container, FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { changeDateFormat } from '../utils/helper';
import { CommonStyles } from '../style/CommonStyles';
import type { PaymentResult } from '../services/payment/payment.types';
import { paymentService } from '../services/payment/PaymentService';
import StorageManager from '../services/StorageManager';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

const EventDetail = ({ navigation, route }: Props) => {
  const { event } = route.params;
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);
  const [remarksError, setRemarksError] = useState('');

  const handleProceedToPay = async () => {
      // Duplicate-payment protection: ignore taps while a payment is running.
      if (processing) {
        return;
      }
  
      setProcessing(true);
  
      try {
        // The UI only talks to PaymentService. Whether the underlying provider
        // is MOCK CCAvenue or the real CCAvenue adapter is decided by
        // PAYMENT_CONFIG.mode — this screen never changes.
        const result: PaymentResult = await paymentService.startPayment({
          amount: event.event_fee + ".00",
          currency: 'INR',
          billingName: '',
          billingEmail: '',
          billingPhone: '',
          description:  event.event_name + ' Joing Fees Payment',
          meta: remarks ? { remarks } : undefined,
        });
  
        // Success, failure and cancellation all land on the result screen.
        //navigation.replace('PaymentResult', { result });
        console.log("PaymentDetail", result);
        if(result.status === 'cancelled'){
          navigation.replace('PaymentResult', { result });
        } else{
            
        }
      } catch {
        // Duplicate-payment / unexpected errors: stay on this screen.
        setProcessing(false);
      }
    };

    const handleProceedToPayWebview = async () => {
      navigation.navigate('CCAvenuePayment', {
            paymentUrl: 'https://www.google.com/',
          });
    }
    

  return (
    <SafeAreaView style={styles.container}>
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
                     Join Now
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
                  Join Event
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
                    style={styles.submitButton}
                    onPress={() => {
                      if (!remarks.trim()) {
                        setRemarksError('Please enter your remarks.');
                        return;
                      }

                      setRemarksError('');
                      setJoinModalVisible(false);
                      handleProceedToPay();
                      //handleProceedToPayWebview();
                    }}
                  >
                    <Text style={styles.submitButtonText}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
});