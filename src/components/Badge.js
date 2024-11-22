import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

const Badge = ({ data, status, style }) => {
    const theme = useTheme();

    const colorScheme = {
        danger: {
            backgroundColor: theme["color-danger-100"],
            borderColor: theme["color-danger-700"],
            iconColor: theme["color-danger-700"],
            textColor: theme["color-danger-700"],
        },
        success: {
            backgroundColor: theme["color-success-100"],
            borderColor: theme["color-success-700"],
            iconColor: theme["color-success-700"],
            textColor: theme["color-success-700"],
        },
        warning: {
            backgroundColor: theme["color-warning-100"],
            borderColor: theme["color-warning-700"],
            iconColor: theme["color-warning-700"],
            textColor: theme["color-warning-700"],
        },
        info: {
            backgroundColor: theme["color-info-100"],
            borderColor: theme["color-info-700"],
            iconColor: theme["color-info-700"],
            textColor: theme["color-info-700"],
        },
    }[status];

    if (!data) {
        return null;
    }

    return (
        <View
            style={[
                styles.badge,
                style,
                {
                    backgroundColor: colorScheme.backgroundColor,
                    borderColor: colorScheme.borderColor,
                },
            ]}
        >
            <Text
                style={[
                    styles.badgeText,
                    {
                        color: colorScheme.textColor,
                    },
                ]}
                category="s1"
            >
                {data}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
    },

    badgeText: {
        fontSize: 12,
        textAlign: "center",
    },
});

export default Badge;
