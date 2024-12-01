import { StyleSheet, StatusBar, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    headerNavigation: {
        paddingTop: StatusBar.currentHeight + 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
        gap: 10,
    },

    headerNavigationContent: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerNavigationTitle: {
        backgroundColor: "transparent",
    },

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

    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    contentContainer: {
        flex: 1,
        gap: 10,
    },

    searchInput: {
        flex: 1,
        marginTop: 10,
        borderRadius: 50,
    },

    card: {
        marginHorizontal: 10,
        borderColor: "#EDEDED",
        borderTopWidth: StyleSheet.hairlineWidth,
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
        backgroundColor: "transparent",
        padding: 10,
        borderColor: "#EDEDED",
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});

export default styles;
