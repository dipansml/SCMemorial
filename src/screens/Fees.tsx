import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import FeesBreakdownComponent from '../component/FeesBreakdownComponent';
import { card, FontFamily, FontSize, iconBox } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import { CommonStyles } from '../style/CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
// types
type FeeItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  status: 'Paid' | 'Unpaid' | 'Pending';
};

const Fees = () => {
  const [feesData, setFeesData] = useState<FeeItem[]>([]);

  useEffect(() => {
    // simulate API
    const data: FeeItem[] = [
      { id: '1', title: 'Tuition Fee', subtitle: 'Q4 Academic Term', amount: '25000', status: 'Paid' },
      { id: '2', title: 'Admission Fee', subtitle: 'One-time payment', amount: '10000', status: 'Paid' },
      { id: '3', title: 'Exam Fee', subtitle: 'Mid-term Examination', amount: '2500', status: 'Unpaid' },
      { id: '4', title: 'Library Fee', subtitle: 'Annual Access', amount: '1500', status: 'Pending' },
      { id: '5', title: 'Transport Fee', subtitle: 'Monthly Commute', amount: '3000', status: 'Unpaid' },
    ];

    setFeesData(data);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Fees Overview"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>

        {/* 🔵 TOP CARD */}
        <View style={styles.topCard}>
          <Text style={styles.smallText}>TOTAL OUTSTANDING</Text>
          <Text style={styles.bigAmount}>₹ 42,000.00</Text>
        </View>

        {/* 🟦 SUMMARY */}
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>PAID AMOUNT</Text>
            <Text style={styles.value}>₹36,500</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>DUE AMOUNT</Text>
            <Text style={styles.value}>₹5,500</Text>
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
                <Text style={styles.date}>15 October 2026</Text>
                <Text style={styles.sub}>Next Due Date</Text>
              </View>
              <View style={styles.rightSection}>
                    <Text style={styles.sub}>Late Fee</Text> 
                    <Text style={styles.lateFee}>+ ₹500/mo</Text> 
              </View>
            </View>

        {/* 📊 TITLE */}
        <Text style={styles.sectionTitle}>Fees Breakdown</Text>

         <View style={styles.cardWhite}>
            {/* 📋 CHILD COMPONENT (FlatList) */}
            <FeesBreakdownComponent data={feesData} />
        </View>
        <TouchableOpacity  style={[CommonStyles.button, {marginBottom: 20}]}>    
            <Text style={CommonStyles.buttonText}>Pay Now</Text>
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