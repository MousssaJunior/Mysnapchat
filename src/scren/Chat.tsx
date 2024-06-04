import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';

type User = {
  _id: string;
  username: string;
  profilePicture: string;
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('https://snapchat.epidoc.eu/user', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN5cGhheC5oYWRkb3VAZXBpdGVjaC5ldSIsImlkIjoiNjY1ZWRkNTg0NDVjMzMxYzllOWEwYTlmIiwiaWF0IjoxNzE3NDkzMTQyLCJleHAiOjE3MTc1Nzk1NDJ9.BHcqcDwbO0xYGKhWmcpSOmhRc_btxsQqm_IxQLUEnXw'
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); 
        setUsers(data.data || []);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  if (users.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>LES UTLISATEURS</Text>
      {users.map(user => (
        <View key={user._id} style={styles.userContainer}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{user._id}</Text>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{user.username}</Text>
          {user.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <Text style={styles.noProfilePicture}>No profile picture</Text>
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

  userContainer: {
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

  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 16,
  },

  noProfilePicture: {
    fontSize: 18,
    marginTop: 16,
    color: 'gray',
  },
  
});
