import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        fontSize: 50,
        fontWeight: "bold",
        lineHeight: 65,
        marginBottom: 50,
    },

    input: {
        backgroundColor: "#fff",
        alignSelf: "center",
        marginBottom: 20,
        width: width * 0.85,
    },

    label: {
        fontWeight: "bold",
        marginBottom: 5,
    },

    passwordIcon: {
        padding: 5,
    },

    button: {
        alignSelf: "center",
        width: width * 0.85,
    },

    errorMessage: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
    },
});

export default styles;
