import React, { useState, useRef, useEffect  } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import axios, { AxiosResponse } from "axios";
import { useRouter, useLocalSearchParams } from 'expo-router';

const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const router = useRouter();
  const params = useLocalSearchParams();

  const [countdown, setCountdown] = useState(300);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); 
  const email = params.email;
  const type = "signUp"

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);
    setIntervalId(id); 

    return () => clearInterval(id); 
  }, []);

  
  useEffect(() => {
    if (countdown === 0) {
      if (intervalId) {
        clearInterval(intervalId);
      }
      Alert.alert('Hết thời gian', 'Vui lòng đăng ký lại để nhận OTP mới.');
      router.push("RegisterScreen"); // Redirect to registration screen
    }
  }, [countdown, intervalId, router]);

  const handleChange = (value: string, index: number) => {
    if (value.length > 1) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (value: string, index: number) => {
    if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      try {
        const response = await axios.post('http://beejobs.io.vn:14307/api/usersverifyotp', {
          email: email,
          otp: otpValue,
          type: type
        });

        if (response.data.status === 200) {
          Alert.alert('Xác thực thành công', response.data.msg);
          if (intervalId) {
            clearInterval(intervalId);
          }
          router.push("LoginScreen")
        } else {
          Alert.alert('Error', response.data.msg);
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while verifying the OTP');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 6-character OTP');
    }
  }

   // Format countdown timer to mm:ss
   const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận OTP</Text>
      <Text style={styles.countdownText}>Hết hạn sau: {formatTime(countdown)}</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="default"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={({ nativeEvent }) =>
              nativeEvent.key === 'Backspace' ? handleBackspace(digit, index) : null
            }
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Xác nhận OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  countdownText: {
    fontSize: 20,
    fontWeight: 'bold',
    color:"red",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OtpScreen;
