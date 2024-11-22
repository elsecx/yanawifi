import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import styles from "./styles/unpaid-orders-styles";

const UnpaidOrdersScreen = () => {
    return (
        <Layout style={styles.container}>
            <Text category="h1">Unpaid Orders Screen</Text>
        </Layout>
    );
};

export default UnpaidOrdersScreen;
