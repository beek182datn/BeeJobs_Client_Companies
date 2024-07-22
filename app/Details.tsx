import { StyleSheet, Text, View, ScrollView, Dimensions, Animated, Image, FlatList, TouchableOpacity, BackHandler } from "react-native";
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
            <Icon name="tag" size={20} color="#007bff" style={styles.icon} />
            <Text style={styles.title}>Tiêu đề: {item.title}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="file-text" size={20} color="#007bff" style={styles.icon} />
            <Text style={styles.text}>Mô tả: {item.desc}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="list-alt" size={20} color="#007bff" style={styles.icon} />
            <Text style={styles.text}>Hình thức: {item.form}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="users" size={20} color="#007bff" style={styles.icon} />
            <Text style={styles.text}>Số lượng tuyển: {item.number_of_recruitments}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="check-circle" size={20} color="#007bff" style={styles.icon} />
            <Text style={styles.text}>Yêu cầu: {item.requirements}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="money" size={20} color="#007bff" style={styles.icon} />
            <Text style={styles.text}>Lương: {item.salary}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="gift" size={20} color="#007bff" style={styles.icon} />
            <Text style={styles.text}>Lợi ích: {item.benefits}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="map-marker" size={20} color="#007bff" style={styles.icon} />
            <Text style={styles.text}>Vị trí: {item.location}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="calendar" size={20} color="#007bff" style={styles.icon} />
            <Text style={styles.text}>Thời hạn: {item.deadline}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Icon name="clock-o" size={20} color="#007bff" style={styles.icon} />
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
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    padding: 20,
    marginBottom: 80,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  text: {
    fontSize: 18,
    color: '#555',
    margin: 8,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  applyButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingVertical: 15,
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
    fontSize: 18,
    fontWeight: '700',
  },
});

