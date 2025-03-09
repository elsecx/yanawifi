import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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

    headerContainer: {
        padding: 10,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    headerText: {
        flex: 1,
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

    previewsContainer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
    },

    button: {
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        width: "95%",
    },

    detailContainer: {
        flex: 1,
        padding: 10,
        gap: 10,
    },

    detailInfo: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: "hidden",
    },

    detailLocation: {
        padding: 10,
        gap: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: "hidden",
    },

    mapContainer: {
        width: "100%",
        height: 200,
        overflow: "hidden",
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
    },

    map: {
        width: "100%",
        height: "100%",
    },

    button: {
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        width: "95%",
    },
});

export default styles;
