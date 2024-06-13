import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const ReceivedSnaps = () => {
	const [snaps, setSnaps] = useState([]);
	const [loading, setLoading] = useState(true);
	const route = useRoute();
	const { userId } = route.params || "";

	useEffect(() => {
		const fetchSnaps = async () => {
			try {
				console.log('Fetching snap list...');
				const response = await axios.get('https://snapchat.epidoc.eu/snap', {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q5OUBnbWFpbC5jb20iLCJpZCI6IjY2NmFjNjA0MDg2MmUyOWRlZjQzMWUzMyIsImlhdCI6MTcxODI3MzYwOSwiZXhwIjoxNzE4MzYwMDA5fQ.IwAcWtJE_uAcJJOxmgc91G5-74JDcckTuTeFyiH2TBs",
						"x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmltLmJhcmFAZXBpdGVjaC5ldSIsImlhdCI6MTcxODEwNjgzOH0.8E6eoi_eRSd7TLYUG3p2BMtTfiQxzzVf25mStXIqJq0",
					},
				});

				if (response.status !== 200) {
					throw new Error(`Erreur HTTP ! statut : ${response.status}`);
				}

				const snapList = response.data.data || [];

				const snapDetailsPromises = snapList.map(async (snap) => {
					const snapResponse = await axios.get(`https://snapchat.epidoc.eu/snap/${snap._id}`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q5OUBnbWFpbC5jb20iLCJpZCI6IjY2NmFjNjA0MDg2MmUyOWRlZjQzMWUzMyIsImlhdCI6MTcxODI3MzYwOSwiZXhwIjoxNzE4MzYwMDA5fQ.IwAcWtJE_uAcJJOxmgc91G5-74JDcckTuTeFyiH2TBs",
							"x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmltLmJhcmFAZXBpdGVjaC5ldSIsImlhdCI6MTcxODEwNjgzOH0.8E6eoi_eRSd7TLYUG3p2BMtTfiQxzzVf25mStXIqJq0",
						},
					});

					return snapResponse.data;
				});

				const snapDetails = await Promise.all(snapDetailsPromises);
				setSnaps(snapDetails);
			} catch (error) {
				console.log('Réponse d\'erreur :', error.response ? error.response.data : error.message);
				let errorMessage = 'Une erreur est survenue.';
				if (error.response && error.response.data.message) {
					errorMessage = error.response.data.message;
				}
				Alert.alert('Erreur', errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchSnaps();
	}, [userId]);

	if (loading) {
		return (
			<View style={styles.container}>
				<Text>En cours...</Text>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (snaps.length === 0) {
		return (
			<View style={styles.container}>
				<Text>Vous n'avez pas de snaps</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>SNAPS REÇUS</Text>
			{snaps.map(snap => {

				return <View key={snap.data._id} style={styles.snapContainer}>
					<Text style={styles.sender}>De: {snap.data.from}</Text>
					<Text>Date: {new Date(snap.data.date).toLocaleString()}</Text>
					<Text>Durée: {snap.data.duration} secondes</Text>
					<Image source={{ uri: snap.data.image }} style={styles.snapImage} />
				</View>
			}
			)
			}
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
	sender: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	snapImage: {
		marginTop: 10,
		width: '100%',
		height: 400,
		resizeMode: 'contain',
	},
});

export default ReceivedSnaps;

