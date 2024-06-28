import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

const colors = {
  body: {
    main: "#06093F",
  },
  lightBlue: {
    main: "#323ADA",
  },
  darkPurple: {
    main: "#280098",
  },
  purple: {
    main: "#323ADA",
  },
  lightPurple: {
    main: "#5647FD",
  },
  red: {
    main: "#ED2579",
  },
  green: {
    main: "#26c990",
  },
  white: {
    main: "#FFFFFF",
    background: "#f0f1f9",
  },
  black: {
    main: "#121212",
    background: "#1e1e1e",
  },
};

export const theme = extendTheme({
  typography: {
    fontFamily: ["var(--font-body)", "sans-serif"].join(","),
  },
  colorSchemes: {
    light: {
      palette: {
        ...colors,
        primary: {
          main: colors.body.main,
          contrastText: colors.white.main,
        },
        secondary: {
          main: colors.purple.main,
          contrastText: colors.white.main,
        },
        background: {
          main: colors.white.background,
          paper: colors.white.main,
          contrastText: colors.body.main,
        },
      },
    },
    dark: {
      palette: {
        ...colors,
        primary: {
          main: colors.white.background,
          contrastText: colors.body.main,
        },
        secondary: {
          main: colors.purple.main,
          contrastText: colors.white.main,
        },
        background: {
          main: colors.black.background,
          paper: colors.black.main,
          contrastText: colors.white.main,
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
