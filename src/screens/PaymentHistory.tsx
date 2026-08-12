import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentListComponent from '../component/PaymentListComponent';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import { PaymentHistoryItem } from '../Model/PaymentHistory/PaymentHistoryItem';
import StorageManager from '../services/StorageManager';
import { Api } from '../services/Api';
import { CommonStyles } from '../style/CommonStyles';


// ✅ Tabs
const tabs = ['All', 'Online', 'Offline'] as const;
type TabType = typeof tabs[number];

  
const PaymentHistory = ({ navigation }: { navigation: any }) => {
const [activeTab, setActiveTab] = useState<TabType>('All');
const [paymentList, setPaymentList] = useState<
  PaymentHistoryItem[]
>([]);

const [loading, setLoading] = useState(false);

useEffect(() => {
  loadPaymentHistory();
}, []);


  // ✅ Filter logic
  const filteredList =
    activeTab === 'All'
      ? paymentList
      : paymentList.filter(item => item.type === activeTab);


const loadPaymentHistory = async () => {

  try {

    setLoading(true);

    const response =
      await Api.getStudentPaymentHistory({
        user_id:
          await StorageManager.getStudentId(),
      });

    console.log(
      'Payment History Response:',
      response
    );

    if (
      response &&
      response.status === 200 &&
      response.data?.payment_history
    ) {

      const formattedData: PaymentHistoryItem[] =
        response.data.payment_history.map(
          (item: PaymentHistoryItem) => ({
            id: item.id,
            type: item.type,
            amount: item.amount,
            payment_date: item.payment_date,
            status: item.status,
            txnid: item.txnid,
            download_url: item.download_url,
          })
        );

      setPaymentList(formattedData);

    } else {

      Alert.alert(
        'Error',
        response?.message ||
          'Failed to load payment history'
      );
    }

  } catch (error: any) {

    console.log(
      'Payment History Error:',
      error?.response?.data || error.message
    );

    Alert.alert(
      'Error',
      error?.response?.data?.message ||
        'Something went wrong'
    );

  } finally {

    setLoading(false);
  }
};

const FullScreenLoader = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;

    return (
      <View style={CommonStyles.loaderOverlay}>
        <ActivityIndicator size="large" color={Colors.loaderColor} />
        <Text style={CommonStyles.loaderText}>Loading...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />
      <AppHeader
        title="Payment History"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.content}>
         {/* 🔹 Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;

          return (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeText,
                ]}
              >
                {tab === 'All' ? 'All Activities' : tab}
              </Text>

              {isActive && <View style={styles.activeLine} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 🔹 List */}
      <PaymentListComponent paymentList={filteredList} />
      </View>

    </SafeAreaView>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    marginTop: 12,
  },

  tabText: {
    fontSize: FontSize.regular,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.medium,
  },

  activeText: {
    color: Colors.theme_color,
    fontFamily: FontFamily.medium,
  },

  activeLine: {
    marginTop: 6,
    height: 3,
    width: '100%',
    backgroundColor: Colors.theme_color,
    borderRadius: 2,
  },
});