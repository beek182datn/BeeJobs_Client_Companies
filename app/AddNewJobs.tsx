import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  BackHandler
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/Ionicons'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

export default function Details() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [form, setForm] = useState("");
  const [number_of_recruitments, setNumber_of_recruitments] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [benefits, setBenefits] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handelNumberInputQuantity = (text) =>{
    const numericText = text.replace(/[^0-9]/g, '');
    setNumber_of_recruitments(numericText);
  };

  const handleNumberInputPrice = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setSalary(numericText);
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
    if (!number_of_recruitments.trim()) newErrors.number_of_recruitments = "Hãy nhập số lượng";
    if (!requirements.trim()) newErrors.requirements = "Hãy nhập yêu cầu";
    if (!salary.trim()) newErrors.salary = "Hãy nhập lương";
    if (!benefits.trim()) newErrors.benefits = "Hãy nhập lợi ích";
    if (!location.trim()) newErrors.location = "Hãy nhập vị trí";
    if (!deadline.trim()) newErrors.deadline = "Hãy nhập hạn hồ sơ";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const addJobs = {
      title,
      desc,
      form,
      number_of_recruitments,
      requirements,
      salary,
      benefits,
      location,
      deadline
    }

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

  const handleCancel = () => {
    setTitle("");
    setDesc("");
    setForm("");
    setNumber_of_recruitments("");
    setRequirements("");
    setSalary("");
    setBenefits("");
    setLocation("");
    setDeadline("");
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
          <Icon name="document-text-outline" size={25} style={styles.icon} />
          <TextInput
            style={[styles.input, styles.descInput, errors.title && styles.inputError]}
            value={title}
            onChangeText={setTitle}
            placeholder="Nhập tiêu đề..."
            multiline
            placeholderTextColor="#A9A9A9"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="albums-outline" size={25} style={styles.icon} />
          <TextInput
            style={[styles.input, styles.descInput, errors.form && styles.inputError]}
            value={form}
            onChangeText={setForm}
            placeholder="Nhập hình thức..."
            multiline
            placeholderTextColor="#A9A9A9"
          />
          {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="people-outline" size={25} style={styles.icon} />
          <TextInput
            style={[styles.input, styles.descInput, errors.number_of_recruitments && styles.inputError]}
            value={number_of_recruitments}
            onChangeText={handelNumberInputQuantity}
            placeholder="Nhập số lượng tuyển dụng..."
            keyboardType="numeric"
            placeholderTextColor="#A9A9A9"
          />
          {errors.number_of_recruitments && <Text style={styles.errorText}>{errors.number_of_recruitments}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="document-attach-outline" size={20} style={styles.icon} />
          <TextInput
            style={[styles.input, styles.descInput, errors.requirements && styles.inputError]}
            value={requirements}
            onChangeText={setRequirements}
            placeholder="Nhập yêu cầu..."
            multiline
            placeholderTextColor="#A9A9A9"
          />
          {errors.requirements && <Text style={styles.errorText}>{errors.requirements}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="cash-outline" size={20} style={styles.icon} />
          <TextInput
            style={[styles.input, styles.descInput, errors.salary && styles.inputError]}
            value={salary}
            onChangeText={handleNumberInputPrice}
            placeholder="Lương..."
            keyboardType="numeric"
            placeholderTextColor="#A9A9A9"
          />
          {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="gift-outline" size={20} style={styles.icon} />
          <TextInput
            style={[styles.input, styles.descInput, errors.benefits && styles.inputError]}
            value={benefits}
            onChangeText={setBenefits}
            placeholder="Nhập lợi ích..."
            multiline
            placeholderTextColor="#A9A9A9"
          />
          {errors.benefits && <Text style={styles.errorText}>{errors.benefits}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="location-outline" size={20} style={styles.icon} />
          <TextInput
            style={[styles.input, styles.descInput, errors.location && styles.inputError]}
            value={location}
            onChangeText={setLocation}
            placeholder="Nhập vị trí..."
            placeholderTextColor="#A9A9A9"
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="clipboard-outline" size={25} style={styles.icon} />
          <TextInput
            style={[styles.input, styles.inputDescription, errors.desc && styles.inputError]}
            value={desc}
            onChangeText={setDesc}
            placeholder="Nhập mô tả..."
            multiline
            numberOfLines={4}
            placeholderTextColor="#A9A9A9"
          />
                   {errors.desc && <Text style={styles.errorText}>{errors.desc}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="calendar-outline" size={20} style={styles.icon} />
          <TouchableOpacity onPress={showDatepicker} style={[styles.input, styles.descInput, errors.deadline && styles.inputError]}>
            <Text style={{ color: deadline ? "#000" : "#A9A9A9" }}>{deadline || "Nhập thời hạn..."}</Text>
          </TouchableOpacity>
          {errors.deadline && <Text style={styles.errorText}>{errors.deadline}</Text>}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
            style={{ zIndex: 1000 }}
          />
        )}
      </KeyboardAwareScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDDDD',
    borderWidth: 1,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
    color: '#0099FF',
  },
  input: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  descInput: {
    justifyContent: 'center',
  },
  inputDescription: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF6F61',
  },
  errorText: {
    color: '#FF6F61',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#0099FF',
  },
  cancelButton: {
    backgroundColor: '#FF6F61',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  scrollContent: {
    flexGrow: 1,
  },
});





