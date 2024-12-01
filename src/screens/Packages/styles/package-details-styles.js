import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    headerNavigation: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 0.1,
    },

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

    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    contentContainer: {
        flex: 1,
        gap: 10,
    },

    headerContainer: {
        margin: 10,
        padding: 10,
        gap: 10,
        borderRadius: 10,
        borderWidth: 1,
    },

    listHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        borderWidth: StyleSheet.hairlineWidth,
    },

    card: {
        marginHorizontal: 10,
    },

    cardContent: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 5,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 0.01,
    },

    label: {
        fontSize: 16,
        fontWeight: "bold",
        width: "50%",
    },

    value: {
        flex: 1,
        fontSize: 16,
    },
});

export default styles;
