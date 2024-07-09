import React from 'react';
import { StyleSheet, Text, View, ScrollView, Linking } from 'react-native';

export default function HelpCenter() {
  // Hàm mở liên kết web
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('Không thể mở liên kết:', err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Trung tâm Trợ giúp BeeJobs</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hướng dẫn sử dụng ứng dụng</Text>
        <Text style={styles.sectionContent}>
          Để biết thêm chi tiết về cách sử dụng ứng dụng BeeJobs, vui lòng xem Hướng dẫn sử dụng tại đây: {' '}
          <Text style={styles.link} onPress={() => openLink('https://github.com/beek182datn/BeeJobs_Client_Companies/commit/d03bceeda0236fcff4538c8f071e08e9491f9500?diff=unified&w=0')}>Hướng dẫn sử dụng</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Câu hỏi thường gặp (FAQs)</Text>
        <Text style={styles.sectionContent}>
          Các câu hỏi thường gặp về BeeJobs và câu trả lời của chúng tôi có thể được tìm thấy tại đây: {' '}
          <Text style={styles.link} onPress={() => openLink('https://chatgpt.com/?fbclid=IwAR0eRtFjMuf5sESaa5W_PcBC3pgg-trMHTPYZi_FnH6QrhAlqKy_cXMDs70')}>FAQs</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Liên hệ hỗ trợ</Text>
        <Text style={styles.sectionContent}>
          Nếu bạn có thắc mắc hoặc cần hỗ trợ từ chúng tôi, vui lòng liên hệ qua email: {' '}
          <Text style={styles.link} onPress={() => Linking.openURL('beek182.datn@gmail.com')}>beek182.datn@gmail.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
