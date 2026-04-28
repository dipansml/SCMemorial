import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import ExamScheduleComponent from '../component/ExamScheduleComponent';
import { card, FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import { CommonStyles } from '../style/CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

type ExamItem = {
  id: string;
  subject: string;
  date: string;
  time: string;
  status: string;
};

const Academics = () => {

  const [examList, setExamList] = useState<ExamItem[]>([]);

  useEffect(() => {
    // simulate API
    const data = [
      { id: '1', subject: 'Mathematics', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Today' },
      { id: '2', subject: 'Science', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Today' },
      { id: '3', subject: 'English', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Upcoming' },
      { id: '4', subject: 'Geography', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Upcoming' },
      { id: '5', subject: 'Mathematics', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Completed' },
    ];

    setExamList(data);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <AppHeader
        title="Academics"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>

        {/* 🔹 List Component */}
        <ExamScheduleComponent examList={examList} />

        {/* 🔹 Static Instructions */}
        <View style={styles.cardWrapper}>
            <ImageBackground
                source={require('../assets/images/instruction_bg.png')}
                style={styles.cardImage}>   
                  <View style={styles.cardPadding}>
                    <Text style={styles.instructionsTitle}>Exam Instructions</Text>
                    <View style={styles.instructions}>
                      <Image
                          source={require('../assets/images/icons/instruction_yes.png')}
                          style={styles.instructionIcon}
                          resizeMode="contain"/>
                      <Text style={styles.instructionsText}>Carry original Admit Cards to every examination.</Text>
                    </View>
                    <View style={styles.instructions}>
                      <Image
                          source={require('../assets/images/icons/instruction_yes.png')}
                          style={styles.instructionIcon}
                          resizeMode="contain"/>
                      <Text style={styles.instructionsText}>Report to the examination hall 30 minutes before the start time.</Text>
                    </View>
                    <View style={styles.instructions}>
                        <Image
                            source={require('../assets/images/icons/instruction_yes.png')}
                            style={styles.instructionIcon}
                            resizeMode="contain"/>
                        <Text style={styles.instructionsText}>Only transparent stationary pouches are allowed.</Text>
                    </View>
                    <View style={styles.instructions}>
                        <Image
                            source={require('../assets/images/icons/instruction_no.png')}
                            style={styles.instructionIcon}
                            resizeMode="contain"/>
                        <Text style={styles.instructionsText}>Mobile phones and smartwatches are strictly prohibited.</Text>
                    </View>
                  </View>
            </ImageBackground>
         </View>
         <TouchableOpacity  style={[CommonStyles.button, { marginBottom: 10 }]}>    
              <Image
                source={require('../assets/images/icons/download.png')}
                style={CommonStyles.buttonIcon}
                resizeMode="contain"/>                                  
              <Text style={CommonStyles.buttonText}>Download PDF Schedule</Text>
         </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Academics;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },

  instructionsBox: {
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    overflow: 'hidden',
},

 cardWrapper: {
    borderRadius: card.border_radius_card,
    overflow: 'hidden',
    backgroundColor: Colors.instruction_box,
    elevation: 3,
    marginTop: 10,
    marginBottom: 10,
  },
  
cardImage: {
  justifyContent: 'center', 
},

cardPadding: {
  padding: card.padding, 
},

instructionsTitle: {
    marginBottom:10,
    color: Colors.textColorInpuHeader,
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,

},
  instructionsText: {
    color: Colors.instruction_text,
    fontSize: FontSize.very_small,
    fontFamily: FontFamily.regular,
  },

  instructions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 4,
}, 
instructionIcon: {
    width: 10,
    height: 10,
    marginRight: 3,
    tintColor: Colors.instruction_text,
  },
});