import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

interface ApplyJob {
  _id: string;
  fullname: string;
  phone_number: string;
  intro_letter: string;
  status: string;
}

interface Job {
  _id: string;
  title: string;
  majors: string;
  number_of_recruitments: string;
  deadline: string;
}

const ListSuitableApplyJob = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [applyJobs, setApplyJobs] = useState<{ [key: string]: ApplyJob[] }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      const companyId = await AsyncStorage.getItem('company_id');
      try {
        const response = await axios.get(
          `http://beejobs.io.vn:14307/api/jobs/getJobsWithSuitableApplications/${companyId}`
        );
        setJobs(response.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDetail = (item) => {
    router.push({
      pathname: 'Details',
      params: { data: JSON.stringify(item) },
    });
  };
    const handleWorker = (_id)=> {
      router.push({
          pathname: 'ViewProfileWorker',
          params: {profileID:_id}
      });
    };

  const toggleExpand = async (jobId: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null); // Thu gọn lại nếu đã mở
    } else {
      setExpandedJobId(jobId);

      // Kiểm tra xem danh sách applyJobs của jobId này đã được tải chưa
      if (!applyJobs[jobId]) {
        try {
          const response = await axios.get(
            `http://beejobs.io.vn:14307/api/applyJobs/getApplyJobsDoneByJobId/${jobId}`
          );
          setApplyJobs((prev) => ({
            ...prev,
            [jobId]: response.data.data
          }));
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu applyJobs:', error.message);
        }
      }
    }
  };

  const renderItem = ({ item }: { item: Job }) => (
    <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => {handleDetail(item)}}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.jobItem}>
          <Ionicons name="briefcase" size={18} color="#5BBD2B" />
          <Text style={styles.label}>Chuyên ngành:</Text>
          <Text style={styles.value}>{item.majors}</Text>
        </View>
        <View style={styles.jobItem}>
          <Ionicons name="people" size={18} color="#1e90ff" />
          <Text style={styles.label}>Số lượng tuyển:</Text>
          <Text style={styles.value}>{item.number_of_recruitments}</Text>
        </View>
        <View style={styles.jobItem}>
          <Ionicons name="calendar" size={18} color="#e12828" />
          <Text style={styles.label}>Hạn nộp hồ sơ:</Text>
          <Text style={styles.value}>{item.deadline}</Text>
        </View>
        </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleExpand(item._id)}>
        <Text style={styles.expandText}>Danh sách hồ sơ</Text>
      </TouchableOpacity>

      {expandedJobId === item._id && (
        <View style={styles.applyList}>
          {applyJobs[item._id] ? (
            applyJobs[item._id].map((applyJob) => (
              <View key={applyJob._id} style={styles.applyJobContainer}>
                <TouchableOpacity onPress={() => {handleWorker(applyJob._id)}}>
                <View style={styles.applyItem}>
                    <Ionicons name="person" size={16} color="#1e90ff" />
                    <Text style={styles.applylabel}>Họ tên:</Text>
                    <Text style={styles.applyvalue}>{applyJob.fullname}</Text>
                </View>
                <View style={styles.applyItem}>
                    <Ionicons name="call" size={16} color="#5BBD2B" />
                    <Text style={styles.applylabel}>Số điện thoại:</Text>
                    <Text style={styles.applyvalue}>{applyJob.phone_number}</Text>
                </View>
                <View style={styles.applyItem}>
                    <Ionicons name="checkmark-done-circle" size={16} color="#ff6400" />
                    <Text style={styles.applylabel}>Trạng thái:</Text>
                    <Text style={styles.applystatus}>{applyJob.status}</Text>
                </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>Đang tải danh sách hồ sơ...</Text>
          )}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View>
    <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.title1}>Tin đã có hồ sơ trúng tuyển</Text>
            </View>
      </View>
    <FlatList
      data={jobs}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.listContainer}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical:10,
    backgroundColor: '#eef',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expandText: {
    alignSelf:"flex-end",
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyList: {
    marginTop: 8,
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 8,
    maxHeight: 200,
  },
  applyJobContainer: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  jobItem: {
    marginTop:3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor:"#ddd",
  },
  label: {
    marginHorizontal:7,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10,
    fontWeight:"bold",
  },
  applyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor:"#ddd",
  },
  applylabel: {
    marginHorizontal:7,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  applyvalue: {
    fontSize: 12,
    color: 'black',
    marginLeft: 10,
    fontWeight:"bold",
  },
  applystatus:{
    fontSize: 12,
    color: "#5BBD2B",
    marginLeft: 10,
    fontWeight:"bold",
  },
  headerContainer: {
    paddingTop:40,
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
  title1: {
    marginLeft:20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ListSuitableApplyJob;
