import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chính sách Bảo mật của BeeJobs</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Thu thập thông tin</Text>
        <Text style={styles.sectionContent}>
          BeeJobs thu thập thông tin cá nhân từ người dùng khi đăng ký tài khoản và sử dụng các dịch vụ của chúng tôi, bao gồm tên, địa chỉ email, số điện thoại và thông tin hồ sơ cá nhân khác cần thiết.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Sử dụng thông tin</Text>
        <Text style={styles.sectionContent}>
          Thông tin cá nhân được sử dụng để cung cấp và quản lý dịch vụ của BeeJobs, bao gồm việc tạo và quản lý hồ sơ, tìm kiếm việc làm, và liên lạc với người dùng về các cơ hội việc làm phù hợp.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Bảo vệ thông tin</Text>
        <Text style={styles.sectionContent}>
          Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng và áp dụng các biện pháp bảo mật thích hợp để ngăn chặn truy cập trái phép, sử dụng sai mục đích, hoặc tiết lộ thông tin cá nhân.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Chia sẻ thông tin</Text>
        <Text style={styles.sectionContent}>
          BeeJobs không chia sẻ thông tin cá nhân của người dùng với bên thứ ba ngoài các trường hợp được phép hoặc yêu cầu bởi pháp luật.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Điều chỉnh và cập nhật</Text>
        <Text style={styles.sectionContent}>
          Người dùng có quyền truy cập và cập nhật thông tin cá nhân của mình thông qua ứng dụng BeeJobs.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Liên hệ</Text>
        <Text style={styles.sectionContent}>
          Nếu có bất kỳ câu hỏi, góp ý hoặc khiếu nại nào về chính sách bảo mật của BeeJobs, vui lòng liên hệ với chúng tôi qua địa chỉ email privacy@beejobs.com.
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
});
