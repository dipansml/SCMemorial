import { StyleSheet } from 'react-native';
import Colors from '../theme/colors';
import { Button, FontFamily, FontSize } from '../theme/fonts_dimen';

export const CommonStyles = StyleSheet.create({
  button: {
    height: Button.height,
    backgroundColor: Colors.button_color,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  buttonText: {
    color: Colors.button_text,
    fontSize: FontSize.regular,
    fontFamily: FontFamily.semiBold,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
    tintColor: Colors.white,
  },
});