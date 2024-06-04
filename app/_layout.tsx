import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from "../src/scren/Chat";

const Stack = createNativeStackNavigator();

const Home = () => {
  return (
    <View>
      <Text>
        Coucou
      </Text>
    </View>
  )
}

const _layout = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='Chat'>
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default _layout;

const styles = StyleSheet.create({});
