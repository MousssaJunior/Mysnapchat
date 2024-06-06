import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

import FontAwesome from "react-native-vector-icons/dist/FontAwesome";

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
				<Text style={styles.signIntext}>Sign in to your account</Text>
			</View>
			<View style={styles.inputContainer}>
				<FontAwesome
					name={"user"}
					size={30}
					color={"#C8C8C8"}
					style={styles.inputIcon} />

				<TextInput style={styles.textInput} placeholder="Email" />

			</View>
			<View style={styles.inputContainer}>
				<FontAwesome
					name={"lock"}
					size={30}
					color={"#C8C8C8"}
					style={styles.inputIcon} />

				<TextInput style={styles.textInput} placeholder="Password" secureTextEntry />

			</View>
			<Text style={styles.forgotPasswordtext}>Forgot your password?</Text>
			<View style={styles.singInButtonContainer}>
				<Text style={styles.singIn}>Sign in</Text>
				<View style={styles.linearGradient}>
					<Text style={styles.buttonText}>
						Sign in with Facebook
					</Text>
				</View>
			</View>
		</View>
	);

}