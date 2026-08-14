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

type Props = {
  navigation: any;
};

type FeeDetailRow = {
  no: string;
  route: string;
  fee: string;
};

type MonthData = {
  id: string;
  name: string;
  totalFees: string;
  checked: boolean;
  details: FeeDetailRow[];
};

const MAY_DETAILS: FeeDetailRow[] = [
  { no: '01', route: 'ADMISSION FEE', fee: '0' },
  { no: '02', route: 'SESSION CHARGES', fee: '7000' },
  { no: '03', route: 'SECURITY DEPOSIT', fee: '0' },
  { no: '04', route: 'TUITION FEE (MONTHLY)', fee: '3000' },
  { no: '05', route: 'TUITION FINE AMOUNT', fee: '0' },
  { no: '01', route: 'BUS SERVICES', fee: '0' },
  { no: '01', route: 'BUS FINE AMOUNT', fee: '0' },
];

const DEFAULT_DETAILS: FeeDetailRow[] = [
  { no: '01', route: 'ADMISSION FEE', fee: '0' },
  { no: '02', route: 'SESSION CHARGES', fee: '0' },
  { no: '03', route: 'SECURITY DEPOSIT', fee: '0' },
  { no: '04', route: 'TUITION FEE (MONTHLY)', fee: '17000' },
  { no: '05', route: 'TUITION FINE AMOUNT', fee: '0' },
  { no: '01', route: 'BUS SERVICES', fee: '0' },
  { no: '01', route: 'BUS FINE AMOUNT', fee: '0' },
];

const months: MonthData[] = [
  { id: 'april', name: 'April', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'may', name: 'May', totalFees: '₹5000', checked: true, details: MAY_DETAILS },
  { id: 'june', name: 'June', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'july', name: 'July', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'august', name: 'August', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'september', name: 'September', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'october', name: 'October', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'november', name: 'November', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'december', name: 'December', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'january', name: 'January', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'february', name: 'February', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
  { id: 'march', name: 'March', totalFees: '₹17000', checked: true, details: DEFAULT_DETAILS },
];

const MothlyFeesPayment = ({ navigation }: Props) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [remark, setRemark] = useState('');

  const toggleAccordion = (id: string) => {
    setExpandedMonth(prev => (prev === id ? null : id));
  };

  const toggleMonthSelection = (id: string) => {
    setSelectedMonths(prev =>
      prev.includes(id)
        ? prev.filter(monthId => monthId !== id)
        : [...prev, id],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Monthly Fees Payment"
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

        {/* Months */}
        {months.map(month => (
          <View key={month.id} style={styles.monthWrapper}>
            <TouchableOpacity
              style={styles.monthCard}
              activeOpacity={0.85}
              onPress={() => toggleMonthSelection(month.id)}
            >
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleMonthSelection(month.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {selectedMonths.includes(month.id) ? (
                  <Image
                    source={require('../assets/images/icons/check_box.png')}
                    style={styles.checkboxImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('../assets/images/icons/uncheck_box.png')}
                    style={styles.checkboxImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>

              <View style={styles.monthInfo}>
                <Text style={styles.monthName}>{month.name}</Text>
                <Text style={styles.monthTotal}>
                  Total Fees: {month.totalFees}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.viewDetailsRow}
                activeOpacity={0.85}
                onPress={() => toggleAccordion(month.id)}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Image
                  source={require('../assets/images/icons/down arrow Icon.png')}
                  style={[styles.arrow, expandedMonth === month.id && styles.arrowUp]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {expandedMonth === month.id && (
              <FeeDetailsCard details={month.details} />
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
            style={styles.proceedButton}
            activeOpacity={0.85}
            onPress={() => console.log('Proceed pressed:', remark)}
          >
            <Text style={styles.proceedButtonText}>PROCEED TO PAY</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeeDetailsCard = ({ details }: { details: FeeDetailRow[] }) => {
  const total = details.reduce((sum, row) => sum + Number(row.fee), 0);

  return (
    <View style={styles.accordionContainer}>
      <View style={styles.accordionHeader}>
        <Text style={[styles.headerText, styles.colNo]}>#</Text>
        <Text style={[styles.headerText, styles.colName]}>BUS ROUTE</Text>
        <Text style={[styles.headerText, styles.colFee]}>FEE</Text>
      </View>

      {details.map((row, index) => (
        <View
          key={`${row.no}-${row.route}-${index}`}
          style={styles.detailRow}
        >
          <Text style={[styles.rowText, styles.colNo]}>{row.no}</Text>
          <Text style={[styles.rowText, styles.colName]}>{row.route}</Text>
          <Text style={[styles.rowText, styles.colFee]}>{row.fee}</Text>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>TOTAL FEE:</Text>
        <Text style={styles.totalAmount}>₹ {total}</Text>
      </View>
    </View>
  );
};

export default MothlyFeesPayment;

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
  monthWrapper: {
    marginBottom: 10,
  },
  monthCard: {
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
  checkbox: {
    padding: 3,
  },
  checkboxImage: {
    width: 24,
    height: 24,
  },
  monthInfo: {
    flex: 1,
    marginLeft: 10,
  },
  monthName: {
    fontFamily: FontFamily.medium,
    fontWeight: '400',
    fontSize: 15.14,
    lineHeight: 15.14,
    color: Colors.textColorInpuHeader,
  },
  monthTotal: {
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
    lineHeight: 10,
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
  proceedButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.regular,
  },
});
