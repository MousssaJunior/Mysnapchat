import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Username:', username);
    console.log('Profile Picture:', profilePicture);

    if (email && password && username && profilePicture) {
      try {
        const data = {
          email,
          username,
          profilePicture,
          password,
        };

        console.log('Data being sent:', data);

        const response = await axios.post('https://snapchat.epidoc.eu/user', data, {
          headers: {
            "X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmltLmJhcmFAZXBpdGVjaC5ldSIsImlhdCI6MTcxODEwNjgzOH0.8E6eoi_eRSd7TLYUG3p2BMtTfiQxzzVf25mStXIqJq0", 
            "Content-Type": "application/json"
          }
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
      if (!profilePicture) {
        Alert.alert('Photo de profil manquante', 'Veuillez sélectionner une photo de profil avant de continuer.');
      } else {
        Alert.alert('Veuillez remplir tous les champs');
      }
    }
  };

  const chooseImage = async () => {
    console.log('Choose image button pressed');
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      console.log('Permission to access media library denied');
      Alert.alert('Permission Requise', 'Veuillez accorder les permissions d\'accès à la galerie dans les paramètres de votre système.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log('Image picker result:', result);

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      console.log('Image selected:', selectedImageUri);

      try {
      
        const resizedImage = await ImageManipulator.manipulateAsync(selectedImageUri, [{ resize: { width: 360, height: 640 } }], {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG, 
        });

      
        const base64Image = await FileSystem.readAsStringAsync(resizedImage.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

      
        const base64String = `data:image/jpeg;base64,${base64Image}`;
        console.log('Base64 string:', base64String.slice(0, 100)); 
        
    
        setProfilePicture(base64String);
      } catch (error) {
        console.log('Error converting image to base64:', error);
        Alert.alert('Erreur', 'Erreur lors de la conversion de l\'image.');
      }
    } else {
      console.log('Image picker cancelled');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.topImageContainer}>
              <Image source={require('../asset/logintop.png')} style={styles.topImage} />
            </View>
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={chooseImage}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <FontAwesome name="camera" size={40} color="#000" />
          )}
        </TouchableOpacity>
      </View>
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
        <Text style={styles.signupButton}>S'inscrire</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginRedirect}>Déjà un compte ? Connectez-vous</Text>
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
  topImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  topImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    backgroundColor: "#FFF",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#000",
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
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
