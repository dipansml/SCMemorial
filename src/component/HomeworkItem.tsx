import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../theme/colors';
import { card, FontFamily, FontSize } from '../theme/fonts_dimen';

type Props = {
  title: string;
  subject: string;
  completed: boolean;
};

const HomeworkItem = ({ title, subject, completed }: Props) => {
  return (
    <View style={styles.card}>
      
      <Image
        source={
            completed
            ? require('../assets/images/checked.png')
            : require('../assets/images/unchecked.png')
            }
        style={styles.icon}
/>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subject}>{subject}</Text>
      </View>

    </View>
  );
};

export default HomeworkItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: card.padding,
    borderRadius: card.border_radius_card,
    backgroundColor: Colors.background_list_item,
    alignItems: 'flex-start',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleFilled: {
    backgroundColor: '#3B82F6',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.regular,
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
  },
  subject: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: Colors.text_light,
    marginTop: 2,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 12,
    resizeMode: 'contain',
},
});