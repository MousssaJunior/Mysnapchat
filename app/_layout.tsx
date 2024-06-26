import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import LoginScreen from '../src/scren/LoginScreen';
import SignupScreen from '../src/scren/SignupScreen';
import CameraScreen from '../src/scren/CameraScreen';
import ReceivedSnaps from '../src/scren/Recivedreponse';
import Chat from '../src/scren/Chat';
import Option from '../src/screen/userpp';
import Crud from '../src/scren/Crud';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainNavigator" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainStack = createNativeStackNavigator();

const MainNavigator = () => (
  <MainStack.Navigator initialRouteName="Camera">
    <MainStack.Screen name="Camera" component={CameraScreen} />
    <MainStack.Screen name="ReceivedSnaps" component={ReceivedSnaps} />
    <MainStack.Screen name="Chat" component={Chat} />
    <MainStack.Screen name="Option" component={Option} />
    <MainStack.Screen name="Crud" component={Crud} />
  </MainStack.Navigator>
);

export default AppNavigator;
