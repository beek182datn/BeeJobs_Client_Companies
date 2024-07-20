import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, BackHandler, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

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
        console.log("API Response Data:", data); // Kiểm tra cấu trúc dữ liệu
  
        // Kiểm tra dữ liệu có đúng như mong đợi không
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Kiểm tra xem accountDetails có tồn tại không trước khi render
  if (!accountDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No account details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{accountDetails.company_address}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Website:</Text>
        <Text style={styles.value}>{accountDetails.company_website}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Scale:</Text>
        <Text style={styles.value}>{accountDetails.company_scale}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Tax Code:</Text>
        <Text style={styles.value}>{accountDetails.taxcode}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("EditAccount")}
      >
        <Text style={styles.buttonText}>Edit Company</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    flex: 2,
    fontSize: 18,
    color: '#555',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
