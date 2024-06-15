import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedPassword = await AsyncStorage.getItem('password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    };

    loadRememberedCredentials();
  }, []);

  const validateEmail = (email) => {
    return email.includes('@') && email.split('@')[1].length > 0;
  };

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Veuillez entrer un email et un mot de passe');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Veuillez entrer un email valide');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put('https://snapchat.epidoc.eu/user', {
        email,
        password,
      }, {
        headers: {
          "X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmltLmJhcmFAZXBpdGVjaC5ldSIsImlhdCI6MTcxODEwNjgzOH0.8E6eoi_eRSd7TLYUG3p2BMtTfiQxzzVf25mStXIqJq0"
        }
      });

      if (response.status === 200) {
        if (response.data.data.token) {
          await AsyncStorage.setItem('token', response.data.data.token);
          if (rememberMe) {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
          } else {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
          }
          Alert.alert('Connexion réussie');
          navigation.navigate('Camera');
        } else {
          Alert.alert('Erreur lors de la connexion', 'Le jeton d\'authentification est manquant dans la réponse.');
        }
      } else {
        Alert.alert('Erreur lors de la connexion', response.data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      if (error.response) {
        console.log('Error response:', error.response.data);
        let errorMessage = 'Une erreur est survenue.';
        if (error.response.data.message) {
          switch (error.response.data.message) {
            case 'user not found':
              errorMessage = 'Utilisateur non trouvé';
              break;
            case 'credentials are bad':
              errorMessage = 'Les identifiants sont incorrects';
              break;
            default:
              errorMessage = error.response.data.message;
          }
        }
        Alert.alert('Erreur lors de la connexion', errorMessage);
      } else {
        console.log('Error message:', error.message);
        Alert.alert('Erreur lors de la connexion', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        Alert.alert('Connexion annulée');
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        Alert.alert('Erreur lors de l\'obtention du token');
        return;
      }

      const facebookToken = data.accessToken.toString();
     
      
      Alert.alert('Connexion Facebook réussie');
      navigation.navigate('Camera');
    } catch (error) {
      console.log('Login fail with error: ' + error);
      Alert.alert('Erreur lors de la connexion avec Facebook', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>

        <Image source={require('../asset/logintop.png')} style={styles.topImage} />
      </View>
      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>MY-SNAP</Text>
      </View>
      <View>
        <Text style={styles.signInText}>Connectez-vous à votre compte</Text>
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={30} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor="#000"
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={30} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor="#000"
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <FontAwesome name={secureTextEntry ? "eye-slash" : "eye"} size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
      <TouchableOpacity style={styles.signInButtonContainer} onPress={login} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.signIn}>Connexion</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupRedirect}>Vous n'avez pas de compte ? Inscrivez-vous</Text>

      </TouchableOpacity>
      <TouchableOpacity style={styles.linearGradient} onPress={loginWithFacebook}>
        <Text style={styles.buttonText}>Connexion avec Facebook</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFC00',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  helloContainer: {
    marginBottom: 30,
  },
  helloText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  signInText: {
    fontSize: 18,
    marginBottom: 30,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    marginBottom: 20,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  forgotPasswordText: {
    color: '#000',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  signInButtonContainer: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
  },
  signIn: {
    color: '#FFFC00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupRedirect: {
    color: '#000',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linearGradient: {
    backgroundColor: '#3b5998',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
