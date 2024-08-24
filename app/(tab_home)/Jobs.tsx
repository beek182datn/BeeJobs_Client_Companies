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
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from '@expo/vector-icons';

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
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      const companyId = await AsyncStorage.getItem("company_id");
      const response = await axios.get(
        "http://beejobs.io.vn:14307/api/jobs/getJobsByIdCompany/" + companyId
      );
      setJobs(response.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu Jobs", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );
  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handlecheckactive = async () => {
    const companyId = await AsyncStorage.getItem("company_id");
    if (companyId) {
      const response = await axios.get(
        `http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`
      );
      if (response.data.data.status !== "ACTIVE") {
        Alert.alert(
          "Thông báo",
          "Doanh nghiệp của bạn chưa được phê duyệt, vui lòng thử lại sau.",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
        return;
      } else {
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
    const {
      title,
      desc,
      form,
      majors,
      number_of_recruitments,
      requirements,
      salary,
      benefits,
      location,
      deadline,
      experience,
      working_time,
    } = selectedJob;

    const newErrors = {};
    if (!title.trim()) newErrors.title = "Hãy nhập tiêu đề";
    if (!desc.trim()) newErrors.desc = "Hãy nhập mô tả";
    if (!form.trim()) newErrors.form = "Hãy nhập hình thức";
    if (!majors.trim()) newErrors.form = "Hãy nhập chuyên ngành";
    if (!number_of_recruitments.trim())
      newErrors.number_of_recruitments = "Hãy nhập số lượng";
    if (!requirements.trim()) newErrors.requirements = "Hãy nhập yêu cầu";
    if (!salary.trim()) newErrors.salary = "Hãy nhập lương";
    if (!benefits.trim()) newErrors.benefits = "Hãy nhập lợi ích";
    if (!location.trim()) newErrors.location = "Hãy nhập vị trí";
    if (!deadline.trim()) newErrors.deadline = "Hãy nhập hạn hồ sơ";
    if (!experience.trim()) newErrors.experience = "Hãy nhập kinh nghiệm";
    if (!working_time.trim())
      newErrors.working_time = "Hãy nhập thời gian làm việc";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const companyId = await AsyncStorage.getItem("company_id");
      const response = await axios.put(
        `http://beejobs.io.vn:14307/api/jobs/edit/${companyId}/${selectedJob._id}`,
        selectedJob
      );

      if (response.status === 200) {
        setJobs(
          jobs.map((job) => (job._id === selectedJob._id ? selectedJob : job))
        );
        Alert.alert("Thông báo!", "Cập nhật thông tin của Jobs thành công!");
        setModalVisible(false);
      } else {
        console.error(
          "Error updating job",
          response.status,
          response.statusText
        );
        Alert.alert("Thông báo", "Cập nhật thông tin của Jobs thất bại");
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
      const companyId = await AsyncStorage.getItem("company_id");
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
    setDatePickerVisibility(Platform.OS === "ios");
    setDate(currentDate);
    setSelectedJob({
      ...selectedJob,
      deadline: currentDate.toISOString().split("T")[0],
    });
  };

  const renderItem = ({ item }) => {
    const currentDate = new Date();
    const expiresDate = new Date(item.expires_at);
    const timeDiff = expiresDate - currentDate;
    const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return(
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <View style={styles.itemContent}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <Icon
              name="calendar"
              size={16}
              color="#CCFF66"
              style={styles.icon}
            />
            <Text style={styles.detailText}>
              <Text style={styles.labelText}>Hạn nộp hồ sơ: </Text>
              <Text style={styles.formText}>{item.deadline}</Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="money" size={16} color="#FFCCFF" style={styles.icon} />
            <Text style={styles.detailText}>
              <Text style={styles.labelText}>Lương: </Text>
              <Text style={styles.formText}>{item.salary}</Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon
              name="file-text"
              size={16}
              color="#97FFFF"
              style={styles.icon}
            />
            <Text style={styles.detailText}>
              <Text style={styles.labelText}>Hình thức: </Text>
              <Text style={styles.formText}>{item.form}</Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
          <Ionicons name="timer" size={17} color="#ff6400" />
            <Text style={styles.detailText}>
              <Text style={styles.labelText}>Hạn đăng tuyển: </Text>
              <Text style={styles.formText}> Còn {remainingDays} ngày</Text>
            </Text>
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
    )
  };

  const removeVietNameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
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

  const clearSearch = () => {
    setSearch("");
  };
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tiêu đề công việc cần tìm kiếm..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Icon name="times-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name="pencil"
                  size={20}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Sửa Thông Tin
                </Text>
              </View>
              <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                ref={scrollViewRef}
                onContentSizeChange={scrollToEnd}
              >
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Tiêu đề</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.title && styles.inputError,
                    ]}
                    value={selectedJob.title}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, title: text })
                    }
                  />
                  {errors.title && (
                    <Text style={styles.errorText}>{errors.title}</Text>
                  )}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Mô tả</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.desc && styles.inputError,
                    ]}
                    value={selectedJob.desc}
                    multiline
                    numberOfLines={2}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, desc: text })
                    }
                  />
                  {errors.desc && (
                    <Text style={styles.errorText}>{errors.desc}</Text>
                  )}
                </View>

                <View style={styles.inputRow}>
                  <Text style={styles.label}>Chuyên ngành</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.majors && styles.inputError,
                    ]}
                    value={selectedJob.majors}
                    multiline
                    numberOfLines={2}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, majors: text })
                    }
                  />
                  {errors.majors && (
                    <Text style={styles.errorText}>{errors.majors}</Text>
                  )}
                </View>

                <View style={styles.inputRow}>
                  <Text style={styles.label}>Hình thức</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.form && styles.inputError,
                      styles.multilineInput,
                    ]}
                    value={selectedJob.form}
                    multiline
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, form: text })
                    }
                  />
                  {errors.form && (
                    <Text style={styles.errorText}>{errors.form}</Text>
                  )}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Số lượng</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.number_of_recruitments && styles.inputError,
                    ]}
                    value={selectedJob.number_of_recruitments}
                    onChangeText={(text) =>
                      setSelectedJob({
                        ...selectedJob,
                        number_of_recruitments: text,
                      })
                    }
                    keyboardType="numeric"
                  />
                  {errors.number_of_recruitments && (
                    <Text style={styles.errorText}>
                      {errors.number_of_recruitments}{" "}
                    </Text>
                  )}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Yêu cầu</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.requirements && styles.inputError,
                      styles.multilineInput,
                    ]}
                    value={selectedJob.requirements}
                    multiline
                    numberOfLines={2}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, requirements: text })
                    }
                  />
                  {errors.requirements && (
                    <Text style={styles.errorText}>{errors.requirements}</Text>
                  )}
                </View>

                <View style={styles.inputRow}>
                  <Text style={styles.label}>Kinh nghiệm</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.experience && styles.inputError,
                      styles.multilineInput,
                    ]}
                    value={selectedJob.experience}
                    multiline
                    numberOfLines={2}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, experience: text })
                    }
                  />
                  {errors.experience && (
                    <Text style={styles.errorText}>{errors.experience}</Text>
                  )}
                </View>

                <View style={styles.inputRow}>
                  <Text style={styles.label}>Lương</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.salary && styles.inputError,
                    ]}
                    value={selectedJob.salary}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, salary: text })
                    }
                    keyboardType="numeric"
                  />
                  {errors.salary && (
                    <Text style={styles.errorText}>{errors.salary}</Text>
                  )}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Lợi ích</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.benefits && styles.inputError,
                      styles.multilineInput,
                    ]}
                    value={selectedJob.benefits}
                    multiline
                    numberOfLines={2}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, benefits: text })
                    }
                  />
                  {errors.benefits && (
                    <Text style={styles.errorText}>{errors.benefits}</Text>
                  )}
                </View>

                <View style={styles.inputRow}>
                  <Text style={styles.label}>Thời gian làm việc</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.working_time && styles.inputError,
                      styles.multilineInput,
                    ]}
                    value={selectedJob.working_time}
                    multiline
                    numberOfLines={2}
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, working_time: text })
                    }
                  />
                  {errors.working_time && (
                    <Text style={styles.errorText}>{errors.working_time}</Text>
                  )}
                </View>

                <View style={styles.inputRow}>
                  <Text style={styles.label}>Vị trí</Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      errors.location && styles.inputError,
                    ]}
                    value={selectedJob.location}
                    multiline
                    onChangeText={(text) =>
                      setSelectedJob({ ...selectedJob, location: text })
                    }
                  />
                  {errors.location && (
                    <Text style={styles.errorText}>{errors.location}</Text>
                  )}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Hạn nộp hồ sơ</Text>
                  <TouchableOpacity
                    style={[styles.modalTextInput, styles.datePickerButton]}
                    onPress={showDatePicker}
                  >
                    <Text>
                      {selectedJob.deadline
                        ? selectedJob.deadline
                        : "Chọn ngày"}
                    </Text>
                  </TouchableOpacity>
                  {isDatePickerVisible && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={handleConfirm}
                    />
                  )}
                  {errors.deadline && (
                    <Text style={styles.errorText}>{errors.deadline}</Text>
                  )}
                </View>
              </ScrollView>
              <View style={styles.modalButtonsContainer}>
                {/* <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.modalButtonText}>Xóa</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleEdit}
                >
                  <Text style={styles.saveButtonText}>Sửa</Text>
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
    backgroundColor: "#F5FFFA",
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  ///
  list: {
    paddingBottom: 70,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  viewDetails: {
    color: "#1e90ff",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  modalTextInput: {
    height: 60,
    borderColor: "#ddd",

    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  datePickerButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
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
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
  },

  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "60%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  inputRow: {
    marginBottom: 15,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
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
  buttonContainer: {
    backgroundColor: "#28A745",
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
  viewDetailsButton: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  viewDetailsText: {
    color: "#1e90ff",
    fontSize: 14,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff6400",
    marginTop: 20,
    width: "45%",
    alignSelf: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#ff6400",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#ff6400",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff6400",
    marginTop: 20,
    width: "45%",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 7,
    fontWeight: "bold",
  },
  labelText: {
    color: "#999",
  },
  formText: {
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    marginVertical: 16,
    flexDirection: "row",
    margin: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  clearButton: {
    alignSelf: "center",
    position: "absolute",
    right: 15,
  },
  addButtonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
});
