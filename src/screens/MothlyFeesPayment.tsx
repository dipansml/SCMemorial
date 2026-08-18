import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import { Api } from '../services/Api';
import StorageManager from '../services/StorageManager';
import FullScreenLoader from '../view/FullScreenLoader';
import PayAcademicFeesModal from '../component/PayAcademicFeesModal';
import PaymentConfirmationOverlay from '../component/PaymentConfirmationOverlay';
import type { FeeStructureItem } from '../Model/ViewFeeStructure/FeeStructureItem';
import type { FeeAmountForSelectedMonthResponse } from '../Model/FeeAmountForSelectedMonth/FeeAmountForSelectedMonthResponse';

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
  apiId: string;
  name: string;
  totalFees: string;
  totalAmount: string;
  checked: boolean;
  paid: boolean;
  details: FeeDetailRow[];
};

type PaymentFormData = {
  tuitionFine: string;
  busFine: string;
  advancedAmount: string;
  dueAmount: string;
  cashAmount: string;
  payeeName: string;
};

const safeFee = (v: string | null): string => {
  if (v === null || v === undefined || v === '') { return '0'; }
  return v;
};

function mapFeeStructureToDetails(item: FeeStructureItem): FeeDetailRow[] {
    const sessionCharges = Number(safeFee(item.development_fee))
      + Number(safeFee(item.exam_fee))
      + Number(safeFee(item.festival_celebration_fee))
      + Number(safeFee(item.games_sports_fee))
      + Number(safeFee(item.audio_visual_lab_fee))
      + Number(safeFee(item.library_fee))
      + Number(safeFee(item.electricity_maintenance_fee))
      + Number(safeFee(item.computer_fee));
    return [
      { no: '01', route: 'ADMISSION FEE', fee: safeFee(item.admission_fee) },
      { no: '02', route: 'SESSION CHARGES', fee: String(sessionCharges) },
    { no: '03', route: 'SECURITY DEPOSIT', fee: safeFee(item.security_deposite) },
    { no: '04', route: 'TUITION FEE (MONTHLY)', fee: safeFee(item.tuition_fee) },
    { no: '05', route: 'TUITION FINE AMOUNT', fee: safeFee(item.fine) },
    { no: '06', route: 'BUS SERVICES', fee: safeFee(item.bus_services) },
    { no: '07', route: 'BUS FINE AMOUNT', fee: safeFee(item.bus_fee_fine) },
    { no: '08', route: 'TOTAL AMOUNT', fee: safeFee(item.total_amount_show) },
  ];
}

