import React, { useEffect, useState , useCallback} from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const ListJobsRemoved = () => {
  const [jobsRemoved, setJobsRemoved] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  const router = useRouter();


  const fetchJobs = async () => {
    try {
      const companyId = await AsyncStorage.getItem("company_id");
      const response = await axios.get(
        "http://beejobs.io.vn:14307/api/jobs/getJobsInctiveByIdCompany/" + companyId
      );
      setJobsRemoved(response.data.data);
      setFilteredJobs(response.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu Jobs", err);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );


  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filteredData = jobsRemoved.filter((job) =>
        job.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJobs(filteredData);
    } else {
      setFilteredJobs(jobsRemoved);
    }
  };
  const handleDetail = (item) => {
    router.push({
      pathname: "DetailsJobRemoved",
      params: { data: JSON.stringify(item) },
    });
  };

  const renderJobItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity >
        <View style={styles.itemContent}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
          <Ionicons name="alarm" size={18} color="#ff6400" />
            <View style={styles.detailText}>
              <Text style={styles.labelText}>Hạn nộp hồ sơ: </Text>
              <Text style={styles.formText}>{item.deadline}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
          <Ionicons name="card" size={18} color="#008000" />
            <View style={styles.detailText}>
              <Text style={styles.labelText}>Lương: </Text>
              <Text style={styles.formText}>{item.salary}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
          <Ionicons name="layers" size={18} color="#0099CC" />
            <View style={styles.detailText}>
              <Text style={styles.labelText}>Hình thức: </Text>
              <Text style={styles.formText}>{item.form}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
          <Ionicons name="timer" size={18} color="#e12828" />
            <View style={styles.detailText}>
              <Text style={styles.labelText}>Hạn đăng tuyển: </Text>
              <Text style={styles.formText}> {`${new Date(item.expires_at).toLocaleDateString()} ${new Date(item.expires_at).toLocaleTimeString()}`}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
          <Ionicons name="checkmark-done-circle" size={18} color="#ff6400" />
            <View style={styles.detailText}>
              <Text style={styles.labelText}>Trạng thái: </Text>
              <Text style={styles.formText}>{item.status === "INACTIVE" ? "Đã gỡ" : "Null"}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => handleDetail(item)}
        >
          <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm công việc..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "column",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  itemDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 5,
    paddingTop: 5,
    flexWrap: "wrap",
  },
  icon: {
    marginRight: 10,
  },
  detailText: {
    flexDirection: "row",
    fontSize: 14,
    color: "#333",
    marginLeft: 7,
    fontWeight: "bold",
  },
  labelText: {
    color: "#999",
  },
  formText: {
    marginLeft:10,
    fontWeight: "bold",
    color: "#000",
  },
  viewDetailsButton: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  viewDetailsText: {
    color: "#1e90ff",
    fontSize: 14,
  },
});

export default ListJobsRemoved;
