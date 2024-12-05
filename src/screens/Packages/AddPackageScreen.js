import React, { useState, useEffect } from "react";
import { addPackage } from "../../services/api";

import { StatusBar } from "react-native";
import { useTheme, Layout, Input, Button, Text } from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Alert from "../../components/Alert";
import styles from "./styles/add-package-styles";

const AddPackageScreen = () => {
    const theme = useTheme();
    const [focusedInput, setFocusedInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        visible: false,
        type: "success",
        message: "",
    });

    // Package Fields
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!name || !price || !description) {
            setAlert({
                visible: true,
                type: "danger",
                message: "Semua field harus diisi.",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await addPackage({
                name,
                price,
                description,
            });

            if (response.status === "success") {
                setAlert({
                    visible: true,
                    type: "success",
                    message: "Paket layanan berhasil ditambahkan.",
                });
                setName("");
                setPrice("");
                setDescription("");
            } else {
                console.error("Error adding package:", response.message);
                setAlert({
                    visible: true,
                    type: "danger",
                    message:
                        "Terjadi kesalahan saat menambahkan paket layanan.",
                });
            }
        } catch (error) {
            console.error("Error adding package:", error);
            setAlert({
                visible: true,
                type: "danger",
                message: "Terjadi kesalahan saat menambahkan paket layanan.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />

            <Layout style={styles.headerContainer}>
                <Icon
                    name="earth"
                    size={40}
                    color={theme["color-primary-500"]}
                />
                <Layout style={styles.headerText}>
                    <Text category="h4" status="primary">
                        Paket Layanan
                    </Text>
                    <Text category="s1">Buat paket layanan baru</Text>
                </Layout>
            </Layout>

            {alert.visible && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => {
                        setAlert({
                            ...alert,
                            visible: false,
                        });
                    }}
                    style={{
                        marginHorizontal: 10,
                    }}
                />
            )}

            <Input
                label={() => <Text style={styles.label}>Nama Paket</Text>}
                placeholder="Masukkan nama untuk paket layanan"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedInput("name")}
                style={styles.input}
                status={focusedInput === "name" ? "primary" : "basic"}
            />

            <Input
                label={() => <Text style={styles.label}>Deskripsi Paket</Text>}
                placeholder="Masukkan deskripsi untuk paket layanan"
                multiline={true}
                value={description}
                onChangeText={setDescription}
                onFocus={() => setFocusedInput("description")}
                style={styles.input}
                textStyle={styles.textArea}
                status={focusedInput === "description" ? "primary" : "basic"}
            />

            <Input
                label={() => <Text style={styles.label}>Harga</Text>}
                placeholder="Masukkan harga untuk paket layanan"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                onFocus={() => setFocusedInput("price")}
                accessoryLeft={() => <Text category="s1">Rp</Text>}
                style={styles.input}
                status={focusedInput === "price" ? "primary" : "basic"}
            />

            <Button
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? "Loading..." : "Buat Paket Layanan"}
            </Button>
        </Layout>
    );
};

export default AddPackageScreen;
