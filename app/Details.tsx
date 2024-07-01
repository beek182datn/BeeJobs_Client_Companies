
import { StyleSheet, Text, View, ScrollView, Dimensions, Animated, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

export default function Details() {
  const { data } = useLocalSearchParams();
  const item = data ? JSON.parse(data) : {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const images = [
    { id: '1', src: require('../assets/images/Beejob_ket_noi_viec_lam_01.png') },
    { id: '2', src: require('../assets/images/Beejob_ket_noi_viec_lam_02.png') },
    { id: '3', src: require('../assets/images/Beejob_ket_noi_viec_lam_03.png') },
    { id: '4', src: require('../assets/images/Beejob_ket_noi_viec_lam.png') },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextImage();
    }, 3000); // Chuyển đổi ảnh mỗi 3 giây

    return () => clearInterval(interval); // Clear interval khi component bị unmount
  }, [currentIndex]);




  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const renderIndicator = () => {
    return (
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              { opacity: currentIndex === index ? 1 : 0.3 }
            ]}
          />
        ))}
      </View>
    );
  };

  const goToNextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
  };

  const goToPreviousImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
  };

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

      <View style={styles.sliderContainer}>
        <TouchableOpacity style={styles.button} onPress={goToPreviousImage}>
          <Text style={styles.buttonText}>{"<"}</Text>
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={handleScroll} // Sử dụng onMomentumScrollEnd thay vì onScroll
          contentContainerStyle={styles.imageContainer}
          renderItem={({ item }) => (
            <Image source={item.src} style={styles.image} />
          )}
          keyExtractor={item => item.id}
        />
        <TouchableOpacity style={styles.button} onPress={goToNextImage}>
          <Text style={styles.buttonText}>{">"}</Text>
        </TouchableOpacity>
        {renderIndicator()}
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: width * 0.8,
    height: 250,
    resizeMode: 'contain', // Ảnh sẽ không bị cắt và hiển thị toàn bộ
    borderRadius: 10, // Điều chỉnh border radius
  
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
    alignItems: 'center', // Căn giữa theo chiều dọc
  },
});

