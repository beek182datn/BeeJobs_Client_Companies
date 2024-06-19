import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";

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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tiêu đề:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Nhập tiêu đề..."
      />

      <Text style={styles.label}>Mô tả:</Text>
      <TextInput
        style={styles.input}
        value={desc}
        onChangeText={setDesc}
        placeholder="Nhập mô tả..."
      />

      <Text style={styles.label}>Hình thức:</Text>
      <TextInput
        style={styles.input}
        value={form}
        onChangeText={setForm}
        placeholder="Nhập hình thức..."
      />

      <Text style={styles.label}>Số lượng tuyển dụng:</Text>
      <TextInput
        style={styles.input}
        value={number_of_recruitments}
        onChangeText={setNumber_of_recruitments}
        placeholder="Nhập số lượng tuyển dụng..."
        keyboardType="numeric"
      />

      <Text style={styles.label}>Yêu cầu:</Text>
      <TextInput
        style={styles.input}
        value={requirements}
        onChangeText={setRequirements}
        placeholder="Nhập yêu cầu..."
      />
      <Text style={styles.label}>Lương:</Text>
      <TextInput
        style={styles.input}
        value={salary}
        onChangeText={setSalary}
        placeholder="Lương..."
        keyboardType="numeric"
      />

      <Text style={styles.label}>Lợi ích:</Text>
      <TextInput
        style={styles.input}
        value={benefits}
        onChangeText={setBenefits}
        placeholder="Nhập lợi ích..."
      />

      <Text style={styles.label}>Vị trí:</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Nhập vị trí..."
      />
      <Text style={styles.label}>Thời hạn:</Text>
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
        placeholder="Nhập thời hạn..."
      />
      <TouchableOpacity style={styles.button} onPress={() => console.log("Save button pressed")}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
