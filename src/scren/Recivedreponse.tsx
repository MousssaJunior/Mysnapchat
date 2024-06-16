import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useRoute } from '@react-navigation/native';

const ReceivedSnaps = () => {
  const route = useRoute();
  const { userId } = route.params || '';
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [snaps, setSnaps] = useState([]);
  const [selectedSnap, setSelectedSnap] = useState(null);
  const [viewedSnaps, setViewedSnaps] = useState(new Set());
  const [deleteTimeouts, setDeleteTimeouts] = useState({}); 

  useEffect(() => {
    const loadViewedSnaps = async () => {
      try {
        const viewedSnapsData = await AsyncStorage.getItem('viewedSnaps');
        if (viewedSnapsData !== null) {
          setViewedSnaps(new Set(JSON.parse(viewedSnapsData)));
        }
      } catch (error) {
        console.log('Erreur lors du chargement des snaps vus:', error);
      }
    };

    loadViewedSnaps();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmltLmJhcmFAZXBpdGVjaC5ldSIsImlhdCI6MTcxODEwNjgzOH0.8E6eoi_eRSd7TLYUG3p2BMtTfiQxzzVf25mStXIqJq0'; 

        const userResponse = await axios.get('https://snapchat.epidoc.eu/user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': apiKey,
          },
        });

        if (userResponse.status !== 200) {
          throw new Error(`Erreur HTTP ! Statut : ${userResponse.status}`);
        }

        const userData = userResponse.data.data;
        setUsername(userData.username);


        const snapResponse = await axios.get('https://snapchat.epidoc.eu/snap', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': apiKey,
          },
        });

        if (snapResponse.status !== 200) {
          throw new Error(`Erreur HTTP ! Statut : ${snapResponse.status}`);
        }

        const snapList = snapResponse.data.data || [];
        const snapDetailsPromises = snapList.map(async (snap) => {
          const [snapDetailResponse, senderResponse] = await Promise.all([
            axios.get(`https://snapchat.epidoc.eu/snap/${snap._id}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-api-key': apiKey,
              },
            }),
            axios.get(`https://snapchat.epidoc.eu/user/${snap.from}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-api-key': apiKey,
              },
            }),
          ]);

          const snapData = {
            _id: snap._id,
            from: snap.from,
            senderUsername: senderResponse.data.data.username,
            date: snap.date,
            duration: snapDetailResponse.data.data.duration,
            image: snapDetailResponse.data.data.image,
          };

          return snapData;
        });

        const snapDetails = await Promise.all(snapDetailsPromises);
        const filteredSnaps = snapDetails.filter(snap => !viewedSnaps.has(snap._id));
        setSnaps(filteredSnaps);

      } catch (error) {
        console.log('Erreur :', error.message || error);
        let errorMessage = 'Une erreur est survenue.';
        if (error.response && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        Alert.alert('Erreur', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, viewedSnaps]);

const handleSnapSelect = async (snap) => {
  setSelectedSnap(snap);

  if (!viewedSnaps.has(snap._id)) {

    const timeout = setTimeout(() => {
    
      if (!viewedSnaps.has(snap._id)) {
        console.log(`Snap ${snap._id} has not been viewed during duration, removing...`);
        removeSnap(snap._id);
      }
    }, snap.duration * 1000); 
    console.log(`Timeout set for Snap ${snap._id} for ${snap.duration} seconds`);

    setDeleteTimeouts(prevDeleteTimeouts => ({
      ...prevDeleteTimeouts,
      [snap._id]: timeout,
    }));
  } else {
    console.log(`Snap ${snap._id} has already been viewed`);
  }

  const markSnapAsViewed = () => {
    setViewedSnaps(prevViewedSnaps => {
      const newViewedSnaps = new Set(prevViewedSnaps);
      newViewedSnaps.add(snap._id);
      saveViewedSnaps(newViewedSnaps);
      console.log(`Snap ${snap._id} marked as viewed`);
      return newViewedSnaps;
    });
  };

  const checkDurationAndMarkAsViewed = () => {
    if (!viewedSnaps.has(snap._id)) {
      markSnapAsViewed();
    }
  };

  await new Promise(resolve => setTimeout(resolve, snap.duration * 1000));

  checkDurationAndMarkAsViewed();
};

  //   setViewedSnaps(prevViewedSnaps => {
  //     const newViewedSnaps = new Set(prevViewedSnaps);
  //     newViewedSnaps.add(snap._id);
  //     saveViewedSnaps(newViewedSnaps);
  //     console.log(`Snap ${snap._id} marked as viewed`);
  //     return newViewedSnaps;
  //   });
  // };
  

const saveViewedSnaps = useCallback(async (updatedViewedSnaps) => {
  try {
    await AsyncStorage.setItem('viewedSnaps', JSON.stringify(Array.from(updatedViewedSnaps)));
    console.log('Viewed snaps saved:', updatedViewedSnaps);
  } catch (error) {
    console.log('Erreur lors de la sauvegarde des snaps vus:', error);
  }
}, []);




const removeSnap = (snapId) => {
  setSnaps(prevSnaps => prevSnaps.filter(snap => snap._id !== snapId));
  clearDeleteTimeout(snapId);
};


  const handleBackToSnaps = () => {
    setSelectedSnap(null);

    Object.keys(deleteTimeouts).forEach(snapId => {
      clearTimeout(deleteTimeouts[snapId]);
    });
    setDeleteTimeouts({});
  };

const clearDeleteTimeout = (snapId) => {
  if (deleteTimeouts[snapId]) {
    clearTimeout(deleteTimeouts[snapId]);
    console.log(`Timeout cleared for Snap ${snapId}`);
    setDeleteTimeouts(prevDeleteTimeouts => {
      const updatedTimeouts = { ...prevDeleteTimeouts };
      delete updatedTimeouts[snapId];
      return updatedTimeouts;
    });
  }
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
    <View style={styles.container}>
      {selectedSnap ? (
        <View>
          <TouchableOpacity onPress={handleBackToSnaps} style={styles.backButton}>
            <Text style={styles.backButtonText}>Retour aux snaps</Text>
          </TouchableOpacity>
          {renderSnapDetails()}
        </View>
      ) : (
        <View>
          <Text style={styles.header}>SNAPS REÇUS  {username}</Text>
          <ScrollView style={styles.snapListContainer}>
            {snaps.map((snap) => (
              <TouchableOpacity key={snap._id} onPress={() => handleSnapSelect(snap)}>
                <View style={styles.snapContainer}>
                  <View style={styles.senderInfo}>
                    <Text style={styles.sender}>{snap.senderUsername}</Text>
                    <Text style={styles.sentAt}>{new Date(snap.date).toLocaleString()}</Text>
                  </View>
                  <View style={styles.imageContainer}>
                    {snap.image ? (
                      <Image source={{ uri: snap.image }} style={styles.snapImage} />
                    ) : (
                      <Text>Image indisponible</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  snapListContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  snapContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  senderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sender: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sentAt: {
    fontSize: 14,
    color: '#888',
  },
  snapImage: {
    marginTop: 10,
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  backButton: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedSnapContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedSnapImage: {
    marginTop: 10,
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
});

export default ReceivedSnaps;
