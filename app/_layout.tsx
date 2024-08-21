import { Stack } from "expo-router";
import { Platform } from 'react-native';

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
          // headerShown: Platform.OS !== 'ios',
        }} />
      <Stack.Screen name="OtpScreen" options={{headerShown: false}}/>
      <Stack.Screen name="EmployerAuth" options={{headerShown: false}}/>
      <Stack.Screen name="CheckEmployerAuth" options={{headerShown: false}}/>
      <Stack.Screen name="FogotPassScreen" options={{headerShown: false}}/>
      <Stack.Screen name="OtpFogotPassScreen" options={{headerShown: false}}/>
      <Stack.Screen name="ListApplyForJob" options={{headerShown: false}}/>
      <Stack.Screen name="ReadCv" options={{headerShown: false}}/>
      <Stack.Screen name="ViewProfileWorker" options={{headerShown: false}}/>
      <Stack.Screen name="ChatScreen" options={{headerShown: false}}/>
      <Stack.Screen name="ChatLiveScreen" options={{headerShown: false}}/>
      <Stack.Screen name="ResetPasswordScreen" options={{headerShown: false}}/>
      <Stack.Screen name="JobsAppliedScreen" options={{headerTitle: "Tin đã có đơn ứng tuyển"}}/>
      <Stack.Screen name="ToUpAccountScreen" options={{headerTitle: "Số dư tài khoản"}}/>
      <Stack.Screen name="UpgradeAccountScreen" options={{headerTitle: "Nâng cấp tài khoản"}}/>
      <Stack.Screen name="ListSuitableCandidate" options={{headerShown: false}}/>
      <Stack.Screen name="ListSuitableApplyJob" options={{headerShown: false}}/>
      <Stack.Screen name="NotifiScreen" options={{headerTitle: "notifi"}}/>
      <Stack.Screen name="AmountWorkerApplyForCompany" options={{headerTitle: "Số ứng viên đã ứng tuyển"}}/>
      <Stack.Screen name="ChangePassword" options={{ headerTitle: 'Đổi mật khẩu', headerTitleStyle: {
            fontSize: 19,
            fontWeight: "bold",}, 
           headerTitleAlign: "center"
          }}/>
      <Stack.Screen name="ViewAccount" options={{headerShown: false}}/>
      <Stack.Screen name="EditAccount" options={{headerShown: false}}/>
      <Stack.Screen
        name="AddNewJobs"
        options={{
          headerTitle: "Thêm công việc mới",
          headerTitleStyle: {
            fontSize: 19,
            fontWeight: "bold",
           
          },
           headerTitleAlign: "center"
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
          headerTitle: "Trung tâm trợ giúp",
          headerTitleStyle: { fontSize: 19, fontWeight: "bold" },
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </Stack>
  );
}
