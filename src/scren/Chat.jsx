import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function SendPage() {
  const [snaps, setSnaps] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://snapchat.epidoc.eu/user', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN5cGhheC5oYWRkb3VAZXBpdGVjaC5ldSIsImlkIjoiNjY1ZWRkNTg0NDVjMzMxYzllOWEwYTlmIiwiaWF0IjoxNzE3NDkzMTQyLCJleHAiOjE3MTc1Nzk1NDJ9.BHcqcDwbO0xYGKhWmcpSOmhRc_btxsQqm_IxQLUEnXw'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Fonction pour récupérer les snaps non vus
    const fetchSnaps = async () => {
      try {
        const response = await fetch('https://snapchat.epidoc.eu/snap', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN5cGhheC5oYWRkb3VAZXBpdGVjaC5ldSIsImlkIjoiNjY1ZWRkNTg0NDVjMzMxYzllOWEwYTlmIiwiaWF0IjoxNzE3NDkzMTQyLCJleHAiOjE3MTc1Nzk1NDJ9.BHcqcDwbO0xYGKhWmcpSOmhRc_btxsQqm_IxQLUEnXw'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const snapDetails = await Promise.all(data.map(async (snap) => {
          const snapResponse = await fetch(`https://snapchat.epidoc.eu/snap/${snap._id}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN5cGhheC5oYWRkb3VAZXBpdGVjaC5ldSIsImlkIjoiNjY1ZWRkNTg0NDVjMzMxYzllOWEwYTlmIiwiaWF0IjoxNzE3NDkzMTQyLCJleHAiOjE3MTc1Nzk1NDJ9.BHcqcDwbO0xYGKhWmcpSOmhRc_btxsQqm_IxQLUEnXw'
            },
          });

          const snapData = await snapResponse.json();
          return { ...snap, ...snapData };
        }));

        setSnaps(snapDetails);
      } catch (error) {
        console.error('Error fetching snaps:', error);
      }
    };

    fetchUsers();
    fetchSnaps();
  }, []);

  if (snaps.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getUserName = (userId) => {
    const user = users.find(user => user._id === userId);
    return user ? user.username : 'Unknown';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>SNAPS REÇUS</Text>
      {snaps.map(snap => (
        <View key={snap._id} style={styles.snapContainer}>
          <Text style={styles.label}>De:</Text>
          <Text style={styles.value}>{getUserName(snap.from)}</Text>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(snap.date).toLocaleString()}</Text>
          <Text style={styles.label}>Durée:</Text>
          <Text style={styles.value}>{snap.duration} minutes</Text>
          {snap.image ? (
            <Image source={{ uri: snap.image }} style={styles.snapImage}/>
          ) : (
            <Text style={styles.noImage}>No image</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    marginBottom: 8,
  },
  snapImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 16,
  },
  noImage: {
    fontSize: 18,
    marginTop: 16,
    color: 'gray',
  },
});
