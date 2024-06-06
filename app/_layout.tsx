import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from '../src/scren/loginscreen';
// import SingupScreen from '../src/scren/singupscreen';

import profile from '../src/screen/userpp';
const Stack = createNativeStackNavigator();

const _layout = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        {/* <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Singup" component={SingupScreen} /> */}
        <Stack.Screen name="profile" component={profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default _layout;

const styles = StyleSheet.create({});