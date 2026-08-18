import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import type { FeeAmountForSelectedMonthResponse } from '../Model/FeeAmountForSelectedMonth/FeeAmountForSelectedMonthResponse';

type PaymentFormData = {
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
  formData: PaymentFormData;
  remark: string;
  feeAmountData: FeeAmountForSelectedMonthResponse | null;
  feeAmountLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const safeNum = (v: string): number => {
  const n = Number(v.replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? 0 : n;
};

const PaymentConfirmationOverlay = ({
  visible,
  totalAmount,
  selectedMonthNames,
  formData,
  remark,
  feeAmountData,
  feeAmountLoading,
  onClose,
  onConfirm,
}: Props) => {
  if (!visible) { return null; }

  const tuitionFine = safeNum(formData.tuitionFine);
  const busFine = safeNum(formData.busFine);
  const advancedAmount = safeNum(formData.advancedAmount);
  const dueAmount = safeNum(formData.dueAmount);
  const cashAmount = safeNum(formData.cashAmount);
  const finalAmount = totalAmount + tuitionFine + busFine + dueAmount - advancedAmount;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Payment Confirmation</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Selected Months */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Selected Months</Text>
            <Text style={styles.rowValue}>{selectedMonthNames.join(', ')}</Text>
          </View>

          {/* Base Amount */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Base Amount</Text>
            <Text style={styles.rowValue}>₹{totalAmount.toLocaleString('en-IN')}.00</Text>
          </View>

          {/* Fee Amount API Data */}
          {feeAmountLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.theme_color} />
              <Text style={styles.loadingText}>Calculating fee amounts...</Text>
            </View>
          ) : feeAmountData?.data ? (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Tution Fine Amount</Text>
                <Text style={styles.rowValue}>₹{Number(feeAmountData.data.tuition_fine).toLocaleString('en-IN')}.00</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Bus Fine Amount</Text>
                <Text style={styles.rowValue}>₹{Number(feeAmountData.data.bus_fine).toLocaleString('en-IN')}.00</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Cash Amount</Text>
                <Text style={styles.rowValue}>₹{Number(feeAmountData.data.totalCalamount).toLocaleString('en-IN')}.00</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Due Amount</Text>
                <Text style={styles.rowValue}>₹{Number(feeAmountData.data.due_amount).toLocaleString('en-IN')}.00</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Advance Amount</Text>
                <Text style={styles.rowValue}>₹{Number(feeAmountData.data.adv_amount).toLocaleString('en-IN')}.00</Text>
              </View>
            </>
          ) : null}

          {/* Tuition Fine */}
          {tuitionFine > 0 && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Tuition Fine</Text>
              <Text style={styles.rowValue}>₹{tuitionFine.toLocaleString('en-IN')}.00</Text>
            </View>
          )}

          {/* Bus Fine */}
          {busFine > 0 && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Bus Fine</Text>
              <Text style={styles.rowValue}>₹{busFine.toLocaleString('en-IN')}.00</Text>
            </View>
          )}

          {/* Cash Amount */}
          {cashAmount > 0 && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Cash Amount</Text>
              <Text style={styles.rowValue}>₹{cashAmount.toLocaleString('en-IN')}.00</Text>
            </View>
          )}

          {/* Advanced Amount */}
          {advancedAmount > 0 && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Advanced Amount</Text>
              <Text style={styles.rowValue}>- ₹{advancedAmount.toLocaleString('en-IN')}.00</Text>
            </View>
          )}

          {/* Due Amount */}
          {dueAmount > 0 && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Due Amount</Text>
              <Text style={styles.rowValue}>₹{dueAmount.toLocaleString('en-IN')}.00</Text>
            </View>
          )}

          {/* Payee Name */}
          {formData.payeeName ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Payee Name</Text>
              <Text style={styles.rowValue}>{formData.payeeName}</Text>
            </View>
          ) : null}

          {/* Remark */}
          {remark ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Remark</Text>
              <Text style={styles.rowValue}>{remark}</Text>
            </View>
          ) : null}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Final Amount */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL PAYABLE AMOUNT</Text>
            <Text style={styles.totalAmount}>₹{finalAmount.toLocaleString('en-IN')}.00</Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.85}
            onPress={onConfirm}
          >
            <Text style={styles.confirmButtonText}>CONFIRM & PAY</Text>
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
    </Pressable>
  );
};

export default PaymentConfirmationOverlay;

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
    zIndex: 2000,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: '80%',
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
    marginBottom: 12,
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
  divider: {
    height: 1,
    backgroundColor: Colors.iconBackGrey,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  rowLabel: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    flex: 1,
    marginRight: 8,
  },
  rowValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.text,
    textAlign: 'right',
    flexShrink: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: FontSize.regular,
    color: Colors.textColorInpuHeader,
  },
  totalAmount: {
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: FontSize.large,
    color: Colors.theme_color,
  },
  confirmButton: {
    height: 46,
    backgroundColor: Colors.theme_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  confirmButtonText: {
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.text_light,
    marginLeft: 8,
  },
});
