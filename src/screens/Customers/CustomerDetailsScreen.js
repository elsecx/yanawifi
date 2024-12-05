import React, { useState, useCallback, useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchCustomer, payOrder, deleteCustomer } from "../../services/api";
import { formatDate, formatPhoneNumber, formatRupiah } from "../../libs/utils";

import { StatusBar, TouchableOpacity } from "react-native";
import {
    useTheme,
    Layout,
    Card,
    Text,
    Button,
    Modal,
} from "@ui-kitten/components";
import MapView, { Marker } from "react-native-maps";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import BouncingLoader from "../../components/BouncingLoader";
import Badge from "../../components/Badge";
import Alert from "../../components/Alert";
import styles from "./styles/customer-details-styles";

const CustomerDetailsScreen = ({ navigation, route }) => {
    const { id } = route.params;
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [customer, setCustomer] = useState([]);

    const [alert, setAlert] = useState({
        visible: false,
        type: "success",
        message: "",
    });

    const getCustomer = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchCustomer(id);
            setCustomer(response);
        } catch (error) {
            console.error("Fetching Customer Error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            getCustomer();
        }, [getCustomer])
    );

    const onRefresh = async () => {
        setLoading(true);
        await getPackage();
    };

    const handlePay = async (id) => {
        try {
            const response = await payOrder(id);

            if (response.status === "success") {
                setAlert({
                    visible: true,
                    type: "success",
                    message: "Pembayaran Berhasil",
                });

                getCustomer();
            }
        } catch (error) {
            console.error("Pay Order Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteCustomer(id);
            navigation.goBack();
        } catch (error) {
            console.error("Error deleting customer:", error);
        } finally {
            setLoading(false);
        }
    };

    const latlng = customer?.latlng;
    let latitude = 0,
        longitude = 0;

    if (latlng) {
        const coords = latlng
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            [latitude, longitude] = coords;
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Detail Pelanggan",
            headerRight: () => (
                <TouchableOpacity onPress={() => setConfirmModal(true)}>
                    <Icon
                        name="trash-can-outline"
                        size={25}
                        color={theme["color-danger-500"]}
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation, theme]);

    if (loading) {
        return (
            <Layout style={styles.loadingContainer}>
                <BouncingLoader size="large" />
            </Layout>
        );
    }

    const CustomerInfo = ({ data, theme }) => (
        <Layout
            style={[
                styles.headerContainer,
                { borderColor: theme["color-primary-200"] },
            ]}
        >
            <Layout style={styles.row}>
                <Icon
                    name="badge-account-horizontal-outline"
                    size={50}
                    color={theme["color-primary-400"]}
                />
                <Layout
                    style={{
                        ...styles.row,
                        flex: 1,
                        justifyContent: "space-between",
                    }}
                >
                    <Text category="h4" status="primary">
                        {data.name}
                    </Text>
                    <Text category="h6" appearance="hint">
                        {customer.order ? "Berlangganan" : "Belum Berlangganan"}
                    </Text>
                </Layout>
            </Layout>
            <Layout style={styles.row}>
                <Text category="h6">Tanggal Dibuat:</Text>
                <Text category="s1">{formatDate(data.created_at)}</Text>
            </Layout>
            <Layout style={styles.row}>
                <Text category="h6">Jenis Kelamin:</Text>
                <Text category="s1">
                    {data.gender === "MALE" ? "LAKI-LAKI" : "PEREMPUAN"}
                </Text>
            </Layout>
            <Layout style={styles.row}>
                <Text category="h6">Nomor Telepon:</Text>
                <Text category="s1">
                    {formatPhoneNumber(data.phone_number)}
                </Text>
            </Layout>
            <Layout style={styles.address}>
                <Text category="h6">Alamat:</Text>
                <Text category="s1">{data.address}</Text>
            </Layout>
            {customer.order && (
                <>
                    <Layout style={styles.row}>
                        <Text category="h6">Status:</Text>
                        <Badge
                            data={
                                customer.order.status === "PAID"
                                    ? "Sudah Dibayar"
                                    : "Belum Dibayar"
                            }
                            status={
                                customer.order.status === "PAID"
                                    ? "success"
                                    : "danger"
                            }
                        />
                    </Layout>
                    <Layout style={styles.row}>
                        <Text category="h6">Jenis Layanan:</Text>
                        <Text category="s1">{data.order.package.name}</Text>
                    </Layout>
                    <Layout style={styles.row}>
                        <Text category="h6">Tanggal Pendaftaran:</Text>
                        <Text category="s1">
                            {formatDate(data.order.register_at)}
                        </Text>
                    </Layout>
                    <Layout
                        style={{
                            ...styles.row,
                            paddingHorizontal: 0.00001,
                            justifyContent: "space-between",
                        }}
                    >
                        <Text category="h4" status="primary">
                            {formatRupiah(data.order.package.price ?? 0)}/bulan
                        </Text>
                        <Button
                            size="small"
                            status="primary"
                            appearance="outline"
                            onPress={() => {
                                navigation.navigate("Orders", {
                                    screen: "OrderDetails",
                                    params: { id: data.order.id },
                                });
                            }}
                        >
                            Detail Langganan{" "}
                            <Icon
                                name="arrow-right"
                                size={15}
                                color={theme["color-primary-500"]}
                            />
                        </Button>
                    </Layout>
                </>
            )}
            <Layout style={styles.row}>
                <Button
                    status="primary"
                    size="medium"
                    style={{ flex: 1 }}
                    onPress={() => {
                        navigation.navigate("Customers", {
                            screen: "UpdateCustomer",
                            params: { id },
                        });
                    }}
                >
                    <Icon name="circle-edit-outline" size={20} color="#fff" />{" "}
                    Edit Pelanggan
                </Button>
                {customer.order && customer.order.status === "UNPAID" && (
                    <Button
                        status="info"
                        size="medium"
                        appearance="outline"
                        onPress={() => handlePay(customer.order.id)}
                    >
                        Bayar
                    </Button>
                )}
            </Layout>
        </Layout>
    );

    return (
        <>
            <StatusBar
                translucent
                barStyle="dark-content"
                backgroundColor="transparent"
            />

            <Layout style={styles.container}>
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
                            marginTop: 10,
                            marginHorizontal: 10,
                        }}
                    />
                )}
                <CustomerInfo data={customer} theme={theme} />
                {latitude && longitude && (
                    <Layout
                        style={[
                            styles.bodyContainer,
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
                                Lokasi Pelanggan
                            </Text>
                            <Icon
                                name="refresh"
                                size={25}
                                color={theme["color-primary-400"]}
                                onPress={onRefresh}
                            />
                        </Layout>
                        <Layout style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude,
                                    longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                            >
                                <Marker
                                    coordinate={{ latitude, longitude }}
                                    title="Lokasi Pelanggan"
                                />
                            </MapView>
                        </Layout>
                    </Layout>
                )}
            </Layout>

            <Modal
                animationType="fade"
                visible={confirmModal}
                backdropStyle={styles.modalBackdrop}
                onBackdropPress={() => setConfirmModal(false)}
            >
                <Card style={styles.modal} disabled>
                    <Layout style={styles.modalContent}>
                        <Layout style={styles.modalHeader}>
                            <Text category="h5">Hapus Pelanggan</Text>
                        </Layout>

                        <Layout style={styles.modalBody}>
                            <Text category="p1">
                                Apakah anda yakin akan menghapus pelanggan{" "}
                                {customer.name ?? "ini"}?{`\n`}
                                Semua data yang berkaitan dengan pelanggan ini
                                akan terhapus.
                                {`\n\n`}
                                Tekan "Ya" jika ingin melanjutkan.
                            </Text>
                        </Layout>

                        <Layout style={styles.modalFooter}>
                            <Layout style={styles.row}>
                                <Button
                                    appearance="outline"
                                    status="basic"
                                    style={{ flex: 1 }}
                                    onPress={() => setConfirmModal(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    status="danger"
                                    style={{ flex: 1 }}
                                    disabled={loading}
                                    onPress={handleDelete}
                                >
                                    {loading ? "Loading..." : "Ya"}
                                </Button>
                            </Layout>
                        </Layout>
                    </Layout>
                </Card>
            </Modal>
        </>
    );
};

export default CustomerDetailsScreen;
