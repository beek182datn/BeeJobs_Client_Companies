import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ChatRoomInfor {
  _id: string;
  userIds: string[];
  myID: string;
  otherID: string;
  worker_avatar: string;
  worker_name: string;
  lastMessage: string;
}

const Messenger = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatRooms, setChatRooms] = useState<ChatRoomInfor[]>([]);
  const [filteredChatRooms, setFilteredChatRooms] = useState<ChatRoomInfor[]>([])
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();



  const fetchChatRooms = async () => {
    const userId = await AsyncStorage.getItem('company_id');
    try {
      const response = await axios.get(`http://beejobs.io.vn:14307/api/chat/getChatroomByUserId/${userId}`);
      setChatRooms(response.data.data);
      setFilteredChatRooms(response.data.data);
      console.log(response.data.data);
      
    } catch (error) {
      setError(error.message);
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, [])
  );
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = chatRooms.filter((room) =>
        room.worker_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChatRooms(filtered);
    } else {
      setFilteredChatRooms(chatRooms);
    }
  };

  const handleItemPress = (_id, worker_name, worker_avatar) => {
    router.push({ pathname: "ChatScreen", params: { ChatID: _id, nameOther: worker_name, avtOther: worker_avatar } });
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Lỗi khi tải dữ liệu: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
              colors={['#f0f0f0', '#87cefa']}
              style={styles.container}
              start={[0, 1]}
              end={[1, 0]}
            >
            
            
      <Text style={styles.title}>Chat với ứng viên</Text>

      <View style = {styles.searchContainer}>
      <Ionicons name="search" size={24} color="#ddd" />
      <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm ứng viên..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        </View>
      <FlatList
        data={filteredChatRooms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item._id, item.worker_name, item.worker_avatar)}>
        <View style={styles.chatRoomItem}>
          <Image
            source={{ uri: "http://beejobs.io.vn:14307"+ item.worker_avatar}}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.workerName}>{item.worker_name}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage ? item.lastMessage : 'No messages'}</Text>
          </View>
        </View>
        </TouchableOpacity>
        )}
      />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    marginTop:30,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  chatRoomItem: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 1,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  avatar: {
    marginLeft:15,
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  workerName: {
    marginLeft:20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    marginLeft:20,
    fontSize: 16,
    color: '#666',
  },
  error: {
    color: 'red',
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal:5,
    marginHorizontal:20,
  },
});

export default Messenger;
