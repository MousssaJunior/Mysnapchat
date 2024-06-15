import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { useRoute } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(null);
  const route = useRoute();
  const { image } = route.params || {};
  const width = 360;
  const height = 640;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://snapchat.epidoc.eu/user', {
          headers: {
            "Authorization": "Bearer " + token,
            "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJhcmFrYXJpbTAxMjhAZ21haWwuY29tIiwiaWQiOiI2NjZkN2Q2MzA4NjJlMjlkZWY0MzFmNzciLCJpYXQiOjE3MTg0NjcxMjIsImV4cCI6MTcxODU1MzUyMn0.uBN-sHpc-phPvtNNzG7S_RJoqCBAbyfAFIiw4zuVYII", 
          }
        });

        if (response.status !== 200) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        setUsers(response.data.data || []);
      } catch (error) {
        console.log('Error response:', error.response ? error.response.data : error.message);
        let errorMessage = 'An error occurred.';
        if (error.response && error.response.data.message) {
          switch (error.response.data.message) {
            case 'user not found':
              errorMessage = 'User not found';
              break;
            case 'credentials are bad':
              errorMessage = 'Invalid credentials';
              break;
            default:
              errorMessage = error.response.data.message;
          }
        }
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [duration]);

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
      console.log('Error converting image to base64:', error);
      throw new Error('Error converting image to base64');
    }
  };

  const sendImage = async (userId, selectedDuration) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const base64Image = await convertImageToBase64(image, width, height);
      const formData = {
        image: "data:image/png;base64," + base64Image,
        to: userId,
        duration: selectedDuration,
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

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.status === 200) {
        Alert.alert('Success', 'Image sent successfully!');
      } else {
        throw new Error('Failed to send image');
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Failed to send image');
    }
  };

  const handleSendImage = (userId) => {
    if (duration === null) {
      Alert.alert('Select a duration', 'Please select a duration before sending the image.');
      return;
    }
    sendImage(userId, duration);
  };

  const handleDurationChange = (selectedDuration) => {
    setDuration(selectedDuration);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No friends found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <MaterialIcons name="timer" size={24} color="#4CAF50" style={styles.pickerIcon} />
        <Picker
          selectedValue={duration}
          onValueChange={(itemValue) => handleDurationChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="5 seconds" value={5} />
          <Picker.Item label="8 seconds" value={8} />
          <Picker.Item label="12 seconds" value={12} />
          <Picker.Item label="20 seconds" value={20} />
        </Picker>
      </View>
      <ScrollView style={styles.friendList}>
        <Text style={styles.header}>MY FRIENDS</Text>
        {users.map(user => (
          <TouchableOpacity
            key={user._id}
            style={styles.friendContainer}
            onPress={() => handleSendImage(user._id)}
          >
            <Text style={styles.username}>{user.username}</Text>
            {image && (
              <View style={styles.sendIcon}>
                <MaterialIcons name="send" size={24} color="#FFFC00" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    pickerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      marginTop: 20, 
    },
    pickerIcon: {
      marginRight: 10,
    },
    picker: {
      height: 50,
      width: 150,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
    },
    friendList: {
      marginBottom: 20,
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
    sendIcon: {
      position: 'absolute',
      right: 20,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
  });
  

export default Chat;
