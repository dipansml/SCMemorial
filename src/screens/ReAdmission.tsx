import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import { paymentService } from '../services/payment/PaymentService';
import type { PaymentResult } from '../services/payment/payment.types';

type Props = {
  navigation: any;
};

type FeeDetailRow = {
  no: string;
  route: string;
  fee: string;
};

type StationaryItem = {
  no: string;
  name: string;
  price: string;
  qty: string;
  total: string;
};

type FeeCategory = {
  id: string;
  name: string;
  totalFees: string;
  type: 'admission' | 'stationary' | 'bus';
  details: FeeDetailRow[];
  items?: StationaryItem[];
  totalLabel: string;
  totalValue: string;
};

const ADMISSION_DETAILS: FeeDetailRow[] = [
  { no: '01', route: 'ADMISSION FEE (ONE TIME) NEW STUDENT', fee: '0' },
  { no: '02', route: 'DEVELOPMENT FEE (YEARLY)', fee: '12500' },
  { no: '03', route: 'EXAM FEE (YEARLY)', fee: '2500' },
  { no: '04', route: 'FESTIVAL CELEBRATION FEE (YEARLY)', fee: '0' },
  { no: '05', route: 'GAMES SPORTS FEE (YEARLY)', fee: '0' },
  { no: '06', route: 'AUDIO VISUAL LAB FEE (YEARLY)', fee: '0' },
  { no: '07', route: 'LIBRARY FEE (YEARLY)', fee: '0' },
  { no: '08', route: 'ELECTRICITY MAINTENANCE FEE (YEARLY)', fee: '0' },
  { no: '09', route: 'COMPUTER FEE (YEARLY)', fee: '0' },
  { no: '10', route: 'SECURITY DEPOSIT (REFUNDABLE) NEW STUDENT', fee: '0' },
  { no: '11', route: 'TUITION FEE (MONTHLY)', fee: '2000' },
];

const STATIONARY_ITEMS: StationaryItem[] = [
  { no: '01', name: 'SCHOOL DIARY', price: '35', qty: '3', total: '525' },
  { no: '02', name: 'ID CARD', price: '35', qty: '3', total: '525' },
  { no: '03', name: 'BENGALI SMALL COPY', price: '35', qty: '3', total: '525' },
  { no: '04', name: 'MATH SMALL COPY', price: '35', qty: '3', total: '525' },
  { no: '05', name: 'DRAWING COPY', price: '35', qty: '3', total: '525' },
  { no: '06', name: 'SCIENCE SMALL COPY', price: '35', qty: '3', total: '525' },
  { no: '07', name: 'BOOK COVER', price: '35', qty: '3', total: '525' },
];

const BUS_DETAILS: FeeDetailRow[] = [
  { no: '01', route: 'SALT LAKE TO HOWRHA', fee: '40000' },
];

const feeCategories: FeeCategory[] = [
  {
    id: 'admission',
    name: 'Admission Fee',
    totalFees: '₹17000',
    type: 'admission',
    details: ADMISSION_DETAILS,
    totalLabel: 'TOTAL FEE:',
    totalValue: '₹ 17000',
  },
  {
    id: 'stationary',
    name: 'Stationary Fee',
    totalFees: '₹1428',
    type: 'stationary',
    details: [],
    items: STATIONARY_ITEMS,
    totalLabel: 'STATIONARY TOTAL FEE :',
    totalValue: '₹ 1428',
  },
  {
    id: 'busServices',
    name: 'Bus Services Fee',
    totalFees: '₹7000',
    type: 'bus',
    details: BUS_DETAILS,
    totalLabel: 'TOTAL FEE :',
    totalValue: '₹ 40000',
  },
];

