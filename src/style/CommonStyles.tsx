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
buttonGray: {
    height: Button.height,
    backgroundColor: Colors.button_color_light,
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
  buttonTextDark: {
    color: Colors.button_text_dark,
    fontSize: FontSize.regular,
    fontFamily: FontFamily.semiBold,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
    tintColor: Colors.white,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 10,
},
 input: {
    padding: 4,
    fontSize: FontSize.small,
    width: '100%',
    height: 40,
    flex: 1,
    paddingVertical: 12,
    fontFamily: FontFamily.regular,
    color: Colors.textColorInpuHeader,
},
loaderOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.loaderBackground,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  loaderText: {
    marginTop: 12,
    color: Colors.loaderText,
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,
  },
});