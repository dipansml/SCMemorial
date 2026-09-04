import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import { CCAvenueService } from '../services/ccavenue/CCAvenueService';
import type { CCAvenuePaymentResponse } from '../services/ccavenue/CCAvenueTypes';
import { generateOrderId } from '../utils/orderId';
import { Api } from '../services/Api';
import StorageManager from '../services/StorageManager';
import type { ReAdmissionFormDetails } from '../Model/ReAdmission/ReAdmissionFormDetails';
import type { ReAdmissionStationaryApiItem } from '../Model/ReAdmission/ReAdmissionStationaryApiItem';
import type { ReAdmissionStoppage } from '../Model/ReAdmission/ReAdmissionStoppage';

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

const parseFee = (value: string | undefined | null): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-IN');
};

const buildAdmissionDetails = (fd: ReAdmissionFormDetails): FeeDetailRow[] => [
  { no: '01', route: 'ADMISSION FEE (ONE TIME) NEW STUDENT', fee: fd.admission_fee || '0' },
  { no: '02', route: 'DEVELOPMENT FEE (YEARLY)', fee: fd.development_fee || '0' },
  { no: '03', route: 'EXAM FEE (YEARLY)', fee: fd.exam_fee || '0' },
  { no: '04', route: 'FESTIVAL CELEBRATION FEE (YEARLY)', fee: fd.festival_celebration_fee || '0' },
  { no: '05', route: 'GAMES SPORTS FEE (YEARLY)', fee: fd.games_sports_fee || '0' },
  { no: '06', route: 'AUDIO VISUAL LAB FEE (YEARLY)', fee: fd.audio_visual_lab_fee || '0' },
  { no: '07', route: 'LIBRARY FEE (YEARLY)', fee: fd.library_fee || '0' },
  { no: '08', route: 'ELECTRICITY MAINTENANCE FEE (YEARLY)', fee: fd.electricity_maintenance_fee || '0' },
  { no: '09', route: 'COMPUTER FEE (YEARLY)', fee: fd.computer_fee || '0' },
  { no: '10', route: 'SECURITY DEPOSIT (REFUNDABLE) NEW STUDENT', fee: fd.security_deposite || '0' },
  { no: '11', route: 'TUITION FEE (MONTHLY)', fee: fd.tuition_fee || '0' },
];

const calculateAdmissionTotal = (fd: ReAdmissionFormDetails): number => {
  return (
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
    parseFee(fd.tuition_fee)
  );
};

const buildBusDetails = (
  fd: ReAdmissionFormDetails,
  sectionList: ReAdmissionStoppage[],
): { details: FeeDetailRow[]; fare: number } => {
  if (!fd || !fd.stoppage_name) {
    return {
      details: [{ no: '01', route: 'NO BUS SERVICE', fee: '0' }],
      fare: 0,
    };
  }

  const fareValue = fd.bus_services || '0';

  return {
    details: [{
      no: '01',
      route: String(fd.stoppage_name),
      fee: fareValue,
    }],
    fare: parseFee(fareValue),
  };
};

const buildStationaryItems = (
  apiItems: ReAdmissionStationaryApiItem[] | undefined | null,
): StationaryItem[] => {
  return (apiItems ?? []).map((item, index) => ({
    no: String(index + 1).padStart(2, '0'),
    name: item?.item_name ?? '',
    price: String(item?.price ?? '0'),
    qty: String(item?.qty ?? '0'),
    total: String(
      Number(item?.price ?? 0) * Number(item?.qty ?? 0),
    ),
  }));
};

