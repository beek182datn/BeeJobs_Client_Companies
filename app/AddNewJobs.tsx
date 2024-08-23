import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  BackHandler,
  Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/Ionicons'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import axios from 'axios';
const { width } = Dimensions.get('window');

export default function Details() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [form, setForm] = useState("");
  const [majors, setMajors] = useState("");
  const [number_of_recruitments, setNumber_of_recruitments] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [benefits, setBenefits] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [experience, setExperience] = useState("");
  const [working_time, setWorking_time] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handelNumberInputQuantity = (text) =>{
    const numericText = text.replace(/[^0-9]/g, '');
    setNumber_of_recruitments(numericText);
  };

  const handleNumberInputPrice = (text) => {
    setSalary(text);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
    setDeadline(currentDate.toLocaleDateString());
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSave = async () => {

    const newErrors = {};
    if (!title.trim()) newErrors.title = "Hãy nhập tiêu đề";
    if (!desc.trim()) newErrors.desc = "Hãy nhập mô tả";
    if (!form.trim()) newErrors.form = "Hãy nhập hình thức";
    if (!majors.trim()) newErrors.majors = "Hãy nhập chuyên ngành";
    if (!number_of_recruitments.trim()) newErrors.number_of_recruitments = "Hãy nhập số lượng";
    if (!requirements.trim()) newErrors.requirements = "Hãy nhập yêu cầu";
    if (!experience.trim()) newErrors.experience = "Hãy nhập yêu cầu";
    if (!salary.trim()) newErrors.salary = "Hãy nhập lương";
    if (!benefits.trim()) newErrors.benefits = "Hãy nhập lợi ích";
    if (!location.trim()) newErrors.location = "Hãy nhập vị trí";
    if (!deadline.trim()) newErrors.deadline = "Hãy nhập hạn hồ sơ";
    if (!working_time.trim()) newErrors.working_time = "Hãy nhập thời gian làm việc";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const addJobs = {
      title,
      desc,
      form,
      majors,
      number_of_recruitments,
      requirements,
      experience,
      salary,
      benefits,
      location,
      deadline,
      working_time
    }
    Alert.alert(
      'Xác nhận',
      'Đăng tin tuyển dụng mới với 19$?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async () => {
            console.log("Up new Job for $19");
            const companyId = await AsyncStorage.getItem('company_id');
            if(companyId){
              const response = await axios.get(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`);
              if(response.data.data.currency < 19){
                Alert.alert('Lỗi', 'Số dư của bạn không đủ!');
                router.push("ToUpAccountScreen");
              }else{
                const amount = "-19";
              await axios.post(`http://beejobs.io.vn:14307/api/companies/top_up_account/${companyId}`, {
                amount: Number(amount),
              });
              await axios.post('http://beejobs.io.vn:14307/api/payment/confirmPaymentSubtract', {
                companyId: companyId,
                amount: Number(amount),
              });
              ///
              Alert.alert('Thành công', 'Đăng tin thành công!');
              try {
                const companyId = await AsyncStorage.getItem('company_id');
                const response = await fetch(`http://beejobs.io.vn:14307/api/jobs/create/${companyId}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(addJobs),
                });
          
                if(response.ok) {
                  const result = await response.json();
                  router.push("Jobs");
                  console.log("Thêm jobs thành công", result);
                } else {
                  console.error("Lỗi jobs", response.status, response.statusText);
                }
              } catch(err) {
                console.error("Lỗi thêm jobs", err);
              }
              }
              
            }
          },
        },
      ],
      { cancelable: false }
    );

    
  }

  const handleCancel = () => {
    setTitle("");
    setDesc("");
    setForm("");
    setNumber_of_recruitments("");
    setRequirements("");
    setExperience("");
    setSalary("");
    setBenefits("");
    setLocation("");
    setDeadline("");
    setWorking_time("");
    setMajors("");
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("Jobs");
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.inputContainer}>
          <Icon name="document-text-outline" size={25} style={[styles.icon, styles.iconTitle]} />
          <TextInput
            style={[styles.input, styles.inputTitle, errors.title && styles.inputError]}
            value={title}
            onChangeText={setTitle}
            placeholder="Tiêu đề..."
            placeholderTextColor="#B0B0B0"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="albums-outline" size={25} style={[styles.icon, styles.iconForm]} />
          <TextInput
            style={[styles.input, styles.inputForm, errors.form && styles.inputError]}
            value={form}
            onChangeText={setForm}
            placeholder="Hình thức..."
            multiline
            placeholderTextColor="#B0B0B0"
          />
          {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="briefcase" size={25} style={[styles.icon, styles.iconForm]} />
          <TextInput
            style={[styles.input, styles.inputForm, errors.form && styles.inputError]}
            value={majors}
            onChangeText={setMajors}
            placeholder="Chuyên ngành..."
            multiline
            placeholderTextColor="#B0B0B0"
          />
          {errors.majors && <Text style={styles.errorText}>{errors.majors}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Icon name="people-outline" size={25} style={[styles.icon, styles.iconQuantity]} />
          <TextInput
            style={[styles.input, styles.inputQuantity, errors.number_of_recruitments && styles.inputError]}
            value={number_of_recruitments}
            onChangeText={handelNumberInputQuantity}
            placeholder="Số lượng tuyển dụng..."
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />
          {errors.number_of_recruitments && <Text style={styles.errorText}>{errors.number_of_recruitments}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="document-attach-outline" size={25} style={[styles.icon, styles.iconRequirements]} />
          <TextInput
            style={[styles.input, styles.inputRequirements, errors.requirements && styles.inputError]}
            value={requirements}
            onChangeText={setRequirements}
            placeholder="Yêu cầu..."
            multiline
            placeholderTextColor="#B0B0B0"
          />
          {errors.requirements && <Text style={styles.errorText}>{errors.requirements}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="ribbon" size={25} style={[styles.icon, styles.iconExperience]} />
          <TextInput
            style={[styles.input, styles.inputExperience, errors.experience && styles.inputError]}
            value={experience}
            onChangeText={setExperience}
            placeholder="Kinh nghiệm..."
            multiline
            placeholderTextColor="#B0B0B0"
          />
          {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="cash-outline" size={25} style={[styles.icon, styles.iconSalary]} />
          <TextInput
            style={[styles.input, styles.inputSalary, errors.salary && styles.inputError]}
            value={salary}
            onChangeText={handleNumberInputPrice}
            placeholder="Lương..."
            placeholderTextColor="#B0B0B0"
          />
          {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="cash-outline" size={25} style={[styles.icon, styles.iconWorking_time]} />
          <TextInput
            style={[styles.input, styles.inputWorking_time, errors.working_time && styles.inputError]}
            value={working_time}
            onChangeText={setWorking_time}
            placeholder="Thời gian làm việc..."
            placeholderTextColor="#B0B0B0"
          />
          {errors.working_time && <Text style={styles.errorText}>{errors.working_time}</Text>}
        </View>


        <View style={styles.inputContainer}>
          <Icon name="gift-outline" size={25} style={[styles.icon, styles.iconBenefits]} />
          <TextInput
            style={[styles.input, styles.inputBenefits, errors.benefits && styles.inputError]}
            value={benefits}
            onChangeText={setBenefits}
            placeholder="Lợi ích..."
            multiline
            placeholderTextColor="#B0B0B0"
          />
          {errors.benefits && <Text style={styles.errorText}>{errors.benefits}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="location-outline" size={25} style={[styles.icon, styles.iconLocation]} />
          <TextInput
            style={[styles.input, styles.inputLocation, errors.location && styles.inputError]}
            value={location}
            onChangeText={setLocation}
            placeholder="Vị trí..."
            placeholderTextColor="#B0B0B0"
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="clipboard-outline" size={25} style={[styles.icon, styles.iconDesc]} />
          <TextInput
            style={[styles.input, styles.inputDesc, errors.desc && styles.inputError]}
            value={desc}
            onChangeText={setDesc}
            placeholder="Mô tả..."
            multiline
            numberOfLines={4}
            placeholderTextColor="#B0B0B0"
          />
          {errors.desc && <Text style={styles.errorText}>{errors.desc}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="calendar-outline" size={25} style={[styles.icon, styles.iconDate]} />
          <TouchableOpacity onPress={showDatepicker} style={[styles.input, styles.inputDate]}>
            <Text style={styles.dateText            }>{deadline || "Chọn hạn hồ sơ"}</Text>
            <Icon name="calendar-outline" size={20} color="#007BFF" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default" 
              onChange={onChange}
            />
            
          )}
          {errors.working_time && <Text style={styles.errorText}>{errors.working_time}</Text>}
        </View>

        
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleCancel} style={styles.buttonCancel}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.buttonSave}>
            <Text style={styles.buttonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    backgroundColor: "#FFFFFF",
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 8,
    marginLeft: 10,
    borderRadius: 4,
  },
  inputTitle: {
    borderColor: "#007BFF",
  },
  inputForm: {
    borderColor: "#28A745",
  },
  inputQuantity: {
    borderColor: "#FFC107",
  },
  inputRequirements: {
    borderColor: "#DC3545",
  },
  inputExperience: {
    borderColor: "#FFC107",
  },
  inputSalary: {
    borderColor: "#17A2B8",
  },
  inputBenefits: {
    borderColor: "#6C757D",
  },
  inputLocation: {
    borderColor: "#FF5733",
  },
  inputDesc: {
    borderColor: "#C70039",
    height: 100,
    textAlignVertical: 'top',
  },inputWorking_time:{
    borderColor: "#FFCCFF",
  },inputDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: "#007BFF",
  },
  icon: {
    marginRight: 10,
  },
  iconTitle: {
    color: "#007BFF",
  },
  iconForm: {
    color: "#28A745",
  },
  iconQuantity: {
    color: "#FFC107",
  },
  iconRequirements: {
    color: "#DC3545",
  },
  iconExperience:{
    color: "#FFC107",
  },
  iconSalary: {
    color: "#17A2B8",
  },
  iconBenefits: {
    color: "#6C757D",
  },
  iconLocation: {
    color: "#FF5733",
  },
  iconDesc: {
    color: "#C70039",
  },
  dateText: {
    flex: 1,
    color: "#6C757D",
  },iconWorking_time:{
    color: "#FF6699",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: "#FF6F61",
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonSave: {
    flex: 1,
    backgroundColor: "#28A745",
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: 'bold',
  },
  errorText: {
    color: "#FF6F61",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
});


          






