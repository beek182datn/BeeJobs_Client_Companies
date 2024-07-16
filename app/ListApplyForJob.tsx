import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ListApplyForJob = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const jobId = "6689f2f5bea188d1509e4820";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://beejobs.io.vn:14307/api/applyJobs/getApylyJobsByIdJob/${jobId}`);
        setApplications(response.data.data);
        console.log(response.data.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleViewProfile = (cv) => {
    // Logic to navigate to worker's profile or view their details
    console.log(`View profile of worker ${cv}`);
  };

  const handleRateWorker = (workerId) => {
    // Logic to navigate to rating screen or perform rating action
    console.log(`Rate worker ${workerId}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.workerName}>Tên ứng viên: {item.worker_name}</Text>
      <Text style={styles.phone}>Số điện thoại: {item.phone}</Text>
      <Text style={styles.status}>Trạng thái: {item.status}</Text>
      <Text style={styles.appliedAt}>Ứng tuyển lúc: {new Date(item.applied_at).toLocaleDateString()}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1} onPress={() => handleViewProfile("http://beejobs.io.vn:14307"+item.cv)}>
          <Text style={styles.buttonText}>Xem hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleRateWorker(item.worker_id)}>
          <Text style={styles.buttonText}>Đánh giá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={applications}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    marginTop: 20,
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
  status: {
    fontSize: 14,
    color: 'gray',
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
});

export default ListApplyForJob;
