import React from "react";
import { ApplicationProvider } from "@ui-kitten/components";
import { mapping, customTheme } from "./lightTheme";

const ThemeProvider = ({ children }) => (
    <>
        <ApplicationProvider mapping={mapping} theme={customTheme}>
            {children}
        </ApplicationProvider>
    </>
);

export default ThemeProvider;
