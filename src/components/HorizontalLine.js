import React from "react";
import { useTheme } from "@ui-kitten/components";
import { View, Text, StyleSheet } from "react-native";

const HorizontalLine = ({ txt }) => {
    const theme = useTheme();
    return (
        <View style={styles.horizontalLine}>
            <View
                style={[
                    styles.line,
                    { backgroundColor: theme["color-primary-200"] },
                ]}
            />
            <Text style={[styles.txt, { color: theme["color-basic-700"] }]}>
                {txt}
            </Text>
            <View
                style={[
                    styles.line,
                    { backgroundColor: theme["color-primary-200"] },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    horizontalLine: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        marginHorizontal: 10,
        gap: 10,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },

    txt: {
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 20,
    },
});

export default HorizontalLine;
