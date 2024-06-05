import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    if (email && password && username) {
      try {
        console.log('Data being sent:', {
          email,
          username,
          profilePicture,
          password,
        });

        const response = await axios.post('https://snapchat.epidoc.eu/user', {
          email,
          username,
          profilePicture,
          password,
        });

        if (response.status === 200) {
          Alert.alert('Inscription réussie');
          navigation.navigate('Camera');
        } else {
          Alert.alert('Erreur lors de l\'inscription', response.data.message || 'Une erreur est survenue.');
        }
      } catch (error) {
        if (error.response) {
          console.log('Error response:', error.response.data);
          Alert.alert('Erreur lors de l\'inscription', JSON.stringify(error.response.data) || 'Une erreur est survenue.');
        } else {
          console.log('Error message:', error.message);
          Alert.alert('Erreur lors de l\'inscription', error.message);
        }
      }
    } else {
      Alert.alert('Veuillez remplir tous les champs');
    }
  };

  const chooseImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfilePicture(response.assets[0].uri);
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
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        ) : (
          <FontAwesome name="camera" size={30} color="#C8C8C8" />
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={30} color="#C8C8C8" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={30} color="#C8C8C8" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={30} color="#C8C8C8" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.signupButtonContainer} onPress={register}>
        <Text style={styles.signupButton}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginRedirect}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

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
  profilePicture: {
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

export default SignupScreen;
