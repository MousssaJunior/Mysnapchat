import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function ProfileView() {
  const [profile, setProfile] = useState({
 
    profilePicture: null,
  });
  const navigation = useNavigation();




useEffect(() => {
  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get('https://snapchat.epidoc.eu/user', {
        headers: {
          Authorization: 'Bearer ' + token,
          'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmltLmJhcmFAZXBpdGVjaC5ldSIsImlhdCI6MTcxODEwNjgzOH0.8E6eoi_eRSd7TLYUG3p2BMtTfiQxzzVf25mStXIqJq0',
        },
      });

      if (response.status === 200) {
        if (response.data && response.data.length > 0) {
          const { username, profilePicture } = response.data[0]; 

          const formattedProfilePicture = profilePicture ? `data:image/jpeg;base64,${profilePicture}` : null;

          setProfile({
            username,
            profilePicture: formattedProfilePicture,
          });
        } else {
          Alert.alert('Erreur', 'Aucune donnée de profil trouvée.');
        }
      } else {
        Alert.alert('Erreur', 'Erreur lors de la récupération des données du profil.');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert('Erreur', 'Erreur lors de la récupération des données du profil.');
    }
  };

  fetchProfileData();
}, []);



const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Erreur lors de la déconnexion', 'Une erreur est survenue lors de la déconnexion.');
      }
  };

  const deleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
        }
        
        const response = await axios.delete('https://snapchat.epidoc.eu/user', {
          headers: {
            Authorization: 'Bearer ' + token,
            'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmltLmJhcmFAZXBpdGVjaC5ldSIsImlhdCI6MTcxODEwNjgzOH0.8E6eoi_eRSd7TLYUG3p2BMtTfiQxzzVf25mStXIqJq0',
            },
            });
            
            if (response.status === 200) {
              await AsyncStorage.removeItem('token');
              Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
              navigation.navigate('Login');
              } else {
                Alert.alert('Erreur', 'Erreur lors de la suppression du compte.');
                }
                } catch (error) {
                  console.error('Error deleting account:', error);
      Alert.alert('Erreur', 'Erreur lors de la suppression du compte.');
    }
  };
  
  const navigateToCRUD = () => {
    navigation.navigate('Crud');
    };
    
    return (
      <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            style={styles.avatar}
            source={{ uri: profile.profilePicture }}
            />
          <Text style={styles.username}>{profile.username}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
            <Text>Se déconnecter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={deleteAccount}>
            <Text>Supprimer mon compte</Text>
          </TouchableOpacity>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius tellus eget metus efficitur,
            sed tempus felis placerat. Phasellus a ipsum vel mi accumsan varius non a risus.
          </Text>
          <View style={styles.profileDetail}>
      
            <TouchableOpacity style={styles.buttonContainer} onPress={navigateToCRUD}>
              <Text>CRUD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      backgroundColor: '#DDDDDD',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
    },
    headerContent: {
      alignItems: 'center',
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: '#000',
      marginBottom: 10,
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 10,
    },
    body: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    bodyContent: {
      alignItems: 'center',
    },
    buttonContainer: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#DDDDDD',
      borderRadius: 10,
    },
    description: {
      marginTop: 20,
      textAlign: 'center',
      fontSize: 16,
      lineHeight: 24,
      color: '#333',
    },
    profileDetail: {
      alignSelf: 'center',
      marginTop: 20,
      alignItems: 'center',
      flexDirection: 'row',
    },
    detailContent: {
      margin: 10,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      color: '#DDDDDD',
    },
    count: {
      fontSize: 18,
    },
  });
  