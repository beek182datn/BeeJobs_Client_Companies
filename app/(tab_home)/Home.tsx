import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = await AsyncStorage.getItem('company_id');
        const response = await axios.get(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`);
        
        setCompanyInfo(response.data.data); // Chỉnh sửa tại đây
        console.log(response.data.data);
        
        setAccountStatus(response.data.data.active ? 'Đã phê duyệt' : 'Chưa phê duyệt');

        const jobResponse = await axios.get(`http://beejobs.io.vn:14307/api/jobs/getJobsByIdCompany/${companyId}`);
        const jobs = jobResponse.data.data;
        setTotalJobs(jobs.length);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
      {companyInfo.company_logo && (
          <Image source={{ uri:"http://beejobs.io.vn:14307/"+ companyInfo.company_logo }} style={styles.logo} />
        )}
      <View style={styles.header}>
        <Text style={styles.companyName}>{companyInfo.company_name}</Text>
        <Text style={styles.welcomeText}>Chào mừng bạn đến với BeeJobs!</Text>
      </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    marginTop:15,
    alignSelf:"flex-end",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
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
