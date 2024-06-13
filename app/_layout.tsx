import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../src/scren/LoginScreen';
import SignupScreen from '../src/scren/SignupScreen';
import CameraScreen from '../src/scren/CameraScreen';
import Chat from '../src/scren/Chat'
import userpp from '../src/screen/userpp';
import crud from '../src/scren/crud'
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (

    <NavigationContainer independent= {true} >
 
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen name="Option" component={userpp} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Chat" component={Chat} />
        {/* <Stack.Screen name="crud" component={crud} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});