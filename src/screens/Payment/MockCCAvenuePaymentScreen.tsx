import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppHeader from '../../component/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';
import { FontFamily, FontSize, card } from '../../theme/fonts_dimen';
import { mockCCAvenueProvider, MOCK_TEST_CARDS } from '../../services/payment/MockCCAvenueProvider';
import { PaymentError } from '../../services/payment/payment.types';

export type MockCCAvenuePaymentRouteParams = {
  orderId: string;
  amount: string;
  currency: string;
  billingName?: string;
  billingEmail?: string;
  billingPhone?: string;
  description?: string;
};

type Props = {
  navigation: any;
  route: { params: MockCCAvenuePaymentRouteParams };
};

/**
 * TEMPORARY CCAvenue-style TEST payment screen.
 *
 * ============================================================================
 * TEST MODE ONLY — this is NOT the real CCAvenue gateway.
 * ============================================================================
 * - Card data entered here is interpreted LOCALLY by the mock adapter.
 * - It is NOT stored, NOT logged and NOT sent to any server.
 * - No real payment is processed.
 *
 * This screen will be replaced by the official CCAvenue checkout later,
 * through RealCCAvenueProvider, without changing the checkout UI.
 */

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function luhnCheck(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

const MockCCAvenuePaymentScreen = ({ navigation, route }: Props) => {
  const { orderId, amount, currency, billingName, description } = route.params;

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState(billingName || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    console.log('[MOCK PAYMENT] Payment screen mounted');
    console.log('[MOCK PAYMENT] Waiting for user to press PAY');
    mounted.current = true;
    return () => {
      mounted.current = false;
      // If the user leaves the screen (back gesture / hardware back) while a
      // payment session is still pending, resolve it as CANCELLED so the
      // checkout never hangs. This only cleans up an existing session; it
      // never starts a payment.
      try {
        mockCCAvenueProvider.cancelMockPayment();
      } catch {
        // No active session — nothing to cancel.
      }
    };
  }, []);

  const validate = (): string | null => {
    const digits = cardNumber.replace(/\s/g, '');
    if (!digits) {
      return 'Please enter a card number.';
    }
    if (digits.length < 13 || digits.length > 19) {
      return 'Please enter a valid card number.';
    }
    if (!luhnCheck(digits)) {
      return 'Invalid card number. Please check and try again.';
    }
    if (!cardHolderName.trim()) {
      return 'Please enter the card holder name.';
    }
    const expiryMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);
    if (!expiryMatch) {
      return 'Please enter the expiry date as MM/YY.';
    }
    const expMonth = Number(expiryMatch[1]);
    const expYear = 2000 + Number(expiryMatch[2]);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return 'This card has expired.';
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      return 'Please enter a valid CVV.';
    }
    return null;
  };

  const handlePayNow = async () => {
    if (processing) {
      return;
    }
    console.log('[MOCK PAYMENT] PAY BUTTON PRESSED');
    const validationError = validate();
    if (validationError) {
      console.log('[MOCK PAYMENT] Validation error:', validationError);
      setError(validationError);
      return;
    }

    setError(null);
    setProcessing(true);

    try {
      const digits = cardNumber.replace(/\s/g, '');
      const expiryMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);
      await mockCCAvenueProvider.submitMockPayment({
        cardNumber: digits,
        cardHolderName: cardHolderName.trim(),
        expiryMonth: expiryMatch ? expiryMatch[1] : '',
        expiryYear: expiryMatch ? expiryMatch[2] : '',
        cvv,
      });
      // The session is complete. Pop this leaf screen so the orchestrator
      // (PaymentService → caller) can land the user on the result screen.
      navigation.goBack();
    } catch (payError) {
      if (mounted.current) {
        setProcessing(false);
        setError(
          payError instanceof PaymentError
            ? payError.userMessage
            : 'Payment could not be completed. Please try again.',
        );
      }
    }
  };

  const handleCancel = () => {
    if (processing) {
      return;
    }
    console.log('[MOCK PAYMENT] CANCEL pressed');
    try {
      mockCCAvenueProvider.cancelMockPayment();
    } catch {
      // No active session — nothing to cancel.
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="CCAvenue Test Payment"
        showBack={true}
        onMenuPress={() => navigation.goBack()}
        onBellPress={() => {}}
        onProfilePress={() => {}}
        navigation={navigation}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Test-mode banner */}
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>CCAvenue TEST MODE</Text>
            <Text style={styles.bannerText}>
              Test Mode — No real payment will be processed.
            </Text>
          </View>

          {/* Order summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>
                {currency} {amount}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order ID</Text>
              <Text style={styles.summaryValueSmall}>{orderId}</Text>
            </View>
            {description ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Description</Text>
                <Text style={styles.summaryValueSmall}>{description}</Text>
              </View>
            ) : null}
          </View>

          {/* Card fields */}
          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="4111 1111 1111 1111"
                placeholderTextColor={Colors.text_light}
                value={cardNumber}
                onChangeText={value => {
                  console.log('[MOCK PAYMENT] Card number changed');
                  setCardNumber(formatCardNumber(value));
                }}
                keyboardType="number-pad"
                maxLength={23}
              />
            </View>

            <Text style={styles.fieldLabel}>Card Holder Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Name on card"
                placeholderTextColor={Colors.text_light}
                value={cardHolderName}
                onChangeText={value => {
                  console.log('[MOCK PAYMENT] Card holder name changed');
                  setCardHolderName(value);
                }}
                autoCapitalize="characters"
                maxLength={40}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.fieldLabel}>Expiry</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor={Colors.text_light}
                    value={expiry}
                    onChangeText={value => {
                      console.log('[MOCK PAYMENT] Expiry changed');
                      setExpiry(formatExpiry(value));
                    }}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
              </View>
              <View style={styles.col}>
                <Text style={styles.fieldLabel}>CVV</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor={Colors.text_light}
                    value={cvv}
                    onChangeText={value => {
                      console.log('[MOCK PAYMENT] CVV changed');
                      setCvv(value.replace(/\D/g, '').slice(0, 4));
                    }}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={4}
                  />
                </View>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Test card hints */}
            <View style={styles.hintBox}>
              <Text style={styles.hintTitle}>Test cards (mock values)</Text>
              <Text style={styles.hintText}>
                {MOCK_TEST_CARDS.SUCCESS} → Success
              </Text>
              <Text style={styles.hintText}>
                {MOCK_TEST_CARDS.FAILED} → Failed
              </Text>
              <Text style={styles.hintText}>
                Any other valid card → Success · Invalid number → Error
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.payButton, processing && styles.payButtonDisabled]}
            activeOpacity={0.85}
            onPress={handlePayNow}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.payButtonText}>PAY {currency} {amount}</Text>
            )}
          </TouchableOpacity>

          {processing ? (
            <View style={styles.processingRow}>
              <ActivityIndicator size="small" color={Colors.theme_color} />
              <Text style={styles.processingText}>
                Mock gateway processing…
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.85}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>CANCEL PAYMENT</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MockCCAvenuePaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: Colors.yellow,
    borderRadius: card.border_radius_card_medium,
    padding: 12,
    marginBottom: 12,
  },
  bannerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.regular,
    color: Colors.instruction_text,
  },
  bannerText: {
    marginTop: 4,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.instruction_text,
  },
  summaryCard: {
    backgroundColor: Colors.theme_color,
    borderRadius: card.border_radius_card_medium,
    padding: 16,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  summaryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.white,
    opacity: 0.9,
  },
  summaryValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.large,
    color: Colors.white,
  },
  summaryValueSmall: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.white,
  },
  formCard: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: card.padding,
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    marginTop: 12,
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    paddingVertical: 12,
    fontSize: FontSize.regular,
    fontFamily: FontFamily.regular,
    color: Colors.textColorInpuHeader,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  errorText: {
    marginTop: 12,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.red,
  },
  hintBox: {
    marginTop: 16,
    backgroundColor: Colors.light_gray,
    borderRadius: card.border_radius_card_medium,
    padding: 10,
  },
  hintTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
  },
  hintText: {
    marginTop: 4,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.text_light,
  },
  payButton: {
    height: 48,
    backgroundColor: Colors.button_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.regular,
  },
  cancelButton: {
    height: 44,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.text_light,
  },
  cancelButtonText: {
    color: Colors.text_light,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.regular,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 8,
  },
  processingText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.text_light,
  },
});
