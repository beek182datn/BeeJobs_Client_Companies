import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View , Image, StyleSheet} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
export default function Index() {
    const router = useRouter();

    useFocusEffect(
      React.useCallback(() => {
        const timer = setTimeout(() => {
          router.push("LoginScreen");
        }, 3000);
        return () => clearTimeout(timer);
      }, [router])
    );
  
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/images/bee_jobs_light_blue.png')} />
      </View>
    );
  }
const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: '100%',
    height: '100%'
  },
})


