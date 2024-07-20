import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface CompanyInfo {
  company_logo?: string;
  company_name?: string;
  active?: boolean;
}

const Home = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({});
  const [totalJobs, setTotalJobs] = useState(0);
  const [appliedJobs, setAppliedJobs] = useState(0);
  const [accountStatus, setAccountStatus] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const companyId = await AsyncStorage.getItem('company_id');
      if (companyId) {
        const response = await axios.get(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`);
        setCompanyInfo(response.data.data);
        console.log(response.data.data);
        
        setAccountStatus(response.data.data.active ? 'Đã phê duyệt' : 'Chưa phê duyệt');

        const jobResponse = await axios.get(`http://beejobs.io.vn:14307/api/jobs/getJobsByIdCompany/${companyId}`);
        const jobs = jobResponse.data.data;
        setTotalJobs(jobs.length);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Chào mừng bạn đến với BeeJobs!</Text>
          {companyInfo.company_logo && (
            <Image source={{ uri: "http://beejobs.io.vn:14307/" + companyInfo.company_logo }} style={styles.logo} />
          )}
        </View>
        <Text style={styles.companyName}>{companyInfo.company_name}</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: accountStatus === 'Đã phê duyệt' ? 'green' : 'red' }]}>
            Trạng thái tài khoản: {accountStatus}
          </Text>
          {accountStatus === 'Đã phê duyệt' && (
            <Ionicons name="checkmark-circle" size={24} color="green" style={styles.icon} />
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/JobPosts')}>
            <Text style={styles.buttonText}>Tổng số tin đã đăng: {totalJobs}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/AppliedJobs')}>
            <Text style={styles.buttonText}>Tin đã có đơn ứng tuyển: {appliedJobs}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  logo: {
    margin: 15,
    alignSelf: "flex-end",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  companyName: {
    flexWrap: 'wrap',
    width: '100%',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    marginRight: 10,
  },
  icon: {
    marginLeft: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#ff6400',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default Home;
