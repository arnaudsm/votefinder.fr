import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

const colors = {
  secondary: {
    main: "#DD5A5A",
    contrastText: "#fff",
  },
  lightBlue: {
    main: "#6697D2",
  },
  lightRed: {
    main: "#E78B8B",
  },
  green: {
    main: "#63B85D",
  },
  white: {
    main: "#FFFFFF",
  },
};

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        ...colors,
        primary: {
          main: "#6000C1",
          contrastText: "#fff",
        },
        body: {
          main: "#3E3E3E",
        },
        highlight: {
          main: "#FFFFFF",
          contrastText: "#3E3E3E",
        },
        background: {
          main: "#FFFFFF",
          paper: "#FFFFFF",
          contrastText: "#3E3E3E",
        },
      },
    },
    dark: {
      palette: {
        ...colors,
        primary: {
          main: "#8948ca",
          contrastText: "#fff",
        },
        body: {
          main: "#FFFFFF",
        },
        highlight: {
          main: "#121212",
          contrastText: "#FFFFFF",
        },
        background: {
          main: "#262626",
          paper: "#121212",
          contrastText: "#FFFFFF",
        },
      },
    },
  },
  shadows: [
    "0px 0px 0px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 2px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 6px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 8px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
  ],
  shape: {
    borderRadius: 14,
  },
});
