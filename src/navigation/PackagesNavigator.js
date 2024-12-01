import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { headerOptions } from "../libs/config";

// Import Screens
import PackagesListScreen from "../screens/Packages/PackagesListScreen";
import PackageDetailsScreen from "../screens/Packages/PackageDetailsScreen";
import AddPackageScreen from "../screens/Packages/AddPackageScreen";
import UpdatePackageScreen from "../screens/Packages/UpdatePackageScreen";

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
                name="PackageDetails"
                component={PackageDetailsScreen}
                options={{
                    ...headerOptions,
                    title: "Detail Paket Layanan",
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

            <Stack.Screen
                name="UpdatePackage"
                component={UpdatePackageScreen}
                options={{
                    ...headerOptions,
                    title: "Ubah Paket Layanan",
                }}
            />
        </Stack.Navigator>
    );
};

export default PackagesNavigator;
