// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, TextInput, ScrollView, BackHandler, Image, Button } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import { useRouter } from "expo-router";


// const getMimeType = (uri) => {
//   const extension = uri.split('.').pop().toLowerCase();
//   switch (extension) {
//     case 'jpg':
//     case 'jpeg':
//       return 'image/jpeg';
//     case 'png':
//       return 'image/png';
//     default:
//       return 'application/octet-stream';
//   }
// };

// const handleImagePicker = async (setter) => {
//   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//   if (status !== 'granted') {
//     alert('Permission to access media library is required!');
//     return;
//   }

//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: true,
//     aspect: [4, 3],
//     quality: 1,
//   });

//   if (!result.canceled && result.assets && result.assets.length > 0) {
//     setter(result.assets[0].uri);
//   }
// };

// export default function EditAccount() {
//   const [loading, setLoading] = useState(true);
//   const [companyName, setCompanyName] = useState('');
//   const [companyAddress, setCompanyAddress] = useState('');
//   const [companyWebsite, setCompanyWebsite] = useState('');
//   const [companyScale, setCompanyScale] = useState('');
//   const [taxCode, setTaxCode] = useState('');
//   const [companyLogo, setCompanyLogo] = useState('');
  
//   const [newLogo, setNewLogo] = useState(null);
//   const router = useRouter();
  
//   useEffect(() => {
//     fetchAccountDetails();
//   }, []);

//   const fetchAccountDetails = async () => {
//     const companyId = await AsyncStorage.getItem('company_id');
//     try {
//       const response = await fetch(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data && data.data) {
//           const companyData = data.data;
//           setCompanyName(companyData.company_name || '');
//           setCompanyAddress(companyData.company_address || '');
//           setCompanyWebsite(companyData.company_website || '');
//           setCompanyScale(companyData.company_scale || '');
//           setTaxCode(companyData.taxcode || '');
//           setCompanyLogo(companyData.company_logo || '');
//         } else {
//           Alert.alert("Error", "Data structure is not as expected");
//         }
//       } else {
//         Alert.alert("Error", "Failed to fetch account details");
//       }
//     } catch (error) {
//       Alert.alert("Error", `An error occurred: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     const companyId = await AsyncStorage.getItem('company_id');
//     const userId = await AsyncStorage.getItem('idUser');

//     try {
//       let formData = new FormData();
      
//       if (newLogo) {
//         formData.append('company_logo', {
//           uri: newLogo,
//           name: `logo.${newLogo.split('.').pop()}`,
//           type: getMimeType(newLogo),
//         });
//       } else if (companyLogo) {
//         const response = await fetch(companyLogo);
//         const blob = await response.blob();
//         formData.append('company_logo', {
//           uri: companyLogo,
//           name: `logo.${companyLogo.split('.').pop()}`,
//           type: getMimeType(companyLogo),
//         });
//       }

//       formData.append('company_name', companyName);
//       formData.append('company_address', companyAddress);
//       formData.append('company_website', companyWebsite);
//       formData.append('company_scale', companyScale);
//       formData.append('taxcode', taxCode);
//       formData.append('active' ,  'false');
//       const response = await fetch(`http://beejobs.io.vn:14307/api/companies/edit/${userId}/${companyId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       console.log("update", data);
//       if (response.ok) {
//         Alert.alert("Success", "Company details updated successfully");
//         router.replace("ViewAccount");
//       } else {
//         Alert.alert("Error", `Failed to update company details: ${data.message}`);
//       }
//     } catch (error) {
//       Alert.alert("Error", `An error occurred: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     const backAction = () => {
//       router.replace("ViewAccount");
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

//     return () => backHandler.remove();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007bff" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.headerContainer}>
//         {newLogo ? (
//           <Image
//             style={styles.logo}
//             source={{ uri: newLogo }}
//           />
//         ) : companyLogo ? (
//           <Image
//             style={styles.logo}
//             source={{ uri: `http://beejobs.io.vn:14307${companyLogo}` }}
//           />
//         ) : (
//           <Text>No logo available</Text>
//         )}
//         <Button title="Change Logo" onPress={() => handleImagePicker(setNewLogo)} />
//         <Text style={styles.header}>Edit Company Details</Text>
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Company Name:</Text>
//         <TextInput
//           style={styles.input}
//           value={companyName}
//           onChangeText={setCompanyName}
//         />
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Address:</Text>
//         <TextInput
//           style={styles.input}
//           value={companyAddress}
//           onChangeText={setCompanyAddress}
//         />
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Website:</Text>
//         <TextInput
//           style={styles.input}
//           value={companyWebsite}
//           onChangeText={setCompanyWebsite}
//         />
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Scale:</Text>
//         <TextInput
//           style={styles.input}
//           value={companyScale}
//           onChangeText={setCompanyScale}
//         />
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Tax Code:</Text>
//         <TextInput
//           style={styles.input}
//           value={taxCode}
//           onChangeText={setTaxCode}
//         />
//       </View>
//       <TouchableOpacity style={styles.button} onPress={handleSave}>
//         <Text style={styles.buttonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//     padding: 20,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   detailContainer: {
//     marginBottom: 15,
//     paddingHorizontal: 20,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     borderRadius: 8,
//     fontSize: 16,
//     borderColor: '#ddd',
//     borderWidth: 1,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems    : 'center',
//     marginHorizontal: 20,
//     marginVertical: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });







