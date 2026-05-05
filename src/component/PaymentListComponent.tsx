import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../theme/colors';
import { Button, card, FontFamily, FontSize } from '../theme/fonts_dimen';
import { CommonStyles } from '../style/CommonStyles';

type Payment = {
  id: string;
  type: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
  txnId: string;
};

type Props = {
  paymentList: Payment[];
};

const PaymentListComponent = ({ paymentList }: Props) => {

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Success':
        return { bg: Colors.light_green, text: Colors.textColorInpuHeader };
      case 'Pending':
        return { bg: Colors.light_red, text: Colors.textColorInpuHeader };
      case 'Failed':
        return { bg: Colors.yellow, text: Colors.textColorInpuHeader };
      default:
        return { bg: '#ccc', text: '#000' };
    }
  };

  const renderItem = ({ item }: any) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={styles.card}>

        {/* Top Row */}
        <View style={styles.rowBetween}>
          <Text style={styles.type}>
            {item.type} Payment
          </Text>

          <View style={[styles.status, { backgroundColor: statusStyle.bg }]}>
            <Text style={{ color: statusStyle.text, fontSize: FontSize.small, fontFamily: FontFamily.medium }}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Amount */}
        <Text style={styles.amount}>{item.amount}</Text>

        {/* Info Row */}
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.value}>{item.date}</Text>
          </View>

          <View>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{item.txnId}</Text>
          </View>
        </View>

        {/* Action Button */}
        {item.status === 'Success' && (
          <TouchableOpacity style={[CommonStyles.buttonGray, { marginTop: 12 }, { marginBottom: 0 }]}>
                <Image
                    source={require('../assets/images/icons/download.png')}
                    style={[CommonStyles.buttonIcon, { tintColor: Colors.textColorInpuHeader }]}
                    resizeMode="contain"/>              
                <Text style={CommonStyles.buttonTextDark}>Download Receipt</Text>
          </TouchableOpacity>
        )}

        {item.status === 'Pending' && (
          <View style={[CommonStyles.buttonGray, { marginTop: 12 }, { marginBottom: 0 }]}>
                 <Image
                    source={require('../assets/images/icons/processing.png')}
                    style={[CommonStyles.buttonIcon, { tintColor: Colors.button_text_inactive }]}
                    resizeMode="contain"/>    
                <Text style={[CommonStyles.buttonTextDark, {color: Colors.button_text_inactive }]}>Processing</Text>
          </View>
        )}

        {item.status === 'Failed' && (
          <TouchableOpacity style={[CommonStyles.button, { marginTop: 12 }, { marginBottom: 0 }]}>
                <Image
                    source={require('../assets/images/icons/reload.png')}
                    style={[CommonStyles.buttonIcon, { tintColor: Colors.button_text }]}
                    resizeMode="contain"/>     
                <Text style={CommonStyles.buttonText}>Retry Payment</Text>
          </TouchableOpacity>
 
 )}

      </View>
    );
  };

  return (
    <FlatList
      data={paymentList}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 15 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default PaymentListComponent;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: card.padding,
    marginBottom: card.margin_bottom,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  type: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: Colors.text_light,
  },

  amount: {
    fontSize: FontSize.large,
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
    marginVertical: 5,
  },

  label: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: Colors.text_light,
    marginTop: 6,
  },

  value: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
    marginTop: 2,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },

  greyBtn: {
    marginTop: 12,
    backgroundColor: Colors.button_color_light,
    borderRadius: Button.buttonRadius,
    alignItems: 'center',
    height: Button.height,
  },

  btnText: {
    fontSize: FontSize.regular,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.medium,
  },

  primaryBtn: {
    marginTop: 12,
    backgroundColor: Colors.button_color,
    padding: 12,
    borderRadius: Button.buttonRadius,
    alignItems: 'center',
    height: Button.height,
  },

  primaryText: {
    color: Colors.button_text,
    fontFamily: FontFamily.medium,
  },
});