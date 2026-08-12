import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import FeesBreakdownComponent from '../component/FeesBreakdownComponent';
import { card, FontFamily, FontSize, iconBox } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import { CommonStyles } from '../style/CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import FeePayment from './FeesPayment';
import { RestApi } from '../services/RestApi';
import StorageManager from '../services/StorageManager';
import { Api } from '../services/Api';
import { FeeStructureData } from '../Model/FeesStructure/FeeStructureData';
// types
type FeeItem = {
  fee_type: string;
  amount: string;
  status: 'paid' | 'unpaid' | 'pending';
};

type FeesProps = {
      navigation: NativeStackNavigationProp<
        RootStackParamList
      >;
    };

const Fees = ({ navigation }: FeesProps) => {
  const [feesData, setFeesData] = useState<FeeItem[]>([]);
  const [feeData, setFeeData] = useState<FeeStructureData | null>(null);
  const [loading, setLoading] = useState(false);
   
  useEffect(() => {
    loadFeeStructure();
  }, []);


  const loadFeeStructure = async () => {

    try {
      setLoading(true);

      const response =
        await Api.getStudentFeesStructure({
          user_id:
            await StorageManager.getStudentId(),
        });

      console.log(
        'Fee Structure Response:',
        response
      );

      if (
        response &&
        response.status === 200 &&
        response.data
      ) {

        setFeeData({
          outstanding_amount:
            response.data.outstanding_amount,

          paid_amount:
            response.data.paid_amount,

          due_amount:
            response.data.due_amount,

          late_fee:
            response.data.late_fee,

          current_month:
            response.data.current_month,

          due_month:
            response.data.due_month,

          fees_breakdown:
            response.data.fees_breakdown,

        });

      } else {

        Alert.alert(
          'Error',
          response?.message ||
            'Failed to load fee structure'
        );
      }

    } catch (error: any) {

      console.log(
        'Fee Structure Error:',
        error?.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Something went wrong'
      );

    } finally {
      setLoading(false);
    }
};

const FullScreenLoader = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;

    return (
      <View style={CommonStyles.loaderOverlay}>
        <ActivityIndicator size="large" color={Colors.loaderColor} />
        <Text style={CommonStyles.loaderText}>Loading...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />
      <AppHeader
        title="Fees Overview"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>

        {/* 🔵 TOP CARD */}
        <View style={styles.topCard}>
          <Text style={styles.smallText}>TOTAL OUTSTANDING</Text>
          <Text style={styles.bigAmount}>₹ {feeData?.outstanding_amount || '0.00'}</Text>
        </View>

        {/* 🟦 SUMMARY */}
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>PAID AMOUNT</Text>
            <Text style={styles.value}>₹ {feeData?.paid_amount || '0.00'}</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>DUE AMOUNT</Text>
            <Text style={styles.value}>₹ {feeData?.due_amount || '0.00'}</Text>
          </View>
        </View>

        {/* 📅 NEXT DUE */}
          <View style={styles.nextDueBox}>
            <View style={styles.iconBox}>
                <Image
                    source={require('../assets/images/icons/attendance.png')}
                    style={styles.icon}
                    resizeMode="contain"
                  />
              </View>
              <View style={styles.leftSection}>
                <Text style={styles.date}>{feeData?.due_month || feeData?.current_month}</Text>
                <Text style={styles.sub}>Next Due Date</Text>
              </View>
              <View style={styles.rightSection}>
                    <Text style={styles.sub}>Late Fee</Text> 
                    <Text style={styles.lateFee}>+₹ {feeData?.late_fee || '0.00'}</Text> 
              </View>
            </View>

        {/* 📊 TITLE */}
        <Text style={styles.sectionTitle}>Fees Breakdown</Text>

         <View style={styles.cardWhite}>
            {/* 📋 CHILD COMPONENT (FlatList) */}
            <FeesBreakdownComponent data={feeData?.fees_breakdown || []} />
        </View>
       <TouchableOpacity
          style={[
            CommonStyles.button,
            { marginBottom: 20 },
          ]}
          onPress={() =>
            navigation.navigate('FeePayment', {
              outstanding_amount:
                feeData?.outstanding_amount || '0',
            })
          }
          >
          <Text style={CommonStyles.buttonText}>
            Pay Now
         </Text>
       </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Fees;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background,
  },
  content: { 
    flex: 1, 
    padding: 16, 
  },

  topCard: {
    backgroundColor: Colors.theme_color,
    padding: card.padding,
    borderRadius: card.border_radius_card_medium,
    marginBottom: 16,
  },
  smallText: { 
    color: Colors.white, 
    fontSize: FontSize.regular ,
    fontFamily: FontFamily.semiBold,
    marginBottom: 4,
  },

    bigAmount: { 
      color: Colors.white, 
      fontSize: FontSize.xxxxLarge, 
      fontFamily: FontFamily.bold 
    },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  box: {
    backgroundColor: Colors.background_list_item,
    padding: card.padding,
    borderRadius: card.border_radius_card_small,
    width: '48%',
  },
  label: { 
    fontSize: FontSize.very_small, 
    color: Colors.text_light, 
    fontFamily: FontFamily.semiBold,
    marginBottom: 4,
  },
  value: { 
    fontSize: FontSize.xxxxLarge, 
    fontFamily: FontFamily.bold,
    color: Colors.textColorInpuHeader, 
  },

  nextDueBox: {
    backgroundColor: Colors.card_background_grey,
    padding: card.padding,
    borderRadius: card.border_radius_card_small,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { 
    fontFamily: FontFamily.medium,
    fontSize: FontSize.medium,  
    color: Colors.textColorInpuHeader,
  },
  sub: { 
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small, 
    color: Colors.text_light 
  },
  
  lateFee: { 
    fontSize: FontSize.very_small, 
    color: Colors.text_orange, 
    marginTop: 4 },

  sectionTitle: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: Colors.theme_color,
},
  leftSection: {
    alignItems: 'flex-start',
    marginRight: 'auto',
},

  rightSection: {
    alignItems: 'flex-end',
},
 cardWhite: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: card.border_radius_card_small,
    elevation: 3,
  },

});