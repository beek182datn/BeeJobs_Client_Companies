import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
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
      <Text style={styles.name}>{item.worker_name}</Text>
      <Text style={styles.major}>Chuyên ngành: {item.major}</Text>
      <Text style={styles.experience}>Kinh nghiệm: {item.experience}</Text>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => handleChatLive(item.user_id, item.worker_name)}
      >
        <Text style={styles.chatButtonText}>Chat ngay</Text>
      </TouchableOpacity>
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
              <Text style={styles.jobDesc}>{job.desc}</Text>
              <Text style={styles.jobLocation}>Địa điểm: {job.location}</Text>
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
    backgroundColor: '#fff',
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
  jobDesc: {
    fontSize: 16,
    marginTop: 4,
  },
  jobLocation: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  candidateItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  major: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  experience: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  chatButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    width:"30%",
    alignSelf:"flex-end"
  },
  chatButtonText: {
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
});

export default ListSuitableCandidate;
