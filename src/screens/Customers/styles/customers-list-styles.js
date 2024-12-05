import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        height: height,
        width: width,
        justifyContent: "center",
        alignItems: "center",
    },

    row: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    noData: {
        alignItems: "center",
        justifyContent: "center",
    },

    label: {
        fontSize: 16,
        fontWeight: "bold",
    },

    value: {
        flex: 1,
        fontSize: 16,
    },

    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    contentContainer: {
        flexGrow: 1,
        gap: 10,
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },

    searchInput: {
        flex: 1,
        borderRadius: 50,
    },

    cardContent: {
        margin: -10,
        flexDirection: "column",
    },

    cardRow: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 0.00001,
    },

    cardFooter: {
        padding: 10,
    },

    floatingButton: {
        margin: 10,
    },
});

export default styles;
