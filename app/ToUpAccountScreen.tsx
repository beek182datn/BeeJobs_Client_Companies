import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, TextInput, } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

interface History {
  amount?: string;
  currency?: string;
  transaction_date?: String;
  status?: string;
}

const ToUpAccountScreen = () => {
  const [balance, setBalance] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [transHistory, setTransHistory] = useState<History[]>([]);
  const stripe = useStripe();

  const fetchData = async () => {
    try {
      const companyId = await AsyncStorage.getItem('company_id');
      if (companyId) {
        const response = await axios.get(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`);
        setBalance(response.data.data.currency);
        console.log(response.data.data.company_name);
        const responseTrans = await axios.get(`http://beejobs.io.vn:14307/api/payment/getTransactionHistoryByCompanyId/${companyId}`);
        setTransHistory(responseTrans.data.data);
        console.log(responseTrans.data.data);
        
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  const handleTopUp = async () => {
    const companyId = await AsyncStorage.getItem('company_id');
    const amount = parseFloat(topUpAmount);
  
    // Kiểm tra số tiền nạp tối thiểu
    if (amount < 50) {
      Alert.alert('Lỗi', 'Số tiền nạp tối thiểu là 50$.');
      return;
    }
  
    try {
      // Gửi yêu cầu tạo thanh toán
      const response = await axios.post('http://beejobs.io.vn:14307/api/payment/createPayment', {
        amount: amount * 100,
        company_id: companyId,
      }, { timeout: 10000 }); // Thêm thời gian chờ 10 giây
  
      const { client_secret, paymentIntentId } = response.data;
      console.log(response.data);
  
      // Khởi tạo thanh toán với Stripe
      const { error: initError } = await stripe.initPaymentSheet({
        paymentIntentClientSecret: client_secret,
        googlePay: true,
        merchantDisplayName: 'TopUp-Account',
        returnURL: 'your-app://return-url' // Thêm returnURL
      });
  
      if (initError) {
        console.error(initError);
        return Alert.alert('Lỗi', initError.message);
      }
  
      const { error: presentError } = await stripe.presentPaymentSheet();
  
      if (presentError) {
        if (presentError.code === 'Canceled') {
          // Người dùng đóng cửa sổ thanh toán
          console.log('Payment sheet closed by user');
          setTopUpAmount('');
          return;
        }
        console.error(presentError);
        return Alert.alert('Lỗi', presentError.message);
      }
  
      await axios.post('http://beejobs.io.vn:14307/api/payment/confirmPayment', {
        paymentIntentId: paymentIntentId,
        companyId: companyId,
        amount: Number(topUpAmount),
      }, { timeout: 10000 }); 
  
      setModalVisible(false);
  
      await axios.post(`http://beejobs.io.vn:14307/api/companies/top_up_account/${companyId}`, {
        amount: Number(topUpAmount),
      }, { timeout: 10000 }); 
  
      Alert.alert('Success', 'Thanh toán thành công!');
      fetchData(); 
  
      setTopUpAmount('');
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình thanh toán.');
    }
  };
  


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StripeProvider publishableKey="pk_test_51Pl6FWENrF9mMyn23Jyblh4KvQy1aZqyRstjPByZ0nDYJZFYrZXj313WiN9HMgMT1g2GXdN4p2gHpVUDYpQQV9IL00u24iQ5ED">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Số Dư (*)</Text>
          <Text style={styles.balance}>{balance} $</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>Nạp tiền</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Lịch sử giao dịch</Text>
          <FlatList
            data={transHistory}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text>{`${new Date(item.transaction_date).toLocaleDateString()} ${new Date(item.transaction_date).toLocaleTimeString()}`}</Text>
                <Text style={styles.transactionAmount}>{item.status}</Text>
              </View>
            )}
          />
        </View>
      </View>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nhập số tiền nạp</Text>
              <TextInput
                style={styles.input}
                placeholder="Số tiền nạp"
                keyboardType="numeric"
                value={topUpAmount}
                onChangeText={(text) => setTopUpAmount(text.replace(/[^0-9]/g, ''))}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton1} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleTopUp}>
                  <Text style={styles.modalButtonText}>Nạp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor:"#ffb900",
    padding:20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color:"#fffc"
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical:5,
    borderRadius:5,
    elevation:5,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight:"bold",
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  transactionAmount: {
    fontWeight: 'bold',
    width:"63%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize:18,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#5BBD2B',
    borderRadius: 5,
    elevation: 2,
  },
  modalButton1: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#e12828',
    borderRadius: 5,
    elevation: 2,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight:"bold"
  },
});

export default ToUpAccountScreen;
