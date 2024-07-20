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
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const companyId = await AsyncStorage.getItem('company_id');
        const response = await axios.get(
          "http://beejobs.io.vn:14307/api/jobs/getJobsByIdCompany/" + companyId
        );
        setJobs(response.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu Jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);


  const handlecheckactive = async () => {
    const companyId = await AsyncStorage.getItem('company_id');
      if (companyId) {
        const response = await axios.get(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`);
        if(!response.data.data.active){
          Alert.alert(
            'Thông báo',
            'Doanh nghiệp của bạn chưa được phê duyệt, vui lòng thử lại sau.',
            [
              {
                text: 'OK',
              },
            ],
            { cancelable: false }
          );
          return;
        }else{
          router.push("AddNewJobs");
        }
      }
  };

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

  const handleEdit = async () => {
    const { title, desc, form, number_of_recruitments, requirements, salary, benefits, location, deadline } = selectedJob;
    
    const newErrors = {};
    if (!title) newErrors.title = "Hãy nhập tiêu đề";
    if (!desc) newErrors.desc = "Hãy nhập mô tả";
    if (!form) newErrors.form = "Hãy nhập hình thức";
    if (!number_of_recruitments) newErrors.number_of_recruitments = "Hãy nhập sô lượng";
    if (!requirements) newErrors.requirements = "Hãy nhập yêu cầu";
    if (!salary) newErrors.salary = "Hãy nhập lương";
    if (!benefits) newErrors.benefits = "Hãy nhập lợi ích";
    if (!location) newErrors.location = "Hãy nhập vị trí";
    if (!deadline) newErrors.deadline = "Hãy nhập hạn hồ sơ";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }



    try {

      const companyId = await AsyncStorage.getItem('company_id');
      const response = await axios.put(
        `http://beejobs.io.vn:14307/api/jobs/edit/${companyId}/${selectedJob._id}`,
        selectedJob
      );

      if (response.status === 200) {
        setJobs(jobs.map(job => job._id === selectedJob._id ? selectedJob : job));
        setModalVisible(false);
      } else {
        console.error("Error updating job", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật công việc", err);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Xác nhận xóa công việc",
      "Bạn có chắc chắn muốn xóa công việc này?",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Xóa công việc đã hủy"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => handleDelete(), 
        },
      ],
      { cancelable: false }
    );
  };

  const handleDelete = async () => {
    try {
      const companyId = await AsyncStorage.getItem('company_id');
      await axios.delete(
        `http://beejobs.io.vn:14307/api/jobs/delete/${companyId}/${selectedJob._id}`
      );
      setJobs(jobs.filter((job) => job._id !== selectedJob._id));
    } catch (err) {
      console.error("Lỗi khi xóa công việc", err);
    } finally {
      setModalVisible(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(Platform.OS === 'ios');
    setDate(currentDate);
    setSelectedJob({ ...selectedJob, deadline: currentDate.toISOString().split('T')[0] });
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
        onPress={handlecheckactive}
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
              <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                ref={scrollViewRef}
                onContentSizeChange={scrollToEnd}
              >
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Tiêu đề</Text>
                  <TextInput
                    style={[styles.modalTextInput, errors.title && styles.inputError]}
                    value={selectedJob.title}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, title: text })
                    }
                  />
                    {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Mô tả</Text>
                  <TextInput
                   style={[styles.modalTextInput, errors.desc && styles.inputError]}
                    value={selectedJob.desc}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, desc: text })
                    }
                  />
                  {errors.desc && <Text style={styles.errorText}>{errors.desc}</Text>}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Hình thức</Text>
                  <TextInput
                    style={[styles.modalTextInput, errors.form && styles.inputError]}
                    value={selectedJob.form}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, form: text })
                    }
                  />
                   {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Số lượng tuyển dụng</Text>
                  <TextInput
                     style={[styles.modalTextInput, errors.number_of_recruitments && styles.inputError]}
                    value={selectedJob.number_of_recruitments}
                    onChangeText={(text) =>
                      setSelectedJob({
                        ...selectedJob,
                        number_of_recruitments: text,
                      })
                    }
                  />
                  {errors.number_of_recruitments && <Text style={styles.errorText}>{errors.number_of_recruitments}</Text>}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Yêu cầu</Text>
                  <TextInput
                   style={[styles.modalTextInput, errors.requirements && styles.inputError]}
                    value={selectedJob.requirements}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, requirements: text })
                    }
                  />
                  {errors.requirements && <Text style={styles.errorText}>{errors.requirements}</Text>}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Lương</Text>
                  <TextInput
                     style={[styles.modalTextInput, errors.salary && styles.inputError]}
                    value={selectedJob.salary}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, salary: text })
                    }
                  />
                   {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Những lợi ích</Text>
                  <TextInput
                      style={[styles.modalTextInput, errors.benefits && styles.inputError]}
                    value={selectedJob.benefits}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, benefits: text })
                    }
                  />
                  {errors.benefits && <Text style={styles.errorText}>{errors.benefits}</Text>}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Vị trí</Text>
                  <TextInput
                    style={[styles.modalTextInput, errors.location && styles.inputError]}
                    value={selectedJob.location}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, location: text })
                    }
                  />
                  {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Hạn nộp hồ sơ</Text>
                  <TouchableOpacity onPress={showDatePicker}>
                    <Text  style={[styles.modalTextInput, errors.deadline && styles.inputError]}>
                      {selectedJob.deadline}
                    </Text>
                  </TouchableOpacity>
                  {errors.deadline && <Text style={styles.errorText}>{errors.deadline}</Text>}
                  {isDatePickerVisible && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={handleConfirm}
                      minimumDate={new Date()}
                    />
                  )}
                </View>
              </ScrollView>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonClose]}
                  onPress={confirmDelete}
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
  }, inputError: {
    borderColor: 'red',
  }, errorText: {
    color: 'red',
    marginLeft: 10,
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
  },
  title: {
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    flex: 1,
    borderRadius: 20,
    width: '90%',
  },
  scrollViewContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  inputRow: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTextInput: {
    flex: 2,
    marginLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    height: 50,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 5,
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "30%",
    backgroundColor: "#2196F3",
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







