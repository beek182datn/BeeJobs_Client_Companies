import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Jobs() {
  const id_Company = "66618678d2005e278ba2cb95";
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://beejobs.io.vn:14307/api/jobs/getJobsByIdCompany/" + id_Company
        );
        setJobs(response.data.data);
      } catch (err) {
        console.error("Lỗi khi lây dữ liệu Jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDetail = (item) => {
    router.push({
      pathname: "Details",
      params: { data: JSON.stringify(item) },
    });
  };

  const handleItemPress = (item) => {
    setSelectedJob(item);
    setModalVisible(true);
  };

  const handleEdit = () => {
    setModalVisible(false);
    // Cập nhật công việc (thực hiện yêu cầu chỉnh sửa ở đây)
    // ...
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://beejobs.io.vn:14307/api/jobs/deleteJobById/${selectedJob._id}`
      );
      setJobs(jobs.filter((job) => job._id !== selectedJob._id));
    } catch (err) {
      console.error("Lỗi khi xóa công việc", err);
    } finally {
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <Text style={styles.title}>Title: {item.title}</Text>
        <Text>Form: {item.form}</Text>
        <Text>Deadline: {item.deadline}</Text>
        <Text>Salary: {item.salary}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDetail(item)}>
        <Text style={styles.viewDetails}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  const removeVietNameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  const searchJobs = (text) => {
    const formattedSearch = removeVietNameseTones(text.trim());
    return jobs.filter((job) => {
      const formattedTitle = removeVietNameseTones(job.title.trim());
      return formattedTitle.includes(formattedSearch);
    });
  };

  const filteredJobs = search ? searchJobs(search) : jobs;

  const scrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search jobs..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#A9A9A9"
      />
      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => router.push("AddNewJobs")}
      >
        <Text style={styles.textButton}>Add New Job</Text>
      </TouchableOpacity>

      {selectedJob && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                ref={scrollViewRef}
                onContentSizeChange={scrollToEnd}
              > */}
                <TextInput
                  style={styles.modalTextInput}
                  value={selectedJob.title}
                  onChangeText={(text) =>
                    setSelectedJob({ ...selectedJob, title: text })
                  }
                />
                <TextInput
                  style={styles.modalTextInput}
                  value={selectedJob.desc}
                  onChangeText={(text) =>
                    setSelectedJob({ ...selectedJob, desc: text })
                  }
                />
                <TextInput
                  style={styles.modalTextInput}
                  value={selectedJob.form}
                  onChangeText={(text) =>
                    setSelectedJob({ ...selectedJob, form: text })
                  }
                />
                <TextInput
                  style={styles.modalTextInput}
                  value={selectedJob.number_of_recruitments}
                  onChangeText={(text) =>
                    setSelectedJob({
                      ...selectedJob,
                      number_of_recruitments: text,
                    })
                  }
                />
                <TextInput
                  style={styles.modalTextInput}
                  value={selectedJob.requirements}
                  onChangeText={(text) =>
                    setSelectedJob({ ...selectedJob, requirements: text })
                  }
                />
                <TextInput
                  style={styles.modalTextInput}
                  value={selectedJob.salary}
                  onChangeText={(text) =>
                    setSelectedJob({ ...selectedJob, salary: text })
                  }
                />
                <TextInput
                  style={styles.modalTextInput}
                  value={selectedJob.benefits}
                  onChangeText={(text) =>
                    setSelectedJob({ ...selectedJob, benefits: text })
                  }
                />
                <TextInput
                  style={styles.modalTextInput}
                  value={selectedJob.location}
                  onChangeText={(text) =>
                    setSelectedJob({ ...selectedJob, location: text })
                  }
                />
                <View style={styles.text}>
                <TextInput
                  style={styles.modalTextInput}
                  value={selectedJob.deadline}
                  onChangeText={(text) =>
                    setSelectedJob({ ...selectedJob, deadline: text })
                  }
                />
                </View>
             
            {/* </ScrollView> */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonClose]}
                  onPress={handleDelete}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleEdit}
                >
                  <Text style={styles.modalButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },text: {
    width: "70%"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    paddingLeft: 10,
  },
  list: {
    flexGrow: 1,
  },
  itemContainer: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignSelf: "stretch",
    width: "93%",
  },  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  viewDetails: {
    color: "#0099FF",
    marginTop: 10,
    
  },
  buttonContainer: {
    backgroundColor: "#0099FF",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
  },
  centeredView: {
        flex: 1,
        backgroundColor: '#DDDDDD',
        opacity: 0.9,
        padding: 20,
        marginTop: 50,
        

  },
  modalView: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    flex: 1,
  
    borderRadius: 20
  },
  scrollViewContent: {
    alignItems: "center",
    paddingBottom: 20, 
  },
  modalTextInput: {
    width: '100%',
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 5,
   borderWidth: 1,
   padding: 5,
    height: 40
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 40,
    
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "30%",
  },
  modalButtonClose: {
    backgroundColor: "#FF6347",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

