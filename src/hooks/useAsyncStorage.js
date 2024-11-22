import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAsyncStorage = () => {
    const storeData = useCallback(async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error("Error storing data:", error);
        }
    }, []);

    const getData = useCallback(async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value != null ? value : null;
        } catch (error) {
            console.error("Error retrieving data:", error);
        }
    }, []);

    const removeData = useCallback(async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing data:", error);
        }
    }, []);

    return { storeData, getData, removeData };
};