import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, TextInput, ScrollView, BackHandler, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";

// Function to determine MIME type from file extension
const getMimeType = (uri) => {
  const extension = uri.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
};

// Function to handle image picking
const handleImagePicker = async (setter) => {
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

export default function EditAccount() {
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyScale, setCompanyScale] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [newLogo, setNewLogo] = useState(null);
  const [companyCertification, setCompanyCertification] = useState('');
  const [newCertification, setNewCertification] = useState(null);
  const [companyDesc, setCompanyDesc] = useState('');
  const [originalCompanyName, setOriginalCompanyName] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  const fetchAccountDetails = async () => {
    const companyId = await AsyncStorage.getItem('company_id');
    try {
      const response = await fetch(`http://beejobs.io.vn:14307/api/companies/getCompanyById/${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          const companyData = data.data;
          setCompanyName(companyData.company_name || '');
          setOriginalCompanyName(companyData.company_name || '');
          setCompanyAddress(companyData.company_address || '');
          setCompanyWebsite(companyData.company_website || '');
          setCompanyScale(companyData.company_scale || '');
          setTaxCode(companyData.taxcode || '');
          setCompanyLogo(companyData.company_logo || '');
          setCompanyCertification(companyData.company_certification || '');
          setCompanyDesc(companyData.company_desc || '');
        } else {
          Alert.alert("Lỗi", "Cấu trúc dữ liệu không như mong đợi");
        }
      } else {
        Alert.alert("Lỗi", `Không thể lấy thông tin tài khoản: ${response.statusText}`);
      }
    } catch (error) {
      Alert.alert("Lỗi", `Đã xảy ra lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSave = async () => {
    const companyId = await AsyncStorage.getItem('company_id');
    const userId = await AsyncStorage.getItem('idUser');
  
    try {
      let formData = new FormData();
  
      // Handle new or existing logo
      if (newLogo) {
        formData.append('company_logo', {
          uri: newLogo,
          name: `logo.${newLogo.split('.').pop()}`,
          type: getMimeType(newLogo),
        });
      } else if (companyLogo) {
        formData.append('company_logo', {
          uri: companyLogo,
          name: `logo.${companyLogo.split('.').pop()}`,
          type: getMimeType(companyLogo),
        });
      }
  
      // Handle new or existing certification
      if (newCertification) {
        formData.append('company_certification', {
          uri: newCertification,
          name: `certification.${newCertification.split('.').pop()}`,
          type: getMimeType(newCertification),
        });
      } else if (companyCertification) {
        formData.append('company_certification', {
          uri: companyCertification,
          name: `certification.${companyCertification.split('.').pop()}`,
          type: getMimeType(companyCertification),
        });
      }
  
      // Append other form data fields
      formData.append('company_name', companyName);
      formData.append('company_address', companyAddress);
      formData.append('company_website', companyWebsite);
      formData.append('company_scale', companyScale);
      formData.append('taxcode', taxCode);
      formData.append('company_desc', companyDesc);
      formData.append('active', 'false'); // Add the active field
  
      const response = await fetch(`http://beejobs.io.vn:14307/api/companies/edit/${userId}/${companyId}`, {
        method: 'PUT',
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Company details updated successfully");
        router.replace("ViewAccount");
      } else {
        Alert.alert("Error", `Failed to update company details: ${data.message}`);
      }
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
      console.log("Error:", error.message);
    }
  };
  

  useEffect(() => {
    const backAction = () => {
      router.replace("ViewAccount");
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        {newLogo ? (
          <Image
            style={styles.logo}
            source={{ uri: newLogo }}
          />
        ) : companyLogo ? (
          <Image
            style={styles.logo}
            source={{ uri: `http://beejobs.io.vn:14307${companyLogo}` }}
          />
        ) : (
          <Text>No logo available</Text>
        )}
        <Button title="Change Logo" onPress={() => handleImagePicker(setNewLogo)} />
        <Text style={styles.header}>Edit Company Details</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Company Name:</Text>
        <TextInput
          style={styles.input}
          value={companyName}
          onChangeText={(text) => {
            setCompanyName(text);
            if (text !== originalCompanyName) {
              setNewCertification(null); // Clear certification if name changes
            }
          }}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={companyAddress}
          onChangeText={setCompanyAddress}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Website:</Text>
        <TextInput
          style={styles.input}
          value={companyWebsite}
          onChangeText={setCompanyWebsite}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Scale:</Text>
        <TextInput
          style={styles.input}
          value={companyScale}
          onChangeText={setCompanyScale}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Tax Code:</Text>
        <TextInput
          style={styles.input}
          value={taxCode}
          onChangeText={setTaxCode}
        />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Company Description:</Text>
        <TextInput
          style={styles.input}
          value={companyDesc}
          onChangeText={setCompanyDesc}
        />
      </View>
      <View style={styles.detailContainer}>
        {newCertification ? (
          <Image
            style={styles.certification}
            source={{ uri: newCertification }}
          />
        ) : companyCertification ? (
          <Image
            style={styles.certification}
            source={{ uri: `http://beejobs.io.vn:14307${companyCertification}` }}
          />
        ) : (
          <Text>No certification available</Text>
        )}
                <Button title="Change Certification" onPress={() => handleImagePicker(setNewCertification)} />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  certification: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});





