import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchOrders } from "../../services/api";
import { formatDate, formatRupiah } from "../../libs/utils";

import {
    ImageBackground,
    RefreshControl,
    FlatList,
    TouchableOpacity,
} from "react-native";
import {
    useTheme,
    OverflowMenu,
    MenuItem,
    Layout,
    Text,
    Input,
    Card,
} from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import BouncingLoader from "../../components/BouncingLoader";
import Badge from "../../components/Badge";
import styles from "./styles/orders-list-styles";

const OrdersListScreen = ({ navigation }) => {
    const theme = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [filterVisible, setFilterVisible] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");

    const getOrders = useCallback(
        async (searchQuery = "") => {
            try {
                setLoading(true);
                const response = await fetchOrders(filterStatus, searchQuery);
                setOrders(response || []);
            } catch (error) {
                console.error("Fetching Orders Error:", error);
                setOrders([]);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [filterStatus]
    );

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
        setFilterStatus("");
        getOrders();
    };

    const handleFilterSelect = (selectedIndex) => {
        setFilterVisible(false);
        const filterOptions = ["", "paid", "unpaid"];
        setFilterStatus(filterOptions[selectedIndex.row]);
    };

    if (loading) {
        return (
            <Layout style={styles.loadingContainer}>
                <BouncingLoader size="large" />
            </Layout>
        );
    }

    return (
        <FlatList
            data={orders}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[theme["color-primary-600"]]}
                    tintColor={theme["color-primary-600"]}
                />
            }
            keyExtractor={(item, index) => `${item.id}-${index}`}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
                <ImageBackground
                    source={require("../../../assets/img/bg.jpeg")}
                    style={styles.headerNavigation}
                >
                    <Layout style={styles.headerNavigationContent}>
                        <Layout style={styles.headerNavigationTitle}>
                            <Layout style={styles.row}>
                                <Text
                                    category="h4"
                                    status="control"
                                    style={{ lineHeight: 28 }}
                                >
                                    Subscribers
                                </Text>
                                <Text
                                    category="h6"
                                    status="control"
                                    style={{ lineHeight: 16 }}
                                >
                                    Total: {orders.length} Subscribers
                                </Text>
                            </Layout>
                            <Layout style={styles.row}>
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
                                <OverflowMenu
                                    anchor={() => (
                                        <TouchableOpacity
                                            onPress={() =>
                                                setFilterVisible(true)
                                            }
                                        >
                                            <Icon
                                                name="filter-variant"
                                                size={30}
                                                color="#fff"
                                            />
                                        </TouchableOpacity>
                                    )}
                                    visible={filterVisible}
                                    onSelect={(index) =>
                                        handleFilterSelect(index)
                                    }
                                    onBackdropPress={() =>
                                        setFilterVisible(false)
                                    }
                                >
                                    <MenuItem title="Semua" />
                                    <MenuItem title="Sudah Dibayar" />
                                    <MenuItem title="Belum Dibayar" />
                                </OverflowMenu>
                            </Layout>
                        </Layout>
                    </Layout>
                </ImageBackground>
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
                                <Text
                                    appearance="hint"
                                    style={{ fontSize: 16 }}
                                >
                                    Berakhir:
                                </Text>
                                <Text category="s1" appearance="hint">
                                    {formatDate(item.subscription_end)}
                                </Text>
                            </Layout>
                            <Layout style={styles.cardPrice}>
                                <Text category="h4" status="primary">
                                    {formatRupiah(item.price ?? 0)}
                                </Text>
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
                        Tidak ada pelanggan
                    </Text>
                </Layout>
            )}
        />
    );
};

export default OrdersListScreen;
