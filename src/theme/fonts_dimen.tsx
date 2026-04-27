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
  xxxxLarge: 26,
};

export const Header ={
  height: Platform.OS === 'android' ? 80 : 60,
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  icon: 24,
  textSize: 20,
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
  border_radius_card_medium: 10,
  border_radius_card_small: 8,
  border_radius_profile: 20,
  padding : 16,

};

export const iconBox ={
  border_radius_card: 10,

};

export const Menu ={
  menuSize: 16,
};

export const Button ={
  buttonRadius: 24,
  height : 40,
};

 const getBottomSpacing = (insets: any) => {
  return Platform.OS === 'android' ? insets.bottom : 0;
};