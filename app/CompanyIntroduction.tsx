import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function CompanyIntroduction() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BeeJobs - Ứng dụng kết nối việc làm</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giới thiệu về BeeJobs</Text>
        <Text style={styles.sectionContent}>
          BeeJobs là một nền tảng ứng dụng di động được thiết kế để kết nối người tìm việc và nhà tuyển dụng một cách nhanh chóng và hiệu quả. Ứng dụng này hướng đến việc cải thiện quá trình tuyển dụng, giúp các bên liên quan tiết kiệm thời gian và công sức.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đặc điểm nổi bật của BeeJobs</Text>
        <Text style={styles.sectionContent}>1. Đa dạng ngành nghề: BeeJobs cung cấp nhiều cơ hội việc làm trong các lĩnh vực khác nhau như công nghệ thông tin, tài chính, marketing, chăm sóc sức khỏe, giáo dục, và nhiều ngành nghề khác.</Text>
        <Text style={styles.sectionContent}>2. Giao diện thân thiện: Ứng dụng được thiết kế với giao diện người dùng dễ sử dụng, cho phép người dùng dễ dàng tạo hồ sơ, tìm kiếm việc làm, và nộp đơn ứng tuyển chỉ với vài thao tác đơn giản.</Text>
        <Text style={styles.sectionContent}>3. Công nghệ tiên tiến: BeeJobs áp dụng các thuật toán và công nghệ mới nhất để gợi ý các công việc phù hợp với hồ sơ và kinh nghiệm của người tìm việc, đồng thời giúp nhà tuyển dụng dễ dàng tìm thấy các ứng viên tiềm năng.</Text>
        <Text style={styles.sectionContent}>4. Tính năng nổi bật: Thông báo việc làm, Tạo hồ sơ chuyên nghiệp, Chat trực tiếp.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lợi ích khi sử dụng BeeJobs</Text>
        <Text style={styles.sectionContent}>
          Đối với nhà tuyển dụng:
          - Tiết kiệm thời gian trong việc tìm kiếm và tuyển dụng nhân tài.
          - Quản lý và theo dõi các ứng viên một cách dễ dàng và hệ thống.
          - Tăng cường khả năng tiếp cận đến một lượng lớn ứng viên tiềm năng.
        </Text>
        <Text style={styles.sectionContent}>
          Đối với người tìm việc:
          - Dễ dàng tiếp cận và ứng tuyển vào các vị trí việc làm mong muốn.
          - Nhận được thông tin tuyển dụng nhanh chóng và chính xác.
          - Tạo và quản lý hồ sơ tìm việc một cách chuyên nghiệp và thuận tiện.
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
