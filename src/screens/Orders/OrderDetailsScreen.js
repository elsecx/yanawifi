import React, { useState, useEffect, useLayoutEffect } from "react";
import { fetchOrder, payOrder } from "../../services/api";
import { formatDate, formatRupiah, formatPhoneNumber } from "../../libs/utils";

import { StatusBar, FlatList, View } from "react-native";
import { useTheme, Layout, Text, Card, Button } from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import BouncingLoader from "../../components/BouncingLoader";
import Badge from "../../components/Badge";
import Alert from "../../components/Alert";
import styles from "./styles/order-details-styles";

const OrderDetailsScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    const [alert, setAlert] = useState({
        visible: false,
        type: "success",
        message: "",
    });

    useEffect(() => {
        getOrder();
    }, []);

    const getOrder = async () => {
        try {
            const response = await fetchOrder(id);
            if (response) setOrder(response);
            else console.log("Error fetching order");
        } catch (error) {
            console.log("Fetching Order Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setLoading(true);
        await getOrder();
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

                getOrder();
            }
        } catch (error) {
            console.log("Error paying order:", error);
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        if (order) {
            navigation.setOptions({
                headerTitle: () => (
                    <Layout style={styles.headerNavigation}>
                        <Text category="h5">Detail Langganan</Text>
                        {order.status && (
                            <Badge
                                data={
                                    order.status === "PAID"
                                        ? "Sudah Dibayar"
                                        : "Belum Dibayar"
                                }
                                status={
                                    order.status === "PAID"
                                        ? "success"
                                        : "danger"
                                }
                            />
                        )}
                    </Layout>
                ),
            });
        }
    }, [order]);

    if (loading) {
        return (
            <Layout style={styles.loadingContainer}>
                <BouncingLoader size="large" />
            </Layout>
        );
    }

    const DetailRow = ({ label, value }) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>: {value}</Text>
        </View>
    );

    const OrderInfo = ({ order, theme }) => (
        <Layout
            style={[
                styles.headerContainer,
                { borderColor: theme["color-primary-200"] },
            ]}
        >
            <View style={styles.row}>
                <Icon
                    name={
                        order.package === "Basic"
                            ? "wifi-strength-1"
                            : order.package === "Standard"
                            ? "wifi-strength-2"
                            : order.package === "Premium"
                            ? "wifi-strength-3"
                            : order.package === "Ultimate"
                            ? "wifi-star"
                            : "earth"
                    }
                    size={50}
                    color={theme["color-primary-400"]}
                />
                <Text category="h4" status="primary">
                    Paket Layanan {order.package}
                </Text>
            </View>
            <DetailRow
                label="Tanggal Pendaftaran"
                value={formatDate(order.register_at)}
            />
            <DetailRow
                label="Kadaluarsa"
                value={formatDate(order.subscription_end)}
            />
            <DetailRow label="Nama Pelanggan" value={order.customer_name} />
            <DetailRow
                label="Nomor HP Pelanggan"
                value={formatPhoneNumber(order.customer_phone)}
            />
            <DetailRow
                label="Alamat Pelanggan"
                value={order.customer_address}
            />
            <Text category="h4" status="primary">
                {formatRupiah(order.price)}/bulan
            </Text>
            {order.status === "UNPAID" && (
                <Button status="primary" onPress={() => handlePay(id)}>
                    Bayar Tagihan
                </Button>
            )}
        </Layout>
    );

    const PaymentHistory = ({ data, onRefresh, theme }) => (
        <FlatList
            data={data}
            contentContainerStyle={styles.contentContainer}
            keyExtractor={(index) => index.toString()}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={() => (
                <Layout
                    style={[
                        styles.listHeader,
                        { borderColor: theme["color-primary-400"] },
                    ]}
                >
                    <Text category="h6" status="primary">
                        Riwayat Pembayaran
                    </Text>
                    <Icon
                        name="refresh"
                        size={25}
                        color={theme["color-primary-400"]}
                        onPress={onRefresh}
                    />
                </Layout>
            )}
            renderItem={({ item }) => (
                <Card
                    style={[
                        styles.card,
                        { borderColor: theme["color-primary-200"] },
                    ]}
                    disabled
                >
                    <Layout style={styles.cardContent}>
                        <Text style={styles.label}>Tanggal Pelunasan: </Text>
                        <Text style={styles.value}>
                            {formatDate(item.effective_at)}
                        </Text>
                        <Badge data="Lunas" status="success" />
                    </Layout>
                </Card>
            )}
            ListEmptyComponent={() => (
                <Layout style={styles.noData}>
                    <Text category="s1" style={{ textAlign: "center" }}>
                        Detail langganan tidak ditemukan
                    </Text>
                </Layout>
            )}
        />
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
                <OrderInfo order={order} theme={theme} />
                <PaymentHistory
                    data={order.payment_history}
                    onRefresh={onRefresh}
                    theme={theme}
                />
            </Layout>
        </>
    );
};

export default OrderDetailsScreen;
