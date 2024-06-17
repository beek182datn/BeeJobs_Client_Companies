import { ActivityIndicator, StyleSheet, Text, View, FlatList, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios';
import { useRouter } from 'expo-router';


export default function Jobs() {
const id_Company = "66618678d2005e278ba2cb95"
const [jobs, setJobs] = useState([]);
const[loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const router = useRouter();
useEffect(()=>{
    const fetchJobs = async ()=>{
        try{
            const response = await axios.get(
                "http://beejobs.io.vn:14307/api/jobs/getJobsByIdCompany/"+id_Company);
             setJobs(response.data.data);  
             console.log("Data jobs",response.data.data); 
        }catch(err){
            console.error("Lỗi khi lây dữ liệu Jobs", err);
        }finally{
            setLoading(false);  
        }
    }
    fetchJobs();
}, []);


const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>Title: {item.title}</Text>
      <Text>Form: {item.form}</Text>
      <Text>Deadline: {item.deadline}</Text>
      <Text>Salary: {item.salary}</Text>
    </View>
  );

const searchJobs = (text) =>{
    const formattedSearch = text.trim().toLowerCase();
    return jobs.filter(job =>{
        const formattedTitle = job.title.trim().toLowerCase();
        return formattedTitle.includes(formattedSearch);
    });
};
// Lọc danh sách công việc nếu có chuỗi tìm kiếm, nếu không thì hiển thị  toàn bộ danh sách 
const filteredJobs = search ? searchJobs(search) : jobs;

if(loading){
    return(
        <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff"/>
        </SafeAreaView>
    );
}

  return (
    <SafeAreaView style={styles.container}>

        <TextInput style={styles.searchInput}
        placeholder='Search jobs...'
        value={search}
        onChangeText={setSearch}
        
        />
      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={(item)=> item._id.toString()}
        contentContainerStyle={styles.list}
      />
      <View style={styles.buttonContainer}>
      <Button 
    title='Add New Job'
    
    
/>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    searchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 10,
      margin: 10,
      paddingLeft: 10,
    },
    list: {
      flexGrow: 1,
    },
    itemContainer: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor: "#f9f9f9",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
      alignSelf: 'stretch',
      width: '93%',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonContainer: {
      padding: 10,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  });