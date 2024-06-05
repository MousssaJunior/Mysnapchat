import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../src/scren/LoginScreen'; // Corrected path
import SignupScreen from '../src/scren/singupscreen'; // Corrected path
import LoginForm from '../src/Form/loginForm'; // Corrected name and path

const Stack = createNativeStackNavigator();

const _layout = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="LoginForm" component={LoginForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default _layout;

const styles = StyleSheet.create({});

