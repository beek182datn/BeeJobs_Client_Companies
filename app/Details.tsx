import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, BackHandler } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const iconSize = width * 0.05; 

const DetailRow = ({ icon, title, value, color }) => (
  <View style={styles.row}>
    <Icon name={icon} size={iconSize} color={color} style={styles.rowIcon} />
    <View style={styles.rowContent}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  </View>
);

export default function Details() {
  const { data } = useLocalSearchParams();
  const item = data ? JSON.parse(data) : {};
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
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
            title="Thời hạn:"
            value={item.deadline}
            color="#DC143C" 
          />
          <View style={styles.divider} />
          <DetailRow
            icon="clock-o"
            title="Ngày tạo:"
            value={item.created_at}
            color="#B22222" 
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.applyButton} onPress={handleApplyInfoPress}>
        <Text style={styles.applyButtonText}>Thông tin ứng tuyển</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    padding: width * 0.05, 
  },
  detailsContainer: {
    marginBottom: width * 0.2, 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.03, 
  },
  rowIcon: {
    marginRight: width * 0.03, 
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: width * 0.05, 
    fontWeight: '600',
    color: '#333',
  },
  rowValue: {
    fontSize: width * 0.04, 
    color: '#555',
    marginTop: width * 0.01, 
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: width * 0.02, 
  },
  applyButton: {
    position: 'absolute',
    bottom: width * 0.05, 
    left: width * 0.05, 
    right: width * 0.05, 
    backgroundColor: '#007bff',
    paddingVertical: width * 0.04, 
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: width * 0.05, 
    fontWeight: '700',
  },
});



