import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, CheckBox } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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
          "X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vdXNzYS1qdW5pb3IuZm9mYW5hQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMTEwNTh9.hI23vvbPZcA1cZDm5cYkgydL2cHn3tO2DGHLhQgvFCI"
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

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <Image source={require('../asset/logintop.png')} style={styles.topImage} />
      </View>
      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>MY-SNAP</Text>
      </View>
      <View>
        <Text style={styles.signInText}>Sign in to your account</Text>
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={30} color="#C8C8C8" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={30} color="#C8C8C8" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <FontAwesome name={secureTextEntry ? "eye-slash" : "eye"} size={30} color="#C8C8C8" />
        </TouchableOpacity>
      </View>
      <View style={styles.rememberMeContainer}>
        <CheckBox
          value={rememberMe}
          onValueChange={setRememberMe}
        />
        <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
      </View>
      <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      <TouchableOpacity style={styles.signInButtonContainer} onPress={login} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signIn}>Sign in</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupRedirect}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.linearGradient}>
        <Text style={styles.buttonText}>Sign in with Facebook</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  topImage: {
    width: 200,
    height: 200,
  },
  helloContainer: {
    marginBottom: 20,
  },
  helloText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  signInText: {
    fontSize: 16,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#C8C8C8',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
  },
  forgotPasswordText: {
    color: '#C8C8C8',
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeText: {
    marginLeft: 10,
    color: '#C8C8C8',
  },
  signInButtonContainer: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  signIn: {
    color: '#fff',
    fontSize: 16,
  },
  signupRedirect: {
    color: '#4CAF50',
    marginBottom: 20,
  },
  linearGradient: {
    backgroundColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
