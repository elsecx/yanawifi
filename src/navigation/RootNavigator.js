import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

// Import Screens
import LoginScreen from "../screens/Auth/LoginScreen";

// Import Navigators
import MainNavigator from "./MainNavigator";
import PackagesNavigator from "./PackagesNavigator";
import CustomersNavigator from "./CustomersNavigator";
import OrdersNavigator from "./OrdersNavigator";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { isAuthenticated } = useContext(AuthContext);

    // Menampilkan layar loading jika status autentikasi belum diketahui
    if (isAuthenticated === null) {
        return (
            <NavigationContainer>
                <Stack.Screen
                    name="Loading"
                    component={() => null} // Ganti dengan komponen loading jika diperlukan
                    options={{ headerShown: false }}
                />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={MainNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Packages"
                            component={PackagesNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Customers"
                            component={CustomersNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Orders"
                            component={OrdersNavigator}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
