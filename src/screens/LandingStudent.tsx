import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import DashboardParents from './DashboardParents';
import Settings from './Settings';
import Academics from './Academics';
import Messages from './Messages';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily } from '../theme/fonts_dimen';
import DashboardStudent from './DashboardStudent';
import Fees from './Fees';
import OnlineExam from './OnlineExam';

type LandingStudentList = {
  DashboardStudent: undefined;
  OnlineExam: undefined;
  Fees: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<LandingStudentList>();

const LandingStudent = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

         // ✅ Safe Area for Bottom Tab
        tabBarStyle: {
          paddingBottom: insets.bottom,   // 🔥 key line
          height: 54 + insets.bottom,     // adjust height dynamically
          borderTopStartRadius: 0,
          borderTopEndRadius: 0,
        },

        //Custom Image Icon
        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === 'DashboardStudent') {
            icon = require('../assets/images/icons/dashboard.png');
          } else if (route.name === 'OnlineExam') {
            icon = require('../assets/images/icons/academic.png');
          } else if (route.name === 'Fees') {
            icon = require('../assets/images/icons/fees.png');
          }
          //  else if (route.name === 'Settings') {
          //   icon = require('../assets/images/icons/settings.png');
          // }
          return (
            <Image
              source={icon}
              style={{
                width:18,
                height: 18,
                resizeMode: 'contain',
                margin:1,
                //Change color on select
                tintColor: focused ? Colors.theme_color : Colors.tintColor,
              }}
            />
          );
        },

        // ✅ Label Color
        tabBarActiveTintColor: Colors.theme_color,
        tabBarInactiveTintColor:  Colors.tintColor,

        // ✅ Custom Font
        tabBarLabelStyle: {
          fontFamily: FontFamily.regular,
          fontSize: 11,
        },
      })}
    >
      <Tab.Screen name="DashboardStudent" component={DashboardStudent} options={{tabBarLabel : 'Dashboard'}}/>
      <Tab.Screen name="OnlineExam" component={OnlineExam} options={{tabBarLabel : 'Online Exam'}}/>
      {/* <Tab.Screen name="Messages" component={Messages} /> */}
      <Tab.Screen name="Fees" component={Fees} />
      {/* <Tab.Screen name="Settings" component={Settings}/> */}
    </Tab.Navigator>
  );
};

export default LandingStudent;