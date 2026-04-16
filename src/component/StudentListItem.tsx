import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';

export type StudentItemType = {
  id: string;
  title: string;
  participants: string;
  rollNo: string;
  section: string;
  image: any;
};

const DATA: StudentItemType[] = [
  {
    id: '1',
    title: 'Anwesha Chakraborty',
    participants: 'Class 12th Standard',
    rollNo: '24',
    section: 'B',
    image: require('../assets/images/student1.png'),
  },
  {
    id: '2',
    title: 'Aritra Chakraborty',
    participants: 'Class 12th Standard',
    rollNo: '25',
    section: 'B',
    image: require('../assets/images/student2.png'),
  },
  {
    id: '2',
    title: 'Aritra Chakraborty',
    participants: 'Class 12th Standard',
    rollNo: '25',
    section: 'B',
    image: require('../assets/images/student2.png'),
  },
  {
    id: '2',
    title: 'Aritra Chakraborty',
    participants: 'Class 12th Standard',
    rollNo: '25',
    section: 'B',
    image: require('../assets/images/student2.png'),
  },
  {
    id: '2',
    title: 'Aritra Chakraborty',
    participants: 'Class 12th Standard',
    rollNo: '25',
    section: 'B',
    image: require('../assets/images/student2.png'),
  },
  {
    id: '2',
    title: 'Aritra Chakraborty',
    participants: 'Class 12th Standard',
    rollNo: '25',
    section: 'B',
    image: require('../assets/images/student2.png'),
  },
  {
    id: '2',
    title: 'Aritra Chakraborty',
    participants: 'Class 12th Standard',
    rollNo: '25',
    section: 'B',
    image: require('../assets/images/student2.png'),
  },
  {
    id: '2',
    title: 'Aritra Chakraborty',
    participants: 'Class 12th Standard',
    rollNo: '25',
    section: 'B',
    image: require('../assets/images/student2.png'),
  },
];

type Props = {
  item: StudentItemType;
  index: number;
  onPress?: (item: StudentItemType, index: number) => void;
};

const Student: React.FC<Props> = ({ item, index, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item, index)}
      activeOpacity={0.7}
    >
      <Image source={item.image} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.participants}</Text>

        <View style={styles.tagContainer}>
          <View style={styles.rollTag}>
            <Text style={styles.rollText}>ROLL NO. {item.rollNo}</Text>
          </View>

          <View style={styles.sectionTag}>
            <Text style={styles.sectionText}>SECTION {item.section}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const StudentListItem = ({ onItemPress } : any) => {
  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <Student 
          item={item}
          index={index}
          onPress={onItemPress}
        />
      )}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    />
  );
};

export default StudentListItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background_list_item,
    padding: 16,
    borderRadius: 30,
    marginBottom: 10,
    marginLeft:10,
    marginRight:10,
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
    backgroundColor: Colors.inputBackground,
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