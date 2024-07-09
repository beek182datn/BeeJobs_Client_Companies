import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'


export default function TermsOfService() {
  return (
    <ScrollView contentContainerStyle= {styles.container}>
      <Text style= {styles.title}>Điều khoản dịch vụ của BeeJobs</Text>
      <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Phạm vi Dịch vụ</Text>
            <Text style={styles.sectionContent}>
                 BeeJobs cung cấp nền tảng trực tuyến để kết nối người tìm việc với nhà tuyển dụng. Chúng tôi cung cấp các công cụ và tính năng để người dùng có thể tạo hồ sơ, tìm kiếm việc làm, và tương tác với nhà tuyển dụng. BeeJobs không can thiệp vào quá trình tuyển dụng của từng bên, và không chịu trách nhiệm về các giao dịch diễn ra giữa người dùng và nhà tuyển dụng.

            </Text>
      </View>

    <View style= {styles.section}>
        <Text style={styles.sectionTitle}>2. Điều kiện Sử dụng</Text>
        <Text style={styles.sectionContent}>
        Người dùng phải cung cấp thông tin chính xác và hoàn chỉnh khi đăng ký tài khoản và sử dụng dịch vụ của chúng tôi. Người dùng phải tuân thủ các quy định về bảo mật thông tin cá nhân và không được sử dụng dịch vụ BeeJobs cho các mục đích vi phạm pháp luật. BeeJobs có quyền ngừng cung cấp dịch vụ hoặc khóa tài khoản của người dùng nếu phát hiện vi phạm điều khoản dịch vụ.
        </Text>
    </View>

    <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Bảo vệ Dữ liệu Cá nhân</Text>
        <Text style={styles.sectionContent}>
          Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng và chỉ sử dụng thông tin này theo đúng mục đích đã thông báo và được người dùng chấp nhận.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Thay đổi và Cập nhật</Text>
        <Text style={styles.sectionContent}>
          BeeJobs có thể thay đổi điều khoản dịch vụ mà không cần thông báo trước. Người dùng nên kiểm tra và hiểu rõ các điều khoản mới nhất trước khi tiếp tục sử dụng dịch vụ.
        </Text>
      </View>
    
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Liên hệ</Text>
        <Text style={styles.sectionContent}>
          Nếu có bất kỳ câu hỏi, góp ý hoặc khiếu nại nào về điều khoản dịch vụ của BeeJobs, vui lòng liên hệ với chúng tôi qua địa chỉ email support@beejobs.com.
        </Text>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f5f5f5"
    }, section: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2
    }, sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    }, sectionContent: {
        fontSize: 16,
        lineHeight: 24
    }, title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: 'center'
    }
})