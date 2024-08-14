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
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";

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
        const companyId = await AsyncStorage.getItem("company_id");
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

  const renderItem = ({ item }) => (
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
        renderItem={renderItem}
      />
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handlecheckactive}
        >
          <Text style={styles.addButtonText}>Thêm công việc</Text>
        </TouchableOpacity>
      </View>
      {selectedJob && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <ScrollView
            style={styles.modalContainer}
            ref={scrollViewRef}
            onContentSizeChange={scrollToEnd}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chỉnh sửa thông tin công việc</Text>
              {Object.keys(errors).length > 0 && (
                <View style={styles.errorContainer}>
                  {Object.values(errors).map((error, index) => (
                    <Text key={index} style={styles.errorText}>
                      {error}
                    </Text>
                  ))}
                </View>
              )}
              <TextInput
                style={styles.input}
                placeholder="Tiêu đề"
                value={selectedJob.title}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, title: text })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Mô tả"
                value={selectedJob.desc}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, desc: text })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Hình thức"
                value={selectedJob.form}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, form: text })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Chuyên ngành"
                value={selectedJob.majors}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, majors: text })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Số lượng"
                value={selectedJob.number_of_recruitments}
                onChangeText={(text) =>
                  setSelectedJob({
                    ...selectedJob,
                    number_of_recruitments: text,
                  })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Yêu cầu"
                value={selectedJob.requirements}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, requirements: text })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Lương"
                value={selectedJob.salary}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, salary: text })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Lợi ích"
                value={selectedJob.benefits}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, benefits: text })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Vị trí"
                value={selectedJob.location}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, location: text })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Hạn hồ sơ"
                value={selectedJob.deadline}
                onFocus={showDatePicker}
              />
              <TextInput
                style={styles.input}
                placeholder="Kinh nghiệm"
                value={selectedJob.experience}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, experience: text })
                }
                onFocus={scrollToEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Thời gian làm việc"
                value={selectedJob.working_time}
                onChangeText={(text) =>
                  setSelectedJob({ ...selectedJob, working_time: text })
                }
                onFocus={scrollToEnd}
              />
              {isDatePickerVisible && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleConfirm}
                  minimumDate={new Date()}
                />
              )}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleEdit}
              >
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    marginVertical: 16,
    flexDirection: "row",
    margin: 10
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 1,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  labelText: {
    fontWeight: "bold",
  },
  formText: {
    fontStyle: "italic",
  },
  icon: {
    marginRight: 8,
  },
  viewDetailsButton: {
    alignSelf: "flex-end",
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  viewDetailsText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButtonContainer: {
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    marginTop: 16,
  },
  addButton: {
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#607D8B",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "#ffcccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: "#cc0000",
    fontSize: 14,
  },  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  clearButton: {
    alignSelf: "center",
    position: 'absolute',
    right: 15,
  },
});
