import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { navigationRef } from './src/navigation/navigationRef';

import SplashScreen from './src/screens/SplashScreen';
import Login from './src/screens/Login';
//import DashboardParents from './src/screens/DashboardParents';
import StudentSelection from './src/screens/StudentSelection';
import Attendance from './src/screens/Attendance';
import Fees from './src/screens/Fees';
import Notice from './src/screens/Notice';
import Events from './src/screens/Events';
import Homework from './src/screens/Homework';
import Messages from './src/screens/Messages';
import LandingParents from './src/screens/LandingParents';
import ParentDrawer from './src/Drawer/ParentDrawer';
import Library from './src/screens/Library';
import AllBooksScreen from './src/screens/AllBooksScreen';
import DueBooksScreen from './src/screens/DueBooksScreen';
import ReturnBookScreen from './src/screens/ReturnBookScreen';
import IssueBookScreen from './src/screens/IssueBookScreen';
import PaymentHistory from './src/screens/PaymentHistory';
import FeePayment from './src/screens/FeesPayment';
import LandingStudent from './src/screens/LandingStudent';
import StudentDrawer from './src/Drawer/StudentDrawer';

enableScreens();

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  LandingParents: undefined;
  StudentSelection: undefined;
  ParentDrawer: undefined;
  Attendance: undefined;
  Fees: undefined;
  Notice: undefined;
  Events: undefined;
  Homework: undefined;
  Messages: undefined;
  Library: undefined;
  PaymentHistory: undefined;
  FeePayment: undefined;
  LandingStudent: undefined;
  StudentDrawer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="LandingParents" component={LandingParents}  options={{ headerShown: false }} />
            <Stack.Screen name="StudentSelection" component={StudentSelection}  options={{ headerShown: false }} />
            <Stack.Screen
              name="ParentDrawer"
              component={ParentDrawer}
              options={{
                headerShown: false,
                animation: 'slide_from_left',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            />
            <Stack.Screen
              name="StudentDrawer"
              component={StudentDrawer}
              options={{
                headerShown: false,
                animation: 'slide_from_left',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            />
            <Stack.Screen name="Attendance" component={Attendance}  options={{ headerShown: false }} />
            <Stack.Screen name="Fees" component={Fees}  options={{ headerShown: false }} />
            <Stack.Screen name="Notice" component={Notice}  options={{ headerShown: false }} />
            <Stack.Screen name="Events" component={Events}  options={{ headerShown: false }} />
            <Stack.Screen name="Homework" component={Homework}  options={{ headerShown: false }} />
            <Stack.Screen name="Messages" component={Messages}  options={{ headerShown: false }} />
            <Stack.Screen name="Library" component={Library}  options={{ headerShown: false }} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistory}  options={{ headerShown: false }} />
            <Stack.Screen name="FeePayment" component={FeePayment}  options={{ headerShown: false }} />
            <Stack.Screen name="LandingStudent" component={LandingStudent}  options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;