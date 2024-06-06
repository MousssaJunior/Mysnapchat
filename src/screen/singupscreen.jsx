import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importez AsyncStorage depuis le bon emplacement

const SignupScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);

  const chooseImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topImageContainer}>
        <Image source={require('../asset/logintop.png')} style={styles.topImage} />
      </View>
      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>Welcome</Text>
      </View>
      <View>
        <Text style={styles.signInText}>Create your account</Text>
      </View>
      <TouchableOpacity style={styles.imagePicker} onPress={chooseImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <FontAwesome name="camera" size={30} color="#C8C8C8" />
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={30} color="#C8C8C8" style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder="Username" />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={30} color="#C8C8C8" style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder="Email" />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={30} color="#C8C8C8" style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder="Password" secureTextEntry />
      </View>
      <TouchableOpacity style={styles.signupButtonContainer}>
        <Text style={styles.signupButton}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.loginRedirect}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  topImageContainer: {
    marginBottom: 20,
  },
  topImage: {
    width: "100%",
    height: 120,
  },
  helloContainer: {
    marginBottom: 10,
  },
  helloText: {
    textAlign: "center",
    fontSize: 70,
    fontWeight: "500",
    color: "#262626",
  },
  signInText: {
    textAlign: "center",
    fontSize: 18,
    color: "#262626",
    marginBottom: 20,
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    width: 100,
    height: 100,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 10,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 10,
    alignItems: "center",
    height: 70,
  },
  inputIcon: {
    marginLeft: 15,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
  signupButtonContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: '#4c669f',
    borderRadius: 5,
    padding: 15,
    marginHorizontal: 40,
    width: "80%",
  },
  signupButton: {
    color: "#fff",
    fontSize: 18,
  },
  loginRedirect: {
    color: "#BEBEBE",
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
  },
});
