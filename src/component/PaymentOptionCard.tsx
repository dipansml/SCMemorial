import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/fonts_dimen';

type Props = {
  title: string;
  subtitle?: string;
  icon: any;
  selected: boolean;
  onPress: () => void;
};

const PaymentOptionCard: React.FC<Props> = ({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image source={icon} style={styles.icon} resizeMode="contain" />

      <View style={styles.textSection}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}
      />
    </TouchableOpacity>
  );
};

export default PaymentOptionCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 80,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingRight: 113,
    paddingBottom: 16,
    paddingLeft: 13,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: 4,
        shadowColor: '#000000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
      },
    }),
  },
  icon: {
    width: 28,
    height: 28,
  },
  textSection: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.medium,
    lineHeight: 16,
    color: Colors.textColorInpuHeader,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    lineHeight: 14,
    color: Colors.text_light,
    marginTop: 4,
  },
  radio: {
    position: 'absolute',
    right: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B9C6D6',
    backgroundColor: Colors.white,
  },
  radioSelected: {
    borderColor: Colors.theme_color,
    backgroundColor: Colors.theme_color,
  },
});
