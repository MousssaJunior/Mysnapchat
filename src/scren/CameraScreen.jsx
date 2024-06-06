import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function Camera() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={goToNewPage}>
            <Text style={styles.headerButtonText}>Option</Text>
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
      const data = await camera.takePictureAsync>(null);
      setImage(data.uri);
    }
  };

  const goToNewPage = () => {
    navigation.navigate('Option');
  };

  const goToSendPage = () => {
    navigation.navigate('SendPage', { image });
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
        <Button onPress={requestPermission} title="Autoriser la caméra" />
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
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.buttonText}>Changer de caméra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>Prendre une photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
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
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    marginTop: 500,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(255,0,0,0.6)',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
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

