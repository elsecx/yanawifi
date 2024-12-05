import React, { useState, useLayoutEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getCurrentDate } from "../../libs/utils";
import { TouchableOpacity, ImageBackground } from "react-native";
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
import styles from "./styles";

const MenuScreen = ({ navigation }) => {
    const theme = useTheme();
    const [menuVisible, setMenuVisible] = useState(false);
    const { logout } = useContext(AuthContext);

    const menuData = [
        {
            id: 1,
            title: "Registrasi Pelanggan",
            desc: "Daftarkan pelanggan baru ke salah satu paket layanan internet.",
            icon: "access-point-plus",
            route: "Orders",
            screen: "CreateOrder",
        },
        {
            id: 2,
            title: "Paket Internet",
            desc: "Kelola paket layanan internet yang tersedia, atau buat paket layanan baru.",
            icon: "package-variant",
            route: "Packages",
            screen: "PackagesList",
        },
        {
            id: 3,
            title: "Data Pelanggan",
            desc: "Lihat dan kelola data pelanggan yang terdaftar, atau daftarkan pelanggan baru.",
            icon: "account-details-outline",
            route: "Customers",
            screen: "CustomersList",
        },
        {
            id: 4,
            title: "Pembayaran Tagihan",
            desc: "Lakukan pembayaran tagihan pelanggan yang telah terdaftar.",
            icon: "cash-register",
            route: "Orders",
            screen: "PayOrders",
        },
    ];

    const handleMenuSelect = async (selectedIndex) => {
        switch (selectedIndex) {
            case 0:
                navigation.navigate("AboutScreen");
                break;
            case 1:
                navigation.navigate("HelpScreen");
                break;
            case 2:
                await logout();
                break;
            default:
                console.log("Pilihan tidak dikenal");
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
                            keyExtractor={(index) => index.toString()}
                            onSelect={(index) => handleMenuSelect(index.row)}
                            onBackdropPress={() => setMenuVisible(false)}
                        >
                            <MenuItem
                                title="Tentang"
                                accessoryLeft={() => (
                                    <Icon name="information" size={20} />
                                )}
                            />
                            <MenuItem
                                title="Bantuan"
                                accessoryLeft={() => (
                                    <Icon name="help" size={20} />
                                )}
                            />
                            <MenuItem
                                title="Keluar"
                                accessoryLeft={() => (
                                    <Icon name="logout" size={20} />
                                )}
                                style={{
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
        <Layout style={styles.container}>
            <Layout style={styles.header}>
                <Text category="h4">Menu Utama</Text>
            </Layout>

            <List
                data={menuData}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => (
                    <ListItem
                        title={() => <Text category="h6">{item.title}</Text>}
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
    );
};

export default MenuScreen;
