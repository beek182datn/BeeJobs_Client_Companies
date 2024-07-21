import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, RefreshControl, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';

interface CompanyInfo {
  company_logo?: string;
  company_name?: string;
  active?: boolean;
}

const Home = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({});
  const [totalJobs, setTotalJobs] = useState(0);
  const [appliedJobs, setAppliedJobs] = useState(0);
  const [appliedJobsDone, setAppliedJobsDone] = useState(0);
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
        <ImageBackground source={require('../../assets/images/Beejob_ket_noi_viec_lam_02.png')} style={styles.headerBackground}>
          <Text style={styles.welcomeText}>Chào mừng bạn đến với BeeJobs!</Text>
          {companyInfo.company_logo && (
            <Image source={{ uri: "http://beejobs.io.vn:14307/" + companyInfo.company_logo }} style={styles.logo} />
          )}
        </ImageBackground>
        
        <View style={styles.statusContainer}>
         <Text style={styles.companyName}>{companyInfo.company_name}</Text>
         <TouchableOpacity onPress={() => router.push('/Notifications')} style={styles.notificationIcon}>
            <Ionicons name="notifications" size={24} color="#1e90ff" />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: "row", alignSelf:"flex-end"}}>
          <Text style={[styles.statusText, { color: accountStatus === 'Đã phê duyệt' ? 'green' : 'red' }]}>
             {accountStatus}
          </Text>
          {accountStatus === 'Đã phê duyệt' && (
            <Ionicons name="checkmark-circle" size={24} color="green" style={styles.icon} />
          )}
          </View>

        <View style={styles.statContainer}>
          <Text style={styles.statText}>Thống kê:</Text>
          <BarChart
            data={{
              labels: ["Tổng số tin", "Đã ứng tuyển", "Hồ sơ trúng tuyển"],
              datasets: [
                {
                  data: [totalJobs, appliedJobs,appliedJobsDone]
                }
              ]
            }}
            width={420}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#ff9800",
              backgroundGradientTo: "#87cefa",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(3, 148, 20, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/Jobs')} activeOpacity={0.7}>
            <Text style={styles.buttonText}>Tổng số tin đã đăng: {totalJobs}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/AppliedJobs')} activeOpacity={0.7}>
            <Text style={styles.buttonText}>Tin đã có đơn ứng tuyển: {appliedJobs}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:5,
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  logo: {
    margin: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  companyName: {
    flexWrap: 'wrap',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 5,
    width:"80%",
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-between",
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
    alignSelf:"flex-end",
    color: '#fff',
    fontWeight: 'bold',
    margin:5,
  },
  headerBackground: {
    width: '100%',
    height: 170,
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  statContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statText: {
    alignSelf:"flex-start",
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationIcon: {
    alignSelf:"flex-end",
    margin:5,
  },
});

export default Home;
