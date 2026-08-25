import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
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

const Fees = ({ navigation }: FeesProps) => {
  const [selectedKey, setSelectedKey] = useState(
    PAYMENT_OPTIONS[0].key,
  );

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
        {PAYMENT_OPTIONS.map(option => (
          <PaymentOptionCard
            key={option.key}
            title={option.title}
            subtitle={option.subtitle}
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
                     Join Now
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
