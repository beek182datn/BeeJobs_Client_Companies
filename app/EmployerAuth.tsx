import React, { useState, useRef,useEffect  } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import mime from 'react-native-mime-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmployerAuth = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyScale, setCompanyScale] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyCertification, setCompanyCertification] = useState<string | null>(null);
  const [taxCode, setTaxCode] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');
  const [certificationError, setCertificationError] = useState<boolean>(false);
  const router = useRouter();
  
  // Refs for focusing on inputs
  const companyNameRef = useRef<TextInput>(null);
  const companyAddressRef = useRef<TextInput>(null);
  const CompanyScaleRef = useRef<TextInput>(null);
  const CompanyWebRel = useRef<TextInput>(null);
  const taxCodeRef = useRef<TextInput>(null);
  const CompanyDescRef = useRef<TextInput>(null);
  const PhoneNumberRef = useRef<TextInput>(null);

  const handleImagePicker = async (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setter(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setCertificationError(false);

    if (!companyName || !companyAddress || !companyScale || !companyWebsite || !phoneNumber || !taxCode || !companyCertification || !companyDesc) {
      setMessage('Hãy nhập đầy đủ thông tin bắt buộc');
      setColor('red');
      

      if (!companyName) {
        companyNameRef.current?.focus();
      }else if (!companyDesc) {
        CompanyDescRef.current?.focus();
      }
       else if (!companyAddress) {
        companyAddressRef.current?.focus();
      }
      else if (!companyScale) {
        CompanyScaleRef.current?.focus();
      }else if (!companyWebsite) {
        CompanyWebRel.current?.focus();
      }else if (!phoneNumber) {
        PhoneNumberRef.current?.focus();
      }
       else if (!taxCode) {
        taxCodeRef.current?.focus();
      }

      if (!companyCertification) {
        setCertificationError(true);
        return;
      }
      
      return;
    }

    try {
      const formData = new FormData();
      formData.append('company_name', companyName);
      formData.append('company_desc', companyDesc);
      formData.append('company_address', companyAddress);
      formData.append('company_scale', companyScale);
      formData.append('company_website', companyWebsite);
      formData.append('phone_number', phoneNumber);
      formData.append('taxcode', taxCode);

      if (companyLogo) {
        const response = await fetch(companyLogo);
        const blob = await response.blob();
        const fileType = mime.lookup(companyLogo);

        if (typeof fileType === 'string') {
          formData.append('company_logo', {
            uri: companyLogo,
            name: `logo.${fileType.split('/').pop()}`,
            type: fileType,
          });
        }
      }

      if (companyCertification) {
        const response = await fetch(companyCertification);
        const blob = await response.blob();
        const fileType = mime.lookup(companyCertification);

        if (typeof fileType === 'string') {
          formData.append('company_certification', {
            uri: companyCertification,
            name: `certification.${fileType.split('/').pop()}`,
            type: fileType,
          });
        }
      }

      const idUser = await AsyncStorage.getItem('idUser');

      const response = await axios.post('http://beejobs.io.vn:14307/api/companies/create/'+idUser, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const companyId = response.data.data._id;
        console.log("Registed Company ID: "+companyId);
        await AsyncStorage.setItem('company_id', companyId);
        setColor('green');
        setMessage('Đăng ký công ty thành công');
        Alert.alert(
          'Thông báo',
          'Đăng ký công ty thành công. Vui lòng chờ phê duyệt để được đăng tin tuyển dụng.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/Home'),
            },
          ],
          { cancelable: false }
        );
      } else {
        setMessage(response.data.message);
        setColor('red');
      }
    } catch (error) {
      console.error('Lỗi đăng ký công ty:', error);
      setColor('red');
    }
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("CheckEmployerAuth");
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.logo} source={require('../assets/images/BeeJobs_logo.jpg')} />
      <Text style={styles.title}>Đăng ký Công ty</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên công ty *</Text>
        <TextInput
          ref={companyNameRef}
          style={styles.input}
          placeholder="Nhập tên công ty"
          value={companyName}
          onChangeText={setCompanyName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giới thiệu về công ty *</Text>
        <TextInput
          ref={CompanyDescRef}
          style={styles.input}
          placeholder="Nhập giới thiệu"
          value={companyDesc}
          onChangeText={setCompanyDesc}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Địa chỉ công ty *</Text>
        <TextInput
          ref={companyAddressRef}
          style={styles.input}
          placeholder="Nhập địa chỉ công ty"
          value={companyAddress}
          onChangeText={setCompanyAddress}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Logo công ty</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker(setCompanyLogo)}>
          {companyLogo ? (
            <Image source={{ uri: companyLogo }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Chọn ảnh</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quy mô công ty</Text>
        <TextInput
          ref={CompanyScaleRef}
          style={styles.input}
          placeholder="Nhập quy mô công ty"
          value={companyScale}
          onChangeText={setCompanyScale}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website công ty</Text>
        <TextInput
          ref={CompanyWebRel}
          style={styles.input}
          placeholder="Nhập website công ty"
          value={companyWebsite}
          onChangeText={setCompanyWebsite}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Số điện thoại công ty</Text>
        <TextInput
          ref={PhoneNumberRef}
          style={styles.input}
          placeholder="Nhập số điện thoại"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
        />
      </View>
      <View style={styles.inputContainer}>
  <Text style={styles.label}>Giấy chứng nhận *</Text>
  <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker(setCompanyCertification)}>
    {companyCertification ? (
      <Image source={{ uri: companyCertification }} style={styles.image} />
    ) : (
      <Text style={styles.imagePickerText}>Chọn ảnh</Text>
    )}
  </TouchableOpacity>
  {certificationError && (
    <Text style={{ color: 'red', textAlign: 'center', marginTop: 5 }}>
      Hãy hoàn thiện giấy tờ để trở thành nhà tuyển dụng
    </Text>
  )}
</View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mã số thuế *</Text>
        <TextInput
          ref={taxCodeRef}
          style={styles.input}
          placeholder="Nhập mã số thuế"
          value={taxCode}
          onChangeText={setTaxCode}
        />
      </View>
      {message ? <Text style={{ color, textAlign: 'center', marginVertical: 10 }}>{message}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Hoàn tất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#000',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  imagePickerText: {
    color: '#A9A9A9',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    marginLeft: 35,
    width: '80%',
    height: 250,
  },
});

export default EmployerAuth;
