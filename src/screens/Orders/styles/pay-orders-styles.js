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
        width: "100%",
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        margin: -11,
    },

    cardTitle: {
        backgroundColor: "transparent",
        gap: 3,
    },

    cardFooter: {
        backgroundColor: "transparent",
        flexDirection: "column",
        justifyContent: "space-between",
    },

    cardPrice: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        paddingVertical: 10,
        paddingHorizontal: 9.999,
        borderColor: "#EDEDED",
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});

export default styles;
