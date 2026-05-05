import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../theme/colors';
import { card, FontFamily, FontSize } from '../theme/fonts_dimen';

export default class NoticeCard extends Component {
  render() {
    const { item } = this.props;

    return (
      <View style={styles.card}>

        {/* Header */}
        <View style={styles.header}>
          {item.important && (
            <View style={styles.header}>
                <View style={styles.badge}>
                <Text style={styles.badgeText}>Important</Text>
                </View>
            </View>)}
        </View>

        {/* Title */}
        <Text style={[
            styles.title,
            !item.important && { marginTop: 0 }
            ]}>
            {item.title}
        </Text>

        {/* Description */}
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.row}>
              <Image
                    source={require('../assets/images/icons/clock.png')}
                    style={styles.smallIcon}
                />
            <Text style={styles.date}>{item.date}</Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.link}>View Details</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: card.padding,
    marginBottom: card.margin_bottom,

    // shadow
    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  badge: {
    backgroundColor: Colors.light_green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },

  badgeText: {
    fontSize: FontSize.small,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.medium,
  },

  title: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,
    marginTop: 6,
    color: Colors.textColorInpuHeader,
  },

  desc: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    marginTop: 6,
    fontFamily: FontFamily.regular,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  date: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
  },

  link: {
    fontSize: FontSize.small,
    color: Colors.theme_color,
    fontFamily: FontFamily.medium,
  },
  smallIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    tintColor: Colors.tintColor,
},
divider: {
    height: 1,
    backgroundColor: Colors.border_color,
    marginVertical: 10,
  },
});