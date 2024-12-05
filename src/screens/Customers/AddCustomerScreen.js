import React, { useState, useCallback } from "react";
import {
    fetchAddressSuggestions,
    fetchCoordinates,
    addCustomer,
} from "../../services/api";
import { debounce } from "lodash";

import {
    StatusBar,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";
import {
    useTheme,
    Layout,
    Input,
    RadioGroup,
    Radio,
    Button,
    Text,
} from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Alert from "../../components/Alert";
import styles from "./styles/add-customer-styles";

const CustomersListScreen = ({ navigation }) => {
    const theme = useTheme();
    const [focusedInput, setFocusedInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        visible: false,
        type: "success",
        message: "",
    });

    // Customer Fields
    const [name, setName] = useState("");
    const [selectedGender, setSelectedGender] = useState(null);
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [latlng, setLatLng] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestions = useCallback(
        debounce(async (query) => {
            if (query.length > 3) {
                try {
                    const result = await fetchAddressSuggestions(query);
                    setSuggestions(result);
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]);
            }
        }, 500),
        []
    );

    const handleSuggestionSelect = async (selectedSuggestion) => {
        if (selectedSuggestion) {
            setAddress(selectedSuggestion.title);
            setLatLng(
                `${selectedSuggestion.position.lat}, ${selectedSuggestion.position.lng}`
            );
        } else {
            try {
                const coordinates = await fetchCoordinates(address);
                if (coordinates) {
                    setLatLng(`${coordinates.lat}, ${coordinates.lng}`);
                } else {
                    setAlert({
                        visible: true,
                        type: "danger",
                        message: "Alamat tidak valid. Coba periksa kembali.",
                    });
                }
            } catch (error) {
                setAlert({
                    visible: true,
                    type: "danger",
                    message: "Gagal mengambil koordinat.",
                });
            }
        }
        setSuggestions([]);
    };

    const handleResetAddress = () => {
        setAddress("");
        setLatLng("");
        setSuggestions([]);
    };

    const handleAddCustomer = async () => {
        if (!name || !gender || !phoneNumber || !address) {
            setAlert({
                visible: true,
                type: "danger",
                message: "Semua bidang harus diisi dengan benar.",
            });
            return;
        }

        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setAlert({
                visible: true,
                type: "warning",
                message: "Nomor telepon tidak valid.",
            });
            return;
        }

        if (!latlng) {
            setAlert({
                visible: true,
                type: "warning",
                message:
                    "Silakan pilih alamat dari saran atau periksa kembali.",
            });
            return;
        }

        setLoading(true);
        try {
            const customerData = {
                name,
                gender,
                phone_number: phoneNumber,
                address,
                latlng,
            };
            await addCustomer(customerData);
            setAlert({
                visible: true,
                type: "success",
                message: "Pelanggan berhasil ditambahkan!",
            });

            setTimeout(() => {
                setName("");
                setGender("");
                setPhoneNumber("");
                setAddress("");
                setLatLng("");

                setAlert({
                    visible: false,
                    type: "success",
                    message: "",
                });

                navigation.goBack();
            }, 2000);
        } catch (error) {
            setAlert({
                visible: true,
                type: "danger",
                message:
                    error.response?.data?.message ||
                    "Terjadi kesalahan saat menambahkan pelanggan.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={100}
            style={styles.container}
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />

            <Layout style={styles.headerContainer}>
                <Icon
                    name="account-plus"
                    size={40}
                    color={theme["color-primary-500"]}
                />
                <Layout style={styles.headerText}>
                    <Text category="h4" status="primary">
                        Tambah Pelanggan
                    </Text>
                    <Text category="s1">Tambahkan pelanggan baru</Text>
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
                label={() => <Text style={styles.label}>Nama Pelanggan</Text>}
                placeholder="Masukkan nama pelanggan"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedInput("name")}
                style={styles.input}
                status={focusedInput === "name" ? "primary" : "basic"}
            />

            <Layout style={styles.radioContainer}>
                <Text style={styles.label}>Jenis Kelamin</Text>
                <RadioGroup
                    style={styles.radioGroup}
                    selectedIndex={selectedGender}
                    onChange={(index) => {
                        setGender(index === 0 ? "MALE" : "FEMALE");
                        setSelectedGender(index);
                    }}
                >
                    <Radio>Laki-laki</Radio>
                    <Radio>Perempuan</Radio>
                </RadioGroup>
            </Layout>

            <Input
                label={() => <Text style={styles.label}>Nomor Telepon</Text>}
                placeholder="Masukkan nomor telepon pelanggan"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => setFocusedInput("phone_number")}
                style={styles.input}
                status={focusedInput === "phone_number" ? "primary" : "basic"}
            />

            <Input
                label={() => <Text style={styles.label}>Alamat</Text>}
                placeholder="Masukkan alamat pelanggan"
                value={address}
                onChangeText={(text) => {
                    setAddress(text);
                    fetchSuggestions(text);
                }}
                onFocus={() => setFocusedInput("address")}
                accessoryRight={() =>
                    address.length > 0 && (
                        <Icon
                            name="close"
                            size={20}
                            color={theme["color-basic-800"]}
                            onPress={handleResetAddress}
                        />
                    )
                }
                style={styles.input}
                status={focusedInput === "address" ? "primary" : "basic"}
            />

            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                ...styles.suggestionItem,
                                borderColor: theme["color-primary-200"],
                            }}
                            onPress={() => handleSuggestionSelect(item)}
                        >
                            <Text style={styles.suggestionText}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionsContainer}
                />
            )}

            <Button
                style={styles.button}
                onPress={handleAddCustomer}
                disabled={loading}
            >
                {loading ? "Loading..." : "Tambah Pelanggan"}
            </Button>
        </KeyboardAvoidingView>
    );
};

export default CustomersListScreen;
