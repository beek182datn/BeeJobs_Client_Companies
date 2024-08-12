import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, Modal, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
const { width } = Dimensions.get('window');
const iconSize = width * 0.05;

const ApplicantItem = ({ fullname, phone_number, applied_at }) => (
  <View style={styles.applicantContainer}>
    <Text style={styles.applicantName}>{fullname}</Text>
  
    <Text style={styles.applicantDetail}>
      Số điện thoại:   <Text style={styles.applicantDate}> {phone_number}</Text>
    </Text>
    <Text style={styles.applicantDetail}>
      Ngày ứng tuyển: <Text style={styles.applicantDate}>{new Date(applied_at).toLocaleDateString()}</Text>
    </Text>
  </View>
);


const JobDetailItem = ({ item }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
  
    if (!item) {
      return null; 
    }
  
    const handleDetail = () => {
      router.push({
        pathname: 'Details',
        params: { data: JSON.stringify(item) },
      });
    };
  const handleWorker = (_id)=> {
        router.push({
            pathname: 'ViewProfileWorker',
            params: {profileID:_id}
        })
  }
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={handleDetail}>
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc} numberOfLines={1}>Mô tả công việc: {item.desc}</Text>
            <View style={styles.row}>
              <Icon name="calendar" size={iconSize} color="#DC143C" style={styles.rowIcon} />
              <Text style={styles.rowText}>Thời hạn: {item.deadline}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.subTitle}>Xem người ứng tuyển</Text>
        </TouchableOpacity>
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Danh sách ứng tuyển</Text>
              <FlatList
                data={item.applicants}
                renderItem={({ item }) => (
                <TouchableOpacity onPress={()=>handleWorker(item._id)}>                  
                  <ApplicantItem
                    fullname={item.fullname}
                    phone_number={item.phone_number}
                    applied_at={item.applied_at}
                   
                  />
                </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
                style={{ maxHeight: 300 }} 
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  

  const JobsAppliedScreen = () => {
    const [jobDetails, setJobDetails] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchJobDetails();
    }, []);
  
    const fetchJobDetails = async () => {
      const companyId = await AsyncStorage.getItem('company_id');
      try {
        const jobResponse = await axios.get(`http://beejobs.io.vn:14307/api/jobs/getDataJobsAppliedByCompanyId/${companyId}`);
        const jobs = jobResponse.data.data;
  
        const jobsWithApplicants = await Promise.all(
          jobs.map(async (job) => {
            const applicantsResponse = await axios.get(`http://beejobs.io.vn:14307/api/applyJobs/getApylyJobsByIdJob/${job._id}`);
            return { ...job, applicants: applicantsResponse.data.data };
          })
        );
  
        setJobDetails(jobsWithApplicants);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
  
    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </SafeAreaView>
      );
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={jobDetails}
          renderItem={({ item }) => (
            <JobDetailItem item={item} />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    );
  };
  

export default JobsAppliedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: width * 0.1,
  },
  itemContainer: {
    backgroundColor: '#fff',
    marginBottom: width * 0.05,
    padding: width * 0.04,
    borderRadius: width * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  item: {
    marginBottom: width * 0.03,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: width * 0.02,
  },
  desc: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: width * 0.03,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.02,
  },
  rowIcon: {
    marginRight: width * 0.02,
  },
  rowText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  subTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: width * 0.03,
  },
  applicantContainer: {
    backgroundColor: '#f9f9f9',
    padding: width * 0.02,
    borderRadius: width * 0.02,
    marginBottom: width * 0.02,
    borderColor: '#ddd',
    borderWidth: 1,
    width: 300,
  },
  applicantName: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: width * 0.01,
  },
  applicantDetail: {
    fontSize: width * 0.035,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: width * 0.04,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },applicantDate: {
     fontWeight: 'bold'
  }
});


