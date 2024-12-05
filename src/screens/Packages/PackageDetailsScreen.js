import React, { useState, useCallback, useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { deletePackage, fetchPackage } from "../../services/api";
import { formatDate, formatRupiah } from "../../libs/utils";

import { StatusBar, TouchableOpacity, FlatList } from "react-native";
import {
    useTheme,
    Layout,
    Card,
    Text,
    Button,
    Modal,
} from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import BouncingLoader from "../../components/BouncingLoader";
import Badge from "../../components/Badge";
import styles from "./styles/package-details-styles";

const PackageDetailsScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const { id } = route.params;

    const [loading, setLoading] = useState(true);
    const [packageData, setPackageData] = useState(null);

    const [confirmModal, setConfirmModal] = useState(false);

    const getPackage = useCallback(async () => {
        try {
            const response = await fetchPackage(id);
            setPackageData(response);
        } catch (error) {
            console.error("Error fetching package:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            getPackage();
        }, [getPackage])
    );

    const onRefresh = async () => {
        setLoading(true);
        await getPackage();
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deletePackage(id);
            navigation.goBack();
        } catch (error) {
            console.error("Error deleting package:", error);
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Detail Paket Layanan",
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

    const PackageInfo = ({ data, theme }) => (
        <Layout
            style={[
                styles.headerContainer,
                { borderColor: theme["color-primary-200"] },
            ]}
        >
            <Layout style={styles.row}>
                <Icon
                    name={
                        data?.name === "Basic"
                            ? "wifi-strength-1"
                            : data?.name === "Standard"
                            ? "wifi-strength-2"
                            : data?.name === "Premium"
                            ? "wifi-strength-3"
                            : data?.name === "Ultimate"
                            ? "wifi-star"
                            : "earth"
                    }
                    size={50}
                    color={theme["color-primary-400"]}
                />
                <Text category="h4" status="primary">
                    Paket Layanan {data?.name}
                </Text>
            </Layout>
            <Layout style={styles.description}>
                <Text category="h6" status="primary">
                    Deskripsi:
                </Text>
                <Text category="s1">{data?.description}</Text>
            </Layout>
            <Text category="h4" status="primary">
                {formatRupiah(data?.price ?? 0)}/bulan
            </Text>
            <Button
                status="primary"
                size="medium"
                onPress={() => {
                    navigation.navigate("Packages", {
                        screen: "UpdatePackage",
                        params: { id },
                    });
                }}
            >
                <Text category="h6">
                    <Icon name="circle-edit-outline" size={20} color="#fff" />{" "}
                    Edit Paket
                </Text>
            </Button>
        </Layout>
    );

    const OrderHistory = ({ data, onRefresh, theme }) => (
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
                        Pelanggan Terdaftar
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
                    onPress={() =>
                        navigation.navigate("Orders", {
                            screen: "OrderDetails",
                            params: { id: item.id },
                        })
                    }
                >
                    <Layout style={styles.cardContent}>
                        <Layout style={styles.cardHeader}>
                            <Text category="h4" status="primary">
                                {item?.customer_name}
                            </Text>
                            <Badge data="Lunas" status="success" />
                        </Layout>
                        <Layout style={styles.row}>
                            <Text style={styles.label}>
                                Tanggal Pendaftaran
                            </Text>
                            <Text style={styles.value}>
                                : {formatDate(item?.register_at)}
                            </Text>
                        </Layout>
                        <Layout style={styles.row}>
                            <Text style={styles.label}>Berakhir</Text>
                            <Text style={styles.value}>
                                : {formatDate(item?.subscription_end)}
                            </Text>
                        </Layout>
                    </Layout>
                </Card>
            )}
            ListEmptyComponent={() => (
                <Layout style={styles.noData}>
                    <Text category="s1" style={{ textAlign: "center" }}>
                        Tidak ada data langganan
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
                <PackageInfo data={packageData} theme={theme} />
                <OrderHistory
                    data={packageData?.orders}
                    onRefresh={onRefresh}
                    theme={theme}
                />
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
                            <Text category="h5">Hapus Paket</Text>
                        </Layout>

                        <Layout style={styles.modalBody}>
                            <Text category="p1">
                                Apakah anda yakin akan menghapus paket{" "}
                                {packageData.name ?? "ini"}?{`\n`}
                                Semua data yang berkaitan dengan paket ini akan
                                terhapus.
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

export default PackageDetailsScreen;
