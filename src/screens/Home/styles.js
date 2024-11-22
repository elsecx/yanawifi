import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    headerNavigation: {
        paddingTop: StatusBar.currentHeight,
        paddingBottom: 10,
        paddingHorizontal: 10,
        gap: 10,
    },

    cardHeaderNavigation: {
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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

    headerContainer: {
        backgroundColor: "transparent",
        margin: 10,
        gap: 10,
    },

    cardHeader: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },

    cardHeaderText: {
        lineHeight: 34,
    },

    bodyContainer: {
        flex: 1,
        marginTop: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderStartWidth: 2,
        borderEndWidth: 2,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },

    flashNavigationContainer: {
        marginVertical: 10,
        marginHorizontal: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
    },

    flashNavigation: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "22%",
        gap: 5,
    },

    flashIcon: {
        padding: 10,
        borderRadius: 10,
    },

    flashText: {
        textAlign: "center",
        fontSize: 12,
    },

    pagerCard: {
        marginHorizontal: 20,
        marginTop: 0,
        padding: 10,
        alignItems: "center",
        borderRadius: 10,
    },

    paymentHistoryContainer: {
        backgroundColor: "transparent",
        paddingHorizontal: 10,
    },

    cardHistory: {
        marginBottom: 10,
    },

    cardContentHistory: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: -10,
    },

    cardContentLeftHistory: {
        flexDirection: "column",
    },

    cardFooterHistory: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center",
    },

    packageModal: {
        width: width * 0.9,
    },

    packageModalContent: {
        margin: -10,
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
    },

    modalHeader: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#EDEDED",
    },

    modalBody: {
        gap: 5,
        justifyContent: "space-between",
    },

    modalFooter: {
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
    },
});

export default styles;
