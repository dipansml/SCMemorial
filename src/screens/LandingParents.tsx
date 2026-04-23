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

type LandingParentsList = {
  DashboardParents: undefined;
  Academics: undefined;
  Messages: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<LandingParentsList>();

const LandingParents = () => {
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

          if (route.name === 'DashboardParents') {
            icon = require('../assets/images/icons/dashboard.png');
          } else if (route.name === 'Academics') {
            icon = require('../assets/images/icons/academic.png');
          } else if (route.name === 'Messages') {
            icon = require('../assets/images/icons/messages.png');
          } else if (route.name === 'Settings') {
            icon = require('../assets/images/icons/settings.png');
          }
          return (
            <Image
              source={icon}
              style={{
                width: 22,
                height: 22,
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
      <Tab.Screen name="DashboardParents" component={DashboardParents} options={{tabBarLabel : 'Dashboard'}}/>
      <Tab.Screen name="Academics" component={Academics} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Settings" component={Settings}/>
    </Tab.Navigator>
  );
};

export default LandingParents;