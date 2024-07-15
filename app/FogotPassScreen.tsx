import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, BackHandler, Image } from 'react-native';
import { useRouter } from 'expo-router';

const ForgotPassScreen = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const emailInputRef = useRef<TextInput>(null);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage('Vui lòng nhập email của bạn.');
      emailInputRef.current?.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage('Email không hợp lệ. Vui lòng nhập lại.');
      emailInputRef.current?.focus();
      return;
    }

    router.push({ pathname: "OtpFogotPassScreen", params: { email: email } });
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("LoginScreen");
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
        <Image style= {styles.logo} source={require('../assets/images/BeeJobs_logo.jpg')}/>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <TextInput
        ref={emailInputRef}
        style={styles.input}
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Đăng nhập với tài khoản khác?
        <Text
          style={styles.signupText}
          onPress={() => router.push("LoginScreen")}
        >
          {" "}
          Đăng nhập
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop:30,
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 15,
    width: Dimensions.get("screen").width / 1.5,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#A9A9A9",
    marginTop: 30,
  },
  signupText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  logo: {
    alignSelf: 'center',
    width: "80%",
    height: 250,
  },
});

export default ForgotPassScreen;
