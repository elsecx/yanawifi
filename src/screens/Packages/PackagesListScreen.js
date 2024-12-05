import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchPackages } from "../../services/api";
import { formatRupiah } from "../../libs/utils";

import { StatusBar, RefreshControl, FlatList } from "react-native";
import { useTheme, Layout, Text, Button } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import BouncingLoader from "../../components/BouncingLoader";
import styles from "./styles/packages-list-styles";

const PackagesListScreen = ({ navigation }) => {
    const theme = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [packageData, setPackageData] = useState([]);

    const getPackages = useCallback(async () => {
        try {
            const response = await fetchPackages();
            setPackageData(response || []);
        } catch (error) {
            console.error("Fetching Packages Error:", error);
            setPackageData([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            getPackages();
        }, [getPackages])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await getPackages();
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
                data={packageData}
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
                renderItem={({ item }) => (
                    <LinearGradient
                        colors={[
                            theme["color-basic-100"],
                            theme["color-primary-100"],
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                            ...styles.card,
                            borderColor: theme["color-primary-400"],
                        }}
                    >
                        <Icon
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
                            size={40}
                            color={theme["color-primary-800"]}
                        />
                        <Text
                            category="h4"
                            style={{
                                color: theme["color-primary-800"],
                            }}
                        >
                            Paket Layanan {item.name}
                        </Text>
                        <Text
                            category="s1"
                            numberOfLines={2}
                            style={{
                                width: "80%",
                                textAlign: "center",
                                color: theme["color-primary-800"],
                            }}
                        >
                            {item.description}
                        </Text>
                        <Text
                            category="h2"
                            style={{
                                marginVertical: 10,
                                lineHeight: 35,
                                color: theme["color-primary-800"],
                            }}
                        >
                            {formatRupiah(item.price ?? 0)}
                        </Text>
                        <Button
                            size="medium"
                            style={{ width: "100%" }}
                            onPress={() =>
                                navigation.navigate("Packages", {
                                    screen: "PackageDetails",
                                    params: { id: item.id },
                                })
                            }
                        >
                            Detail
                        </Button>
                    </LinearGradient>
                )}
                ListEmptyComponent={() => (
                    <Layout style={styles.noData}>
                        <Text category="s1" style={{ textAlign: "center" }}>
                            Tidak ada paket layanan.
                        </Text>
                    </Layout>
                )}
            />

            <Button
                size="large"
                appearance="outline"
                style={styles.floatingButton}
                onPress={() =>
                    navigation.navigate("Packages", {
                        screen: "AddPackage",
                    })
                }
            >
                <Icon
                    name="earth-plus"
                    size={20}
                    color={theme["color-primary-800"]}
                />{" "}
                <Text
                    category="h6"
                    style={{ color: theme["color-primary-800"] }}
                >
                    Tambah Paket
                </Text>
            </Button>
        </Layout>
    );
};

export default PackagesListScreen;
