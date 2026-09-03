import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Api } from '../services/Api';
import StorageManager from '../services/StorageManager';
import AppHeader from '../component/AppHeader';
import PaymentOptionCard from '../component/PaymentOptionCard';
import { openParentDrawer } from '../navigation/navigationRef';
import Colors from '../theme/colors';
import { FontFamily } from '../theme/fonts_dimen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { CommonStyles } from '../style/CommonStyles';

type FeesProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type PaymentOption = {
  key: string;
  title: string;
  subtitle: string;
  icon: any;
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    key: 'readmission',
    title: 'Re Admission Fee',
    subtitle: 'Total Amount: ₹18428',
    icon: require('../assets/images/id-card1.png'),
  },
  {
    key: 'monthly',
    title: 'Monthly Payment',
    subtitle: 'Select month for payments',
    icon: require('../assets/images/id-card2.png'),
  },
];

const parseFee = (value: string | undefined | null): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const calculateReAdmissionTotal = (apiData: any): number => {
  const fd = apiData?.form_details;
  if (!fd) {
    return 0;
  }
  const admissionTotal =
    parseFee(fd.admission_fee) +
    parseFee(fd.development_fee) +
    parseFee(fd.exam_fee) +
    parseFee(fd.festival_celebration_fee) +
    parseFee(fd.games_sports_fee) +
    parseFee(fd.audio_visual_lab_fee) +
    parseFee(fd.library_fee) +
    parseFee(fd.electricity_maintenance_fee) +
    parseFee(fd.computer_fee) +
    parseFee(fd.security_deposite) +
    parseFee(fd.tuition_fee);
  const stationaryTotal = parseFee(apiData?.stationary_total_price);
  const busTotal = parseFee(fd.bus_services);
  return admissionTotal + stationaryTotal + busTotal;
};

const Fees = ({ navigation }: FeesProps) => {
  const [selectedKey, setSelectedKey] = useState(
    PAYMENT_OPTIONS[0].key,
  );
  const [reAdmissionDone, setReAdmissionDone] = useState<
    boolean | null
  >(null);
  const [reAdmissionTotal, setReAdmissionTotal] = useState<string>(
    PAYMENT_OPTIONS[0].subtitle,
  );

  useEffect(() => {
    (async () => {
      try {
        const userId = await StorageManager.getStudentId();
        const response = await Api.getReAdmissionFee({ user_id: userId });
        const formDetails = response?.data?.form_details as
          | { ad_payment_status?: string }
          | undefined;
        const apiData = response?.data;
        const done = formDetails?.ad_payment_status === '1';
        setReAdmissionDone(done);
        setSelectedKey(done ? 'monthly' : 'readmission');
        setReAdmissionTotal(
          `Total Amount: ₹${calculateReAdmissionTotal(apiData).toLocaleString('en-IN')}`,
        );
      } catch (error) {
        console.log('Re Admission Status Fetch Error:', error);
        setReAdmissionDone(false);
      }
    })();
  }, []);

  if (reAdmissionDone === null) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader
          title="Fees Overview"
          onMenuPress={openParentDrawer}
          onBellPress={() => console.log('Bell')}
          onProfilePress={() => console.log('Profile')}
          navigation={navigation}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.theme_color} />
        </View>
      </SafeAreaView>
    );
  }

  const visibleOptions = reAdmissionDone
    ? PAYMENT_OPTIONS.filter(option => option.key === 'monthly')
    : PAYMENT_OPTIONS.filter(option => option.key === 'readmission');

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Fees Overview"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.frame}>
        {visibleOptions.map(option => (
          <PaymentOptionCard
            key={option.key}
            title={option.title}
            subtitle={
              option.key === 'readmission'
                ? reAdmissionTotal
                : option.subtitle
            }
            icon={option.icon}
            selected={selectedKey === option.key}
            onPress={() => setSelectedKey(option.key)}
          />
        ))}
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
              style={[
              CommonStyles.button,
                { marginBottom: 20 },
              ]}
               onPress={() =>
                 selectedKey === 'monthly'
                   ? navigation.navigate('MothlyFeePayment')
                   : navigation.navigate('ReAdmission')
               }
            >
                <Text style={CommonStyles.buttonText}>
                     Pay Now
                </Text>
          </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default Fees;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  frame: {
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 14,
  },
  buttonWrapper: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    width: 339,
    height: 50,
    borderRadius: 24,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(115, 147, 179, 1)',
  },
  nextText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
  },
});
