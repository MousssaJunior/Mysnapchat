import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Crud = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleSaveChanges = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log(token)
    try {
      const response = await axios.patch('https://snapchat.epidoc.eu/user', {
        email: newEmail,
        username: username,
        password: newPassword,
      }, {

        headers: {
          "Authorization": 'Bearer ' + token,
          " X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vdXNzYS1qdW5pb3IuZm9mYW5hQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMTEwNTh9.hI23vvbPZcA1cZDm5cYkgydL2cHn3tO2DGHLhQgvFCI"
        }
      });
      console.log(response.data)
    }
 catch (e) {
      console.log(e)
    }


  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Changer le pseudonyme</Text>
      <TextInput
        style={styles.input}
        placeholder="Nouveau pseudonyme"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Changer l'email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nouveau email"
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <Text style={styles.label}>Changer le mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button
        title="Sauvegarder les changements"
        onPress={handleSaveChanges}
        color="#fff600"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    width: '100%',
  },
});

export default Crud;