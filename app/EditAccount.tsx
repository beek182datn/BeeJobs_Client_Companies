import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, TextInput, ScrollView, BackHandler, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const handleImagePicker = async (setter) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access media library is required!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setter(result.assets[0].uri); 
  }
};

export default function EditAccount() {
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyScale, setCompanyScale] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [newLogo, setNewLogo] = useState(null);
  const [companyCertification, setCompanyCertification] = useState('');
  const [newCertification, setNewCertification] = useState(null);
  const [companyDesc, setCompanyDesc] = useState('');
  const [originalCompanyName, setOriginalCompanyName] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  const fetchAccountDetails = async () => {
    const companyId = await AsyncStorage.getItem('company_id');
    try {
      const response = await fetch(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          const companyData = data.data;
          setCompanyName(companyData.company_name || '');
          setOriginalCompanyName(companyData.company_name || '');
          setCompanyAddress(companyData.company_address || '');
          setCompanyWebsite(companyData.company_website || '');
          setCompanyScale(companyData.company_scale || '');
          setTaxCode(companyData.taxcode || '');
          setCompanyLogo(companyData.company_logo || '');
          setCompanyCertification(companyData.company_certification || '');
          setCompanyDesc(companyData.company_desc || '');
        } else {
          Alert.alert("Lỗi", "Cấu trúc dữ liệu không như mong đợi");
        }
      } else {
        Alert.alert("Lỗi", `Không thể lấy thông tin tài khoản: ${response.statusText}`);
      }
    } catch (error) {
    //  Alert.alert("Lỗi", `Đã xảy ra lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const isCompanyNameChanged = companyName !== originalCompanyName;
    if (companyName !== originalCompanyName && !newCertification) {
      Alert.alert("Thông báo", "Vui lòng cập nhật lại giấy tờ khi thay đổi tên công ty");
      return;
    }
  
    const companyId = await AsyncStorage.getItem('company_id');
    const userId = await AsyncStorage.getItem('idUser');
  
    const formData = new FormData();
    formData.append('company_name', companyName);
    formData.append('company_address', companyAddress);
    formData.append('company_website', companyWebsite);
    formData.append('company_scale', companyScale);
    formData.append('taxcode', taxCode);
    formData.append('company_desc', companyDesc);
    formData.append('active', isCompanyNameChanged ? 'false' : 'true');
    if (newLogo) {
      const response = await fetch(newLogo);
      const blob = await response.blob();
      formData.append('company_logo', {
        uri: newLogo,
        type: blob.type,
        name: 'logo.jpg',
      });
    }
  
    if (newCertification) {
      const response = await fetch(newCertification);
      const blob = await response.blob();
      formData.append('company_certification', {
        uri: newCertification,
        type: blob.type,
        name: 'certification.jpg',
      });
    }
  
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://beejobs.io.vn:14307/api/companies/edit/${userId}/${companyId}`);
    xhr.onload = () => {
      if (xhr.status === 200) {
        Alert.alert("Thành công", "Cập nhật thông tin công ty thành công");
        router.replace("ViewAccount");
      } else {
        Alert.alert("Lỗi", `Không thể cập nhật thông tin công ty: ${xhr.responseText}`);
      }
    };
    xhr.onerror = () => {
    //  Alert.alert("Lỗi", "Đã xảy ra lỗi");
    };
    xhr.send(formData);
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("ViewAccount");
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
   
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          {newLogo ? (
            <Image style={styles.logo} source={{ uri: newLogo }} />
          ) : companyLogo ? (
            <Image style={styles.logo} source={{ uri: `http://beejobs.io.vn:14307${companyLogo}` }} />
          ) : (
            <Text>Không có logo</Text>
          )}
          <TouchableOpacity style={styles.changeButton} onPress={() => handleImagePicker(setNewLogo)}>
            <Text style={styles.buttonText}>Thay đổi Logo</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.header}>Chỉnh sửa thông tin công ty</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Tên công ty:</Text>
        <TextInput
          style={styles.input}
          value={companyName}
          multiline
          onChangeText={(text) => {
            setCompanyName(text);
            if (text !== originalCompanyName) {
              setNewCertification(null);
            }
          }}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Địa chỉ:</Text>
        <TextInput
          style={styles.input}
          value={companyAddress}
          multiline
          onChangeText={setCompanyAddress}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Website:</Text>
        <TextInput
          style={styles.input}
          value={companyWebsite}
          multiline
          onChangeText={setCompanyWebsite}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Quy mô:</Text>
        <TextInput
          style={styles.input}
          value={companyScale}
          multiline
          onChangeText={setCompanyScale}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Mã số thuế:</Text>
        <TextInput
          style={styles.input}
          value={taxCode}
    
          onChangeText={setTaxCode}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Mô tả công ty:</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={companyDesc}
          multiline
          numberOfLines={4}

          onChangeText={setCompanyDesc}
        />
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.certificationContainer}>
          {newCertification ? (
            <Image style={styles.certification} source={{ uri: newCertification }} />
          ) : companyCertification ? (
            <Image style={styles.certification} source={{ uri: `http://beejobs.io.vn:14307${companyCertification}` }} />
          ) : (
            <Text>Không có chứng nhận</Text>
          )}
        </View>
        <TouchableOpacity style={styles.changeButton} onPress={() => handleImagePicker(setNewCertification)}>
          <Text style={styles.buttonText}>Thay đổi Chứng nhận</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonTex}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9', 
  },
  headerContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#007bff',
    padding: 20,
    borderRadius: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
    marginTop: 10,
  },
  detailContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  certificationContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  certification: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  changeButton: {
    backgroundColor: '#fff', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff', 
    marginTop: 10,
  },
  buttonText: {
    color: '#007bff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#E0EEE0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff', 
    marginTop: 20, 
    width: '50%', 
    alignSelf: 'center', 
    marginBottom: 40,

    
  },
  saveButtonText: {
    color: '#007bff', // Blue text color for save button
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },saveButtonTex:{
    color: "#007bff",
    fontSize: 20
  },multilineInput:{
    minHeight: 100,
    textAlignVertical: 'top',
  }
});