const MothlyFeesPayment = ({ navigation }: Props) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [months, setMonths] = useState<MonthData[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationOverlay, setShowConfirmationOverlay] = useState(false);
  const [feeAmountLoading, setFeeAmountLoading] = useState(false);
  const [feeAmountData, setFeeAmountData] = useState<FeeAmountForSelectedMonthResponse | null>(null);
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    tuitionFine: '',
    busFine: '',
    advancedAmount: '',
    dueAmount: '',
    cashAmount: '',
    payeeName: '',
  });

  useEffect(() => {
    loadFeeStructure();
  }, []);

  const loadFeeStructure = async () => {
    try {
      setLoading(true);
      const userId = await StorageManager.getStudentId();
      const response = await Api.getViewFeeStructure({ user_id: userId });

      if (response && response.status === 200 && response.data) {
        const { fee_structure } = response.data;

        if (fee_structure && fee_structure.length > 0) {
          const mappedMonths: MonthData[] = fee_structure.map(
            (item: FeeStructureItem) => {
              const isPaid = item.ad_payment_status === '1';
              return {
                id: item.month_name?.toLowerCase() || '',
                apiId: item.id || '',
                name: item.month_name,
                totalFees: `₹${item.total_amount_show}`,
                totalAmount: safeFee(item.total_amount_show),
                checked: !isPaid,
                paid: isPaid,
                details: mapFeeStructureToDetails(item),
              };
            },
          );
          setMonths(mappedMonths);
          setSelectedMonths([]);
        }
      } else {
        Alert.alert(
          'Error',
          response?.message || 'Failed to load fee structure',
        );
      }
    } catch (error: any) {
      console.log(
        'Fee Structure Error:',
        error?.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (id: string) => {
    setExpandedMonth(prev => (prev === id ? null : id));
  };

  const toggleMonthSelection = (id: string) => {
    const month = months.find(m => m.id === id);
    if (month?.paid) {
      return;
    }
    setSelectedMonths(prev =>
      prev.includes(id)
        ? prev.filter(monthId => monthId !== id)
        : [...prev, id],
    );
  };

  const totalSelectedFee = selectedMonths.reduce((sum, monthId) => {
    const month = months.find(m => m.id === monthId);
    if (!month) { return sum; }
    const numericStr = month.totalFees.replace(/[^0-9]/g, '');
    return sum + Number(numericStr);
  }, 0);

  const selectedMonthNames = selectedMonths
    .map(id => months.find(m => m.id === id)?.name)
    .filter(Boolean) as string[];

  const handleOpenPaymentModal = async () => {
    if (selectedMonths.length === 0) {
      Alert.alert('Info', 'Please select at least one unpaid month to proceed.');
      return;
    }

    const selectedIds = selectedMonths
      .map(id => months.find(m => m.id === id)?.apiId)
      .filter(id => id !== undefined && id !== '')
      .map(id => Number(id));

    try {
      setFeeAmountLoading(true);
      const userId = await StorageManager.getStudentId();
      const response = await Api.getFeeAmountForSelectedMonth({
        user_id: userId,
        ids: selectedIds,
      });
      setFeeAmountData(response);
    } catch (error: any) {
      console.log(
        'Fee Amount API Error:',
        error?.response?.data || error.message,
      );
      setFeeAmountData(null);
    } finally {
      setFeeAmountLoading(false);
      setShowPaymentModal(true);
    }
  };

  const handleProceedToPay = (data: PaymentFormData) => {
    setPaymentFormData(data);
    setShowPaymentModal(false);
    setShowConfirmationOverlay(true);
  };

  const handleConfirmPayment = () => {
    setShowConfirmationOverlay(false);
    Alert.alert('Success', 'Payment initiated successfully.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />
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
          <Text style={styles.summaryAmount}>
            {totalSelectedFee.toLocaleString('en-IN')}.00
          </Text>
        </View>

        {/* Months */}
        {months.map(month => (
          <View key={month.id} style={styles.monthWrapper}>
            <TouchableOpacity
              style={[
                styles.monthCard,
                month.paid && styles.monthCardPaid,
              ]}
              activeOpacity={month.paid ? 1 : 0.85}
              onPress={() => toggleMonthSelection(month.id)}
            >
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleMonthSelection(month.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                disabled={month.paid}
              >
                {month.paid ? (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidBadgeText}>✓</Text>
                  </View>
                ) : selectedMonths.includes(month.id) ? (
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
                <Text
                  style={[
                    styles.monthName,
                    month.paid && styles.monthNamePaid,
                  ]}
                >
                  {month.name}
                </Text>
                <Text style={styles.monthTotal}>
                  Total Fees: {month.totalFees}
                </Text>
                {month.paid ? (
                  <Text style={styles.paidLabel}>Paid</Text>
                ) : null}
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
              <FeeDetailsCard details={month.details} totalAmount={month.totalAmount} />
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
            onPress={handleOpenPaymentModal}
          >
            <Text style={styles.proceedButtonText}>PROCEED TO PAY</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PayAcademicFeesModal
        visible={showPaymentModal}
        totalAmount={totalSelectedFee}
        selectedMonthNames={selectedMonthNames}
        initialPayeeName=""
        feeAmountData={feeAmountData}
        onClose={() => setShowPaymentModal(false)}
        onProceedToPay={handleProceedToPay}
      />

      <PaymentConfirmationOverlay
        visible={showConfirmationOverlay}
        totalAmount={totalSelectedFee}
        selectedMonthNames={selectedMonthNames}
        formData={paymentFormData}
        remark={remark}
        feeAmountData={feeAmountData}
        feeAmountLoading={feeAmountLoading}
        onClose={() => {
          setShowConfirmationOverlay(false);
          setFeeAmountData(null);
          setShowPaymentModal(true);
        }}
        onConfirm={handleConfirmPayment}
      />
    </SafeAreaView>
  );
};

const FeeDetailsCard = ({ details, totalAmount }: { details: FeeDetailRow[]; totalAmount: string }) => {
  return (
    <View style={styles.accordionContainer}>
      <View style={styles.accordionHeader}>
        <Text style={[styles.headerText, styles.colNo]}>#</Text>
        <Text style={[styles.headerText, styles.colName]}>FEE TYPE</Text>
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
        <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
        <Text style={styles.totalAmount}>₹ {totalAmount}</Text>
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
  monthCardPaid: {
    opacity: 0.5,
  },
  checkbox: {
    padding: 3,
  },
  checkboxImage: {
    width: 24,
    height: 24,
  },
  paidBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark_green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidBadgeText: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
    fontSize: 12,
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
  monthNamePaid: {
    color: Colors.text_light,
  },
  monthTotal: {
    fontFamily: FontFamily.regular,
    fontSize: 12.21,
    lineHeight: 12.21,
    color: Colors.text_light,
    marginTop: 4,
  },
  paidLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: Colors.dark_green,
    marginTop: 2,
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
