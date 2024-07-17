import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Modal,
  BackHandler
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/Ionicons'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from "@react-native-community/datepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";


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


  const handleSave = async () =>{
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

      try{
        const companyId = await AsyncStorage.getItem('company_id');
        const response = await fetch(`http://beejobs.io.vn:14307/api/jobs/create/${companyId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addJobs),
        });

        if(response.ok){
          const result = await response.json();
          router.push("Jobs")
          console.log("Them jobs thanh cong", result);
        }else{
          console.error("err jobs", response.status, response.statusText);
        }
      }catch(err){
          console.error("Loi add jobs", err);
      }
  }
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
            style={[styles.input, styles.descInput,  errors.salary && styles.inputError]}
            value={salary}
            onChangeText={handleNumberInputPrice}
            placeholder="Lương..."
            keyboardType="numeric"
            placeholderTextColor="#A9A9A9"
          />

            {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
        </View>
        
        <View style={styles.inputContainer}>
          <Icon name="gift-outline"  size={20} style={styles.icon} />
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
        <TouchableWithoutFeedback onPress={handleSave}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  }, inputError: {
    borderColor: 'red',
  }, errorText: {
    color: 'red',
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 35,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonContainer: {
    marginTop: 20, 
    alignSelf: 'center', 
    width: '80%', 
  },
  button: {
    backgroundColor: "#0099FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1, 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginLeft: 4,
    position: 'absolute',
    left: 10,
  },
  descInput: {
    height: 40,
    justifyContent: 'center',
  },
  inputDescription: {
    height: 100,
  },modalView:{
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    }

  }, centeredView:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
  }
});



