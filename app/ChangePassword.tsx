import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    const userId = await AsyncStorage.getItem('idUser');
    console.log("mk", userId);
    if (newPassword !== confirmNewPassword) {

      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    const url = `http://beejobs.io.vn:14307/api/changepassword/${userId}`;

    try {
      const response = await axios.post(url, {
        newPassword: newPassword,
        currentPassword: currentPassword,
      });

      if (response.data.status === 200) {
        Alert.alert("Thông báo", "Đổi mật khẩu thành công");
        router.replace("Profile");
      } else if (response.data.status === 400) {
        Alert.alert("Lỗi", "Mật khẩu cũ không đúng");
        return;
      } else {
        Alert.alert("Lỗi", "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("Profile");
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đổi mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu mới"
        secureTextEntry
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
