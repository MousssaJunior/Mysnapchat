import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

<<<<<<< HEAD
=======

>>>>>>> 40509cecc77c18a011bb72d7a239254c0712c42
import LoginScreen from '../src/scren/LoginScreen';
import SignupScreen from '../src/scren/SignupScreen';
import CameraScreen from '../src/scren/CameraScreen';
import Chat from "../src/scren/Chat";


<<<<<<< HEAD
// import profile from '../src/screen/userpp';
=======

import profile from '../src/screen/userpp';
>>>>>>> 40509cecc77c18a011bb72d7a239254c0712c422
const Stack = createNativeStackNavigator();



        
const AppNavigator = () => {
  return (

    <NavigationContainer independent= {true} >
 
      <Stack.Navigator initialRouteName="Login">
<<<<<<< HEAD
        {/* <Stack.Screen name="profile" component={profile} /> */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
=======
        {/*<Stack.Screen name="profile" component={profile} /> */}
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
        <Stack.Screen name="Camera" component={CameraScreen} />
         <Stack.Screen name="Chat" component={Chat} />
>>>>>>> 40509cecc77c18a011bb72d7a239254c0712c422

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});