import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/FontAwesome6";

// Screens
import { HomeScreen, CustomersListScreen, MenuScreen } from "../screens";

const Tab = createBottomTabNavigator();

const MainNavigator = () => (
    <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => (
            <View style={styles.tabBarContainer}>
                {props.state.routes.map((route, index) => {
                    const isFocused = props.state.index === index;
                    const onPress = () => {
                        const event = props.navigation.emit({
                            type: "tabPress",
                            target: route.key,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            props.navigation.navigate(route.name);
                        }
                    };

                    let iconName;
                    let label;

                    switch (route.name) {
                        case "Home":
                            iconName = "house";
                            label = "Beranda";
                            break;
                        case "Customers":
                            iconName = "network-wired";
                            label = "Berlangganan";
                            break;
                        case "Menu":
                            iconName = "bars";
                            label = "Menu";
                            break;
                        default:
                            iconName = "circle";
                            label = "Tab";
                            break;
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={styles.tab}
                        >
                            <View
                                style={[
                                    styles.iconContainer,
                                    isFocused && styles.iconContainerActive,
                                    isFocused &&
                                        route.name === "Dashboard" &&
                                        styles.dashboardTabActive,
                                ]}
                            >
                                <Icon
                                    name={iconName}
                                    size={20}
                                    color={isFocused ? "#fff" : "#0090FA"}
                                />
                                {isFocused && (
                                    <View style={styles.textContainer}>
                                        <Text
                                            style={[
                                                styles.label,
                                                { color: "#fff" },
                                            ]}
                                        >
                                            {label}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )}
    >
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: true }}
        />
        <Tab.Screen name="Customers" component={CustomersListScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderColor: "#EDEDED",
        borderTopWidth: 1,
        borderStartWidth: 2,
        borderEndWidth: 2,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },

    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },

    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        gap: 5,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },

    iconContainerActive: {
        backgroundColor: "#0090FA",
        paddingVertical: 13,
        borderRadius: 50,
    },
});

export default MainNavigator;
