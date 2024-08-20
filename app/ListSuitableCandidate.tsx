import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Image,Linking, Dimensions } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ListSuitableCandidate = () => {
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const { job_id } = useLocalSearchParams();
  const router = useRouter();


  const handleCall = (phone_number) => {
      const call = `tel:${phone_number.replace(/\s+/g, '')}`;
      Linking.openURL(call).catch(console.error);
      
  };

  const handleChatLive = async (user_id, worker_name) => {
    const companyId = await AsyncStorage.getItem('company_id');
      
    try {
      // Gửi yêu cầu tạo ChatRoom mới đến API
      const response = await axios.post('http://beejobs.io.vn:14307/api/chat/createChatRoom', {
        companyID : companyId,
        userID : user_id,
      });

      if (response.status === 200 || response.status === 201) {
        const newChatRoom = response.data.data;
      console.log(newChatRoom);
      
  
      // Điều hướng đến ChatLiveScreen với ID_ChatRoom
      router.push({ pathname: 'ChatLiveScreen', params: { ID_ChatRoom: newChatRoom._id, worker_Name: worker_name } });
      }
      
    } catch (error) {
      console.error('Lỗi khi tạo phòng chat:', error);
    }
  };

  useEffect(() => {
    const fetchJobAndCandidates = async () => {
      try {
        // Lấy thông tin công việc
        const jobResponse = await axios.get(`http://beejobs.io.vn:14307/api/jobs/getJobById/${job_id}`);
        setJob(jobResponse.data.data);

        // Lấy danh sách ứng viên phù hợp
        const candidatesResponse = await axios.get(`http://beejobs.io.vn:14307/api/jobs/searchWorkersByJob/${job_id}`);
        setCandidates(candidatesResponse.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndCandidates();
  }, [job_id]);

  const renderItem = ({ item }) => (
    <View style={styles.candidateItem}>
      <View style={styles.chatRoomItem}>
                <Image
                  source={{ uri: "http://beejobs.io.vn:14307" + item.worker_avatar }}
                  style={styles.avatar}
                />
                <View style={styles.textContainer}>
                <Text style={styles.name}>{item.worker_name}</Text>
                <Text style={styles.major}>Chuyên ngành: {item.major}</Text>
                <Text style={styles.experience}>Kinh nghiệm: {item.experience}</Text>
                </View>
              </View>

              <View style = {{flexDirection:"row", justifyContent:"space-between"}}>
              <TouchableOpacity
               style={styles.chatButton1}
                onPress={() => handleCall(item.phone)}
              >
                <Ionicons name="call" size={18} color="white" />
                <Text style={styles.chatButtonText}>Gọi ngay</Text>
              </TouchableOpacity>

              <TouchableOpacity
               style={styles.chatButton}
                onPress={() => handleChatLive(item.user_id, item.worker_name)}
              >
                <Ionicons name="chatbubble-ellipses" size={18} color="white" />
                <Text style={styles.chatButtonText}>Chat ngay</Text>
              </TouchableOpacity>

              </View>
              
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style ={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
        <Text style={styles.titlejob}>Ứng viên phù hợp</Text>
        </View>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : (
        <>
          {job && (
            
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobMajor}>Chuyên ngành: {job.majors}</Text>
              <Text style={styles.jobexpre}>Kinh nghiệm: {job.experience}</Text>
            </View>
          )}
          {candidates.length === 0 ? (
            <Text>Hiện chưa có ứng viên phù hợp với tin tuyển dụng</Text>
          ) : (
            <FlatList
              data={candidates}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  jobInfo: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#eef',
    borderRadius: 8,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  jobMajor: {
    fontSize: 16,
    marginTop: 4,
  },
  jobexpre: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  candidateItem: {
    marginHorizontal:16,
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  major: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  experience: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  chatButton1: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#5BBD2B',
    borderRadius: 8,
    width: Dimensions.get("screen").width/3.5,
    flexDirection:"row",
  },
  chatButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    width: Dimensions.get("screen").width/3.5,
    flexDirection:"row",
  },
  chatButtonText: {
    
    marginLeft:5,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  header:{
    flexDirection:"row",
    paddingBottom:15,
    paddingHorizontal:15,
    paddingTop:30,
    backgroundColor:"#ADD8E6",

  },
  backButton: {
    marginTop: 5,
  },
  titlejob: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
    marginLeft:25,
  },
  chatRoomItem: {
    flexDirection: 'row',
    padding: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    
    
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
});

export default ListSuitableCandidate;
