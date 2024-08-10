import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, Alert, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');
import { useFocusEffect } from '@react-navigation/native';



export default function Profile() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idUser, setIdUser] = useState(null);

  const toUpAccount = async () => {
    router.push("ToUpAccountScreen");
  }

  const UpgradeAccount = async () => {
    router.push("UpgradeAccountScreen");
  }

  const fetchCompanyData = async () => {
    try {
      const companyId = await AsyncStorage.getItem('company_id');
      const idUser = await AsyncStorage.getItem('idUser');
      setIdUser(idUser);

      if (!companyId) {
        throw new Error('Company ID not found');
      }
      const response = await fetch(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCompanyData(data.data || data);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setError(error.message);
      Alert.alert('Error', 'Failed to load company data.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true); 
      fetchCompanyData();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', "Bạn có muốn đăng xuất không",
      [
        {text: 'Hủy', style: 'cancel'},
        {text: 'Đăng xuất', onPress: async ()=>{

          try {
            await AsyncStorage.clear();
            router.replace("LoginScreen");
          } catch (error) {
            console.error("Error clearing AsyncStorage:", error);
            Alert.alert('Error', 'Failed to log out.');
          }

        }}, ],
)
}

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0099FF" />
      </SafeAreaView>
    );
  }

  if (error || !companyData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Failed to load data or no data available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.profileContainer}>
        <Image
          style={styles.imageProfile}
          source={companyData?.company_logo ? { uri: `http://beejobs.io.vn:14307${companyData.company_logo}` } : require("../../assets/images/avatar-15.png")}
        />
        <View style={styles.textContainer}>
          <Text style={styles.companyName}>{companyData?.company_name || "Tên công ty"}</Text>
          <Text style={styles.userId}>{idUser || "Mã công ty"}</Text>
        </View>
      </View>
      

      <View style={styles.paycontainer}>
      <View style={styles.leftContainer}>
        <Ionicons name="wallet" size={30} color="#1e90ff" />
        <Text style={styles.label}>Tài khoản chính</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.currency}>$</Text>
        <TouchableOpacity onPress={toUpAccount}>
        <Text style={styles.balance}>{companyData.currency}</Text>
        </TouchableOpacity>
      </View>
    </View>

    {companyData.premium ? (
      <View style = {styles.premiumView}>
        <Text style = {styles.introText}>Doanh nghiệp đã nâng cấp Premium</Text>
        <Image source={require('../../assets/images/crown.png')} style={styles.crownImage} />
      </View>
    ) : (
      <View>
        <Text style = {styles.introText}>Nâng cấp để sử dụng những dịch vụ tốt nhất! </Text>
      <TouchableOpacity onPress={UpgradeAccount} style={styles.upgradeButton}>
        <Text style={styles.upgradeText}>Nâng cấp tài khoản</Text>
      </TouchableOpacity>
      </View>
    )}

    <ScrollView style= {styles.scrollview}>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Cài đặt tài khoản</Text>

        <TouchableOpacity style={styles.textIcon} onPress={() => router.push("ChangePassword")}>
          <Icon name="key-outline" size={24} style={styles.icon} />
          <Text style={styles.underlinedText}>Đổi mật khẩu</Text>
          <Icon name="chevron-forward-outline" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.textIcon} onPress={() => router.push("ViewAccount")}>
          <Icon name="albums-outline" size={24} style={styles.icon} />
          <Text style={styles.underlinedText}>Xem thông tin chi tiết tài khoản</Text>
          <Icon name="chevron-forward-outline" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Thông tin dịch vụ</Text>

        <TouchableOpacity style={styles.textIcon} onPress={() => router.push("CompanyIntroduction")}>
          <Icon name="business-outline" size={24} style={styles.icon} />
          <Text style={styles.underlinedText}>Về BeeJobs</Text>
          <Icon name="chevron-forward-outline" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.textIcon} onPress={() => router.push("TermsOfService")}>
          <Icon name="document-text-outline" size={24} style={styles.icon} />
          <Text style={styles.underlinedText}>Điều khoản dịch vụ</Text>
          <Icon name="chevron-forward-outline" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.textIcon} onPress={() => router.push("PrivacyPolicy")}>
          <Icon name="document-lock-outline" size={24} style={styles.icon} />
          <Text style={styles.underlinedText}>Chính sách bảo mật</Text>
          <Icon name="chevron-forward-outline" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.textIcon} onPress={() => router.push("HelpCenter")}>
          <Icon name="call-outline" size={24} style={styles.icon} />
          <Text style={styles.underlinedText}>Trợ giúp</Text>
          <Icon name="chevron-forward-outline" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
        <Text style={styles.textLogout}>Đăng xuất</Text>
        <Icon name="enter-outline" size={24} color="white" />
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  profileContainer: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageProfile: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    borderWidth: 2,
    borderColor: "#0099FF",
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  companyName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: "#333333",
  },
  userId: {
    fontSize: width * 0.035,
    color: "#666666",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#0099FF",
    marginBottom: 10,
  },
  textIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    color: "#0099FF",
  },
  underlinedText: {
    fontSize: width * 0.035,
    marginLeft: 15,
    flex: 1,
    color: "#333333",
    textDecorationLine: "underline",
  },
  buttonLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0099FF",
    borderRadius: 10,
    padding: width * 0.04, 
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textLogout: {
    color: "white",
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  scrollview: {
    flexGrow: 1,
  },
  paycontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom:10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight:"bold",

  },
  currency: {
    fontSize: 16,
    marginRight: 8,
    fontWeight:"bold",
  },
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    color:"#1e90ff"
  },
  crownImage: {
    marginLeft:10,
    width: 25 ,
    height: 25,
  },
  upgradeButton: {
    marginTop:10,
    backgroundColor: "#5BBD2B",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20, 
    width:"40%",
  },
  upgradeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  introText:{
    marginTop: 15,
    fontWeight: "400",
    fontStyle: "italic",
  },
  premiumView:{
    flexDirection:"row",
    marginBottom: 10,
  }
});

