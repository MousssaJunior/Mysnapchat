import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function Camera() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [duration, setDuration] = useState(5);  // Durée par défaut
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={goToNewPage}>
            <Text style={styles.headerButtonText}>Option</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={goToReceived}>
            <Text style={styles.headerButtonText}>Mes messages</Text>
          </TouchableOpacity>
          {image && (
            <TouchableOpacity style={styles.headerButton} onPress={goToSendPage}>
              <Text style={styles.headerButtonText}>Envoyer</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [image, navigation]);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const goToNewPage = () => {
    navigation.navigate('Option');
  };

  const goToReceived = () => {
    navigation.navigate('ReceivedSnaps');
  };

  const goToSendPage = () => {

    navigation.navigate('Chat', { image, duration });

  };

  const deletePicture = () => {
    setImage(null);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Nous avons besoin de votre permission pour utiliser la caméra</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={(ref) => setCamera(ref)}>
        <View style={styles.overlay}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.galleryButton} onPress={addImage}>

            <Entypo name="folder-images" size={24} color="white" />

            </TouchableOpacity>
            <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
              <Ionicons name="camera" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>

            <MaterialCommunityIcons name="camera-flip-outline" size={24} color="white" />

            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Durée :</Text>
            <Picker
              selectedValue={duration}
              style={styles.picker}
              onValueChange={(itemValue) => setDuration(itemValue)}
            >
              {[...Array(11).keys()].map(i => (
                <Picker.Item key={i} label={`${i} secondes`} value={i} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={deletePicture}>
            <Text style={styles.buttonText}>Supprimer la photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'black', 

  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: 'flex-end', 
    alignItems: 'center',
    paddingBottom: 20, 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    width: '80%', 

  },
  snapButton: {
    width: 80,
    height: 80,

    borderRadius: 40, 
    backgroundColor: '#FFFC00', 

    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    width: 50,
    height: 50,

    borderRadius: 25, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 

    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 50,
    height: 50,

    borderRadius: 25, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 

    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',

    borderWidth: 1,
    borderColor: '#FFFC00',
  },
  durationContainer: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationLabel: {
    color: 'white',
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: 150,
    color: 'white',

  },
  deleteButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  permissionButton: {

    backgroundColor: '#4CAF50',

 

    padding: 10,
    borderRadius: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 10,
  },
  headerButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
