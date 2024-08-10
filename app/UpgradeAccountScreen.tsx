import { View, Text, TouchableOpacity, StyleSheet,Alert, ScrollView } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';


const UpgradeAccountScreen = () => {

  const router = useRouter();

  const handleUpgrade = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn nâng cấp tài khoản với 199$?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async () => {
            console.log("Upgrade to Premium for $199");
            // Handle the upgrade logic here
            const companyId = await AsyncStorage.getItem('company_id');
            if(companyId){
              const response = await axios.get(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`);
              if(response.data.data.currency < 199){
                Alert.alert('Lỗi', 'Số dư của bạn không đủ!');
                router.push("ToUpAccountScreen");
              }else{
                const upgrade = await axios.post(`http://beejobs.io.vn:14307/api/companies/upgrade_to_premium/${companyId}`);
                await AsyncStorage.setItem('premium', JSON.stringify(upgrade.data.data.premium));
                const amount = "-199";
              
              await axios.post(`http://beejobs.io.vn:14307/api/companies/top_up_account/${companyId}`, {
                amount: Number(amount),
              });
              Alert.alert('Thành công', 'Nâng cấp thành công!');
              router.replace("/(tab_home)/Profile");
              }
              
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Lợi ích khi nâng cấp tài khoản:</Text>
        <Text style={styles.benefitItem}>- Truy cập không giới hạn vào tất cả các tính năng.</Text>
        <Text style={styles.benefitItem}>- Ưu tiên hỗ trợ khách hàng.</Text>
        <Text style={styles.benefitItem}>- Cơ hội tuyển dụng nhiều hơn.</Text>
        <Text style={styles.benefitItem}>- Tăng sự tin tưởng với biểu tượng Premium.</Text>
      </View>
      <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
        <Text style={styles.upgradeText}>Nâng cấp với $199</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  benefitItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  upgradeButton: {
    backgroundColor: '#5BBD2B',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width:"60%",
    alignSelf: 'center',
  },
  upgradeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpgradeAccountScreen;
