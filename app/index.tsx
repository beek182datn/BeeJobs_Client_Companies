import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View , Image, StyleSheet} from "react-native";

export default function Index() {
    const router = useRouter();
    useEffect(()=>{
      const timer = setTimeout(()=>{
        router.push("LoginScreen");
      }, 3000);
      return () => clearTimeout(timer);
    }, [router])
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
     <Image style={styles.image} source={require('../assets/images/bee_jobs_light_blue.png')}/>
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


