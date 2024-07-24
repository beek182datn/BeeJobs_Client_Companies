import React, { useEffect, useState, useCallback  } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const ListApplyForJob = () => {
  const [applicationsPending, setApplicationsPending] = useState([]);
  const [applicationsReviewed, setApplicationsReviewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [applyJobId, setApplyJobId] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: 'Chưa đánh giá' },
    { key: 'reviewed', title: 'Đã đánh giá' },
  ]);

  const [titleJob, setTitleJob] = useState("");
  const [totalApply, setTotalApply] = useState("");
  const [numberRe, setNumberRe] = useState("");

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

  const { jobId } = useLocalSearchParams();
  
  const router = useRouter();

  const fetchApplications = useCallback(async () => {
    try {

      const getInforJob = await axios.get(`http://beejobs.io.vn:14307/api/jobs/getJobById/${jobId}`);
      if(getInforJob.status === 200){
        setTitleJob(getInforJob.data.data.title);
        setNumberRe(getInforJob.data.data.number_of_recruitments);
      }

      const response = await axios.get(`http://beejobs.io.vn:14307/api/applyJobs/getApylyJobsByIdJob/${jobId}`);
      if (response.status === 200) {
        if (response.data.data.length > 0) {
          setTotalApply(response.data.data.length);
          const pendingApplications = response.data.data.filter(app => app.status === 'pending');
          const reviewedApplications = response.data.data.filter(app => app.status !== 'pending');
          setApplicationsPending(pendingApplications);
          setApplicationsReviewed(reviewedApplications);
        } else {
          setTotalApply("0");
          setApplicationsPending([]);
          setApplicationsReviewed([]);
        }
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    setLoading(true); 
    fetchApplications();
  }, [jobId, fetchApplications]);

  const handleViewProfile = (_id) => {
    console.log(`View profile of worker ${_id}`);
    router.push({ pathname: "ViewProfileWorker", params: { cvUrl: _id } });
  };

  const handleRateWorker = (_id) => {
    setApplyJobId(_id);
    setModalVisible(true);
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
        fetchApplications();
      }
    } catch (error) {
      console.error('Error rating worker:', error);
      Alert.alert('Lỗi', 'Không thể đánh giá ứng viên');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.workerName}>Tên ứng viên: {item.fullname}</Text>
      <Text style={styles.phone}>Số điện thoại: {item.phone_number}</Text>
      <View style={{ flexDirection: 'row' }}>
      <Text style={styles.statusLabel}>Trạng thái: </Text>
      <Text style={[styles.statusValue, getStatusStyle(item.status)]}>
        {item.status}
      </Text>
    </View>
      <Text style={styles.appliedAt}>Ứng tuyển lúc: {new Date(item.applied_at).toLocaleDateString()}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1} onPress={() => handleViewProfile(item._id)}>
          <Text style={styles.buttonText}>Xem hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleRateWorker(item._id)}>
          <Text style={styles.buttonText}>Đánh giá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  

  const renderScene = SceneMap({
    pending: () => (
      loading ? (
        <SafeAreaView style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </SafeAreaView>
      ) : applicationsPending.length === 0 ? (
        <View style={styles.noApplicationsContainer}>
          <Text>Chưa có hồ sơ ứng tuyển</Text>
        </View>
      ) : (
        <FlatList
          data={applicationsPending}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )
    ),
    reviewed: () => (
      loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : applicationsReviewed.length === 0 ? (
        <View style={styles.noApplicationsContainer}>
          <Text>Chưa có hồ sơ ứng tuyển</Text>
        </View>
      ) : (
        <FlatList
          data={applicationsReviewed}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )
    ),
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.containerheader}>
      <Text style={styles.titlejob}>{titleJob}</Text>
      <Text style={styles.textjob}>Số lượng tuyển: {numberRe}</Text>
      <Text style={styles.textjob}>Số hồ sơ đã ứng tuyển: {totalApply}</Text>
    </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
        style={{ flex: 1 }}
      />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  containerheader: {
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  titlejob: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    alignSelf: 'center',
  },
  textjob: {
    fontSize: 17,
    marginVertical: 3,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noApplicationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    marginTop: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 16,
  },
  statusLabel: {
    marginTop:5,
    fontSize: 14, 
  },
  statusValue: {
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
  appliedAt: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0099FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  button1: {
    backgroundColor: '#ff6400',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
  tabBar: {
    backgroundColor: '#0099FF',
    elevation: 4,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight:'bold'
  },
  tabIndicator: {
    backgroundColor: '#fff',
  },
});

export default ListApplyForJob;
