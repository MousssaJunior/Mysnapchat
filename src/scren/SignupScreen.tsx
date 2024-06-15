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
        },{
            headers:{
           "X-API-Key":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmltLmJhcmFAZXBpdGVjaC5ldSIsImlhdCI6MTcxODEwNjgzOH0.8E6eoi_eRSd7TLYUG3p2BMtTfiQxzzVf25mStXIqJq0"
        }});

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
      <View style={styles.logoContainer}>
        <Image source={require('../asset/logintop.png')} style={styles.logo} />
      </View>
      <Text style={styles.signUpText}>Create your account</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={chooseImage}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        ) : (
          <FontAwesome name="camera" size={30} color="#FFFC00" />
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor="#808080"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#808080"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#808080"
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
    backgroundColor: "#FFFC00",
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  signUpText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFF",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 20,
    width: 100,
    height: 100,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    borderRadius: 50,
    marginHorizontal: 40,
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#000",
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  signupButtonContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: '#000',
    borderRadius: 50,
    padding: 15,
    marginHorizontal: 40,
    width: "80%",
  },
  signupButton: {
    color: "#FFFC00",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginRedirect: {
    color: "#000",
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
