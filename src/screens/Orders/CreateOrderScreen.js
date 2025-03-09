import React, { useState, useEffect } from "react";
import {
    fetchCustomers,
    fetchCustomer,
    fetchPackages,
    fetchPackage,
    createOrder,
} from "../../services/api";
import {
    formatDate,
    formatPhoneNumber,
    formatRupiah,
    getCurrentDate,
} from "../../libs/utils";

import { StatusBar } from "react-native";
import {
    useTheme,
    Layout,
    Text,
    Select,
    SelectItem,
    Button,
} from "@ui-kitten/components";
import MapView, { Marker } from "react-native-maps";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Alert from "../../components/Alert";
import BouncingLoader from "../../components/BouncingLoader";
import HorizontalLine from "../../components/HorizontalLine";
import styles from "./styles/create-order-styles";

const CreateOrderScreen = ({ navigation }) => {
    const theme = useTheme();
    const defaultCoordinates = {
        latitude: -6.194942351826034,
        longitude: 106.8230582847778,
    };
    const [loading, setLoading] = useState(false);
    const [loadingInput, setLoadingInput] = useState(false);
    const [alert, setAlert] = useState({
        visible: false,
        type: "",
        message: "",
    });

    const [data, setData] = useState({ customers: [], packages: [] });
    const [selectedData, setSelectedData] = useState({
        customer: null,
        package: null,
    });

    const [coordinates, setCoordinates] = useState({
        latitude: 0,
        longitude: 0,
    });

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setAlert({
                    visible: true,
                    type: "danger",
                    message: "Izin lokasi diperlukan untuk menampilkan peta.",
                });
                return;
            }
        })();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customersResponse = await fetchCustomers("unsubscribed");
                setData((prevState) => ({
                    ...prevState,
                    customers: customersResponse,
                }));
            } catch (error) {
                console.error("Error customers data:", error);
            }

            try {
                const packagesResponse = await fetchPackages();
                setData((prevState) => ({
                    ...prevState,
                    packages: packagesResponse,
                }));
            } catch (error) {
                console.error("Error packages data:", error);
            }
        };

        fetchData();
    }, []);

    const handleSelection = async (index, type) => {
        const items = type === "customer" ? data.customers : data.packages;

        const selectedItem = items[index.row];

        if (!items || items.length === 0) {
            if (type === "customer") {
                navigation.navigate("Customers", { screen: "AddCustomer" });
            } else {
                navigation.navigate("Packages", { screen: "AddPackage" });
            }
            return;
        }

        if (index.row < 0 || index.row > items.length) {
            return;
        }

        if (index.row === items.length) {
            if (type === "customer") {
                navigation.navigate("Customers", { screen: "AddCustomer" });
            } else {
                navigation.navigate("Packages", { screen: "AddPackage" });
            }
            return;
        }

        setLoadingInput(true);

        try {
            const response =
                type === "customer"
                    ? await fetchCustomer(selectedItem.id)
                    : await fetchPackage(selectedItem.id);

            setSelectedData((prevState) => ({
                ...prevState,
                [type]: response,
            }));

            if (type === "customer") {
                const coords = response.latlng
                    .split(",")
                    .map((coord) => parseFloat(coord.trim()));

                if (
                    coords.length === 2 &&
                    !isNaN(coords[0]) &&
                    !isNaN(coords[1])
                ) {
                    setCoordinates({
                        latitude: coords[0],
                        longitude: coords[1],
                    });
                } else {
                    console.error(
                        "Koordinat tidak valid untuk customer:",
                        coords
                    );
                    setCoordinates(defaultCoordinates);
                }
            }
        } catch (error) {
            setAlert({
                visible: true,
                type: "danger",
                message: `Gagal mengambil data ${type}.`,
            });
            console.error(`Error fetching ${type} data:`, error);
        } finally {
            setLoadingInput(false);
        }
    };

    const handleReset = () => {
        setSelectedData({
            customer: null,
            package: null,
        });
        setCoordinates(defaultCoordinates);
        setAlert({
            visible: false,
            type: "",
            message: "",
        });
        setLoadingInput(false);
        setLoading(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await createOrder({
                customer_id: selectedData.customer.id,
                package_id: selectedData.package.id,
            });

            if (response.status === "success") {
                setAlert({
                    visible: true,
                    type: "success",
                    message: "Registrasi berhasil.",
                });

                setTimeout(() => {
                    handleReset();
                }, 3000);
            }
        } catch (error) {
            console.log("Error registering order:", error);
        } finally {
            setLoading(false);
        }
    };

    const getEndDate = () => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        return formatDate(currentDate.toISOString().split("T")[0]);
    };

    const getIconName = (name, type) => {
        if (type === "package") {
            switch (name) {
                case "Basic":
                    return "wifi-strength-1";
                case "Standard":
                    return "wifi-strength-2";
                case "Premium":
                    return "wifi-strength-3";
                case "Ultimate":
                    return "wifi-star";
                default:
                    return "earth";
            }
        }
        return "account";
    };

    const renderSelectItem = (items, type) => {
        if (items.length === 0) {
            return (
                <SelectItem
                    title={`Buat ${
                        type === "customer" ? "Pelanggan" : "Paket"
                    } Baru`}
                    accessoryLeft={(props) => (
                        <Icon
                            {...props}
                            size={20}
                            name="plus"
                            color={theme["color-primary-800"]}
                        />
                    )}
                />
            );
        }

        return [
            ...items.map((item) => (
                <SelectItem
                    key={item.id}
                    title={item.name}
                    accessoryLeft={(props) => (
                        <Icon
                            {...props}
                            name={getIconName(item.name, type)}
                            size={20}
                            color={theme["color-primary-800"]}
                        />
                    )}
                />
            )),

            <SelectItem
                key="add-new"
                title={`Tambah ${
                    type === "customer" ? "Pelanggan" : "Paket"
                } Baru`}
                accessoryLeft={(props) => (
                    <Icon
                        {...props}
                        size={20}
                        name="plus"
                        color={theme["color-primary-800"]}
                    />
                )}
            />,
        ];
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
                value={selectedData?.customer?.name}
                onSelect={(index) => handleSelection(index, "customer")}
                disabled={loadingInput}
                accessoryRight={
                    loadingInput ? <BouncingLoader size="tiny" /> : null
                }
                style={styles.select}
            >
                {renderSelectItem(data.customers, "customer")}
            </Select>

            <Select
                label={() => <Text style={styles.label}>Paket Layanan</Text>}
                placeholder="Pilih Paket Layanan"
                value={selectedData.package?.name}
                onSelect={(index) => handleSelection(index, "package")}
                disabled={loadingInput}
                accessoryRight={
                    loadingInput ? <BouncingLoader size="tiny" /> : null
                }
                style={styles.select}
            >
                {renderSelectItem(data.packages, "package")}
            </Select>

            <HorizontalLine txt="Detail Pesanan" />

            {selectedData.customer && selectedData.package ? (
                <Layout style={styles.detailContainer}>
                    <Layout
                        style={{
                            ...styles.detailInfo,
                            borderColor: theme["color-primary-200"],
                        }}
                    >
                        <Layout style={styles.row}>
                            <Text category="s1" style={styles.label}>
                                Atas Nama
                            </Text>
                            <Text category="s1" style={styles.value}>
                                : {selectedData.customer.name}
                            </Text>
                        </Layout>
                        <Layout style={styles.row}>
                            <Text category="s1" style={styles.label}>
                                Paket Layanan
                            </Text>
                            <Text category="s1" style={styles.value}>
                                : {selectedData.package.name}
                            </Text>
                        </Layout>
                        <Layout style={styles.row}>
                            <Text category="s1" style={styles.label}>
                                Nomor Telepon Pelanggan
                            </Text>
                            <Text category="s1" style={styles.value}>
                                :{" "}
                                {formatPhoneNumber(
                                    selectedData.customer.phone_number
                                )}
                            </Text>
                        </Layout>
                        <Layout style={styles.row}>
                            <Text category="s1" style={styles.label}>
                                Tanggal Pendaftaran
                            </Text>
                            <Text category="s1" style={styles.value}>
                                : {getCurrentDate()} (Sekarang)
                            </Text>
                        </Layout>
                        <Layout style={styles.row}>
                            <Text category="s1" style={styles.label}>
                                Tanggal Berakhir
                            </Text>
                            <Text category="s1" style={styles.value}>
                                : {getEndDate()}
                            </Text>
                        </Layout>
                        <Text
                            category="h4"
                            status="primary"
                            style={styles.value}
                        >
                            {formatRupiah(selectedData.package.price)}/Bulan
                        </Text>
                    </Layout>

                    <Layout
                        style={[
                            styles.detailLocation,
                            { borderColor: theme["color-primary-200"] },
                        ]}
                    >
                        <Layout
                            style={{
                                ...styles.row,
                                paddingHorizontal: 0.00001,
                                justifyContent: "space-between",
                            }}
                        >
                            <Text category="h5" status="primary">
                                <Icon
                                    name="map-marker-radius"
                                    size={30}
                                    color={theme["color-primary-500"]}
                                />{" "}
                                Lokasi
                            </Text>
                        </Layout>
                        <Layout
                            style={{
                                ...styles.mapContainer,
                                borderColor: theme["color-primary-200"],
                            }}
                        >
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: coordinates.latitude,
                                    longitude: coordinates.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: coordinates.latitude,
                                        longitude: coordinates.longitude,
                                    }}
                                    title="Lokasi"
                                />
                            </MapView>
                        </Layout>
                    </Layout>
                </Layout>
            ) : (
                <Layout style={styles.noData}>
                    <Text category="s1" style={{ textAlign: "center" }}>
                        Belum ada pelanggan dan paket yang dipilih
                    </Text>
                </Layout>
            )}

            <Button
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? "Loading..." : "Daftarkan"}
            </Button>
        </Layout>
    );
};

export default CreateOrderScreen;
