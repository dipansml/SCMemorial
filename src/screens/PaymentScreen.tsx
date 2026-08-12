import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import RazorpayCheckout from 'react-native-razorpay';

const PaymentScreen = () => {

  const openRazorpay = () => {
    console.log('Opening Razorpay...');

    const options = {
      description: 'SCMemorial App Payment',
      currency: 'INR',
      key: 'rzp_test_SmSTwiKHdNaqc8', // Your Razorpay Key ID
      amount: '50000', // Amount in paise => 500 INR
      name: 'SCMemorial App',
      prefill: {
        email: 'test@gmail.com',
        contact: '9876543210',
        name: 'Beas Consultancy',
      },
      theme: {
        color: '#3399cc',
      },
    };

    console.log('Razorpay options:', options);

    RazorpayCheckout.open(options)
      .then((data) => {
        console.log('Payment Success:', data);

        // Success
        Alert.alert(
          'Payment Success',
          `Payment ID: ${data.razorpay_payment_id}`
        );

      })
      .catch((error) => {
        console.log('Payment Error:', error);

        // Failed
        Alert.alert(
          'Payment Failed',
          `Code: ${error.code} | Description: ${error.description}`
        );

      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={openRazorpay}
      >
        <Text style={styles.text}>
          Pay ₹500
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn: {
    backgroundColor: '#3399cc',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },

  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});