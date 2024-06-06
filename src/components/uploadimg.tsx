import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';

export function UploadImage() {
  const [image, setImage] = useState(null);

  const checkForCameraRollPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Requise", "Veuillez accorder les permissions d'accès à la galerie dans les paramètres de votre système.");
    } else {
      console.log('Les permissions d’accès aux médias sont accordées');
    }
  };

  useEffect(() => {
    checkForCameraRollPermission();
  }, []);

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={imageUploaderStyles.container}>
      {image && <Image source={{ uri: image }} style={{ width: 130, height: 130 }} />}
      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn}>
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 130,
    width: 130,
    backgroundColor: '#efefef',
    position: 'relative',
    bottom: 296,
    overflow: 'hidden',
    marginLeft: 130,
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
