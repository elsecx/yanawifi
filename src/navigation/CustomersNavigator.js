import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { headerOptions } from "../libs/config";

// Import Screens
import CustomersListScreen from "../screens/Customers/CustomersListScreen";
import CustomerDetailsScreen from "../screens/Customers/CustomerDetailsScreen";
import AddCustomerScreen from "../screens/Customers/AddCustomerScreen";
import UpdateCustomerScreen from "../screens/Customers/UpdateCustomerScreen";

const Stack = createNativeStackNavigator();

const PackagesNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="CustomersList">
            <Stack.Screen
                name="CustomersList"
                component={CustomersListScreen}
                options={{
                    ...headerOptions,
                    title: "Data Pelanggan",
                }}
            />

            <Stack.Screen
                name="CustomerDetails"
                component={CustomerDetailsScreen}
                options={{
                    ...headerOptions,
                    title: "Detail Pelanggan",
                }}
            />

            <Stack.Screen
                name="AddCustomer"
                component={AddCustomerScreen}
                options={{
                    ...headerOptions,
                    title: "Tambah Pelanggan",
                }}
            />

            <Stack.Screen
                name="UpdateCustomer"
                component={UpdateCustomerScreen}
                options={{
                    ...headerOptions,
                    title: "Edit Pelanggan",
                }}
            />
        </Stack.Navigator>
    );
};

export default PackagesNavigator;
