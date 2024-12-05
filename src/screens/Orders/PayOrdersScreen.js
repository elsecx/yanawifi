import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchOrders, payOrder } from "../../services/api";
import { formatDate, formatRupiah } from "../../libs/utils";

import { StatusBar, RefreshControl, FlatList } from "react-native";
import {
    useTheme,
    Layout,
    Text,
    Button,
    Input,
    Card,
} from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import BouncingLoader from "../../components/BouncingLoader";
import Alert from "../../components/Alert";
import Badge from "../../components/Badge";
import styles from "./styles/pay-orders-styles";

const PayOrdersScreen = ({ navigation }) => {
    const theme = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState([]);

    const [alert, setAlert] = useState({
        visible: false,
        type: "success",
        message: "",
    });

    const getOrders = useCallback(async (searchQuery = "") => {
        try {
            setLoading(true);
            const response = await fetchOrders("unpaid", searchQuery);
            setOrders(response || []);
        } catch (error) {
            console.error("Fetching Customers Error:", error);
            setOrders([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            getOrders();
        }, [getOrders])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        fetchReset();
        await getOrders(search);
    };

    const handleSearch = async () => {
        await getOrders(search);
    };

    const fetchReset = () => {
        setSearch("");
        getOrders();
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

                getOrders();
            }
        } catch (error) {
            console.log("Error paying order:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout style={styles.loadingContainer}>
                <BouncingLoader size="large" />
            </Layout>
        );
    }

    return (
        <Layout style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />

            <FlatList
                data={orders}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme["color-primary-600"]]}
                        tintColor={theme["color-primary-600"]}
                    />
                }
                keyExtractor={(item) => item.id.toString()}
                stickyHeaderIndices={[0]}
                ListHeaderComponent={
                    <Layout style={styles.headerContainer}>
                        <Input
                            value={search}
                            placeholder="Cari pelanggan..."
                            accessoryLeft={() => (
                                <Icon
                                    name="magnify"
                                    size={20}
                                    color={theme["color-primary-700"]}
                                />
                            )}
                            accessoryRight={() =>
                                search.length > 0 && (
                                    <Icon
                                        name="close"
                                        size={20}
                                        color={theme["color-basic-800"]}
                                        onPress={fetchReset}
                                    />
                                )
                            }
                            onChangeText={setSearch}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                            style={styles.searchInput}
                        />

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
                                }}
                            />
                        )}
                    </Layout>
                }
                renderItem={({ item }) => (
                    <Card
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate("Orders", {
                                screen: "OrderDetails",
                                params: { id: item.id },
                            })
                        }
                        footer={() => (
                            <Layout style={styles.cardFooter}>
                                <Layout style={{ ...styles.row, padding: 10 }}>
                                    <Text style={styles.label}>Berakhir:</Text>
                                    <Text style={styles.value}>
                                        {formatDate(item.subscription_end)}
                                    </Text>
                                </Layout>
                                <Layout style={styles.cardPrice}>
                                    <Text category="h4" status="primary">
                                        {formatRupiah(item.price ?? 0)}
                                    </Text>
                                    <Button
                                        size="medium"
                                        status="primary"
                                        onPress={() => handlePay(item.id)}
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Bayar"}
                                    </Button>
                                </Layout>
                            </Layout>
                        )}
                    >
                        <Layout style={styles.cardContent}>
                            <Layout style={styles.cardTitle}>
                                <Text category="h5">
                                    Paket Layanan {item.package}
                                </Text>
                                <Text
                                    category="h6"
                                    appearance="alternative"
                                    status="primary"
                                >
                                    {item.customer_name}
                                </Text>
                            </Layout>
                            {item.status === "PAID" ? (
                                <Badge data="Sudah Dibayar" status="success" />
                            ) : item.status === "UNPAID" ? (
                                <Badge data="Belum Dibayar" status="danger" />
                            ) : null}
                        </Layout>
                    </Card>
                )}
                ListEmptyComponent={() => (
                    <Layout style={styles.noData}>
                        <Text category="s1" style={{ textAlign: "center" }}>
                            Pelanggan tidak ditemukan
                        </Text>
                    </Layout>
                )}
            />
        </Layout>
    );
};

export default PayOrdersScreen;
