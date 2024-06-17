import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
  //an hien mat khau
  const [showPassword, setShowPassword] = useState(false);
  // su dung cho hop thoai canh bao
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const router = useRouter();


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
      passwd.trim() === ""
    ) {
      setMessage('Hãy nhập đầy đủ thông tin')
      setColor('red');
      setShowAlert(true);
      return;
    }

    if (!isValidEmail(email)) {
      setMessage('Email không hợp lệ')
      setColor('red');
      setShowAlert(true);
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
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setMessage('Lỗi khi đăng ký');
      setShowAlert(true);
      setColor('red');
      clear();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tài khoản"
          value={accout_name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={passwd}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
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
          onPress={() => router.push("LoginScreen")}
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
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
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
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
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
});

export default RegisterScreen;
