import React, { useState, useLayoutEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { getCurrentDate } from "../../libs/utils";
import {
    useTheme,
    Layout,
    Text,
    OverflowMenu,
    MenuItem,
    List,
    ListItem,
} from "@ui-kitten/components";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { ImageBackground } from "react-native";
import styles from "./styles";

const MenuScreen = ({ navigation }) => {
    const theme = useTheme();
    const [menuVisible, setMenuVisible] = useState(false);

    const menuData = [
        {
            title: "Registrasi Pelanggan",
            desc: "Daftarkan pelanggan baru ke salah satu paket layanan internet.",
            icon: "access-point-plus",
            route: "Orders",
            screen: "AddOrder",
        },
        {
            title: "Paket Internet",
            desc: "Kelola paket layanan internet yang tersedia.",
            icon: "package-variant",
            route: "Packages",
            screen: "PackagesList",
        },
        {
            title: "Data Pelanggan",
            desc: "Lihat dan kelola data pelanggan yang terdaftar.",
            icon: "account-details-outline",
            route: "Customers",
            screen: "CustomersList",
        },
        {
            title: "Pembayaran Tagihan",
            desc: "Proses pembayaran tagihan pelanggan.",
            icon: "cash-register",
            route: "Orders",
            screen: "PayOrders",
        },
        {
            title: "Koneksi Suspended",
            desc: "Monitor pelanggan dengan tagihan yang belum dibayar.",
            icon: "access-point-off",
            route: "Orders",
            screen: "UnpaidOrders",
        },
    ];

    const handleMenuSelect = (index) => {
        setMenuVisible(false);
        switch (index) {
            case 0:
                console.log("oke");
                break;
            case 1:
                console.log("oke");
                break;
            default:
                break;
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <ImageBackground
                    source={require("../../../assets/img/bg.jpeg")}
                    style={styles.headerNavigation}
                >
                    <Layout style={styles.headerNavigationContent}>
                        <Layout style={styles.headerNavigationTitle}>
                            <Text
                                category="h4"
                                status="control"
                                style={{ lineHeight: 28 }}
                            >
                                YanaWifi Manager
                            </Text>
                            <Text
                                category="s1"
                                status="control"
                                style={{ lineHeight: 16 }}
                            >
                                {getCurrentDate()}
                            </Text>
                        </Layout>
                        <OverflowMenu
                            anchor={() => (
                                <TouchableOpacity
                                    onPress={() => setMenuVisible(true)}
                                >
                                    <Icon
                                        name="dots-vertical"
                                        size={24}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            )}
                            visible={menuVisible}
                            onSelect={(index) => handleMenuSelect(index.row)}
                            onBackdropPress={() => setMenuVisible(false)}
                        >
                            <MenuItem
                                title="Bantuan"
                                accessoryLeft={() => (
                                    <Icon name="help" size={20} />
                                )}
                            />
                            <MenuItem
                                title="Keluar"
                                accessoryLeft={() => (
                                    <Icon
                                        name="logout"
                                        size={20}
                                        color={theme["color-danger-700"]}
                                    />
                                )}
                                style={{
                                    color: theme["color-danger-700"],
                                    backgroundColor: theme["color-danger-200"],
                                }}
                            />
                        </OverflowMenu>
                    </Layout>
                </ImageBackground>
            ),
        });
    }, [theme, navigation, menuVisible]);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
        >
            <Layout style={styles.header}>
                <Text category="h4">Menu Utama</Text>
            </Layout>

            <Layout style={styles.content}>
                <List
                    data={menuData}
                    renderItem={({ item, index }) => (
                        <ListItem
                            key={index}
                            title={() => (
                                <Text category="h6">{item.title}</Text>
                            )}
                            description={() => (
                                <Text appearance="hint">{item.desc}</Text>
                            )}
                            accessoryLeft={() => (
                                <Icon
                                    name={item.icon}
                                    size={35}
                                    color={theme["color-primary-400"]}
                                />
                            )}
                            onPress={() =>
                                navigation.navigate(item.route, {
                                    screen: item.screen,
                                })
                            }
                            style={styles.menuItem}
                        />
                    )}
                    style={styles.menuContainer}
                />
            </Layout>
        </ScrollView>
    );
};

export default MenuScreen;
