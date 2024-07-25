import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(tab_home)" options={{ headerShown: false }} />
      <Stack.Screen name="Details" options={{
          headerTitle: "Chi tiết công việc",
          headerTitleStyle: {
            fontSize: 19,
            fontWeight: "bold",
            alignSelf: "center",
          },
        }} />
      <Stack.Screen name="OtpScreen" options={{headerShown: false}}/>
      <Stack.Screen name="EmployerAuth" options={{headerShown: false}}/>
      <Stack.Screen name="CheckEmployerAuth" options={{headerShown: false}}/>
      <Stack.Screen name="FogotPassScreen" options={{headerShown: false}}/>
      <Stack.Screen name="OtpFogotPassScreen" options={{headerShown: false}}/>
      <Stack.Screen name="ListApplyForJob" options={{headerShown: false}}/>
      <Stack.Screen name="ReadCv" options={{headerShown: false}}/>
      <Stack.Screen name="ViewProfileWorker" options={{
        headerTitle: "Chi tiết đơn ứng tuyển",
        headerTitleStyle: {
          fontSize: 25,
          fontWeight: "bold",
        },
        headerStyle: {
          backgroundColor: '#0099FF',
        },
        headerTitleAlign: 'center',

      }}/>
      <Stack.Screen name="ChatScreen" options={{headerShown: false}}/>
      <Stack.Screen name="ChangePassword" options={{headerShown: false}}/>
      <Stack.Screen name="ViewAccount" options={{headerShown: false}}/>
      <Stack.Screen name="EditAccount" options={{headerShown: false}}/>
      <Stack.Screen
        name="AddNewJobs"
        options={{
          headerTitle: "Thêm công việc mới",
          headerTitleStyle: {
            fontSize: 19,
            fontWeight: "bold",
            alignSelf: "center",
          },
        }}
      />
      <Stack.Screen
        name="CompanyIntroduction"
        options={{
          headerTitle: "Về BeeJobs",
          headerTitleStyle: { fontSize: 19, fontWeight: "bold" },
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
      <Stack.Screen
        name="TermsOfService"
        options={{
          headerTitle: "Điều khoản dịch vụ",
          headerTitleStyle: { fontSize: 19, fontWeight: "bold" },
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <Stack.Screen
        name="PrivacyPolicy"
        options={{
          headerTitle: "Chính sách bảo mật",
          headerTitleStyle: { fontSize: 19, fontWeight: "bold" },
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <Stack.Screen
        name="HelpCenter"
        options={{
          headerTitle: "Chính sách bảo mật",
          headerTitleStyle: { fontSize: 19, fontWeight: "bold" },
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </Stack>
  );
}
