
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const ReceivedSnaps = () => {
  const [snaps, setSnaps] = useState([]); // État pour stocker les snaps reçus
  const [loading, setLoading] = useState(true); // État pour le chargement
  const [username, setUsername] = useState(''); // État pour stocker le nom d'utilisateur
  const [selectedSnap, setSelectedSnap] = useState(null); // État pour stocker le snap sélectionné
  const route = useRoute(); // Obtenir les paramètres de la route actuelle
  const { userId } = route.params || ''; // Identifiant de l'utilisateur récupéré depuis les paramètres de la route

  useEffect(() => {
    const fetchSnaps = async () => {
      const token = await AsyncStorage.getItem('token'); // Récupérer le token d'authentification depuis AsyncStorage

      try {
        // Récupération des détails de l'utilisateur
        const userResponse = await axios.get('https://snapchat.epidoc.eu/user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vdXNzYS1qdW5pb3IuZm9mYW5hQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMTEwNTh9.hI23vvbPZcA1cZDm5cYkgydL2cHn3tO2DGHLhQgvFCI',
          },
        });

        if (userResponse.status !== 200) {
          throw new Error(`Erreur HTTP ! statut : ${userResponse.status}`);
        }

        const userData = userResponse.data.data;
        const fetchedUsername = userData.username;
        setUsername(fetchedUsername); // Mettre à jour le nom d'utilisateur dans l'état

        // Récupération des snaps de l'utilisateur
        const snapResponse = await axios.get('https://snapchat.epidoc.eu/snap', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vdXNzYS1qdW5pb3IuZm9mYW5hQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMTEwNTh9.hI23vvbPZcA1cZDm5cYkgydL2cHn3tO2DGHLhQgvFCI',
          },
        });

        if (snapResponse.status !== 200) {
          throw new Error(`Erreur HTTP ! statut : ${snapResponse.status}`);
        }

        const snapList = snapResponse.data.data || []; // Liste des snaps récupérée depuis la réponse

        // Récupérer les détails de chaque snap avec une promesse asynchrone
        const snapDetailsPromises = snapList.map(async (snap) => {
          // Récupération des détails de chaque snap
          const snapDetailResponse = await axios.get(`https://snapchat.epidoc.eu/snap/${snap._id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vdXNzYS1qdW5pb3IuZm9mYW5hQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMTEwNTh9.hI23vvbPZcA1cZDm5cYkgydL2cHn3tO2DGHLhQgvFCI',
            },
          });

          // Récupérer les détails de l'utilisateur qui a envoyé le snap (sender)
          const senderResponse = await axios.get(`https://snapchat.epidoc.eu/user/${snap.from}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vdXNzYS1qdW5pb3IuZm9mYW5hQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMTEwNTh9.hI23vvbPZcA1cZDm5cYkgydL2cHn3tO2DGHLhQgvFCI',
            },
          });

          // Créer un nouvel objet snap avec les informations nécessaires
          const snapData = {
            _id: snap._id,
            from: snap.from,
            senderUsername: senderResponse.data.data.username,
            date: snap.date,
            duration: snapDetailResponse.data.data.duration,
            image: snapDetailResponse.data.data.image,
          };

          return snapData; // Retourner les données du snap avec le nom d'utilisateur du sender et les détails du snap
        });

        const snapDetails = await Promise.all(snapDetailsPromises); // Attendre que toutes les promesses soient résolues
        setSnaps(snapDetails); // Mettre à jour les snaps dans l'état

      } catch (error) {
        console.log('Erreur :', error.response ? error.response.data : error.message);
        let errorMessage = 'Une erreur est survenue.';
        if (error.response && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        Alert.alert('Erreur', errorMessage); // Afficher une alerte en cas d'erreur
      } finally {
        setLoading(false); // Marquer le chargement comme terminé
      }
    };

    fetchSnaps(); // Appeler la fonction pour récupérer les snaps lors du montage du composant
  }, [userId]); // Effectuer la requête à chaque changement de userId

  const handleSnapSelect = (snap) => {
    setSelectedSnap(snap); // Mettre à jour l'état du snap sélectionné
  };

  const handleBackToSnaps = () => {
    setSelectedSnap(null); // Réinitialiser l'état du snap sélectionné pour revenir à la liste des snaps
  };

  const renderSnapDetails = () => (
    <View key={selectedSnap._id} style={styles.selectedSnapContainer}>
      <Text style={styles.sender}>De: {selectedSnap.senderUsername}</Text>
      <Text>Date: {new Date(selectedSnap.date).toLocaleString()}</Text>
      <Text>Durée: {selectedSnap.duration} secondes</Text>
      {selectedSnap.image ? (
        <Image source={{ uri: selectedSnap.image }} style={styles.snapImage} />
      ) : (
        <Text>Image indisponible</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (snaps.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Aucun snap disponible</Text>
      </View>
    );
  }

  return (

    <ScrollView style={styles.container}>
      {selectedSnap ? (
        <View>
          <TouchableOpacity onPress={handleBackToSnaps} style={styles.backButton}>
            <Text style={styles.backButtonText}>Retour aux snaps</Text>
          </TouchableOpacity>
          {renderSnapDetails()}
        </View>
      ) : (
        <View>
          <Text style={styles.header}>SNAPS REÇUS pour {username}</Text>
          {snaps.map((snap) => (
            <TouchableOpacity key={snap._id} onPress={() => handleSnapSelect(snap)}>
              <View style={styles.snapContainer}>
                <Text style={styles.sender}>De: {snap.senderUsername}</Text>
                <Text>Date: {new Date(snap.date).toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  snapContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedSnapContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  sender: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#DDDDDD',
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedSnapImage: {
    marginTop: 10,
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  snapImage: {
    marginTop: 10,
    width: '100%',
    height: 400,
    resizeMode: 'contain',
  },
});

export default ReceivedSnaps;
