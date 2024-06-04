import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

import FontAwesome from "react-native-vector-icons/dist/FontAwesome";
// import LinearGradient from 'react-native-linear-gradient';

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
=======
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.TopimageContainer}>
        <Image source={require("../asset/logintop.png")} style={styles.topImage} />
      </View>
      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>Hello</Text>
      </View>
      <View>
        <Text style={styles.signInText}>Sign in to your account</Text>
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name={"user"} size={30} color={"#C8C8C8"} style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder="Email" />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name={"lock"} size={30} color={"#C8C8C8"} style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder="Password" secureTextEntry />
      </View>
      <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      <TouchableOpacity style={styles.signInButtonContainer}>
        <Text style={styles.signIn}>Sign in</Text>
      </TouchableOpacity>
      <View style={styles.linearGradient}>
        <TouchableOpacity>
          <Text style={styles.buttonText}>Sign in with Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  TopimageContainer: {
   
  },
  topImage: {
    width: "100%",
    height: 120,
  },
  helloContainer: {
   
  },
  helloText: {
    textAlign: "center",
    fontSize: 70,
    fontWeight: "500",
    color: "#262626",
  },
  signInText: {
    textAlign: "center",
    fontSize: 18,
    color: "#262626",
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 10,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    alignItems: "center",
    height: 70,
  },
  inputIcon: {
    marginLeft: 15,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
  forgotPasswordText: {
    color: "#BEBEBE",
    textAlign: "right",
    width: "90%",
    fontSize: 15,
    alignSelf: "center",
  },
  signInButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  signIn: {
    color: "#262626",
    fontSize: 25,
    fontWeight: "bold",
  },
  linearGradient: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 20,
    padding: 15,
  },
  buttonText: {
    backgroundColor: 'transparent',
    fontSize: 18,
    color: '#fff',
  },
});
