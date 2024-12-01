import React, { useState, useEffect } from "react";
import { updatePackage, fetchPackage } from "../../services/api";
import { StatusBar } from "react-native";
import { useTheme, Layout, Input, Button, Text } from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Alert from "../../components/Alert";
import styles from "./styles/add-package-styles";

const UpdatePackageScreen = ({ navigation, route }) => {
    const { id } = route.params;
    const theme = useTheme();
    const [focusedInput, setFocusedInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        visible: false,
        type: "success",
        message: "",
    });

    // State untuk data paket
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchPackageData = async () => {
            try {
                const response = await fetchPackage(id);
                if (response) {
                    setName(response.name || "");
                    setPrice(response.price ? response.price.toString() : "");
                    setDescription(response.description || "");
                }
            } catch (error) {
                console.error("Error fetching package data:", error);
            }
        };

        fetchPackageData();
    }, [id]);

    const handleSubmit = async () => {
        if (!name || !price || !description) {
            setAlert({
                visible: true,
                type: "danger",
                message: "Semua kolom harus diisi.",
            });
            return;
        }

        setLoading(true);
        try {
            const updatedData = { name, price: parseFloat(price), description };
            await updatePackage(id, updatedData);
            setAlert({
                visible: true,
                type: "success",
                message: "Paket berhasil diperbarui!",
            });

            setAlert({
                visible: true,
                type: "success",
                message: "Paket berhasil diperbarui!",
            });

            setTimeout(() => {
                setAlert({
                    visible: false,
                    type: "success",
                    message: "",
                });

                navigation.goBack();
            }, 2000);
        } catch (error) {
            console.error("Error updating package:", error);
            setAlert({
                visible: true,
                type: "danger",
                message: "Gagal memperbarui paket.",
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
                    <Text category="s1">Perbarui paket layanan {name}</Text>
                </Layout>
            </Layout>

            {alert.visible && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ ...alert, visible: false })}
                    style={{ marginHorizontal: 10, marginBottom: 10 }}
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
                {loading ? "Memperbarui..." : "Perbarui"}
            </Button>
        </Layout>
    );
};

export default UpdatePackageScreen;
