import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const { width } = Dimensions.get('window');
const iconSize = width * 0.05; 

interface DetailRowProps {
  icon: string;   
  title: string; 
  value: string;  
  color?: string; 
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, title, value, color })  => (
    <View style={styles.row}>
      <Icon name={icon} size={iconSize} color={color} style={styles.rowIcon} />
      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );

const DetailsJobRemoved = () => {
    const { data } = useLocalSearchParams();
  const item = data ? JSON.parse(data) : {};
  const router = useRouter();
    const suitableCandidate = async () => {
        try {
          const value = await AsyncStorage.getItem('premium');
          if (value !== null) {
            const isPremium = JSON.parse(value); // Parse giá trị JSON
            if (isPremium) {
              router.push({
                pathname: 'ListSuitableCandidate',
                params: { job_id: item._id },
              });
            } else {
              Alert.alert(
                'Thông báo',
                'Tài khoản của bạn chưa được sử dụng tính năng này, hãy nâng cấp để được sử dụng.',
                [
                  {
                    text: 'Hủy',
                    style: 'cancel',
                  },
                  {
                    text: 'Nâng cấp',
                    onPress: () => router.push('/(tab_home)/Profile') // Chuyển đến màn hình hồ sơ sau khi nhấn OK
                  }
                ]
              );
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      const handleApplyInfoPress = () => {
        router.push({
          pathname: 'ListApplyForJob',
          params: { jobId: item._id },
        });
      };
    
      useEffect(() => {
        const backAction = () => {
          router.replace('Jobs');
          return true;
        };
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
        return () => backHandler.remove();
      }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.applyButton2} onPress={suitableCandidate}>
      <Ionicons name="people" size={22} color="#0099CC" />
          <Text style={styles.applyButtonText1}> Tìm ứng viên phù hợp »</Text>
        </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailsContainer}>
          <DetailRow
            icon="tag"
            title="Tiêu đề:"
            value={item.title}
            color="#FF6347" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="file-text"
            title="Mô tả:"
            value={item.desc}
            color="#4682B4" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="briefcase"
            title="Chuyên ngành:"
           value={item.majors}
            color="#32CD32" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="list-alt"
            title="Hình thức:"
            value={item.form}
            color="#32CD32" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="users"
            title="Số lượng tuyển:"
            value={item.number_of_recruitments}
            color="#FFD700" 
          />

          <View style={styles.divider} />
          <DetailRow
            icon="clock-o"
            title="Thời gian làm việc"
            value={item.working_time}
            color="#0000FF" 
          />

          <View style={styles.divider} />
          <DetailRow
            icon="check-circle"
            title="Yêu cầu:"
            value={item.requirements}
            color="#8A2BE2" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="money"
            title="Lương:"
            value={item.salary}
            color="#FF4500" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="gift"
            title="Lợi ích:"
            value={item.benefits}
            color="#DA70D6" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="book"
            title="Kinh Nghiệm:"
            value={item.experience}
            color="#B2DFEE" 
          />

          <View style={styles.divider} />
          <DetailRow
            icon="map-marker"
            title="Vị trí:"
            value={item.location}
            color="#20B2AA" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="calendar"
            title="Hạn nộp hồ sơ:"
            value={item.deadline}
            color="#DC143C" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="clock-o"
            title="Ngày tạo:"
            value={`${new Date(item.created_at).toLocaleDateString()} ${new Date(item.created_at).toLocaleTimeString()}`}
            
            color="#B22222" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="clock-o"
            title="Hạn đăng tin:"
            value={`${new Date(item.expires_at).toLocaleDateString()} ${new Date(item.expires_at).toLocaleTimeString()}`}
            
            color="#ff6400" 
          />
        </View>
        
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyInfoPress}>
          <Text style={styles.applyButtonText}>Thông tin ứng tuyển</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default DetailsJobRemoved
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
    },
    scrollContainer: {
      paddingHorizontal: width * 0.05, 
    },
    detailsContainer: {
      marginBottom: width * 0.2, 
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: width * 0.015, 
    },
    rowIcon: {
      marginRight: width * 0.03, 
    },
    rowContent: {
      flex: 1,
    },
  
    rowTitle: {
      fontSize: width * 0.04,
      color: '#999',
      fontWeight: 'bold',
      
    },
    rowValue: {
      fontSize: width * 0.035, 
      color: '#333', 
      fontWeight: 'bold', 
      marginTop: width * 0.01, 
    },
    divider: {
      height: 1,
      backgroundColor: '#e0e0e0',
      marginVertical: width * 0.02, 
    },
    footer:{
      height:"15%",
    },
    buttonContainer: {
      marginTop:15,
      width: "90%",
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    applyButton: {
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: '#007bff',
      paddingVertical: width * 0.04, 
      borderRadius: 15,
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
      marginTop:10,
    },
    applyButton1: {
      marginTop:10,
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: '#ff6400',
      paddingVertical: width * 0.04, 
      borderRadius: 15,
      alignItems: 'center',
    },
    applyButton2: {
      marginVertical:5,
      flexDirection:"row",
      marginHorizontal: 15,
      backgroundColor: '#008000', 
      borderRadius: 7,
      width:"40%",
      height:45,
      alignSelf:"flex-end",
      alignItems: 'center',
      justifyContent: 'center',
    },
    applyButtonText: {
      color: '#ffffff',
      fontSize: width * 0.03, 
      fontWeight: 'bold',
    },
    applyButtonText1: {
      color: '#ffffff',
      fontSize: width * 0.03, 
      fontWeight: 'bold',
    },
  });