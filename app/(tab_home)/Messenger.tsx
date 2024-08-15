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
  const [filteredChatRooms, setFilteredChatRooms] = useState<ChatRoomInfor[]>([]);
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
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, [])
  );

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredChatRooms(chatRooms);
  };

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
    router.push({ pathname: 'ChatScreen', params: { ChatID: _id, nameOther: worker_name, avtOther: worker_avatar } });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error loading data: {error}</Text>
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
        <Text style={styles.title}>Trò chuyện với ứng viên</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm ứng viên..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
        </View>

        <FlatList
          data={filteredChatRooms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item._id, item.worker_name, item.worker_avatar)}>
              <View style={styles.chatRoomItem}>
                <Image
                  source={{ uri: "http://beejobs.io.vn:14307" + item.worker_avatar }}
                  style={styles.avatar}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.workerName}>{item.worker_name}</Text>
                  <Text style={styles.lastMessage}>{item.lastMessage ? item.lastMessage : 'No messages yet'}</Text>
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  chatRoomItem: {
    flexDirection: 'row',
    padding: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  textContainer: {
    flex: 1,
    marginLeft: 17,
    justifyContent: 'center',
  },
  workerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
  
    marginLeft: 15,
    fontSize: 15,
    color: '#333',
  },
  clearButton: {
    alignSelf: "center",
    position: 'absolute',
    right: 15,
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Messenger;
