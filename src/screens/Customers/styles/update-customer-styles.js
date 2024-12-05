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

    input: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginBottom: 10,
    },

    radioContainer: {
        gap: 0,
        marginBottom: 20,
        paddingHorizontal: 10,
    },

    radioGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
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

    suggestionsContainer: {
        maxHeight: 150,
        marginHorizontal: 10,
        zIndex: 1,
    },

    suggestionItem: {
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: "#fff",
    },

    suggestionText: {
        fontSize: 16,
    },
});

export default styles;
