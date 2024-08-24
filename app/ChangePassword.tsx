import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    const userId = await AsyncStorage.getItem('idUser');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường");
      return;
    }
    if(newPassword.length < 6 || newPassword.length > 10){
      Alert.alert("Thông báo!", "Mật khẩu mới phải dài từ 6 đến 10 ký tự.");
      return;
    }
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
      } else {
        Alert.alert("Lỗi", "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleCancel = () => {
    router.replace("Profile");
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
      <Text style={styles.description}>Vui lòng nhập mật khẩu hiện tại của bạn và mật khẩu mới để thay đổi mật khẩu.</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock-open-outline" size={24} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu hiện tại"
          placeholderTextColor="#555"
          value={currentPassword}
          onChangeText={setCurrentPassword}
      
        />

      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={24} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          placeholderTextColor="#555"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
          <Icon name={showNewPassword ? "eye-off-outline" : "eye-outline"} size={24} style={styles.iconToggle} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={24} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu mới"
          placeholderTextColor="#555"
          secureTextEntry={!showConfirmNewPassword}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          
        />
        <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
          <Icon name={showConfirmNewPassword ? "eye-off-outline" : "eye-outline"} size={24} style={styles.iconToggle} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
    color: '#007bff',
  },
  iconToggle: {
    color: '#007bff',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    color: "#00008B"
    
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSave: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonCancel: {
    backgroundColor: '#FF6A6A',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

