import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';
import { FontFamily, FontSize, card } from '../../theme/fonts_dimen';
import {
  PAYMENT_METHOD_LABEL,
} from '../../services/payment/payment.types';
import type { PaymentResult } from '../../services/payment/payment.types';

export type PaymentResultRouteParams = {
  result: PaymentResult;
};

type Props = {
  navigation: any;
  route: { params: PaymentResultRouteParams };
};

/**
 * Payment result screen — identical for MOCK and real CCAvenue.
 * Shows Order ID, Payment Status, Transaction ID, Amount and Payment Mode.
 */

const STATUS_META: Record<
  PaymentResult['status'],
  { title: string; subtitle: string; color: string; bg: string }
> = {
  success: {
    title: 'Payment Successful',
    subtitle: 'Your payment has been processed and verified.',
    color: Colors.dark_green,
    bg: Colors.light_green,
  },
  failed: {
    title: 'Payment Failed',
    subtitle: 'Your payment could not be completed.',
    color: Colors.red,
    bg: Colors.light_red,
  },
  cancelled: {
    title: 'Payment Cancelled',
    subtitle: 'The payment was cancelled. No amount was charged.',
    color: Colors.orange_dark,
    bg: Colors.light_orange,
  },
};

const PaymentResultScreen = ({ navigation, route }: Props) => {
  const { result } = route.params;
  const meta = STATUS_META[result.status];

  const handleDone = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.popToTop();
    }
  };

  const handleRetry = () => {
    navigation.replace('ReAdmission');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
          <Text style={[styles.iconGlyph, { color: meta.color }]}>
            {result.status === 'success' ? '✓' : result.status === 'failed' ? '!' : '×'}
          </Text>
        </View>

        <Text style={[styles.title, { color: meta.color }]}>{meta.title}</Text>
        <Text style={styles.subtitle}>{meta.subtitle}</Text>

        <View style={styles.detailsCard}>
          <DetailRow label="Order ID" value={result.orderId} />
          <DetailRow label="Payment Status" value={meta.title} />
          <DetailRow
            label="Transaction ID"
            value={result.transactionId || '—'}
          />
          <DetailRow
            label="Amount"
            value={`${result.currency} ${result.amount}`}
          />
          <DetailRow
            label="Payment Mode"
            value={result.mode === 'MOCK' ? 'CCAvenue (MOCK)' : 'CCAvenue'}
          />
          {result.method ? (
            <DetailRow
              label="Payment Method"
              value={PAYMENT_METHOD_LABEL[result.method]}
            />
          ) : null}
          {result.verificationStatus ? (
            <DetailRow
              label="Verification"
              value={
                result.verificationStatus === 'verified'
                  ? 'Verified'
                  : 'Not verified'
              }
            />
          ) : null}
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{result.message}</Text>
        </View>

        {result.status === 'success' ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleDone}>
            <Text style={styles.primaryButtonText}>DONE</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRetry}>
              <Text style={styles.primaryButtonText}>RETRY PAYMENT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDone}>
              <Text style={styles.secondaryButtonText}>BACK</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.mockNote}>
          {result.mode === 'MOCK'
            ? 'This payment was processed in MOCK/TEST mode. No real money moved.'
            : ''}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default PaymentResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  iconGlyph: {
    fontFamily: FontFamily.bold,
    fontSize: 40,
  },
  title: {
    marginTop: 18,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxLarge,
  },
  subtitle: {
    marginTop: 6,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.regular,
    color: Colors.text_light,
  },
  detailsCard: {
    alignSelf: 'stretch',
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: card.padding,
    marginTop: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.text_light,
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
  },
  messageCard: {
    alignSelf: 'stretch',
    backgroundColor: Colors.light_gray,
    borderRadius: card.border_radius_card_medium,
    padding: 12,
    marginTop: 12,
  },
  messageText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    textAlign: 'center',
  },
  primaryButton: {
    alignSelf: 'stretch',
    height: 48,
    backgroundColor: Colors.button_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.regular,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    height: 44,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.text_light,
  },
  secondaryButtonText: {
    color: Colors.text_light,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.regular,
  },
  mockNote: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.vv_small,
    color: Colors.text_light,
  },
});