const ReAdmission = ({ navigation }: Props) => {
  const [expandedCategory, setExpandedCategory] = useState<
    string | null
  >(null);
  const [remark, setRemark] = useState('');
  const [processing, setProcessing] = useState(false);

  const toggleAccordion = (id: string) => {
    setExpandedCategory(prev => (prev === id ? null : id));
  };

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
        amount: '42000.00',
        currency: 'INR',
        billingName: 'Student Name',
        billingEmail: 'student@gmail.com',
        billingPhone: '9876543210',
        description: 'Re-Admission Fee Payment',
        meta: remark ? { remark } : undefined,
      });

      // Success, failure and cancellation all land on the result screen.
      navigation.replace('PaymentResult', { result });
    } catch {
      // Duplicate-payment / unexpected errors: stay on this screen.
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Re Admission"
        showBack={true}
        onMenuPress={() => navigation.goBack()}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Total Re-Admission Fee */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TOTAL RE-ADMISSION FEE :</Text>
          <Text style={styles.summaryAmount}>42,000.00</Text>
        </View>

        {/* Fee Categories */}
        {feeCategories.map(category => (
          <View key={category.id} style={styles.categoryWrapper}>
            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.85}
              onPress={() => toggleAccordion(category.id)}
            >
              <View style={styles.iconBack}>
                <Image
                  source={require('../assets/images/icons/fees.png')}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>
                  {category.name}
                </Text>
                <Text style={styles.categoryTotal}>
                  Total Fees: {category.totalFees}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.viewDetailsRow}
                activeOpacity={0.85}
                onPress={() => toggleAccordion(category.id)}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Image
                  source={require('../assets/images/icons/down arrow Icon.png')}
                  style={[
                    styles.arrow,
                    expandedCategory === category.id && styles.arrowUp,
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {expandedCategory === category.id && (
              <FeeDetailsCard category={category} />
            )}
          </View>
        ))}

        {/* Remarks */}
        <View style={styles.remarksCard}>
          <Text style={styles.remarksTitle}>Remarks</Text>
          <TextInput
            style={styles.remarksInput}
            placeholder="Enter your remark"
            placeholderTextColor={Colors.text_light}
            value={remark}
            onChangeText={setRemark}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.proceedButton, processing && styles.proceedButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleProceedToPay}
            disabled={processing}
          >
            <Text style={styles.proceedButtonText}>
              {processing ? 'PLEASE WAIT…' : 'PROCEED TO PAY'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeeDetailsCard = ({ category }: { category: FeeCategory }) => {
  if (category.type === 'stationary' && category.items) {
    return (
      <View style={styles.accordionContainer}>
        <View style={styles.accordionHeader}>
          <Text style={[styles.headerText, styles.colNo]}>#</Text>
          <Text style={[styles.headerText, styles.colName]}>NAME</Text>
          <Text style={[styles.headerText, styles.colPrice]}>PRICE</Text>
          <Text style={[styles.headerText, styles.colQty]}>QTY</Text>
          <Text style={[styles.headerText, styles.colTotal]}>TOTAL</Text>
        </View>

        {category.items.map((item, index) => (
          <View
            key={`${item.no}-${item.name}-${index}`}
            style={styles.detailRow}
          >
            <Text style={[styles.rowText, styles.colNo]}>{item.no}</Text>
            <Text style={[styles.rowText, styles.colName]}>
              {item.name}
            </Text>
            <Text style={[styles.rowText, styles.colPrice]}>
              {item.price}
            </Text>
            <Text style={[styles.rowText, styles.colQty]}>{item.qty}</Text>
            <Text style={[styles.rowTextBold, styles.colTotal]}>
              {item.total}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{category.totalLabel}</Text>
          <Text style={styles.totalAmount}>{category.totalValue}</Text>
        </View>
      </View>
    );
  }

  if (category.type === 'bus') {
    return (
      <View style={styles.accordionContainer}>
        <View style={styles.accordionHeader}>
          <Text style={[styles.headerText, styles.colNo]}>#</Text>
          <Text style={[styles.headerText, styles.colName]}>
            BUS ROUTE
          </Text>
          <Text style={[styles.headerText, styles.colFee]}>FEE</Text>
        </View>

        {category.details.map((row, index) => (
          <View
            key={`${row.no}-${row.route}-${index}`}
            style={styles.detailRow}
          >
            <Text style={[styles.rowText, styles.colNo]}>{row.no}</Text>
            <Text style={[styles.rowText, styles.colName]}>
              {row.route}
            </Text>
            <Text style={[styles.rowText, styles.colFee]}>{row.fee}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{category.totalLabel}</Text>
          <Text style={styles.totalAmount}>{category.totalValue}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.accordionContainer}>
      <View style={styles.accordionHeader}>
        <Text style={[styles.headerText, styles.colNo]}>#</Text>
        <Text style={[styles.headerText, styles.colName]}>
          CATEGORY NAME
        </Text>
        <Text style={[styles.headerText, styles.colFee]}>FEE</Text>
      </View>

      {category.details.map((row, index) => (
        <View
          key={`${row.no}-${row.route}-${index}`}
          style={styles.detailRow}
        >
          <Text style={[styles.rowText, styles.colNo]}>{row.no}</Text>
          <Text style={[styles.rowText, styles.colName]}>
            {row.route}
          </Text>
          <Text style={[styles.rowText, styles.colFee]}>{row.fee}</Text>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{category.totalLabel}</Text>
        <Text style={styles.totalAmount}>{category.totalValue}</Text>
      </View>
    </View>
  );
};

export default ReAdmission;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  summaryCard: {
    backgroundColor: Colors.theme_color,
    height: 111,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 14,
    color: Colors.white,
  },
  summaryAmount: {
    marginTop: 10,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: 48,
    lineHeight: 48,
    color: Colors.white,
  },
  categoryWrapper: {
    marginBottom: 10,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
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
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: 15.14,
    lineHeight: 15.14,
    color: Colors.textColorInpuHeader,
  },
  categoryTotal: {
    fontFamily: FontFamily.regular,
    fontSize: 12.21,
    lineHeight: 12.21,
    color: Colors.text_light,
    marginTop: 4,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  viewDetailsText: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: 12.5,
    lineHeight: 12.5,
    color: Colors.theme_color,
  },
  arrow: {
    width: 14,
    height: 8,
    marginLeft: 4,
  },
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  accordionContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E2E2',
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 10,
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  headerText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    lineHeight: 12,
    color: Colors.text,
  },
  colNo: {
    width: 30,
  },
  colName: {
    flex: 1,
    textAlign: 'left',
  },
  colFee: {
    width: 70,
    textAlign: 'right',
  },
  colPrice: {
    width: 50,
    textAlign: 'right',
  },
  colQty: {
    width: 40,
    textAlign: 'right',
  },
  colTotal: {
    width: 60,
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.iconBackGrey,
  },
  rowText: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    lineHeight: 12,
    color: Colors.text,
    textTransform: 'uppercase',
  },
  rowTextBold: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: 10,
    lineHeight: 12,
    color: Colors.text,
    textTransform: 'uppercase',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E2E2E2',
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 10,
    paddingLeft: 5,
    marginTop: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  totalLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 12,
    color: Colors.text,
  },
  totalAmount: {
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 12,
    color: Colors.text,
  },
  remarksCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
    marginBottom: 20,
  },
  remarksTitle: {
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: FontSize.medium,
    color: Colors.textColorInpuHeader,
  },
  remarksInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: Colors.iconBackGrey,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
  },
  proceedButton: {
    height: 46,
    backgroundColor: Colors.theme_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  proceedButtonDisabled: {
    opacity: 0.6,
  },
  proceedButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.regular,
  },
});
