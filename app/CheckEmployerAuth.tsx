import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckEmployerAuth = () => {
  const router = useRouter();

  const handleConfirm = () => {
    // Chuyển người dùng đến trang tải lên giấy tờ
    router.push('/EmployerAuth');
  };

  const handleExit = async () => {
    // Xóa hết dữ liệu trong AsyncStorage
    try {
      await AsyncStorage.clear();
      router.push('/LoginScreen');
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/images/BeeJobs_logo.jpg')} />
      <Text style={styles.message}>Hãy hoàn thiện hồ sơ để trở thành nhà tuyển dụng</Text>
      <TouchableOpacity style={styles.buttonConfirm} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonExit} onPress={handleExit}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    alignSelf: "center",
    width: "80%",
    height: 250,
  },
  message: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  buttonConfirm: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginBottom: 20,
  },
  buttonExit: {
    backgroundColor: '#ff3b30',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckEmployerAuth;
