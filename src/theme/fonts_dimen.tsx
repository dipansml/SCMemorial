import {
  Platform,
  StatusBar
} from 'react-native';


export const FontSize = {
  very_small: 10,
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  xlarge: 20,
  xxLarge: 22,
  xxxLarge: 24,
};

export const Header ={
  height: Platform.OS === 'android' ? 80 : 60,
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

};

export const FontFamily = {
  regular: Platform.OS === 'ios' ? 'Roboto Regular' : 'Roboto-Regular',
  bold: Platform.OS === 'ios' ? 'Roboto Bold' : 'Roboto-Bold',
  semiBold: Platform.OS === 'ios' ? 'Roboto SemiBold' : 'semibold',
  medium: Platform.OS === 'ios' ? 'Roboto Medium' : 'medium',

};


export const container ={
  container_padding: 16,
  attendance_stat: 50,
};

export const card ={
  border_radius_card: 16,
  border_radius_profile: 20,
};

export const Menu ={
  menuSize: 16,
};