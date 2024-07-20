import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idUser, setIdUser] = useState(null); // State for IdUser

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const companyId = await AsyncStorage.getItem('company_id');
        const idUser = await AsyncStorage.getItem('idUser');
        setIdUser(idUser); // Update IdUser state

        if (!companyId) {
          throw new Error('Company ID not found');
        }
        const response = await fetch(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCompanyData(data.data || data); // Adjust based on the actual API response structure
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError(error.message);
        Alert.alert('Error', 'Failed to load company data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("LoginScreen");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

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
        <Text>{idUser || "Mã công ty"}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Cài đặt tài khoản</Text>

      <TouchableOpacity style={styles.textIcon} onPress={() => router.push("ChangePassword")}>
        <Icon name="key-outline" size={25} style={styles.icon} />
        <Text style={styles.underlinedText}>Đổi mật khẩu</Text>
        <Icon name="chevron-forward-outline" size={25} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.textIcon} onPress={() => router.push("ViewAccount")}>
        <Icon name="albums-outline" size={25} style={styles.icon} />
        <Text style={styles.underlinedText}>Xem thông tin chi tiết tài khoản</Text>
        <Icon name="chevron-forward-outline" size={25} style={styles.icon} />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Thông tin dịch vụ</Text>

      <TouchableOpacity style={styles.textIcon} onPress={() => router.push("CompanyIntroduction")}>
        <Icon name="business-outline" size={25} style={styles.icon} />
        <Text style={styles.underlinedText}>Về BeeJobs</Text>
        <Icon name="chevron-forward-outline" size={25} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.textIcon} onPress={() => router.push("TermsOfService")}>
        <Icon name="document-text-outline" size={25} style={styles.icon} />
        <Text style={styles.underlinedText}>Điều khoản dịch vụ</Text>
        <Icon name="chevron-forward-outline" size={25} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.textIcon} onPress={() => router.push("PrivacyPolicy")}>
        <Icon name="document-lock-outline" size={25} style={styles.icon} />
        <Text style={styles.underlinedText}>Chính sách bảo mật</Text>
        <Icon name="chevron-forward-outline" size={25} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.textIcon} onPress={() => router.push("ListApplyForJob")}>
        <Icon name="call-outline" size={25} style={styles.icon} />
        <Text style={styles.underlinedText}>Trợ giúp</Text>
        <Icon name="chevron-forward-outline" size={25} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
        <Text style={styles.textLogout}>Đăng xuất</Text>
        <Icon name="enter-outline" size={25} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonLogout: {
    marginTop: 20,
    backgroundColor: "#0099FF",
    height: 45,
    width: "100%",
    justifyContent: "center",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textLogout: {
    textAlign: "center",
    color: "white",
    marginRight: 10
  },
  imageProfile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#0099FF",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    height: 100,
    backgroundColor: "#EEEEEE",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    width: 25,
    marginRight: 10,
    color: "#BBBBBB",
  },
  textIcon: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#AAAAAA",
    paddingBottom: 5,
  },
  underlinedText: {
    fontSize: 14,
    width: "78%",
    marginLeft: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 10,
  }
});
