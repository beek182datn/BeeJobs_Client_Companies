
import { StyleSheet, Text, View, ScrollView, Dimensions, Animated, Image, FlatList, TouchableOpacity , BackHandler} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

export default function Details() {
  const { data } = useLocalSearchParams();
  const item = data ? JSON.parse(data) : {};
  const router = useRouter();

  const handleApplyInfoPress = () => {
    router.push({
      pathname: 'ListApplyForJob',
      params: { jobId: item._id }
    });
  };


  useEffect(() => {
    const backAction = () => {
      router.replace("Jobs");
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.item}>
            <Icon name="tag" size={20} color="#333" style={styles.icon} />
            <Text style={styles.title}>Tiêu đề: {item.title}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="file-text" size={20} color="#333" style={styles.icon} />
            <Text style={styles.text}>Mô tả: {item.desc}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="list-alt" size={20} color="#333" style={styles.icon} />
            <Text style={styles.text}>Hình thức: {item.form}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="users" size={20} color="#333" style={styles.icon} />
            <Text style={styles.text}>Số lượng tuyển: {item.number_of_recruitments}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="check-circle" size={20} color="#333" style={styles.icon} />
            <Text style={styles.text}>Yêu cầu: {item.requirements}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="money" size={20} color="#333" style={styles.icon} />
            <Text style={styles.text}>Lương: {item.salary}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="gift" size={20} color="#333" style={styles.icon} />
            <Text style={styles.text}>Lợi ích: {item.benefits}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="map-marker" size={20} color="#333" style={styles.icon} />
            <Text style={styles.text}>Vị trí: {item.location}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="calendar" size={20} color="#333" style={styles.icon} />
            <Text style={styles.text}>Thời hạn: {item.deadline}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="clock-o" size={20} color="#333" style={styles.icon} />
            <Text style={styles.text}>Ngày tạo: {item.created_at}</Text>
          </View>
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
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 15,
    marginBottom: 150,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
    margin: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  sliderContainer: {
    marginLeft: 10,
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '95%',
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  image: {
    width: width * 0.9,
    height: 200,
    resizeMode: 'cover', 
    borderRadius: 10, 

   
  
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    margin: 5,
   
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },  imageContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Căn giữa theo chiều ngang
    
   
  }, applyButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

