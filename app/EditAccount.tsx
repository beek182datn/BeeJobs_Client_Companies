import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, TextInput, ScrollView, BackHandler, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome';

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
          Alert.alert("Error", "Data structure is not as expected");
        }
      } else {
        Alert.alert("Error", `Failed to fetch account details: ${response.statusText}`);
      }
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const isCompanyNameChanged = companyName !== originalCompanyName;
    if (companyName !== originalCompanyName && !newCertification) {
      Alert.alert("Notification", "Please update the certification when changing the company name");
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
        Alert.alert("Success", "Company information updated successfully");
        router.replace("ViewAccount");
      } else {
        Alert.alert("Error", `Failed to update company information: ${xhr.responseText}`);
      }
    };
    xhr.onerror = () => {
      Alert.alert("Error", "An error occurred");
    };
    xhr.send(formData);
  };

  const handleCancel = () => {
    router.replace("ViewAccount");
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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            {newLogo ? (
              <Image style={styles.logo} source={{ uri: newLogo }} />
            ) : companyLogo ? (
              <Image style={styles.logo} source={{ uri: `http://beejobs.io.vn:14307${companyLogo}` }} />
            ) : (
              <Text>No logo available</Text>
            )}
            <TouchableOpacity style={styles.changeButton} onPress={() => handleImagePicker(setNewLogo)}>
              <Text style={styles.buttonText}>Change Logo</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.header}>Edit Company Information</Text>
        </View>
        <View style={styles.detailContainer}>
          <Icon name="building" size={20} color="#007bff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Company Name"
            value={companyName}
            onChangeText={(text) => {
              setCompanyName(text);
              if (text !== originalCompanyName) {
                setNewCertification(null);
              }
            }}
          />
        </View>
        <View style={styles.detailContainer}>
          <Icon name="map-marker" size={20} color="#28a745" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={companyAddress}
            onChangeText={setCompanyAddress}
          />
        </View>
        <View style={styles.detailContainer}>
          <Icon name="globe" size={20} color="#dc3545" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Website"
            value={companyWebsite}
            onChangeText={setCompanyWebsite}
          />
        </View>
        <View style={styles.detailContainer}>
          <Icon name="bars" size={20} color="#ffc107" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Scale"
            value={companyScale}
            onChangeText={setCompanyScale}
          />
        </View>
        <View style={styles.detailContainer}>
          <Icon name="id-card" size={20} color="#17a2b8" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Tax Code"
            value={taxCode}
            onChangeText={setTaxCode}
          />
        </View>
        <View style={styles.detailContainer}>
          <Icon name="file-text" size={20} color="#6c757d" style={styles.icon} />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Company Description"
            value={companyDesc}
            multiline
            numberOfLines={4}
            onChangeText={setCompanyDesc}
          />
        </View>
        <View style={styles.certificationContainer}>
          {newCertification ? (
            <Image style={styles.certification} source={{ uri: newCertification }} />
          ) : companyCertification ? (
            <Image style={styles.certification} source={{ uri: `http://beejobs.io.vn:14307${companyCertification}` }} />
          ) : (
            <Text>No certification available</Text>
          )}
                    <TouchableOpacity style={styles.changeButton} onPress={() => handleImagePicker(setNewCertification)}>
            <Text style={styles.buttonText}>Change Certification</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    paddingBottom: 20,
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
    marginBottom: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  certificationContainer: {
    marginBottom: 16,
    alignItems: 'center',
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
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    marginTop: 20,
    width: '45%',
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#EE6363',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6c757d',
    marginTop: 20,
    width: '45%',
    alignSelf: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
});

