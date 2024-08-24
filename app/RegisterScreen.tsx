import React, { useState, useEffect, useRef  } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AlertComponent from "@/components/AlertComponent";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "expo-router";
// import CheckBox from '@react-native-community/checkbox';

const RegisterScreen = () => {
  // su dung cho dang ky
  const [accout_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwd, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  //an hien mat khau
  const [showPassword, setShowPassword] = useState(false);
  // su dung cho hop thoai canh bao
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const router = useRouter();

  const AcoutRef = useRef<TextInput>(null);
  const EmailRef = useRef<TextInput>(null);
  const PasswdRef = useRef<TextInput>(null);
  const ConfirmpassRef = useRef<TextInput>(null);


  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const clear = () => {
    setName("");
    setEmail("");
    setPassword("");
  }

  const handleRegister = async () => {
    if (
      accout_name.trim() === "" ||
      email.trim() === "" ||
      passwd.trim() === "" ||
      confirmpassword.trim() === "" 
    ) {
      setMessage('Hãy nhập đầy đủ thông tin')
      setColor('red');
      setShowAlert(true);
      return;
    }
    if(accout_name.trim() === ""){
      AcoutRef.current?.focus();
      return;
    }
    if(email.trim() === ""){
      EmailRef.current?.focus();
      return;
    }
    if(passwd.trim() === ""){
      PasswdRef.current?.focus();
      return;
    }
    if(confirmpassword.trim() === ""){
      ConfirmpassRef.current?.focus();
      return;
    }

    if (!isValidEmail(email)) {
      setMessage('Email không hợp lệ')
      setColor('red');
      setShowAlert(true);
      EmailRef.current?.focus();
      return;
    }
    if(passwd.length < 6 || passwd.length > 10){
      setMessage('Mật khẩu từ 6 - 10 ký tự');
      setColor('red');
      setShowAlert(true);
      PasswdRef.current?.focus();
      return;
    }
    if(passwd !== confirmpassword){
      setMessage('Mật khẩu không trùng khớp')
      setColor('red');
      setShowAlert(true);
      PasswdRef.current?.focus();
      return;
    }
    

    try {
      const response: AxiosResponse = await axios.post(
        "http://beejobs.io.vn:14307/api/signup",
        {
          accout_name: accout_name,
          email: email,
          passwd: passwd,
          type_role: 'DN'
        }
      );
      console.log(response.data);
      if (response.data.status !== 200) {
        setMessage(response.data.msg);
        setShowAlert(true);
        setColor('red');
        clear();
        return
      }

      setMessage('Đăng ký thành công');
      setShowAlert(true);
      setColor('green');
      router.push({ pathname: "OtpScreen", params: { email: email} });
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setMessage('Lỗi khi đăng ký');
      setShowAlert(true);
      setColor('red');
      clear();
    }
    // router.push({ pathname: "OtpScreen", params: { email: email} });
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
      <Text style={styles.wellcome}>Chào mừng bạn đến với BeeJobs</Text>
      <Text style={styles.title}>Đăng ký</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          ref={AcoutRef}
          style={styles.input}
          placeholder="Tài khoản"
          value={accout_name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          ref={EmailRef}
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          ref={PasswdRef}
          style={styles.input}
          placeholder="Mật khẩu 6 - 10 ký tự"
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
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          ref={ConfirmpassRef}
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry={!showPassword}
          value={confirmpassword}
          onChangeText={setConfirmPassword}
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
      <Text style={styles.continueWithText}>----- continue with -----</Text>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity>
          <Ionicons name="logo-facebook" size={35} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="logo-google" size={35} color="#db4a39" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="logo-twitter" size={35} color="#00acee" />
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        Bạn đã có tài khoản?
        <Text
          style={styles.signinText}
          onPress={() => router.replace("LoginScreen")}
        >
          {" "}
          Đăng nhập
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
    marginBottom: 15,
    color:"#ff4500"
  },
  wellcome: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 15,
    marginBottom: 15,
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
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    width: Dimensions.get("screen").width/1.5 ,
    borderRadius: 15,
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
  },
  signinText: {
    color: "#007BFF",
    fontWeight: "bold",
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
  logo: {
    width: "50%",
    height: 120,
    alignSelf: "center",
    marginBottom:10,
    marginTop:10,
  },
});

export default RegisterScreen;
