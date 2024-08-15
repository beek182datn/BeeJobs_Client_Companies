import { View, Text, FlatList, StyleSheet,BackHandler, ActivityIndicator, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useEffect, useState,useRef  } from 'react';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import io from 'socket.io-client';
const socket = io('http://beejobs.io.vn:14307');
import { useIsFocused } from '@react-navigation/native';

const ChatLiveScreen = () => {
    const { ID_ChatRoom } = useLocalSearchParams();
    const { worker_Name } = useLocalSearchParams();
    const [messages, setMessages] = useState<MessInfor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [companyId, setCompanyId] = useState<string | null>("");
    const flatListRef = useRef<FlatList>(null);
    const isFocused = useIsFocused();
    console.log("View ChatRoom ID: " + ID_ChatRoom);

    const router = useRouter();

    interface MessInfor {
        _id: string;
        senderId: string;
        content: string;
        createdAt: string;
        worker_name: string;
        worker_avatar: string;
      }

      useEffect(() => {
        const fetchMessages = async () => {
          const companyId = await AsyncStorage.getItem('company_id');
          setCompanyId(companyId);
          try {
            const response = await axios.get(`http://beejobs.io.vn:14307/api/chat/getMessageByChatroomId/${ID_ChatRoom}`);
            setMessages(response.data.data);
            ;
          } catch (error) {
            setError('Lỗi khi tải tin nhắn');
          } finally {
            setLoading(false);
          }
        };
        
        fetchMessages();
        
        socket.on('message', (newMessage) => {
          if (newMessage.chatRoomId === ID_ChatRoom) {
            fetchMessages();
          }
        });
    
        // Tham gia vào phòng chat khi kết nối
        socket.emit('joinRoom', ID_ChatRoom);
        return () => {
          socket.off('message');
          socket.emit('leaveRoom', ID_ChatRoom);
        };
      }, [ID_ChatRoom]);
    
      useEffect(() => {
        if (isFocused) {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      }, [isFocused, messages]);
    
      useEffect(() => {
        const backAction = () => {
          router.replace("ViewProfileWorker");
          return true;
        };
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
        return () => backHandler.remove();
      }, []);
    
      const handleSendMessage = async () => {
        if (!newMessage.trim()) {
          return;
        }
    
        try {
          const response = await axios.post('http://beejobs.io.vn:14307/api/chat/sendMessage', {
            chatRoomId: ID_ChatRoom,
            content: newMessage,
            senderId: companyId,
          });
          socket.emit('message', response.data.data);
          setNewMessage("");
        } catch (error) {
          console.error('Lỗi khi gửi tin nhắn:', error);
        }
      };
    
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
            <Text style={styles.error}>{error}</Text>
          </View>
        );
      }
    
      return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#660099" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
            <Text style={styles.nameOther}>{worker_Name}</Text>
                </View>
          </View>
    
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={[styles.messageItem, item.senderId === companyId ? styles.myMessage : styles.theirMessage]}>
                <View style={{flexDirection:"row"}}>
                {item.senderId !== companyId && (
                <Image
                  source={{ uri: "http://beejobs.io.vn:14307" + item.worker_avatar }}
                  style={styles.avatar}
                />
              )}
                <Text style={styles.messageContent}>{item.content}</Text>
                </View>
              </View>
            )}
            onContentSizeChange={() => {
              if (isFocused) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      headerContainer: {
        paddingTop:30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0FFFF',
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
      messageItem: {
        paddingVertical: 10,
        paddingRight:20,
        marginHorizontal:5,
        marginVertical: 2,
        borderRadius: 10,
        maxWidth: '70%',
      },
      myMessage: {
        paddingLeft:15,
        backgroundColor: '#87cefa',
        alignSelf: 'flex-end',
        borderRadius: 15,
        marginRight:7,
        marginBottom:5,
      },
      theirMessage: {
        paddingRight:15,
        marginLeft:7,
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
        borderRadius: 15,
        marginBottom:5,
      },
      messageContent: {
        fontSize: 16,
        flexShrink: 1,
      },
      messageTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        alignSelf: 'flex-end',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
      },
      input: {
        flex: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#f1f1f1',
        marginRight: 10,
      },
      sendButton: {
        backgroundColor: '#007BFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
      },
      sendButtonText: {
        color: '#fff',
        fontSize: 16,
      },
      error: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
      },
      avatar: {
        marginLeft:5,
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 15,
      },
      nameOther:{
        fontSize:20,
        fontWeight:"bold",
        alignSelf: 'center',
      },
    });
    
export default ChatLiveScreen