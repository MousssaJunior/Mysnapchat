import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'; // Ajout de Picker
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { useRoute } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


const Chat = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState({Picker}); // Durée par défaut à null
  const route = useRoute();
  const { image } = route.params || {};
  const width = 360;
  const height = 640;

  useEffect(() => {
    console.log('Valeur initiale de duration dans useEffect :', duration); // Log pour vérifier l'initialisation

    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://snapchat.epidoc.eu/user', {
          headers: {
            "Authorization": "Bearer " + token,
            "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJhcmFrYXJpbTAxMjhAZ21haWwuY29tIiwiaWQiOiI2NjZkN2Q2MzA4NjJlMjlkZWY0MzFmNzciLCJpYXQiOjE3MTg0NjcxMjIsImV4cCI6MTcxODU1MzUyMn0.uBN-sHpc-phPvtNNzG7S_RJoqCBAbyfAFIiw4zuVYII", // Remplacez par votre clé API
          }
        });

        if (response.status !== 200) {
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }

        setUsers(response.data.data || []);
      } catch (error) {
        console.log('Réponse d\'erreur :', error.response ? error.response.data : error.message);
        let errorMessage = 'Une erreur est survenue.';
        if (error.response && error.response.data.message) {
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
        Alert.alert('Erreur', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [duration]); // Ajout de duration comme dépendance

  const convertImageToBase64 = async (uri, width, height) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: width, height: height } }], {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.log('Erreur lors de la conversion de l\'image en base64 :', error);
      throw new Error('Erreur lors de la conversion de l\'image en base64');
    }
  };

  const sendImage = async (userId, selectedDuration) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const base64Image = await convertImageToBase64(image, width, height);
      const formData = {
        image: "data:image/png;base64," + base64Image,
        to: userId,
        duration: selectedDuration, // Utiliser la valeur de selectedDuration passée en paramètre
      };

      const response = await fetch('https://snapchat.epidoc.eu/snap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + token,
          "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJhcmFrYXJpbTAxMjhAZ21haWwuY29tIiwiaWQiOiI2NjZkN2Q2MzA4NjJlMjlkZWY0MzFmNzciLCJpYXQiOjE3MTg0NjcxMjIsImV4cCI6MTcxODU1MzUyMn0.uBN-sHpc-phPvtNNzG7S_RJoqCBAbyfAFIiw4zuVYII",
        },
        body: JSON.stringify(formData),
      });

      console.log('Statut de la réponse :', response.status);
      const responseData = await response.json();
      console.log('Données de la réponse :', responseData);

      if (response.status === 200) {
        Alert.alert('Succès', 'Image envoyée avec succès !');
      } else {
        throw new Error('Échec de l\'envoi de l\'image');
      }
    } catch (error) {
      console.log('Erreur :', error);
      Alert.alert('Erreur', 'Échec de l\'envoi de l\'image');
    }
  };

  const handleSendImage = (userId) => {
    if (duration === null) {
      Alert.alert('Sélectionnez une durée', 'Veuillez sélectionner une durée avant d\'envoyer l\'image.');
      return;
    }
    sendImage(userId, duration); // Passer la valeur actuelle de duration
  };

  // Fonction appelée lorsque la durée est sélectionnée dans le Picker
  const handleDurationChange = (selectedDuration) => {
    setDuration(selectedDuration); // Mettre à jour la valeur de duration
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>En cours...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Vous n'avez pas d'ami</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>MES AMIS</Text>
      {users.map(user => (
        <View key={user._id} style={styles.friendContainer}>
          <Text style={styles.username}>{user.username}</Text>
          {image && (
            <TouchableOpacity style={styles.sendButton} onPress={() => handleSendImage(user._id)}>
              <Text style={styles.sendButtonText}>Envoyer l'image</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {/* Ajouter un Picker pour la sélection de la durée */}
      <Picker
        selectedValue={duration}
        onValueChange={(itemValue) => handleDurationChange(itemValue)}
        style={{ height: 50, width: 150 }}
      >
         <Picker.Item label="5 secondes" value={5} />
        <Picker.Item label="8 secondes" value={8} />
        <Picker.Item label="12 secondes" value={12} />
        <Picker.Item label="20 secondes" value={20} />
      
      </Picker>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  friendContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sendButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Chat;
