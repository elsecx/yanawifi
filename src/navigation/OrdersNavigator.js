import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { headerOptions } from "../libs/config";

import {
    OrdersListScreen,
    OrderDetailsScreen,
    CreateOrderScreen,
    UnpaidOrdersScreen,
    PayOrdersScreen,
} from "../screens";

const Stack = createNativeStackNavigator();

const PackagesNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="OrdersList">
            <Stack.Screen
                name="OrdersList"
                component={OrdersListScreen}
                options={{
                    ...headerOptions,
                    title: "Data Pesanan",
                }}
            />

            <Stack.Screen
                name="OrderDetails"
                component={OrderDetailsScreen}
                options={{
                    ...headerOptions,
                    title: "Detail Pesanan",
                }}
            />

            <Stack.Screen
                name="CreateOrder"
                component={CreateOrderScreen}
                options={{
                    ...headerOptions,
                    title: "Registrasi Pelanggan",
                }}
            />

            <Stack.Screen
                name="UnpaidOrders"
                component={UnpaidOrdersScreen}
                options={{
                    ...headerOptions,
                    title: "Koneksi Suspended",
                }}
            />

            <Stack.Screen
                name="PayOrders"
                component={PayOrdersScreen}
                options={{
                    ...headerOptions,
                    title: "Pembayaran Tagihan",
                }}
            />
        </Stack.Navigator>
    );
};

export default PackagesNavigator;
