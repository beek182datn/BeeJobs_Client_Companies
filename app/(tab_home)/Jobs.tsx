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
    if (!title.trim()) newErrors.title = "Hãy nhập tiêu đề";
    if (!desc.trim()) newErrors.desc = "Hãy nhập mô tả";
    if (!form.trim()) newErrors.form = "Hãy nhập hình thức";
    if (!number_of_recruitments.trim()) newErrors.number_of_recruitments = "Hãy nhập số lượng";
    if (!requirements.trim()) newErrors.requirements = "Hãy nhập yêu cầu";
    if (!salary.trim()) newErrors.salary = "Hãy nhập lương";
    if (!benefits.trim()) newErrors.benefits = "Hãy nhập lợi ích";
    if (!location.trim()) newErrors.location = "Hãy nhập vị trí";
    if (!deadline.trim()) newErrors.deadline = "Hãy nhập hạn hồ sơ";

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
        <Text style={styles.title}>Tiêu đề: {item.title}</Text>
        <Text>Hình thức: {item.form}</Text>
        <Text>Hạn nộp hồ sơ: {item.deadline}</Text>
        <Text>Lương: {item.salary}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDetail(item)}>
        <Text style={styles.viewDetails}>Xem chi tiết</Text>
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
        placeholder="Tìm kiếm công việc..."
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
        <Text style={styles.textButton}>Thêm công việc mới</Text>
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

<TouchableOpacity
    style={styles.centeredView}
    onPress={() => setModalVisible(false)}
  >
    <TouchableOpacity
      style={styles.modalView}
      activeOpacity={1} 
      onPress={() => {}}
    >
         
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
                      style={[styles.modalTextInput, errors.form && styles.inputError,  styles.multilineInput]}
                      value={selectedJob.form}
                      multiline
                      numberOfLines={2}
                      
                      onChangeText={(text) =>
                        setSelectedJob({ ...selectedJob, form: text })
                      }
                    />
                    {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}
                  </View>
                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Số lượng</Text>
                    <TextInput
                      style={[styles.modalTextInput, errors.number_of_recruitments && styles.inputError]}
                      value={selectedJob.number_of_recruitments}
                      onChangeText={(text) =>
                        setSelectedJob({ ...selectedJob, number_of_recruitments: text })
                      }
                      keyboardType="numeric"
                    />
                    {errors.number_of_recruitments && <Text style={styles.errorText}>{errors.number_of_recruitments}</Text>}
                  </View>
                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Yêu cầu</Text>
                    <TextInput
                      style={[styles.modalTextInput, errors.requirements && styles.inputError,  styles.multilineInput]}
                      value={selectedJob.requirements}
                      multiline
                      numberOfLines={2}
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
                      keyboardType="numeric"
                    />
                    {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
                  </View>
                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Lợi ích</Text>
                    <TextInput
                      style={[styles.modalTextInput, errors.benefits && styles.inputError,  styles.multilineInput]}
                      value={selectedJob.benefits}
                      multiline
                      numberOfLines={2}
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
                      multiline
                      onChangeText={(text) =>
                        setSelectedJob({ ...selectedJob, location: text })
                      }
                    />
                    {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                  </View>
                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Hạn nộp hồ sơ</Text>
                    <TouchableOpacity
                      style={[styles.modalTextInput, styles.datePickerButton]}
                      onPress={showDatePicker}
                    >
                      <Text>{selectedJob.deadline ? selectedJob.deadline : "Chọn ngày"}</Text>
                    </TouchableOpacity>
                    {isDatePickerVisible && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleConfirm}
                      />
                    )}
                    {errors.deadline && <Text style={styles.errorText}>{errors.deadline}</Text>}
                  </View>
                </ScrollView>
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={confirmDelete}
                  >
                    <Text style={styles.modalButtonText}>Xóa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleEdit}
                  >
                    <Text style={styles.modalButtonText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
                </TouchableOpacity>
                </TouchableOpacity>
          </Modal>
        )}
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      paddingHorizontal: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    searchInput: {
      height: 40,
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
      backgroundColor: "#fff",
    },
    list: {
      paddingBottom: 70,
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
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    viewDetails: {
      color: "#1e90ff",
      marginTop: 10,
    },
    buttonContainer: {
      backgroundColor: "#007bff",
      padding: 15,
      borderRadius: 10,
      position: "absolute",
      bottom: 20,
      right: 20,
    },
    textButton: {
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
    },

    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    modalTextInput: {
      height: 40,
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: "#fff",

    },
    datePickerButton: {
      justifyContent: "center",
      alignItems: "center",
    },
    inputError: {
      borderColor: "red",
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginTop: 5,
    },
    modalButtonsContainer: {
      flexDirection: "row",
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 5,
      alignItems: "center",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
    },
    saveButton: {
      backgroundColor: "#28a745",
    },
    modalButtonText: {
      color: "#fff",
      fontSize: 16,
    },


    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      width: "80%", 
      maxHeight: "80%", 
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    inputRow: {
      marginBottom: 15,
      width: "100%",
    },multilineInput:{
      minHeight: 60,
      maxHeight: 120, 
      textAlignVertical: 'top',
      marginBottom: 10,
      flexGrow: 1,
    } 
  });
  






