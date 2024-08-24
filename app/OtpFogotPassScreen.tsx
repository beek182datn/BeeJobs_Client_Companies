import React, { useState, useRef,useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
const OtpFogotPassScreen: React.FC = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  // Khai báo kiểu rõ ràng cho inputRefs
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email;
  const type = "FogotPassword";

  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);
    setIntervalId(id); 

    return () => clearInterval(id); 
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      try {
        const response = await axios.post(
          "http://beejobs.io.vn:14307/api/usersverifyotp",
          {
            email: email,
            otp: otpValue,
            type: type,
          }
        );

        if (response.data.status === 200) {
          Alert.alert("Xác thực thành công", response.data.msg);
          if (intervalId) {
            clearInterval(intervalId);
          }
          const user_id = response.data.id_User;
          router.push({
            pathname: "ResetPasswordScreen",
            params: { user_id: user_id },
          });
          //console.log( 'IDID: ' + user_id);
        } else {
          Alert.alert("Error", response.data.msg);
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while verifying the OTP");
      }
    } else {
      Alert.alert("Error", "Please enter a valid 6-character OTP");
    }
  };

  const handleChangeOtp = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text) {
      // Move to next input if current input is not empty and it's not the last input
      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // Move to previous input if current input is empty and it's not the first input
      // if (index > 0) {
      //   inputRefs.current[index - 1]?.focus();
      // }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      // Move to previous input if Backspace is pressed and current input is empty
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác minh OTP</Text>
      <Text style={styles.countdownText}>Hết hạn sau: {formatTime(countdown)}</Text>
      <Text style={styles.instruction}>
        Nhập mã OTP gồm 6 ký tự mà chúng tôi đã gửi đến email của bạn.
      </Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleChangeOtp(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Xác minh</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("FogotPassScreen")}
      >
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
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
  otpContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 5,
    width: 45,
    height: 50,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#f9f9f9",
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
  countdownText: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: 'bold',
    color:"red",
    marginBottom: 20,
  },
});

export default OtpFogotPassScreen;