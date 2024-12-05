import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    fetchAddressSuggestions,
    fetchCustomer,
    updateCustomer,
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
import styles from "./styles/update-customer-styles";

const UpdateCustomerScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const { id } = route.params;
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

    const getCustomer = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchCustomer(id);
            setName(response.name);
            setGender(response.gender);
            setSelectedGender(
                response.gender === "MALE"
                    ? 0
                    : response.gender === "FEMALE"
                    ? 1
                    : null
            );
            setPhoneNumber(response.phone_number);
            setAddress(response.address);
            setLatLng(response.latlng);
        } catch (error) {
            setAlert({
                visible: true,
                type: "danger",
                message: "Gagal mengambil data pelanggan.",
            });
        } finally {
            setLoading(false);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            getCustomer();
        }, [getCustomer])
    );

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
                const coordinates = await fetchOpenCageCoordinates(address);
                if (coordinates) {
                    setLatLng(`${coordinates.lat}, ${coordinates.lng}`);
                } else {
                    setAlert({
                        visible: true,
                        type: "warning",
                        message: "Alamat tidak valid. Coba periksa kembali.",
                    });
                }
            } catch (error) {
                setAlert({
                    visible: true,
                    type: "danger",
                    message: "Gagal mengambil koordinat dari OpenCage.",
                });
            }
        }
        setSuggestions([]);
    };

    const handleUpdateCustomer = async () => {
        if (!name || !gender || !phoneNumber || !address) {
            setAlert({
                visible: true,
                type: "danger",
                message: "Semua bidang harus diisi dengan benar.",
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
            await updateCustomer(id, customerData);

            setAlert({
                visible: true,
                type: "success",
                message: "Pelanggan berhasil diperbarui!",
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
            setAlert({
                visible: true,
                type: "danger",
                message: "Terjadi kesalahan saat memperbarui pelanggan.",
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
                    name="account-edit"
                    size={40}
                    color={theme["color-primary-500"]}
                />
                <Layout style={styles.headerText}>
                    <Text category="h4" status="primary">
                        Edit Pelanggan
                    </Text>
                    <Text category="s1">Edit pelanggan {name}</Text>
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
                accessoryRight={() =>
                    address.length > 0 && (
                        <Icon
                            name="close"
                            size={20}
                            color={theme["color-basic-800"]}
                            onPress={() => setAddress("")}
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
                onPress={handleUpdateCustomer}
                disabled={loading}
                style={styles.button}
            >
                {loading ? "Memperbarui..." : "Simpan Perubahan"}
            </Button>
        </KeyboardAvoidingView>
    );
};

export default UpdateCustomerScreen;
