import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { headerOptions } from "../libs/config";

import {
    CustomersListScreen,
    CustomerDetailsScreen,
    AddCustomerScreen,
    UpdateCustomerScreen,
} from "../screens";

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
