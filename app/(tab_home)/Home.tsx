import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, RefreshControl, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [appliedJobsFalse, setAppliedJobsFalse] = useState(0);
  const [countJobApplied, setCountJobApplied] = useState(0);
  const [countJobAppliedDone, setCountJobAppliedDone] = useState(0);
  const [wokerApplied, setWokerApplied] = useState(0);
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

        const CountApplyiedJob = await axios.get(`http://beejobs.io.vn:14307/api/applyJobs/getApylyJobsByIdCompany/${companyId}`);
        const countapplyforCompany = CountApplyiedJob.data.data;
        setAppliedJobs(countapplyforCompany.length);

        const CountAppliedDone = await axios.get(`http://beejobs.io.vn:14307/api/applyJobs/getApplyJobsDoneByIdCompany/${companyId}`);
        const count = CountAppliedDone.data.data;
        setAppliedJobsDone(count.length);

        const CountAppliedFalse = await axios.get(`http://beejobs.io.vn:14307/api/applyJobs/getApplyJobsFalseByIdCompany/${companyId}`);
        const countFalse = CountAppliedFalse.data.data;
        setAppliedJobsFalse(countFalse.length);

        const countjobapplied = await axios.get(`http://beejobs.io.vn:14307/api/jobs/getJobsAppliedByCompanyId/${companyId}`);
        setCountJobApplied(countjobapplied.data.data);

        const countjobappliedDone = await axios.get(`http://beejobs.io.vn:14307/api/jobs/getJobApplyDonedByCompanyId/${companyId}`);
        setCountJobAppliedDone(countjobappliedDone.data.data);

        const countWorkerApplied = await axios.get(`http://beejobs.io.vn:14307/api/applyJobs/getWorkerAppliedByCompanyId/${companyId}`);
        setWokerApplied(countWorkerApplied.data.data);
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
              labels: ["Tổng số tin", "Hồ sơ ứng tuyển", "Hồ sơ Pass", "Hồ sơ bị loại"],
              datasets: [
                {
                  data: [totalJobs, appliedJobs,appliedJobsDone, appliedJobsFalse]
                }
              ]
            }}
            width={Dimensions.get("screen").width/1.07}
            height={240}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#ff9800",
              backgroundGradientTo: "#87cefa",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(3, 148, 20, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForBackgroundLines: {
                strokeDasharray: "", // Đường nền liền
                strokeWidth: 0.5, // Độ dày của đường nền
              },
              barPercentage: 1,
              propsForLabels: {
                fontWeight: 'bold',
                fontSize: 12,
              },
            }}
            fromZero={true}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.touchable} onPress={() => router.push('/Jobs')} activeOpacity={0.7}>
            <LinearGradient
              colors={['#f0f0f0', '#87cefa']}
              style={styles.button}
              start={[0, 1]}
              end={[1, 0]}
            >
            <Ionicons name="briefcase" size={25} color="#0099CC" />
            <Text style={styles.buttonText}>Tổng số tin đã đăng</Text>
            <Text style={styles.value}>{totalJobs}</Text>
            </LinearGradient>
         </TouchableOpacity>

          <TouchableOpacity style={styles.touchable} activeOpacity={0.7}>
            <LinearGradient
              colors={['#f0f0f0', '#87cefa']}
              style={styles.button}
              start={[0, 1]}
              end={[1, 0]}
            >
            <Ionicons name="shuffle" size={25} color="#0099CC" />
            <Text style={styles.buttonText}>Tin đã có đơn ứng tuyển</Text>
            <Text style = {styles.value}>{countJobApplied}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.touchable} activeOpacity={0.7}>
            <LinearGradient
              colors={['#00ff7f' ,'#f0f0f0' ]}
              style={styles.button}
              start={[0, 1]}
              end={[1, 0]}
            >
            <Ionicons name="checkmark-done-circle" size={25} color="#0099CC" />
            <Text style={styles.buttonText}>Tin đã có hồ sơ trúng tuyển</Text>
            <Text style={styles.value}>{countJobAppliedDone}</Text>
            </LinearGradient>
         </TouchableOpacity>

          <TouchableOpacity style={styles.touchable} activeOpacity={0.7}>
            <LinearGradient
              colors={['#00ff7f' , '#f0f0f0' ]}
              style={styles.button}
              start={[0, 1]}
              end={[1, 0]}
            >
            <Ionicons name="person-add" size={25} color="#0099CC" />
            <Text style={styles.buttonText}>Số ứng viên đã ứng tuyển</Text>
            <Text style = {styles.value}>{wokerApplied}</Text>
            </LinearGradient>
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
  touchable: {
    flex: 1,
    marginHorizontal: 5, // Đảm bảo khoảng cách giữa các nút
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    marginVertical:7,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button1: {
    flex: 1,
    backgroundColor: '#008000',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
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
  value:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color:"#0099CC"
  }
});

export default Home;
