import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/Ionicons'; 
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


  const handelNumberInputQuantity = (text) =>{
    const numericText = text.replace(/[^0-9]/g, '');
    setNumber_of_recruitments(numericText);
    
  }
  const handleNumberInputPrice =(text) =>{
    const numericText = text.replace(/[^0-9]/g, '');
    setSalary(numericText);
  }


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS == "ios");
    setDate(currentDate);
    setDeadline(currentDate.toLocaleDateString());
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle = {styles.scrollContent}>

      <View style={styles.inputContainer}>
          <Icon name="document-text-outline" size={25} style={styles.icon} />
          <TextInput
            style={[styles.input, styles.descInput]}
            value={title}
            onChangeText={setTitle}
            placeholder="Nhập tiêu đề..."
            multiline
          />
    </View>
   

    <View style= {styles.inputContainer}>
       <Icon name= "albums-outline" size={25} style={styles.icon} />
       <TextInput
         style={[styles.input, styles.descInput]}
        value={form}
        onChangeText={setForm}
        placeholder="Nhập hình thức..."
        multiline
      />
    </View>

     <View style= {styles.inputContainer}>
        <Icon name= "people-outline" size={25} style={styles.icon} />
        <TextInput
             style={[styles.input, styles.descInput]}
            value={number_of_recruitments}
            onChangeText={handelNumberInputQuantity}
            placeholder="Nhập số lượng tuyển dụng..."
            keyboardType="numeric"
      />
     </View>
      
      <View style= {styles.inputContainer}>
          <Icon name="document-attach-outline" size={20} style={styles.icon} />
         <TextInput
            style={[styles.input, styles.descInput]}
            value={requirements}
            onChangeText={setRequirements}
            placeholder="Nhập yêu cầu..."
            multiline
      />
      </View>
    
    
      <View style={styles.inputContainer}>
          <Icon name="cash-outline" size={20} style={styles.icon} />
          <TextInput
             style={[styles.input, styles.descInput]}
            value={salary}
            onChangeText={handleNumberInputPrice}
            placeholder="Lương..."
            keyboardType="numeric"
      />

      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="gift-outline" size={20} style={styles.icon} />
        <TextInput
           style={[styles.input, styles.descInput]}
          value={benefits}
          onChangeText={setBenefits}
          placeholder="Nhập lợi ích..."
          multiline
        />
      </View>


      <View style={styles.inputContainer}>
        <Icon name="location-outline" size={20} style={styles.icon} />
        <TextInput
           style={[styles.input, styles.descInput]}
          value={location}
          onChangeText={setLocation}
          placeholder="Nhập vị trí..."
         
          />
       </View>
       
      <View style={styles.inputContainer}>
          <Icon name="calendar-outline" color="#FFFFFF	" size={20} style={styles.icon} />
          <TouchableOpacity onPress={showDatepicker}  style={[styles.input, styles.descInput]}>
          <TextInput
            style={[styles.input, styles.descInput]}
            value={deadline}
            placeholder="Nhập thời hạn..."
            editable={false}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
      <Icon name= "clipboard-outline" color="grey"  size={25} style={styles.icon} />
      <TextInput
        style={[styles.input, styles.inputDecoription]}
        value={desc}
        onChangeText={setDesc}
        placeholder="Nhập mô tả..."
        multiline
        numberOfLines={4}
      />
    </View>


      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      </ScrollView>
      


<View style={styles.buttonContainer}>
  <TouchableWithoutFeedback onPress={() => console.log("Save button pressed")}>
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
   
    borderRadius: 5,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  }, scrollContent: {
    flexGrow: 1, // Đảm bảo ScrollView có thể mở rộng khi cần thiết
  },inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderColor :'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    
  }, icon:{
    marginLeft : 4,
    position: 'absolute',
    left: 10,
    
   
  }, descInput: {
    height: 60,
 

  },inputDecoription: {
      height: 100
  }
});
