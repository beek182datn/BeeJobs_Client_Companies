import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios, { AxiosResponse } from "axios";
import { useRouter } from 'expo-router';
import AlertComponent from "@/components/AlertComponent";

const LoginScreen = () => {
    // su dung de luu tru thong tin cac truong thong tin dang nhap
    const [username, setUsername] = useState("");
    const [passwd, setPassword] = useState("");
    // su dung cho an hien mat khau va ghi nho tai khoan
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    // su dung de lu tru cac message, color cua hop thoai canh bao
    const [showAlert, setShowAlert] = useState(false)
    const [message, setMessage] = useState('')
    const [color, setColor] = useState('')


    const router = useRouter();

    const clear =()=>{
        setUsername('');
        setPassword('');
    }
    const handleLogin = async () => {
        if (username.trim() === "" || passwd.trim() === "") {
            setMessage('Hãy nhập đầy đủ thông tin')
            setColor('red')
            setShowAlert(true)
            return;
        }

        try {
            const response: AxiosResponse = await axios.post('http://beejobs.io.vn:14307/api/login', {
                username: username,
                passwd: passwd,
            });

            console.log(response.data)
            if (response.data.status !== 200) {
                setMessage(response.data.msg)
                setColor('red')
                setShowAlert(true)
                clear();
                return
            }

            // setLoggedInUser(response.data.email);
            setMessage('Đăng nhập thành công')
            setColor('green')
            setShowAlert(true)

            // Chuyển hướng đến màn hình khác sau khi đăng nhập thành công
            router.push('/Home');
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            setMessage('Lỗi khi đăng nhập')
            setColor('red')
            setShowAlert(true)
            clear(); 
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng nhập</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#A9A9A9" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Tài khoản hoặc Email"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#A9A9A9" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    secureTextEntry={!showPassword}
                    value={passwd}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? "eye" : "eye-off"}
                        size={20}
                        color="#A9A9A9"
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('ForgotPasswordScreen')}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <View style={styles.rememberMeContainer}>
                <TouchableOpacity
                    style={[
                        styles.rememberMeCheckbox,
                        rememberMe ? styles.rememberMeCheckboxChecked : null,
                    ]}
                    onPress={() => setRememberMe(!rememberMe)}
                />
                <Text style={styles.rememberMeText}>Lưu mật khẩu</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <Text style={styles.continueWithText}>----- continue with -----</Text>
            <View style={styles.socialIconsContainer}>
                <TouchableOpacity>
                    <Ionicons name="logo-facebook" size={35} color="#3b5998" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="logo-google" size={35} color="#db4a39" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="logo-twitter" size={35} color="#00acee" />
                </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>
                Bạn chưa có tài khoản?
                <Text style={styles.signupText} onPress={() => router.push('RegisterScreen')}> Đăng ký</Text>
            </Text>
            <AlertComponent color={color} message={message} visible={showAlert}
                onClose={() => setShowAlert(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#A9A9A9",
        borderRadius: 25,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: "#f9f9f9",
        padding: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        color: "#000",
    },
    icon: {
        marginRight: 10,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#007BFF',
        fontSize: 16,
    },
    rememberMeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        marginLeft: 10,
    },
    rememberMeText: {
        marginLeft: 10,
        fontSize: 16,
        color: "#000",
    },
    rememberMeCheckbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginRight: 10,
    },
    rememberMeCheckboxChecked: {
        backgroundColor: "#007aff",
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    continueWithText: {
        textAlign: "center",
        color: "#A9A9A9",
        marginBottom: 20,
    },
    socialIconsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
    footerText: {
        textAlign: "center",
        fontSize: 16,
        color: "#A9A9A9",
        marginBottom: 30,
    },
    signupText: {
        color: "#007BFF",
        fontWeight: "bold",
    },
});

export default LoginScreen;
