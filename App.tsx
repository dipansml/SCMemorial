import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import SplashScreen from './src/screens/SplashScreen';
import Login from './src/screens/Login';
//import DashboardParents from './src/screens/DashboardParents';
import StudentSelection from './src/screens/StudentSelection';
import Attendance from './src/screens/Attendance';
import LandingParents from './src/screens/LandingParents';

enableScreens();

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  LandingParents: undefined;
  StudentSelection: undefined;
  Attendance: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
     <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LandingParents" component={LandingParents}  options={{ headerShown: false }} />
        <Stack.Screen name="StudentSelection" component={StudentSelection}  options={{ headerShown: false }} />
        <Stack.Screen name="Attendance" component={Attendance}  options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;