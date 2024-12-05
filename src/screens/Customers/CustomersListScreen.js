import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchCustomers } from "../../services/api";
import { formatDate, formatPhoneNumber } from "../../libs/utils";

import {
    StatusBar,
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
    Button,
    Input,
    Card,
} from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import BouncingLoader from "../../components/BouncingLoader";
import Badge from "../../components/Badge";
import styles from "./styles/customers-list-styles";

const CustomersListScreen = ({ navigation }) => {
    const theme = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [customersData, setCustomersData] = useState([]);
    const [search, setSearch] = useState("");
    const [filterVisible, setFilterVisible] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");

    const getCustomers = useCallback(
        async (searchQuery = "") => {
            try {
                setLoading(true);
                const response = await fetchCustomers(
                    filterStatus,
                    searchQuery
                );
                setCustomersData(response || []);
            } catch (error) {
                console.error("Fetching Customers Error:", error);
                setCustomersData([]);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [filterStatus]
    );

    useFocusEffect(
        useCallback(() => {
            getCustomers();
        }, [getCustomers])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        fetchReset();
        await getCustomers(search);
    };

    const handleSearch = async () => {
        await getCustomers(search);
    };

    const fetchReset = () => {
        setSearch("");
        setFilterStatus("");
        getCustomers();
    };

    const handleFilterSelect = (selectedIndex) => {
        setFilterVisible(false);
        const filterOptions = [
            "",
            "subscribed",
            "unsubscribed",
            "paid",
            "unpaid",
        ];
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
        <Layout style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />

            <FlatList
                data={customersData}
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
                                        onPress={() => setFilterVisible(true)}
                                    >
                                        <Icon
                                            name="filter-variant"
                                            size={30}
                                            color={theme["color-primary-500"]}
                                        />
                                    </TouchableOpacity>
                                )}
                                visible={filterVisible}
                                onSelect={(index) => handleFilterSelect(index)}
                                onBackdropPress={() => setFilterVisible(false)}
                            >
                                <MenuItem title="Semua" />
                                <MenuItem title="Berlangganan" />
                                <MenuItem title="Tidak Berlangganan" />
                                <MenuItem title="Sudah Dibayar" />
                                <MenuItem title="Belum Dibayar" />
                            </OverflowMenu>
                        </Layout>
                    </Layout>
                }
                renderItem={({ item }) => (
                    <Card
                        disabled
                        footer={() => (
                            <Layout style={styles.cardFooter}>
                                <Layout style={styles.row}>
                                    <Text style={styles.label}>
                                        Tanggal Didaftarkan
                                    </Text>
                                    <Text style={styles.value}>
                                        : {formatDate(item.created_at)}
                                    </Text>
                                    <Button
                                        size="small"
                                        status="primary"
                                        onPress={() =>
                                            navigation.navigate("Customers", {
                                                screen: "CustomerDetails",
                                                params: { id: item.id },
                                            })
                                        }
                                    >
                                        Detail{" "}
                                        <Icon
                                            name="arrow-right"
                                            size={15}
                                            color="white"
                                        />
                                    </Button>
                                </Layout>
                            </Layout>
                        )}
                    >
                        <Layout style={styles.cardContent}>
                            <Layout style={styles.cardRow}>
                                <Text category="h4" status="primary">
                                    {item.name}
                                </Text>
                                <Text category="h6" status="primary">
                                    {item.status
                                        ? "Berlangganan"
                                        : "Belum Berlangganan"}
                                </Text>
                            </Layout>
                            <Layout style={styles.cardRow}>
                                <Text
                                    category="p1"
                                    status="primary"
                                    appearance="hint"
                                >
                                    {formatPhoneNumber(item.phone)}
                                </Text>
                                <Badge
                                    data={
                                        item.status === "PAID"
                                            ? "Sudah Dibayar"
                                            : item.status === "UNPAID"
                                            ? "Belum Dibayar"
                                            : null
                                    }
                                    status={
                                        item.status === "PAID"
                                            ? "success"
                                            : item.status === "UNPAID"
                                            ? "danger"
                                            : null
                                    }
                                />
                            </Layout>
                            <Text
                                category="p1"
                                numberOfLines={2}
                                style={{ marginTop: 5 }}
                            >
                                {item.address}
                            </Text>
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

            <Button
                size="large"
                appearance="outline"
                style={styles.floatingButton}
                onPress={() =>
                    navigation.navigate("Customers", {
                        screen: "AddCustomer",
                    })
                }
            >
                <Icon
                    name="account-plus-outline"
                    size={20}
                    color={theme["color-primary-800"]}
                />{" "}
                <Text
                    category="h6"
                    style={{ color: theme["color-primary-800"] }}
                >
                    Tambah Pelanggan
                </Text>
            </Button>
        </Layout>
    );
};

export default CustomersListScreen;
