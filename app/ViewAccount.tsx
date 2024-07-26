import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, BackHandler, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ViewAccount() {
  const [loading, setLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState(null);
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
          setAccountDetails(data.data);
        } else {
          Alert.alert("Error", "Data structure is not as expected");
        }
      } else {
        Alert.alert("Error", "Failed to fetch account details");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("Profile");
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!accountDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>No account details available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          {accountDetails.company_logo ? (
            <Image
              style={styles.logo}
              source={{ uri: `http://beejobs.io.vn:14307${accountDetails.company_logo}` }}
            />
          ) : (
            <Text>No logo available</Text>
          )}
          <Text style={styles.header}>{accountDetails.company_name}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Icon name="location-on" size={24} color="#007bff" />
          <View style={styles.detailText}>
            <Text style={styles.label}>Địa chỉ:</Text>
            <Text style={styles.value}>{accountDetails.company_address}</Text>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <Icon name="web" size={24} color="#ff5722" />
          <View style={styles.detailText}>
            <Text style={styles.label}>Website:</Text>
            <Text style={styles.value}>{accountDetails.company_website}</Text>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <Icon name="domain" size={24} color="#4caf50" />
          <View style={styles.detailText}>
            <Text style={styles.label}>Quy mô:</Text>
            <Text style={styles.value}>{accountDetails.company_scale}</Text>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <Icon name="business" size={24} color="#ff9800" />
          <View style={styles.detailText}>
            <Text style={styles.label}>Mã số thuế:</Text>
            <Text style={styles.value}>{accountDetails.taxcode}</Text>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <Icon name="description" size={24} color="#9c27b0" />
          <View style={styles.detailText}>
            <Text style={styles.label}>Mô tả:</Text>
            <Text style={styles.value}>{accountDetails.company_desc}</Text>
          </View>
        </View>
        <Text style={styles.certificationTitle}>Giấy chứng nhận</Text>
        <View style={styles.certificationContainer}>
          {accountDetails.company_certification ? (
            <Image
              style={styles.certification}
              source={{ uri: `http://beejobs.io.vn:14307${accountDetails.company_certification}` }}
            />
          ) : (
            <Text>No certification available</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("EditAccount")}
          >
            <Text style={styles.buttonText}>Sửa thông tin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.replace("Profile")}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#8DEEEE',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailText: {
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  certificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
    marginLeft: 20,
  },
  certificationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  certification: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
    elevation: 2,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
