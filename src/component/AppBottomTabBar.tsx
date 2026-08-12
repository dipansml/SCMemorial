import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/fonts_dimen';

export type BottomTabItem = {
  key: string;
  label: string;
  icon?: string;
};

type AppBottomTabBarProps = {
  tabs: BottomTabItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
};

const AppBottomTabBar: React.FC<AppBottomTabBarProps> = ({
  tabs,
  activeKey,
  onTabPress,
}) => {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {tabs.map(tab => {
          const isActive = tab.key === activeKey;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.8}
              onPress={() => onTabPress(tab.key)}
            >
              {!!tab.icon && (
                <Text style={[styles.icon, isActive && styles.activeText]}>
                  {tab.icon}
                </Text>
              )}
              <Text style={[styles.label, isActive && styles.activeText]}>
                {tab.label}
              </Text>
              <View style={[styles.dot, isActive && styles.activeDot]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default AppBottomTabBar;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.NavBarHeader_color,
  },
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#0868C9',
    backgroundColor: Colors.NavBarHeader_color,
    minHeight: 62,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: -2 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 2,
  },
  icon: {
    fontSize: 16,
    color: '#D5E8FF',
  },
  label: {
    fontSize: FontSize.small,
    color: '#D5E8FF',
    fontFamily: FontFamily.regular,
  },
  activeText: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
  dot: {
    marginTop: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  activeDot: {
    backgroundColor: Colors.white,
  },
});
