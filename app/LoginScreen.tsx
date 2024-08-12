import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  ToastAndroid,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import AlertComponent from "@/components/AlertComponent";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [passwd, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [backPressCount, setBackPressCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const clear = () => {
    setUsername("");
    setPassword("");
  };

  const handleLogin = async () => {
    if (username.trim() === "" || passwd.trim() === "") {
        setMessage("Hãy nhập đầy đủ thông tin");
        setColor("red");
        setShowAlert(true);
        return;
    }
    setLoading(true);

    try {
        const response = await axios.post("http://beejobs.io.vn:14307/api/login", {
            username: username,
            passwd: passwd,
        });
        console.log("token", response.data.token);
        if (response.data.status !== 200) {
            setMessage(response.data.msg);
            setColor("red");
            setShowAlert(true);
            clear();
            setLoading(false);
            return;
        }

        const userId = response.data.user_info.id_user;
        await AsyncStorage.setItem('idUser',userId );
        console.log(userId);
        const checkCompanyResponse = await axios.get(`http://beejobs.io.vn:14307/api/companies/checkCompany/${userId}`);
        if (checkCompanyResponse.data.registered) {
          await AsyncStorage.setItem('company_id', checkCompanyResponse.data.data._id);
          await AsyncStorage.setItem('premium', JSON.stringify(checkCompanyResponse.data.data.premium));
          console.log(checkCompanyResponse.data.data._id);
            router.push("/Home");
        } else {
            router.push("/CheckEmployerAuth");
        }

        if (rememberMe) {
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('passwd', passwd);
        } else {
          await AsyncStorage.removeItem('username');
          await AsyncStorage.removeItem('passwd');
        }
        setMessage("Đăng nhập thành công");
        setColor("green");
        setShowAlert(true);
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        setMessage("Lỗi khi đăng nhập");
        setColor("red");
        setShowAlert(true);
        clear();
    }finally {
      setLoading(false); // Stop loading spinner
    }
};

const loadSavedCredentials = async () => {
  const savedUsername = await AsyncStorage.getItem('username');
  const savedPassword = await AsyncStorage.getItem('passwd');

  if (savedUsername && savedPassword) {
    setUsername(savedUsername);
    setPassword(savedPassword);
    setRememberMe(true);
  }
};

useEffect(() => {
  loadSavedCredentials();
}, []);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount === 0) {
        setBackPressCount(1);
        ToastAndroid.show("Chạm lần nữa để thoát", ToastAndroid.SHORT);
        setTimeout(() => {
          setBackPressCount(0);
        }, 2000);

        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [backPressCount]);

  const handleFeatureInDevelopment = () => {
    Alert.alert("Thông báo", "Tính năng đang phát triển");
  };

  return (
    <View style={styles.container}>
      <Image style= {styles.logo} source={require('../assets/images/BeeJobs_logo.jpg')}/>
      <Text style={styles.title}>Đăng nhập</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tài khoản hoặc Email"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed"
          size={20}
          color="#A9A9A9"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={passwd}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#A9A9A9"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => router.push("FogotPassScreen")}
      >
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity
          style={[
            styles.rememberMeCheckbox,
            rememberMe ? styles.rememberMeCheckboxChecked : null,
          ]}
          onPress={() => setRememberMe(!rememberMe)}
        >
          {rememberMe && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </TouchableOpacity>
        <Text style={styles.rememberMeText}>Lưu mật khẩu</Text>
      </View>

      {loading && ( 
        <ActivityIndicator size="large" color="#007BFF" style={styles.spinner} />
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
      
      <Text style={styles.continueWithText}>----- continue with -----</Text>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity onPress={handleFeatureInDevelopment}>
          <Ionicons name="logo-facebook" size={35} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFeatureInDevelopment}>
          <Ionicons name="logo-google" size={35} color="#db4a39" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFeatureInDevelopment}>
          <Ionicons name="logo-twitter" size={35} color="#00acee" />
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        Bạn chưa có tài khoản?
        <Text
          style={styles.signupText}
          onPress={() => router.push("RegisterScreen")}
        >
          {" "}
          Đăng ký
        </Text>
      </Text>
      <AlertComponent
        color={color}
        message={message}
        visible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    padding: 1,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  icon: {
    marginRight: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: 16,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
  },
  rememberMeText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  rememberMeCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
  rememberMeCheckboxChecked: {
    backgroundColor: "#007aff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 15,
    width: Dimensions.get("screen").width/1.5 ,
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",

  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  continueWithText: {
    textAlign: "center",
    color: "#A9A9A9",
    marginBottom: 20,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  footerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#A9A9A9",
    marginBottom: 30,
  },
  signupText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  logo: {
    alignSelf: "center",
    width: "80%",
    height: 250,
  },
  spinner: {
    marginVertical: 10,
    alignSelf: "center", 
  },
});

export default LoginScreen;
