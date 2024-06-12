import * as FileSystem from 'expo-file-system';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [azer, setazer] = useState<object>();
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { image } = route.params || "";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://snapchat.epidoc.eu/user', {
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q2NkBnbWFpbC5jb20iLCJpZCI6IjY2NjZjOWY0MDg2MmUyOWRlZjQzMWE4MiIsImlhdCI6MTcxODExODM3NiwiZXhwIjoxNzE4MjA0Nzc2fQ.nUncSLb8DzHntxU6PvdfUKLBAlxQiqwT8OOzsp_QjZo",
            "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vdXNzYS1qdW5pb3IuZm9mYW5hQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMTEwNTh9.hI23vvbPZcA1cZDm5cYkgydL2cHn3tO2DGHLhQgvFCI"
          }
        });

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setUsers(response.data.data || []);
      } catch (error) {
        console.log('Error response:', error.response ? error.response.data : error.message);
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
  }, []);


  import { Alert } from 'react-native';
  import ImageResizer from 'react-native-image-resizer';
  import * as FileSystem from 'expo-file-system';
  
  const sendImage = async (userId) => {
    try {
      // Convertir l'image en base64
      const base64Image = await convertImageToBase64(image);
  
      // Redimensionner l'image si nécessaire
      const resizedImage = await resizeImage(base64Image);
  
      // Préparer les données à envoyer
      const formData = {
        image: resizedImage,
        to: userId,
        duration: 5
      };
  
      // Envoyer les données au serveur
      const response = await fetch('https://snapchat.epidoc.eu/snap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer VOTRE_JETON_JWT",
          "x-api-key": "VOTRE_CLE_API",
        },
        body: JSON.stringify(formData),
      });
  
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);
  
      if (response.status === 200) {
        Alert.alert('Succès', 'Image envoyée avec succès!');
      } else {
        throw new Error('Failed to send image');
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Erreur', 'Échec de l\'envoi de l\'image');
    }
  };
  
  const convertImageToBase64 = async (uri) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  };
  
  const resizeImage = async (base64Image) => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        `data:image/jpeg;base64,${base64Image}`,
        360,
        640,
        'JPEG',
        100,
        0
      );
      const resizedBase64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return resizedBase64;
    } catch (error) {
      console.log('Error resizing image:', error);
      return base64Image;
    }
  };
  
// const convertImageToBase64 = async (uri) => {
//   const base64 = await FileSystem.readAsStringAsync(uri, {
//     encoding: FileSystem.EncodingType.Base64,
//   });
//   return base64;
// };


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
            <TouchableOpacity style={styles.sendButton} onPress={() => sendImage(user._id)}>
              <Text style={styles.sendButtonText}>Envoyer l'image</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
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