const ReAdmission = ({ navigation }: Props) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [remark, setRemark] = useState('');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([]);
  const [summaryTotal, setSummaryTotal] = useState('0');
  const [paymentAmount, setPaymentAmount] = useState('0');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [formNo, setFormNo] = useState('');
  const [formDetails, setFormDetails] = useState<ReAdmissionFormDetails | null>(null);

  useEffect(() => {
    fetchReAdmissionFee();
  }, []);

  const fetchReAdmissionFee = async () => {
    try {
      setLoading(true);
      const userId = await StorageManager.getStudentId();
      const response = await Api.getReAdmissionFee({ user_id: userId });

      console.log(
        'ReAdmission API Response:',
        JSON.stringify(response, null, 2),
      );

      if (response && response.status === 200 && response.data?.form_details) {
        const fd = response.data.form_details;
        const stationaryTotal = parseFee(response.data.stationary_total_price);
        const admissionTotal = calculateAdmissionTotal(fd);
        const busResult = buildBusDetails(fd, response.data.section_list || []);
        const busTotal = busResult.fare;
        const total = admissionTotal + stationaryTotal + busTotal;

        console.log(
          'ReAdmission Form Details:',
          JSON.stringify(fd, null, 2),
        );

        const categories: FeeCategory[] = [
          {
            id: 'admission',
            name: 'Admission Fee',
            totalFees: `\u20B9${formatCurrency(admissionTotal)}`,
            type: 'admission',
            details: buildAdmissionDetails(fd),
            totalLabel: 'TOTAL FEE:',
            totalValue: `\u20B9 ${formatCurrency(admissionTotal)}`,
          },
          {
            id: 'stationary',
            name: 'Stationary Fee',
            totalFees: `\u20B9${formatCurrency(stationaryTotal)}`,
            type: 'stationary',
            details: [],
            items: buildStationaryItems(response.data.stationary_item_list),
            totalLabel: 'STATIONARY TOTAL FEE :',
            totalValue: `\u20B9 ${formatCurrency(stationaryTotal)}`,
          },
          {
            id: 'busServices',
            name: 'Bus Services Fee',
            totalFees: `\u20B9${formatCurrency(busTotal)}`,
            type: 'bus',
            details: busResult.details,
            totalLabel: 'TOTAL FEE :',
            totalValue: `\u20B9 ${formatCurrency(busTotal)}`,
          },
        ];

        setFeeCategories(categories);
        setSummaryTotal(formatCurrency(total));
        setPaymentAmount(String(total));
        setFormDetails(fd);

        if (fd.first_name) {
          setStudentName(fd.first_name);
        }
        if (fd.student_code) {
          setStudentCode(String(fd.student_code));
        }
        if (fd.form_no) {
          setFormNo(String(fd.form_no));
        }
      } else {
        Alert.alert('Error', response?.message || 'Failed to load fee details');
      }
    } catch (error: any) {
      console.log(
        'ReAdmission API Error:',
        error?.response?.data || error?.message || error,
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
    setExpandedCategory(prev => (prev === id ? null : id));
  };

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
      // TEST: fixed ₹1.00 amount for Re-Admission CCAvenue testing. Revert to the original line below.
      // const amount = Number(paymentAmount).toFixed(2);
      const amount = '1.00';
      const payeeUserId = await StorageManager.getStudentId();
      const user = await StorageManager.getUser();

      const merchantParam2 = [
        formDetails?.student_id || '',
        formDetails?.session_year_id || '',
        formDetails?.id || '',
        user?.user_id || '',
      ].join('#');

      const ccavenueRequestPayload = {
        user_id: payeeUserId,
        payment_amount: paymentAmount,
        session_pay_mnth_id: formDetails?.month_id ? [formDetails.month_id] : [],
      };
      const ccavenueRequestResponse = await Api.ccavenueRequestReadmission(ccavenueRequestPayload);
      console.log('ccavenue-request-readmission response:', JSON.stringify(ccavenueRequestResponse));

      if (!ccavenueRequestResponse) {
        setProcessing(false);
        Alert.alert('Error', 'CC Avenue request failed. No response received.');
        return;
      }

      const response: CCAvenuePaymentResponse = await CCAvenueService.startPayment({
        orderId,
        amount,
        currency: 'INR',
        customerName: studentName || 'Student',
        studentCode: studentCode || undefined,
        formNo: formNo || undefined,
        merchantParam1:
          ccavenueRequestResponse?.data?.data?.merchant_param1 != null
            ? String(ccavenueRequestResponse?.data?.data?.merchant_param1)
            : '',
        merchantParam2,
        merchantParam3: amount,
        merchantParam4: studentCode || undefined,
        merchantParam5: studentName || 'Student',
      });

      setProcessing(false);

      if (response.orderStatus === 'Success') {
        await CCAvenueService.postAbortedResponseToPhp(response);
      } else if (response.orderStatus === 'Aborted') {
        await CCAvenueService.postAbortedResponseToPhp(response);
      } else {
        Alert.alert(
          'Payment Failed',
          `Status: ${response.orderStatus}\n${response.failureMessage || response.statusMessage || 'Unknown error'}`,
        );
      }
    } catch (error: any) {
      setProcessing(false);
      Alert.alert('Payment Error', error?.message || 'Something went wrong');
    }
  };

  if (loading) {
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.theme_color} />
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.summaryAmount}>{summaryTotal}</Text>
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
              {processing ? 'PLEASE WAIT\u2026' : 'PROCEED TO PAY'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
                <Text style={styles.confirmValue}>Re-Admission Fee</Text>
              </View>

              <View style={styles.confirmSection}>
                <Text style={styles.confirmLabel}>Total Amount</Text>
                <Text style={styles.confirmTotalAmount}>
                  {`₹${Number(paymentAmount).toLocaleString('en-IN', {
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
                style={styles.confirmPayButton}
                activeOpacity={0.85}
                onPress={handleConfirmPayment}
              >
                <Text style={styles.confirmPayButtonText}>CONFIRM AND PAY</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
