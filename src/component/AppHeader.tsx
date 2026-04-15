import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import Colors from '../theme/colors';

//Test

type Props = {
  title: string;
  onMenuPress?: () => void;
  onBellPress?: () => void;
  onProfilePress?: () => void;
};

const AppHeader = ({
  title,
  onMenuPress,
  onBellPress,
  onProfilePress,
}: Props) => {
  return (
    <View style={styles.container}>
      
      {/* Left group: menu + title */}
      <View style={styles.left}>
        <TouchableOpacity onPress={onMenuPress}>
          <Image
            source={require('../assets/images/SideMenu.png')}
            style={styles.menuImage}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right Icons */}
      <View style={styles.right}>
        <TouchableOpacity onPress={onBellPress}>
          <Image
          source={require('../assets/images/Nitification.png')}
          style={styles.menuImage}
        />
        </TouchableOpacity>

        <TouchableOpacity onPress={onProfilePress}>
          <View style={styles.profileColumn}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100' }}
              style={styles.avatar}
            />
            <Image
              source={require('../assets/images/Switch.png')}
              style={styles.switchImage}
            />
          </View>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'android' ? 80 : 60,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: Colors.NavBarHeader_color,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  menu: {
    fontSize: 24,
    color: Colors.background,
  },
  menuImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: Colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    fontFamily: 'Roboto-Regular',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  icon: {
    fontSize: 20,
    color: 'white',
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
    marginTop: -10,
    resizeMode: 'contain',
    tintColor: 'white',
  },
});