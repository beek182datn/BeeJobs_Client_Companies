import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotifiScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchNotifications = async () => {
    const companyId = await AsyncStorage.getItem('company_id');
    try {
      const response = await axios.get(`http://beejobs.io.vn:14307/api/notifi/getNotifiByCompanyId/${companyId}`);
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotifi = async (id) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa thông báo này!",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
               await axios.delete(`http://beejobs.io.vn:14307/delete/${id}`);
               fetchNotifications();
            } catch (error) {
              console.error("Lỗi khi xóa", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleReadNotifi = async (isRead, notification_id, job_id) => {
    if(isRead){
      router.push({
        pathname: 'ListApplyForJob',
        params: { jobId: job_id },
      }); 
    }else{
      try {
        console.log("ID notifi: "+notification_id);
        const response = await axios.post('http://beejobs.io.vn:14307/api/notifi/updateIsRead', {
          notification_id: notification_id,
        });
        console.log(response.data.message);
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
      fetchNotifications();
      router.push({
        pathname: 'ListApplyForJob',
        params: { jobId: job_id },
      });
  
    };
    }
    
    
    


  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotification = ({ item }) => {
    const notificationStyle = item.isRead
      ? styles.readNotificationItem
      : styles.unreadNotificationItem;

    return (
      <TouchableOpacity onPress={() => handleReadNotifi(item.isRead, item._id, item.job_id)}
      onLongPress={() => handleDeleteNotifi(item._id)}
      >
      <View style={notificationStyle}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.content}>
        <Image
          source={require('../assets/images/notification.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Bạn chưa có thông báo nào</Text>
        <Text style={styles.description}>
          Đừng lo, chúng tôi sẽ thông báo ngay khi có tin mới cho bạn.
          Hãy khám phá tính năng khác hoặc kiểm tra lại sau.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotification}
      keyExtractor={(item) => item._id}
    />
  );
};

export default NotifiScreen;

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  unreadNotificationItem: {
    marginTop:5,
    backgroundColor: '#b0c4de', // Màu nền cho thông báo chưa đọc
    padding: 15,
    marginBottom: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginRight: 10,
    marginLeft: 10,
  },
  readNotificationItem: {
    marginTop:5,
    backgroundColor: '#fff', // Màu nền cho thông báo đã đọc
    padding: 15,
    marginBottom: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginRight: 10,
    marginLeft: 10,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333',
  },
  notificationTime: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
