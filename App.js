import React from "react";
import { KeyboardAvoidingView, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import ThemeProvider from "./src/themes/ThemeProvider";

LogBox.ignoreAllLogs(true);

const App = () => (
    <AuthProvider>
        <SafeAreaProvider>
            <KeyboardAvoidingView behavior="hight" style={{ flex: 1 }}>
                <ThemeProvider>
                    <RootNavigator />
                </ThemeProvider>
            </KeyboardAvoidingView>
        </SafeAreaProvider>
    </AuthProvider>
);

export default App;
