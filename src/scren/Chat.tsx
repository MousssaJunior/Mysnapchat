import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://snapchat.epidoc.eu/user', {
          headers: {
            // "authorization" : `Bearer ${token}`
            "Authorization": " Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q2NkBnbWFpbC5jb20iLCJpZCI6IjY2NjZjOWY0MDg2MmUyOWRlZjQzMWE4MiIsImlhdCI6MTcxODExODM3NiwiZXhwIjoxNzE4MjA0Nzc2fQ.nUncSLb8DzHntxU6PvdfUKLBAlxQiqwT8OOzsp_QjZo",
            "X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vdXNzYS1qdW5pb3IuZm9mYW5hQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMTEwNTh9.hI23vvbPZcA1cZDm5cYkgydL2cHn3tO2DGHLhQgvFCI"
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
});

export default Chat;
