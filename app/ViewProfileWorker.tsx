import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal, SafeAreaView, Dimensions,ScrollView, Linking } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const ViewProfileWorker = () => {
 
  const { profileID } = useLocalSearchParams(); 
  const [storedProfileID, setStoredProfileID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    _id: '',
    fullname: '',
    phone_number: '',
    status: '',
    applied_at: '',
    intro_letter: '',
    worker_id:'',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [applyJobId, setApplyJobId] = useState(null);
  const [cv, setCv] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyId, setCompanyId] = useState<string | null>("");
  const router = useRouter();
  
  
  const handleRateWorker = (_id) => {
    setApplyJobId(_id);
    setModalVisible(true);
  };

  const handleCall = () => {
    if (phoneNumber) {
      const call = `tel:${phoneNumber.replace(/\s+/g, '')}`;
      Linking.openURL(call).catch(console.error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã xem':
        return styles.statusReviewed;
      case 'Phù hợp':
        return styles.statusSuitable;
      case 'Chưa phù hợp':
        return styles.statusNotSuitable;
      case 'Pending':
        return styles.statusPending;
      default:
        return styles.statusValue; 
    }
  };

  const handleOptionSelect = async (option) => {
    setModalVisible(false);
    if (option === 'Cancel') return;

    try {
      const response = await axios.put(`http://beejobs.io.vn:14307/api/applyJobs/editApplyJobStatus/${applyJobId}`, {
        status: option,
      });
      if (response.status === 200) {
        Alert.alert('Thông báo', 'Đánh giá thành công');
        fetchProfile();
      }
    } catch (error) {
      console.error('Error rating worker:', error);
      Alert.alert('Lỗi', 'Không thể đánh giá ứng viên');
    }
  };

  const handleChatLive = async () => {
    const companyId = await AsyncStorage.getItem('company_id');
      setCompanyId(companyId);
    try {
      // Gửi yêu cầu tạo ChatRoom mới đến API
      const response = await axios.post('http://beejobs.io.vn:14307/api/chat/createChatRoom', {
        companyID : companyId,
        userID : profile.worker_id,
      });

      if (response.status === 200 || response.status === 201) {
        const newChatRoom = response.data.data;
      console.log(newChatRoom);
      
  
      // Điều hướng đến ChatLiveScreen với ID_ChatRoom
      router.push({ pathname: 'ChatLiveScreen', params: { ID_ChatRoom: newChatRoom._id, worker_Name: profile.fullname } });
      }
      
    } catch (error) {
      console.error('Lỗi khi tạo phòng chat:', error);
    }
  };

  const openPdfInBrowser1 = async () => {
    setLoading(true);
    try {
        const url = `http://beejobs.io.vn:14307${cv}`;
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Không thể mở URL", "Trình duyệt không hỗ trợ URL này.");
        }
    } catch (err) {
        console.error('Error details:', err);
        Alert.alert("Lỗi", "Không thể mở file PDF.");
    } finally {
        setLoading(false);
    }
};


useEffect(() => {
  const initializeProfileID = async () => {
    let profileIDValue: string | null = null;

    if (Array.isArray(profileID)) {
      profileIDValue = profileID[0] || null;
    } else {
      profileIDValue = profileID || null;
    }

    if (profileIDValue) {
      await AsyncStorage.setItem('profileID', profileIDValue);
    } else {
      profileIDValue = await AsyncStorage.getItem('profileID');
    }

    setStoredProfileID(profileIDValue);
  };

  initializeProfileID();
}, [profileID]);

const fetchProfile = useCallback(async () => {
  if (!storedProfileID) return; 

  setLoading(true);

  try {
    const response = await axios.get(`http://beejobs.io.vn:14307/api/applyJobs/getApplyJobById/${storedProfileID}`);
    setProfile(response.data.data);
    setCv(response.data.data.cv);
    setPhoneNumber(response.data.data.phone_number);
  } catch (error) {
    console.error('Error fetching applications:', error);
  } finally {
    setLoading(false);
  }
}, [storedProfileID]);

useEffect(() => {
  if (storedProfileID) {
    fetchProfile();
  }
}, [storedProfileID, fetchProfile]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Lỗi khi tải dữ liệu: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/Jobs")}>
            <Ionicons name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Chi tiết đơn ứng tuyển</Text>
            </View>
      </View>
      <View style = {styles.bodycontain}>
        <View style={styles.profileItem}>
          <Ionicons name="person" size={24} color="#1e90ff" />
          <Text style={styles.label}>Họ và tên:</Text>
          <Text style={styles.value}>{profile.fullname}</Text>
        </View>
        <View style={styles.profileItem}>
            <Ionicons name="call" size={24} color="#5BBD2B" />
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{profile.phone_number}</Text>
        </View>
      
        <View style={styles.profileItem}>
          <Ionicons name="checkmark-done-circle" size={24} color="#ff6400" />
          <Text style={styles.label}>Trạng thái:</Text>
          <Text style={[styles.statusValue, getStatusStyle(profile.status)]}>
            {profile.status}
          </Text>
        </View>
      <View style={styles.profileItem}>
      <Ionicons name="calendar" size={24} color="#e12828" />
        <Text style={styles.label}>Ngày ứng tuyển:</Text>
        <Text style={styles.value}>
          {new Date(profile.applied_at).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </Text>
      </View>

      <View style={styles.profileItemletter}>
      <Ionicons name="mail" size={24} color="#FFA500" />
        <Text style={styles.label}>Thư giới thiệu:</Text>
      </View>
      <View style={styles.lettercontain}>
        <ScrollView style={styles.scrollView}>
        <Text style={styles.letter}>{profile.intro_letter}</Text>
        </ScrollView>
        </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1} onPress={openPdfInBrowser1}>
        <Ionicons name="eye" size={20} color="white" />
          <Text style={styles.buttonText}>Xem CV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleRateWorker(profile._id)}>
        <Ionicons name="star-half" size={20} color="white" />
          <Text style={styles.buttonText}>Đánh giá</Text>
        </TouchableOpacity> 
      </View>
      <View style={styles.buttonContainer1}>
        <TouchableOpacity style={styles.button2} onPress={handleCall} >
        <Ionicons name="call" size={20} color="white" />
          <Text style={styles.buttonText}>Liên hệ ứng viên</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button3} onPress={handleChatLive}>
        <Ionicons name="chatbubble-ellipses" size={20} color="white" />
          <Text style={styles.buttonText}>Chát với ứng viên</Text>
        </TouchableOpacity> 
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chọn đánh giá</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleOptionSelect('Đã xem')}
            >
              <Text style={styles.modalButtonText}>Đã xem</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSuccess}
              onPress={() => handleOptionSelect('Phù hợp')}
            >
              <Text style={styles.modalButtonText}>Phù hợp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalFalse}
              onPress={() => handleOptionSelect('Chưa phù hợp')}
            >
              <Text style={styles.modalButtonText}>Chưa phù hợp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancle}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bodycontain:{
    margin:20,
  },
  headerContainer: {
    paddingTop:30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0099FF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 15,
    paddingBottom: 10,
    marginBottom:5,
  },
  backButton: {
    marginRight: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft:20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor:"#ddd",
  },
  profileItemletter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  label: {
    marginHorizontal:7,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    
  },
  lettercontain:{
    alignSelf:"flex-end",
    padding: 5,
    width:Dimensions.get("screen").width/1.3,
    height:100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  letter: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
    flexShrink: 1,
  },
  scrollView: {
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
    fontWeight:"bold",
  },

  statusLabel: {
    marginTop:5,
    fontSize: 14, 
  },
  statusValue: {
    marginLeft:10,
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  statusPending: {
    color: '#FFA500', 
  },
  statusReviewed: {
    color: '#0000FF', 
  },
  statusSuitable: {
    color: '#5BBD2B', 
  },
  statusNotSuitable: {
    color: '#e12828', 
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal:20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor:"#ddd",
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor:"#ddd",
  },
  button: {
    backgroundColor: '#0099FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection:"row",
  },
  button1: {
    flexDirection:"row",
    backgroundColor: '#ff6400',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  button2: {
    flexDirection:"row",
    backgroundColor: '#5BBD2B',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  button3: {
    flexDirection:"row",
    backgroundColor: '#0000FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft:5,
    color: 'white',
    fontWeight: 'bold',
    fontSize:16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#0099FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalSuccess: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#5BBD2B',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalFalse: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#e12828',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCancle: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#555555',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ViewProfileWorker;
