import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';


const loginscreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.TopimageContainer}>
                <Image source={require("../asset/logintop.png")} style={styles.topImage} />
            </View>
			<View style={styles.helloContainer}>
				<Text style={styles.helloText}>Hello</Text>
			</View>
			<View>
				<Text style={styles.singIntext}>Sing in to your account</Text>
			</View>
        </View>
    );
};

export default loginscreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        flex: 1,
    },
    TopimageContainer: {
      
    },
	topImage:{
		width: "100%",
		height:120,
	},
	helloContainer:{
		
	},
	helloText:{
		textAlign:"center",
		fontSize: 70,
		fontWeight:"500",
		color:"#262626",
	},
	singIntext: {
		textAlign:"center",
		fontSize: 18,
		color:"#262626",
	}
});
