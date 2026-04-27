import { Platform } from 'react-native';

export const getBottomSpacing = (insets: any) => {
  return Platform.OS === 'android' ? insets.bottom : 0;
};