import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentListComponent from '../component/PaymentListComponent';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';

type Payment = {
  id: string;
  type: 'Online' | 'Offline';
  amount: string;
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
  txnId: string;
};

// ✅ Tabs
const tabs = ['All', 'Online', 'Offline'] as const;
type TabType = typeof tabs[number];

  
const PaymentHistory = () => {
const [activeTab, setActiveTab] = useState<TabType>('All');

  // ✅ Data (typed properly)
  const paymentList: Payment[] = [
    {
      id: '1',
      type: 'Online',
      amount: '₹1,240.00',
      status: 'Success',
      date: 'Mar 24, 2026 • 14:20',
      txnId: '#TXN-882910',
    },
    {
      id: '2',
      type: 'Offline',
      amount: '₹450.00',
      status: 'Pending',
      date: 'Mar 23, 2026 • 09:15',
      txnId: '#TXN-882910',
    },
    {
      id: '3',
      type: 'Online',
      amount: '₹2,100.00',
      status: 'Failed',
      date: 'Mar 21, 2026 • 18:45',
      txnId: '#TXN-882910',
    },
  ];

  // ✅ Filter logic
  const filteredList =
    activeTab === 'All'
      ? paymentList
      : paymentList.filter(item => item.type === activeTab);


  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Payment History"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
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