import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {
  FontFamily,
  FontSize,
} from '../theme/fonts_dimen';

import Colors from '../theme/colors';
import { Student } from '../Model/StudentList/Student';

type Props = {
  item: Student;
  index: number;
  onPress?: (
    item: Student,
    index: number
  ) => void;
};

const StudentItem: React.FC<Props> = ({
  item,
  index,
  onPress,
}) => {

  return (

    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        onPress?.(item, index)
      }
      activeOpacity={0.7}
    >

      <Image
          source={
            item.gender === 'Male'
              ? require('../assets/images/student1.png')
              : require('../assets/images/student2.png')
          }
          style={styles.image}
        />

      <View style={styles.info}>

        <Text style={styles.title}>
          {item.first_name}
        </Text>

        <Text style={styles.subtitle}>
          {item.class_name}
        </Text>

        <View style={styles.tagContainer}>

          <View style={styles.rollTag}>
            <Text style={styles.rollText}>
              ROLL NO. {item.roll_num || 'N/A'}
            </Text>
          </View>

          <View style={styles.sectionTag}>
            <Text style={styles.sectionText}>
              SECTION {item.section_name || 'N/A'}
            </Text>
          </View>

        </View>

      </View>

    </TouchableOpacity>
  );
};

type StudentListProps = {
  data: Student[];
  onItemPress?: (
    item: Student,
    index: number
  ) => void;
};

const StudentListItem = ({
  data,
  onItemPress,
}: StudentListProps) => {

  return (

    <FlatList
      data={data}
      keyExtractor={(item) => item.user_id}
      renderItem={({ item, index }) => (

        <StudentItem
          item={item}
          index={index}
          onPress={onItemPress}
        />

      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    />

  );
};

export default StudentListItem;

const styles = StyleSheet.create({

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      Colors.background_list_item,
    padding: 16,
    borderRadius: 30,
    marginBottom: 10,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },

  subtitle: {
    fontSize: FontSize.small,
    color: Colors.text,
    marginTop: 2,
    fontFamily: FontFamily.regular,
  },

  tagContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

  rollTag: {
    backgroundColor: Colors.light_orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
    marginRight: 8,
  },

  rollText: {
    fontSize: FontSize.small,
    color: Colors.text,
    fontFamily: FontFamily.regular,
  },

  sectionTag: {
    backgroundColor:
      Colors.inputBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
  },

  sectionText: {
    fontSize: FontSize.small,
    color: Colors.text,
    fontFamily: FontFamily.regular,
  },

});