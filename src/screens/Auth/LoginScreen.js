import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TouchableOpacity } from "react-native";
import { Text, Input, Button } from "@ui-kitten/components";
import Icon from "@expo/vector-icons/FontAwesome6";
import Background from "../../components/Background";

import styles from "./styles";

const LoginScreen = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [focusedInput, setFocusedInput] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Masukkan pengenal dan kata sandi.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await login(username, password);

            if (response) {
                setUsername("");
                setPassword("");
                setError("");
            } else {
                setError("Gagal masuk. Kredensial tidak valid.");
                setPassword("");
            }
        } catch (err) {
            if (err.message === "user-not-found") {
                setError("Nama pengguna tidak ditemukan.");
            } else if (err.message === "invalid") {
                setError("Kata sandi yang anda masukkan salah.");
            } else {
                console.log("Login Error: ", err);
                setError("Terjadi kesalahan. Coba lagi nanti.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Background>
            <Text style={styles.title}>WIFI</Text>

            {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

            <Input
                label={() => <Text style={styles.label}>Nama Pengguna</Text>}
                placeholder="Masukkan pengenal anda"
                value={username}
                onChangeText={setUsername}
                onFocus={() => setFocusedInput("username")}
                style={styles.input}
                status={focusedInput === "username" ? "primary" : "basic"}
            />

            <Input
                label={() => <Text style={styles.label}>Kata Sandi</Text>}
                placeholder="Masukkan kata sandi anda"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput("password")}
                secureTextEntry={secureTextEntry}
                accessoryRight={() => (
                    <TouchableOpacity
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                    >
                        <Icon
                            name={secureTextEntry ? "eye-slash" : "eye"}
                            style={styles.passwordIcon}
                            fill="gray"
                            size={18}
                        />
                    </TouchableOpacity>
                )}
                style={styles.input}
                status={focusedInput === "password" ? "primary" : "basic"}
            />

            <Button
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? "Memuat..." : "Masuk"}
            </Button>
        </Background>
    );
};

export default LoginScreen;
