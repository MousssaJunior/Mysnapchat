import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();

  const validateEmail = (email) => {
    // Vérifie si l'email contient un @ et au moins un caractère après
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
      const response = await axios.post('https://snapchat.epidoc.eu/user', {
        email,
        password,
      });
  
      // Afficher la réponse et le statut de la requête dans des alertes
      Alert.alert('Réponse de la requête', JSON.stringify(response));
      Alert.alert('Statut de la requête', response.status.toString());
  
      if (response.status === 200 && response.data.token) {
        // Si la connexion réussit, afficher une alerte et naviguer vers l'écran de registre
        Alert.alert('Connexion Réussie');
        navigation.navigate('register');
      } else {
        // Si la réponse a un statut autre que 200 ou si le token est manquant, afficher un message d'erreur
        if (response.data && response.data.message) {
          Alert.alert('Erreur de connexion', response.data.message);
        } else {
          Alert.alert('Erreur de connexion', 'Identifiants invalides');
        }
      }
    } catch (error) {
      // Afficher le message d'erreur générique pour les erreurs réseau ou autres
      Alert.alert('Erreur de connexion', 'Une erreur est survenue lors de la connexion.');
      // Afficher l'erreur spécifique s'il y en a une
      Alert.alert('Erreur spécifique', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <View style={styles.container}>
      <View style={styles.TopimageContainer}>
        <Image source={require('../asset/logintop.png')} style={styles.topImage} />
      </View>
      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>Hello</Text>
      </View>
      <View>
        <Text style={styles.signIntext}>Sign in to your account</Text>
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
      <Text style={styles.forgotPasswordtext}>Forgot your password?</Text>
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
  TopimageContainer: {
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
  signIntext: {
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
  forgotPasswordtext: {
    color: '#C8C8C8',
    marginBottom: 20,
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
  signupRedirect: {
    color: "#BEBEBE",
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
  },
});

export default LoginScreen;
