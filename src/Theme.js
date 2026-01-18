import { lightGreen, orange, red, yellow } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import "@fontsource/noto-sans"; 

export const theme = createTheme({
    palette: {
        background: { default: "#000000" },
        mode: "dark",
        primary: orange,
        secondary: yellow,
        blue: { main: '#03628f' },
        white: { main: '#ffffff' },
        red: red,
        grey: { main: '#545453' },
        success: lightGreen,
        error: red,
        unselected: { main: '#f8b051' }
    },

    typography: {
        fontFamily: '"Noto Sans", sans-serif', // Use Noto Sans from Google Fonts
    },    
        fontSize: 25,

        h1: {
            fontSize: 30,
            fontWeight: 400,
            fontFamily: '"Noto Sans", sans-serif', // Apply to h1 explicitly
        },
    },
);
