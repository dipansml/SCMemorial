import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import Colors from '../theme/colors';
import { FontFamily, Header } from '../theme/fonts_dimen';
import StorageManager from '../services/StorageManager';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  title: string;
  showBack?: boolean;
  isMenuVisible?: boolean;
  isNotificationVisible?: boolean;
  onMenuPress?: () => void;
  onBellPress?: () => void;
  onProfilePress?: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const AppHeader = ({
  title,
  showBack,
  isMenuVisible = true,
  isNotificationVisible = true,
  onMenuPress,
  onBellPress,
  onProfilePress,
  navigation
}: Props) => {

  const [isStudentLoggedIn, setIsStudentLoggedIn] =
  useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsStudentLoggedIn(await StorageManager.isLoggedInStudent());
      } catch (error) {
        console.log('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>

      {/* Left: Menu + Title */}
      <View style={styles.left}>
        {isMenuVisible && (
          <TouchableOpacity onPress={onMenuPress}>
            <Image
              source={
                showBack
                  ? require('../assets/images/icons/back.png')
                  : require('../assets/images/SideMenu.png')
              }
              style={[
                styles.menuImage,
                showBack && { width: 18, height: 18 },
              ]}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right: Icons */}
      <View style={styles.right}>

        {/* Notification */}
        {isNotificationVisible && (
          <TouchableOpacity onPress={onBellPress}>
            <Image
              source={require('../assets/images/Nitification.png')}
              style={styles.menuImage}
            />
          </TouchableOpacity>
        )}
        {/* Profile (Hidden for Student) */}
        {!isStudentLoggedIn&& (
          // <TouchableOpacity onPress={onProfilePress}>
          <TouchableOpacity 
            onPress={() => navigation.replace('StudentSelection')}>
            <View style={styles.profileColumn}>
              <Image
                source={require('../assets/images/student1.png')}
                style={styles.avatar}
              />
              <Image
                source={require('../assets/images/Switch.png')}
                style={styles.switchImage}
              />
            </View>
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.NavBarHeader_color,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: Header.height,
    
  },
  menuImage: {
    width: Header.icon,
    height: Header.icon,
    resizeMode: 'contain',
    tintColor: Colors.background,
  },
  title: {
    fontSize: Header.textSize,
    color: 'white',
    marginLeft: 10,
    fontFamily: FontFamily.bold,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    marginTop: 7,
    borderRadius: 16,
  },
  switchImage: {
    width: 36,
    height: 18,
    marginTop: -7,
    resizeMode: 'contain',
  },
});