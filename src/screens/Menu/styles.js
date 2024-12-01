import { StyleSheet, Dimensions, StatusBar } from "react-native";
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

    header: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "transparent",
    },

    menuContainer: {
        flex: 1,
        backgroundColor: "transparent",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#EDEDED",
    },

    menuItem: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#EDEDED",
        paddingVertical: 20,
        gap: 10,
    },
});

export default styles;
