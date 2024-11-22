import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { headerOptions } from "../libs/config";

import { PackagesListScreen, AddPackageScreen } from "../screens";

const Stack = createNativeStackNavigator();

const PackagesNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="PackagesList">
            <Stack.Screen
                name="PackagesList"
                component={PackagesListScreen}
                options={{
                    ...headerOptions,
                    title: "Paket Layanan Internet",
                }}
            />

            <Stack.Screen
                name="AddPackage"
                component={AddPackageScreen}
                options={{
                    ...headerOptions,
                    title: "Tambah Paket Layanan",
                }}
            />
        </Stack.Navigator>
    );
};

export default PackagesNavigator;
