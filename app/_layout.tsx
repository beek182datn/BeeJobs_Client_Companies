import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="LoginScreen" options={{headerShown: false}}/>
      <Stack.Screen name="RegisterScreen" options={{headerShown: false}}/>
      <Stack.Screen name="(tab_home)" options={{headerShown: false}}/>
      <Stack.Screen name="Details" options={{headerShown: false}}/>
      <Stack.Screen name="AddNewJobs" options={{headerTitle: "Thêm công việc mới", headerTitleStyle: {fontSize: 19, fontWeight: "bold"}}} />
      <Stack.Screen name="CompanyIntroduction" options={{headerTitle: "Về BeeJobs", headerTitleStyle: {fontSize: 19, fontWeight: "bold"}}} />
    </Stack>
  );
}
