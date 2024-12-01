import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text, useTheme } from "@ui-kitten/components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Alert = ({ message, type = "danger", onClose = null, style = {} }) => {
    const theme = useTheme();

    const colorScheme = {
        danger: {
            backgroundColor: theme["color-danger-100"],
            borderColor: theme["color-danger-200"],
            iconColor: theme["color-danger-700"],
            textColor: theme["color-danger-700"],
        },
        success: {
            backgroundColor: theme["color-success-100"],
            borderColor: theme["color-success-200"],
            iconColor: theme["color-success-700"],
            textColor: theme["color-success-700"],
        },
        warning: {
            backgroundColor: theme["color-warning-100"],
            borderColor: theme["color-warning-200"],
            iconColor: theme["color-warning-700"],
            textColor: theme["color-warning-700"],
        },
        info: {
            backgroundColor: theme["color-info-100"],
            borderColor: theme["color-info-200"],
            iconColor: theme["color-info-700"],
            textColor: theme["color-info-700"],
        },
    }[type];

    if (!message) {
        return null;
    }

    return (
        <Layout
            style={[
                styles.alertContainer,
                style,
                {
                    backgroundColor: colorScheme.backgroundColor,
                    borderColor: colorScheme.borderColor,
                },
            ]}
        >
            <Layout style={[styles.row]}>
                <Icon
                    name="alert-circle-outline"
                    style={[
                        styles.alertIcon,
                        {
                            color: colorScheme.iconColor,
                        },
                    ]}
                    size={20}
                />
                <Text category="s1">{message}</Text>
            </Layout>
            {onClose && (
                <Icon
                    name="window-close"
                    style={{
                        color: colorScheme.iconColor,
                    }}
                    size={20}
                    onPress={onClose}
                />
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    alertContainer: {
        flexDirection: "row",
        alignSelf: "center",
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
    },

    row: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
});

export default Alert;
