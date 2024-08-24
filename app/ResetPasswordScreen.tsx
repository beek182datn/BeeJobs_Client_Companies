import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios, { AxiosResponse } from "axios";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user_id = params.user_id;

  console.log('user_id: ' + user_id);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const NewPassRef = useRef<TextInput>(null);
  const ConfirmNewPassRef = useRef<TextInput>(null);

  useEffect(() => {
    const backAction = () => {
      router.replace("FogotPassScreen");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://beejobs.io.vn:14307/user/${user_id}`
        );
        const userData = response.data.user;
        console.log(userData);
        if (userData && userData.email) {
          setEmail(userData.email);
        } else {
          console.error("Email not found in user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user_id]);

  const handleSave = async () => {
    if (newPassword.trim() === "" || confirmNewPassword.trim() === "" ) {
        Alert.alert("Lỗi", "Hãy nhập đầy đủ thông tin");
        return;
      }
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp");
      NewPassRef.current?.focus();
      return;
    }

    const url = `http://beejobs.io.vn:14307/api/changepass`;

    try {
      const response = await axios.post(url, {
        IdUser: user_id,
        newPass: newPassword
      });

      if (response.data.status === 200) {
        Alert.alert("Thông báo", "Đổi mật khẩu thành công");
        router.replace("/LoginScreen");
      } else {
        Alert.alert("Lỗi", "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <Icon name="arrow-left" size={20} color="#000" onPress={router.back} /> */}
        <TouchableOpacity
          onPress={router.back}
          style={{ backgroundColor: "#2196F3", borderRadius: 30, padding: 5 }}
        >
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lại mật khẩu</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Email đăng nhập</Text>
        <TextInput
          style={styles.inputemail}
          value={String(email)}
          editable={false}
        />
        <Text style={styles.label}>Mật khẩu mới</Text>
        <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          ref={NewPassRef}
          style={styles.input}
          placeholder="Mật khẩu 6 - 10 ký tự"
          secureTextEntry={!showPassword}
          value={newPassword}
          onChangeText={setNewPassword}
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

        <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
        <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          ref={ConfirmNewPassRef}
          style={styles.input}
          placeholder="Nhập lại mật khẩu mới"
          secureTextEntry={!showPassword}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonCancel} onPress={router.back}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  inputemail: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    color: "black",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonCancel: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ccc",
    borderRadius: 4,
    marginRight: 8,
  },
  buttonSave: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
  icon: {
    marginRight: 10,
  },
});

export default ResetPasswordScreen;