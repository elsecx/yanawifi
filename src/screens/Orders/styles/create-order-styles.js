import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    headerContainer: {
        padding: 10,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    select: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginBottom: 10,
    },

    label: {
        fontWeight: "bold",
        marginBottom: 5,
    },

    button: {
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        width: "95%",
    },
});

export default styles;
