import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    fetchCustomers,
    fetchCustomer,
    fetchPackages,
    fetchPackage,
    createOrder,
} from "../../services/api";

import { StatusBar, KeyboardAvoidingView } from "react-native";
import {
    useTheme,
    Layout,
    Select,
    SelectItem,
    Button,
    Text,
} from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Alert from "../../components/Alert";
import styles from "./styles/create-order-styles";

const CreateOrderScreen = ({ navigation }) => {
    const theme = useTheme();
    const [loadingInput, setLoadingInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        visible: false,
        type: "success",
        message: "",
    });

    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [packagesData, setPackagesData] = useState([]);
    const [packageData, setPackageData] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const getData = useCallback(async () => {
        setLoadingInput(true);
        try {
            const customersData = await fetchCustomers("unsubscribed");
            setCustomers(customersData);
        } catch (error) {
            console.error("Error fetching customers:", error);
            setCustomers([]);
        } finally {
            setLoadingInput(false);
        }

        try {
            const packagesData = await fetchPackages();
            setPackagesData(packagesData);
        } catch (error) {
            console.error("Error fetching packages:", error);
            setPackagesData([]);
        } finally {
            setLoadingInput(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            getData();
        }, [getData])
    );

    const getCustomerData = async (id) => {
        try {
            const response = await fetchCustomer(id);
            setCustomer(response);
        } catch (error) {
            console.error("Error fetching customer:", error);
        }
    };

    const handleSelectedCustomer = async (index) => {
        const customer = customers[index.row];
        setSelectedCustomer(customer.name);

        getCustomerData(customer.id);
    };

    const getPackageData = async (id) => {
        try {
            const response = await fetchPackage(id);
            setPackageData(response);
        } catch (error) {
            console.error("Error fetching package:", error);
        }
    };

    const handleSelectedPackage = async (index) => {
        const packageData = packagesData[index.row];
        console.log(packageData);
        setSelectedPackage(packageData.name);

        getPackageData(packageData.id);
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
                    name="access-point-plus"
                    size={40}
                    color={theme["color-primary-500"]}
                />
                <Layout style={styles.headerText}>
                    <Text category="h4" status="primary">
                        Registrasi Pelanggan
                    </Text>
                    <Text category="s1">
                        Daftarkan pelanggan dengan layanan internet yang
                        tersedia
                    </Text>
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

            <Select
                label={() => <Text style={styles.label}>Pelanggan</Text>}
                placeholder="Pilih Pelanggan"
                value={selectedCustomer}
                onSelect={(index) =>
                    customers.length > 0
                        ? handleSelectedCustomer(index)
                        : navigation.navigate("Customers", {
                              screen: "AddCustomer",
                          })
                }
                disabled={loadingInput}
                style={styles.select}
            >
                {customers.length > 0 ? (
                    <>
                        {customers.map((customer) => (
                            <SelectItem
                                key={customer.id}
                                title={customer.name}
                            />
                        ))}

                        <SelectItem
                            title="Tambah Pelanggan Baru"
                            accessoryLeft={(props) => (
                                <Icon
                                    {...props}
                                    name="plus"
                                    size={20}
                                    color={theme["color-primary-500"]}
                                />
                            )}
                        />
                    </>
                ) : (
                    <SelectItem
                        title="Buat Pelanggan"
                        accessoryLeft={(props) => (
                            <Icon
                                {...props}
                                name="plus"
                                size={20}
                                color={theme["color-primary-500"]}
                            />
                        )}
                    />
                )}
            </Select>

            <Select
                label={() => <Text style={styles.label}>Paket Layanan</Text>}
                placeholder="Pilih Paket Layanan"
                value={selectedPackage}
                onSelect={(index) =>
                    packagesData.length > 0
                        ? handleSelectedPackage(index)
                        : navigation.navigate("Packages", {
                              screen: "AddPackage",
                          })
                }
                disabled={loadingInput}
                style={styles.select}
            >
                {packagesData.length > 0 ? (
                    <>
                        {packagesData.map((item) => (
                            <SelectItem
                                key={item.id}
                                title={item.name}
                                accessoryLeft={(props) => (
                                    <Icon
                                        {...props}
                                        name={
                                            item.name === "Basic"
                                                ? "wifi-strength-1"
                                                : item.name === "Standard"
                                                ? "wifi-strength-2"
                                                : item.name === "Premium"
                                                ? "wifi-strength-3"
                                                : item.name === "Ultimate"
                                                ? "wifi-star"
                                                : "earth"
                                        }
                                        size={20}
                                        color={theme["color-primary-800"]}
                                    />
                                )}
                            />
                        ))}

                        <SelectItem
                            title="Tambah Paket Baru"
                            accessoryLeft={(props) => (
                                <Icon
                                    {...props}
                                    name="plus"
                                    size={20}
                                    color={theme["color-primary-500"]}
                                />
                            )}
                        />
                    </>
                ) : (
                    <SelectItem
                        title="Buat Paket"
                        accessoryLeft={(props) => (
                            <Icon
                                {...props}
                                name="account"
                                size={20}
                                color={theme["color-primary-500"]}
                            />
                        )}
                    />
                )}
            </Select>

            <Layout style={styles.previewsContainer}></Layout>

            <Button style={styles.button} onPress={() => {}} disabled={loading}>
                {loading ? "Loading..." : "Tambah Pelanggan"}
            </Button>
        </KeyboardAvoidingView>
    );
};

export default CreateOrderScreen;
