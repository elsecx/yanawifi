import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import styles from "./styles/orders-list-styles";

const OrdersListScreen = () => {
    return (
        <Layout style={styles.container}>
            <Text category="h1">Orders List Screen</Text>
        </Layout>
    );
};

export default OrdersListScreen;
