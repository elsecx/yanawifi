import React, { useState, useEffect, useLayoutEffect } from "react";
import {
    fetchInfo,
    fetchPackages,
    fetchPaymentHistory,
    updatePackage,
    deletePackage,
} from "../../services/api";
import {
    cleanData,
    formatDate,
    formatRupiah,
    getCurrentDate,
} from "../../libs/utils";

import {
    StatusBar,
    RefreshControl,
    ScrollView,
    View,
    TouchableOpacity,
    Keyboard,
} from "react-native";
import {
    useTheme,
    Layout,
    Text,
    Card,
    ViewPager,
    Modal,
    Button,
    Input,
} from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { ImageBackground } from "react-native";
import BouncingLoader from "../../components/BouncingLoader";
import HorizontalLine from "../../components/HorizontalLine";
import Alert from "../../components/Alert";
import Badge from "../../components/Badge";
import styles from "./styles";

const HomeScreen = ({ navigation }) => {
    const theme = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [infoData, setInfoData] = useState({});
    const [packagesData, setPackagesData] = useState([]);
    const [paymentHistoryData, setPaymentHistoryData] = useState([]);

    const [packageAlert, setPackageAlert] = useState({
        alertVisible: false,
        alertType: "success",
        alertMessage: "",
        alertLoading: false,
    });

    const [updatePackageData, setUpdatePackageData] = useState({
        name: null,
        description: null,
        price: null,
    });

    const [modalPackage, setModalPackage] = useState({
        visible: false,
        data: {},
        isModalUpdate: false,
        isModalDelete: false,
    });

    const navItems = [
        {
            label: "Tambah Paket",
            route: "Packages",
            screen: "AddPackage",
            icon: "earth-plus",
        },
        {
            label: "Pendaftaran",
            route: "AddCustomer",
            icon: "access-point-plus",
        },
        {
            label: "Pembayaran",
            route: "Orders",
            screen: "PayOrders",
            icon: "cash-register",
        },
        {
            label: "Lainnya",
            route: "Main",
            screen: "Menu",
            icon: "view-grid-outline",
        },
    ];

    const getInfoData = async () => {
        try {
            const response = await fetchInfo();
            setInfoData(response);
        } catch (error) {
            console.log("Error fetching info:", error);
        }
    };

    const getPackagesData = async () => {
        try {
            const response = await fetchPackages();
            setPackagesData(response);
        } catch (error) {
            console.log("Error fetching packages:", error);
        }
    };

    const getPaymentHistoryData = async () => {
        try {
            const response = await fetchPaymentHistory();
            setPaymentHistoryData(response);
        } catch (error) {
            console.log("Error fetching payment history:", error);
        }
    };

    const handleNavigation = (item) => {
        navigation.navigate(item.route, {
            screen: item.screen,
        });
    };

    const handleUpdatePackage = async (id, data) => {
        setPackageAlert({
            ...packageAlert,
            alertLoading: true,
        });

        try {
            const response = await updatePackage(id, data);

            if (response.status === "success") {
                setPackageAlert({
                    alertVisible: true,
                    alertType: "success",
                    alertMessage: "Paket berhasil diperbarui",
                    alertLoading: false,
                });

                setTimeout(() => {
                    setPackageAlert({
                        alertVisible: false,
                        alertType: "success",
                        alertMessage: "",
                        alertLoading: false,
                    });

                    setUpdatePackageData({
                        name: null,
                        description: null,
                        price: null,
                    });

                    setModalPackage({
                        ...modalPackage,
                        visible: false,
                        isModalUpdate: false,
                    });

                    onRefresh();
                }, 2000);
            } else {
                console.log("Error updating package:", response.message);
                setPackageAlert({
                    alertVisible: true,
                    alertType: "danger",
                    alertMessage: "Gagal memperbarui paket",
                    alertLoading: false,
                });
            }
        } catch (error) {
            console.log("Error updating package:", error);
            setPackageAlert({
                alertVisible: true,
                alertType: "danger",
                alertMessage: "Gagal memperbarui paket",
                alertLoading: false,
            });
        }
    };

    const handleDeletePackage = async (id) => {
        setPackageAlert({
            ...packageAlert,
            alertLoading: true,
        });

        try {
            const response = await deletePackage(id);

            if (response.status === "success") {
                setPackageAlert({
                    ...packageAlert,
                    alertLoading: false,
                });

                setModalPackage({
                    visible: false,
                    data: {},
                    isModalUpdate: false,
                    isModalDelete: false,
                });

                onRefresh();
            } else {
                console.log("Error deleting package:", response.message);
                setPackageAlert({
                    alertVisible: true,
                    alertType: "danger",
                    alertMessage: "Gagal menghapus paket",
                    alertLoading: false,
                });
            }
        } catch (error) {
            console.log("Error deleting package:", error);
            setPackageAlert({
                alertVisible: true,
                alertType: "danger",
                alertMessage: "Gagal menghapus paket",
                alertLoading: false,
            });
        }
    };

    const onRefresh = async () => {
        setLoading(true);
        setRefreshing(true);
        await getInfoData();
        await getPackagesData();
        await getPaymentHistoryData();
        setRefreshing(false);
        setLoading(false);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await getInfoData();
            await getPackagesData();
            await getPaymentHistoryData();
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (packagesData?.length > 0) {
            const interval = setInterval(() => {
                setSelectedIndex(
                    (prevIndex) => (prevIndex + 1) % packagesData?.length
                );
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [packagesData]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            "keyboardDidShow",
            (event) => {
                setKeyboardOffset(event.endCoordinates.height);
            }
        );

        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardOffset(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => {
                return loading ? (
                    <Layout style={styles.loadingContainer}>
                        <BouncingLoader size="large" />
                    </Layout>
                ) : (
                    <ImageBackground
                        source={require("../../../assets/img/bg.jpeg")}
                        style={styles.headerNavigation}
                    >
                        <Layout style={styles.row}>
                            <Text category="h4" status="control">
                                YanaWifi Manager
                            </Text>
                            <Text category="h6" status="control">
                                {getCurrentDate()}
                            </Text>
                        </Layout>
                        <LinearGradient
                            colors={[
                                theme["color-primary-400"],
                                theme["color-primary-100"],
                            ]}
                            start={[1, 0]}
                            end={[0, 1]}
                            style={styles.cardHeaderNavigation}
                        >
                            <View>
                                <Icon
                                    name={"lan-connect"}
                                    size={35}
                                    color={theme["color-primary-800"]}
                                />
                                <Text
                                    category="h6"
                                    style={{
                                        ...styles.cardText,
                                        color: theme["color-primary-800"],
                                    }}
                                >
                                    Total Pelanggan
                                </Text>
                            </View>
                            <Text
                                category="h4"
                                style={{
                                    ...styles.cardText,
                                    color: theme["color-primary-800"],
                                }}
                            >
                                {infoData.customers ?? 0} Orang
                            </Text>
                        </LinearGradient>
                    </ImageBackground>
                );
            },
        });
    }, [loading, infoData, theme, navigation]);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[theme["color-primary-600"]]}
                    tintColor={theme["color-primary-600"]}
                />
            }
            showsVerticalScrollIndicator={false}
            style={styles.container}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            {loading ? (
                <Layout style={styles.loadingContainer}>
                    <BouncingLoader size="large" />
                </Layout>
            ) : (
                <>
                    <Layout style={styles.headerContainer}>
                        <Text
                            category="h4"
                            style={{ color: theme["color-primary-800"] }}
                        >
                            Status
                        </Text>
                        <Layout style={styles.row}>
                            <LinearGradient
                                colors={[
                                    theme["color-success-200"],
                                    theme["color-success-500"],
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.cardHeader}
                            >
                                <Text
                                    category="h6"
                                    style={{
                                        ...styles.cardHeaderText,
                                        color: theme["color-success-800"],
                                    }}
                                >
                                    Terhubung
                                </Text>
                                <Text
                                    category="h4"
                                    style={{
                                        ...styles.cardHeaderText,
                                        color: theme["color-success-800"],
                                    }}
                                >
                                    {infoData.connected_orders ?? 0}
                                </Text>
                            </LinearGradient>
                            <LinearGradient
                                colors={[
                                    theme["color-danger-100"],
                                    theme["color-danger-400"],
                                ]}
                                start={[0, 0]}
                                end={[0, 1]}
                                style={styles.cardHeader}
                            >
                                <Text
                                    category="h6"
                                    style={{
                                        ...styles.cardHeaderText,
                                        color: theme["color-danger-800"],
                                    }}
                                >
                                    Terputus
                                </Text>
                                <Text
                                    category="h4"
                                    style={{
                                        ...styles.cardHeaderText,
                                        color: theme["color-danger-800"],
                                    }}
                                >
                                    {infoData.disconnected_orders ?? 0}
                                </Text>
                            </LinearGradient>
                        </Layout>
                    </Layout>

                    <Layout
                        style={{
                            ...styles.bodyContainer,
                            borderColor: theme["color-primary-200"],
                        }}
                    >
                        <Layout style={styles.flashNavigationContainer}>
                            {navItems.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.flashNavigation}
                                        activeOpacity={0.8}
                                        onPress={() => handleNavigation(item)}
                                    >
                                        <Layout
                                            level="3"
                                            style={{
                                                ...styles.flashIcon,
                                                backgroundColor:
                                                    theme["color-primary-300"],
                                            }}
                                        >
                                            <Icon
                                                name={item.icon}
                                                size={30}
                                                color={
                                                    theme["color-primary-800"]
                                                }
                                            />
                                        </Layout>
                                        <Text
                                            category="s1"
                                            style={styles.flashText}
                                            appearance="hint"
                                            numberOfLines={2}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </Layout>
                    </Layout>

                    <ViewPager
                        selectedIndex={selectedIndex}
                        onSelect={(index) => setSelectedIndex(index)}
                    >
                        {packagesData.length > 0
                            ? packagesData.map((item) => (
                                  <TouchableOpacity
                                      key={item.id}
                                      onPress={() =>
                                          setModalPackage({
                                              visible: true,
                                              data: item,
                                              isModalUpdate: false,
                                              isModalDelete: false,
                                          })
                                      }
                                      activeOpacity={0.9}
                                  >
                                      <LinearGradient
                                          colors={[
                                              theme["color-primary-800"],
                                              theme["color-primary-600"],
                                          ]}
                                          start={{ x: 0, y: 0 }}
                                          end={{ x: 0, y: 1 }}
                                          style={styles.pagerCard}
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
                                              size={30}
                                              color={theme["color-primary-300"]}
                                          />
                                          <Text category="h5" status="control">
                                              {item.name}
                                          </Text>
                                          <Text
                                              category="h3"
                                              status="success"
                                              style={{ lineHeight: 35 }}
                                          >
                                              {formatRupiah(item.price ?? 0)}
                                          </Text>
                                      </LinearGradient>
                                  </TouchableOpacity>
                              ))
                            : null}
                    </ViewPager>

                    <HorizontalLine txt="Riwayat Pelunasan" />

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[theme["color-primary-600"]]}
                                tintColor={theme["color-primary-600"]}
                            />
                        }
                        style={styles.paymentHistoryContainer}
                    >
                        {paymentHistoryData.length > 0 ? (
                            paymentHistoryData.map((item) => (
                                <Card
                                    key={item.id}
                                    style={styles.cardHistory}
                                    appearance="outline"
                                    disabled
                                    footer={() => (
                                        <Layout
                                            style={styles.cardFooterHistory}
                                        >
                                            <Text category="s1">
                                                {formatDate(item.last_paid_at)}
                                            </Text>
                                            <Text
                                                category="h4"
                                                status="primary"
                                            >
                                                {formatRupiah(item.price)}
                                            </Text>
                                        </Layout>
                                    )}
                                >
                                    <Layout style={styles.cardContentHistory}>
                                        <Layout
                                            style={
                                                styles.cardContentLeftHistory
                                            }
                                        >
                                            <Text
                                                category="h4"
                                                status="primary"
                                            >
                                                {item.package}
                                            </Text>
                                            <Text category="h6">
                                                {item.customer_name}
                                            </Text>
                                        </Layout>
                                        <Badge
                                            data={item.status}
                                            status={
                                                item.status === "PAID"
                                                    ? "success"
                                                    : "danger"
                                            }
                                        />
                                    </Layout>
                                </Card>
                            ))
                        ) : (
                            <Layout style={styles.noData}>
                                <Text
                                    category="s1"
                                    style={{ textAlign: "center" }}
                                >
                                    Belum ada pelunasan untuk bulan ini
                                </Text>
                            </Layout>
                        )}
                    </ScrollView>
                </>
            )}

            <Modal
                animationType="slide"
                visible={modalPackage.visible}
                backdropStyle={styles.modalBackdrop}
                onBackdropPress={() =>
                    setModalPackage({
                        visible: false,
                        data: {},
                        isModalUpdate: false,
                        isModalDelete: false,
                    })
                }
            >
                <Card
                    style={{
                        ...styles.packageModal,
                        marginBottom: keyboardOffset,
                    }}
                    disabled
                >
                    <Layout style={styles.packageModalContent}>
                        <Layout style={styles.modalHeader}>
                            <Text category="h5">
                                {modalPackage.isModalUpdate
                                    ? "Edit"
                                    : modalPackage.isModalDelete
                                    ? "Hapus"
                                    : "Detail"}{" "}
                                Paket
                            </Text>
                        </Layout>

                        <Layout style={styles.modalBody}>
                            {modalPackage.isModalUpdate ? (
                                <>
                                    <Alert
                                        message={packageAlert.alertMessage}
                                        type={packageAlert.alertType}
                                    />
                                    <Input
                                        label="Nama Paket"
                                        placeholder={
                                            modalPackage.data.name ??
                                            "Masukkan nama paket"
                                        }
                                        value={updatePackageData.name}
                                        onChangeText={(text) =>
                                            setUpdatePackageData({
                                                ...updatePackageData,
                                                name: text,
                                            })
                                        }
                                        style={{ marginBottom: 10 }}
                                    />
                                    <Input
                                        label="Deskripsi"
                                        multiline={true}
                                        placeholder={
                                            modalPackage.data.description ??
                                            "Masukkan deskripsi paket"
                                        }
                                        value={updatePackageData.description}
                                        onChangeText={(text) =>
                                            setUpdatePackageData({
                                                ...updatePackageData,
                                                description: text,
                                            })
                                        }
                                        style={{
                                            textAlignVertical: "top",
                                            justifyContent: "start",
                                            marginBottom: 10,
                                        }}
                                    />
                                    <Input
                                        label="Harga"
                                        keyboardType="numeric"
                                        placeholder={`${
                                            modalPackage.data.price ??
                                            "Masukkan harga untuk paket"
                                        }`}
                                        value={updatePackageData.price}
                                        accessoryLeft={() => (
                                            <Text category="s1">Rp</Text>
                                        )}
                                        onChangeText={(text) =>
                                            setUpdatePackageData({
                                                ...updatePackageData,
                                                price: text,
                                            })
                                        }
                                        style={{ marginBottom: 10 }}
                                    />
                                </>
                            ) : modalPackage.isModalDelete ? (
                                <Text category="h6">
                                    Apakah anda yakin akan menghapus paket{" "}
                                    {modalPackage.data.name ?? "ini"}?
                                </Text>
                            ) : (
                                <>
                                    <Text category="h4">
                                        Paket{" "}
                                        {modalPackage.data.name ?? "Nama Paket"}
                                    </Text>
                                    <Text category="s1">
                                        {modalPackage.data.description ??
                                            "Deskripsi Paket"}
                                    </Text>
                                    <Text category="h6">
                                        Harga:{" "}
                                        {formatRupiah(
                                            modalPackage.data.price ?? 0
                                        )}
                                    </Text>
                                </>
                            )}
                        </Layout>

                        <Layout style={styles.modalFooter}>
                            {modalPackage.isModalUpdate ? (
                                <Layout style={styles.row}>
                                    <Button
                                        appearance="outline"
                                        status="basic"
                                        style={{ flex: 1 }}
                                        onPress={() => {
                                            setModalPackage({
                                                ...modalPackage,
                                                isModalUpdate: false,
                                            });

                                            setUpdatePackageData({
                                                name: "",
                                                description: "",
                                                price: "",
                                            });

                                            setPackageAlert({
                                                ...packageAlert,
                                                alertLoading: false,
                                                alertMessage: "",
                                                alertType: "info",
                                            });
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        status="primary"
                                        style={{ flex: 1 }}
                                        onPress={() =>
                                            handleUpdatePackage(
                                                modalPackage.data.id,
                                                cleanData(updatePackageData)
                                            )
                                        }
                                        disabled={
                                            (!updatePackageData.name &&
                                                !updatePackageData.description &&
                                                !updatePackageData.price) ||
                                            packageAlert.alertLoading
                                        }
                                    >
                                        {packageAlert.alertLoading
                                            ? "Loading..."
                                            : "Perbarui"}
                                    </Button>
                                </Layout>
                            ) : modalPackage.isModalDelete ? (
                                <Layout style={styles.row}>
                                    <Button
                                        appearance="outline"
                                        status="basic"
                                        style={{ flex: 1 }}
                                        onPress={() => {
                                            setModalPackage({
                                                ...modalPackage,
                                                isModalDelete: false,
                                            });
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        status="danger"
                                        style={{ flex: 1 }}
                                        onPress={() =>
                                            handleDeletePackage(
                                                modalPackage.data.id
                                            )
                                        }
                                    >
                                        {packageAlert.alertLoading
                                            ? "Loading..."
                                            : "Ya"}
                                    </Button>
                                </Layout>
                            ) : (
                                <>
                                    <Layout style={styles.row}>
                                        <Button
                                            status="primary"
                                            style={{ flex: 1 }}
                                            onPress={() => {
                                                setModalPackage({
                                                    ...modalPackage,
                                                    isModalUpdate: true,
                                                });
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            status="danger"
                                            style={{ flex: 1 }}
                                            onPress={() => {
                                                setModalPackage({
                                                    ...modalPackage,
                                                    isModalDelete: true,
                                                });
                                            }}
                                        >
                                            Hapus
                                        </Button>
                                    </Layout>
                                    <Button
                                        appearance="outline"
                                        status="basic"
                                        onPress={() =>
                                            setModalPackage({
                                                visible: false,
                                                data: {},
                                                isModalUpdate: false,
                                                isModalDelete: false,
                                            })
                                        }
                                    >
                                        Tutup
                                    </Button>
                                </>
                            )}
                        </Layout>
                    </Layout>
                </Card>
            </Modal>
        </ScrollView>
    );
};

export default HomeScreen;
