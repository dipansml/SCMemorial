import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import type { FeeAmountForSelectedMonthResponse } from '../Model/FeeAmountForSelectedMonth/FeeAmountForSelectedMonthResponse';
import { CCAvenueService } from '../services/ccavenue/CCAvenueService';
import type {
  CCAvenueMerchantMeta,
  CCAvenuePaymentResponse,
} from '../services/ccavenue/CCAvenueTypes';
import { generateOrderId } from '../utils/orderId';

export type PaymentFormData = {
  tuitionFine: string;
  busFine: string;
  advancedAmount: string;
  dueAmount: string;
  cashAmount: string;
  payeeName: string;
};

type Props = {
  visible: boolean;
  totalAmount: number;
  selectedMonthNames: string[];
  initialPayeeName?: string;
  feeAmountData: FeeAmountForSelectedMonthResponse | null;
  merchantMeta?: CCAvenueMerchantMeta;
  onClose: () => void;
  onProceedToPay: (data: PaymentFormData) => void;
};

const safeStr = (v: number | null | undefined): string => {
  if (v === null || v === undefined) { return '0'; }
  return String(v);
};

const PayAcademicFeesModal = ({
  visible,
  totalAmount,
  selectedMonthNames,
  initialPayeeName = '',
  feeAmountData,
  merchantMeta,
  onClose,
  onProceedToPay,
}: Props) => {
  const [tuitionFine, setTuitionFine] = useState('');
  const [busFine, setBusFine] = useState('');
  const [advancedAmount, setAdvancedAmount] = useState('');
  const [dueAmount, setDueAmount] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [payeeName, setPayeeName] = useState(initialPayeeName);
  const [paying, setPaying] = useState(false);

  const computeCashAmount = (
    total: number,
    tFine: string,
    bFine: string,
    adv: string,
    due: string,
  ): string => {
    const nTotal = Number(total) || 0;
    const nFine = Number(tFine) || 0;
    const nBusFine = Number(bFine) || 0;
    const nAdv = Number(adv) || 0;
    const nDue = Number(due) || 0;
    return String(nTotal + nFine + nBusFine + nAdv - nDue);
  };

  useEffect(() => {
    if (visible && feeAmountData?.data) {
      const tFine = safeStr(feeAmountData.data.tuition_fine);
      const bFine = safeStr(feeAmountData.data.bus_fine);
      const adv = safeStr(feeAmountData.data.adv_amount);
      const due = safeStr(feeAmountData.data.due_amount);
      setTuitionFine(tFine);
      setBusFine(bFine);
      setAdvancedAmount(adv);
      setDueAmount(due);
      setCashAmount(computeCashAmount(totalAmount, tFine, bFine, adv, due));
    }
  }, [visible, feeAmountData, totalAmount]);

  if (!visible) { return null; }

  const handleProceed = async () => {
    if (paying) { return; }
    setPaying(true);

    try {
      const orderId = generateOrderId();
      const finalCashAmount = computeCashAmount(
        totalAmount,
        tuitionFine,
        busFine,
        advancedAmount,
        dueAmount,
      );
      const amount = Number(finalCashAmount).toFixed(2);
      //const amount = "1.00";
      const customerName = payeeName.trim() || merchantMeta?.customerName || 'Student';

      const merchantParam2 = merchantMeta
        ? [
            merchantMeta.payeeUserId || '',
            merchantMeta.sessionYearId || '',
            merchantMeta.selId || '',
            merchantMeta.loginUserId || '',
          ].join('#')
        : '';

      const response: CCAvenuePaymentResponse = await CCAvenueService.startPayment({
        orderId,
        amount,
        currency: 'INR',
        customerName,
        studentCode: merchantMeta?.studentCode || undefined,
        formNo: merchantMeta?.formNo || undefined,
        merchantParam1: '',
        merchantParam2,
        merchantParam3: amount,
        merchantParam4: merchantMeta?.studentCode || undefined,
        merchantParam5: customerName,
      });

      console.log('===== CCAvenue Native Result =====');
      console.log(response);

      setPaying(false);

      if (response.orderStatus === 'Aborted') {
        await CCAvenueService.postAbortedResponseToPhp(response);
        return;
      }

      if (response.orderStatus === 'Success') {
        await CCAvenueService.postAbortedResponseToPhp(response);
        return;
      } else {
        Alert.alert(
          'Payment Failed',
          `Status: ${response.orderStatus}\n${response.failureMessage || response.statusMessage || 'Unknown error'}`,
        );
      }
    } catch (error: any) {
      setPaying(false);
      Alert.alert('Payment Error', error?.message || 'Something went wrong');
    }
  };

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Pay Academic Fees</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Online Payment */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Online Payment</Text>
              <View style={styles.divider} />
            </View>

            {/* Selected Months */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Selected Months</Text>
              <Text style={styles.sectionValue}>
                {selectedMonthNames.join(', ') || 'None'}
              </Text>
            </View>

            {/* Total Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Total Amount</Text>
              <Text style={styles.totalAmountValue}>₹{totalAmount.toLocaleString('en-IN')}.00</Text>
            </View>

            {/* Tuition Fine Amount */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Tuition Fine Amount</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="0"
                placeholderTextColor={Colors.text_light}
                keyboardType="numeric"
                value={tuitionFine}
                onChangeText={setTuitionFine}
                editable={false}
              />
            </View>

            {/* Bus Fine Amount */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Bus Fine Amount</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="0"
                placeholderTextColor={Colors.text_light}
                keyboardType="numeric"
                value={busFine}
                onChangeText={setBusFine}
                editable={false}
              />
            </View>

            {/* Advanced Amount */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Advanced Amount</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="0"
                placeholderTextColor={Colors.text_light}
                keyboardType="numeric"
                value={advancedAmount}
                onChangeText={setAdvancedAmount}
                editable={false}
              />
            </View>

            {/* Due Amount */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Due Amount</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="0"
                placeholderTextColor={Colors.text_light}
                keyboardType="numeric"
                value={dueAmount}
                onChangeText={setDueAmount}
                editable={false}
              />
            </View>

            {/* Cash Amount */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Cash Amount</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="0"
                placeholderTextColor={Colors.text_light}
                keyboardType="numeric"
                value={cashAmount}
                onChangeText={setCashAmount}
                editable={false}
              />
            </View>

            {/* Payee Name */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Payee Name</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Enter payee name"
                placeholderTextColor={Colors.text_light}
                value={payeeName}
                onChangeText={setPayeeName}
                editable={false}
              />
            </View>

            {/* Important Note */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteTitle}>Important Note</Text>
              <Text style={styles.noteText}>
                Please ensure all details are correct before proceeding with the payment.
              </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.proceedButton, paying && { opacity: 0.6 }]}
              activeOpacity={0.85}
              onPress={handleProceed}
              disabled={paying}
            >
              <Text style={styles.proceedButtonText}>
                {paying ? 'PROCESSING...' : 'CONFIRM AND PAY'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.85}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  );
};

export default PayAcademicFeesModal;

const styles = StyleSheet.create({
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: '85%',
    width: '90%',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: FontSize.large,
    color: Colors.textColorInpuHeader,
  },
  closeIcon: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.large,
    color: Colors.text_light,
    padding: 4,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    marginBottom: 4,
  },
  sectionValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.iconBackGrey,
    marginTop: 8,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    marginBottom: 6,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: Colors.iconBackGrey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    backgroundColor: Colors.white,
  },
  noteContainer: {
    backgroundColor: Colors.instruction_box,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginTop: 4,
  },
  noteTitle: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.small,
    color: Colors.instruction_text,
    marginBottom: 4,
  },
  noteText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.very_small,
    color: Colors.instruction_text,
    lineHeight: 16,
  },
  totalAmountValue: {
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: FontSize.regular,
    color: Colors.textColorInpuHeader,
  },
  proceedButton: {
    height: 46,
    backgroundColor: Colors.theme_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  proceedButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.regular,
  },
  closeButton: {
    height: 46,
    backgroundColor: Colors.white,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.iconBackGrey,
  },
  closeButtonText: {
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.regular,
  },
});
