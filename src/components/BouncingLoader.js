import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTheme } from "@ui-kitten/components";

const sizePresets = {
    tiny: 8,
    small: 12,
    medium: 15,
    large: 20,
    giant: 30,
};

const BouncingLoader = ({ size = "medium" }) => {
    const theme = useTheme();

    const colors = [
        theme["color-primary-500"],
        theme["color-danger-500"],
        theme["color-warning-500"],
    ];

    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    const dotSize =
        typeof size === "string"
            ? sizePresets[size] || sizePresets.medium
            : size;

    const bounce = (dot, delay) => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(dot, {
                    toValue: -dotSize / 2,
                    duration: 400,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(dot, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        bounce(dot1, 0);
        bounce(dot2, 200);
        bounce(dot3, 400);
    }, [dot1, dot2, dot3]);

    return (
        <View style={styles.container}>
            {colors.map((color, index) => {
                const dotAnimation =
                    index === 0 ? dot1 : index === 1 ? dot2 : dot3;
                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: color,
                                width: dotSize,
                                height: dotSize,
                                borderRadius: dotSize / 2,
                                transform: [{ translateY: dotAnimation }],
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 100,
    },
    dot: {
        marginHorizontal: 5,
    },
});

export default BouncingLoader;
