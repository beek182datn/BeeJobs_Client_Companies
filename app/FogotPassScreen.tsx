import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import AlertComponent from "@/components/AlertComponent";

const ForgotPassScreen = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showMissingInfoAlert, setShowMissingInfoAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (email.trim() === "") {
      alert("Xin vui lòng điền email của bạn.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Email không hợp lệ");
      setColor("red");
      setShowMissingInfoAlert(true);
      return;
    }

    try {
      setLoading(true);
      const response: AxiosResponse = await axios.post(
        "http://beejobs.io.vn:14307/api/forgottpass2",
        {
          email: email,
        }
      );
      if (response.data.status === 200) {
        console.log("Yêu cầu đặt lại mật khẩu thành công:", response.data);
        Alert.alert(
          "Thông báo", // Tiêu đề
          "Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.", // Nội dung
          [{ text: "OK" }] // Nút bấm
        );
        //setEmail("");
        router.push({
          pathname: "OtpFogotPassScreen",
          params: { email: email },
        });
      } else if (response.data.status === 404) {
        setMessage("Email chưa đăng ký!");
        setColor("red");
        setShowMissingInfoAlert(true);
        return;
      } else {
        setMessage("Đã xảy ra lỗi!");
        setColor("red");
        setShowMissingInfoAlert(true);
        return;
      }
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      alert(
        "Đã xảy ra lỗi trong quá trình đặt lại mật khẩu. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const navigateToLogin = () => {
    router.push("LoginScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.instruction}>
        Nhập email hoặc số điện thoại của bạn và chúng tôi sẽ gửi hướng dẫn để
        đặt lại mật khẩu.
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email hoặc số điện thoại"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Gửi yêu cầu</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
        <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
      <AlertComponent
        color={color}
        message={message}
        visible={showMissingInfoAlert}
        onClose={() => setShowMissingInfoAlert(false)}
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
  instruction: {
    fontSize: 16,
    color: "#A9A9A9",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  input: {
    padding: 10,
    fontSize: 16,
    color: "#000",
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
  backButton: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    borderColor: "#007BFF",
    borderWidth: 1,
  },
  backButtonText: {
    color: "#007BFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ForgotPassScreen;