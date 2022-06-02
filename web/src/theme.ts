import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  colors: {
    initialColorMode: "dark",
    useSystemColorMode: false,
    primary: {
      main: "#834eca",
      50: "#f7e9ff",
      100: "#dbc3f1",
      200: "#c09de4",
      300: "#a275d7",
      400: "#834eca",
      500: "#6535b1",
      600: "#56298b",
      700: "#421c64",
      800: "#2b113e",
      900: "#13041b",
    },
    graybutton: {
      50: "#F7FAFC",
      100: "#EDF2F7",
      200: "#E2E8F0",
      300: "#CBD5E0f",
      400: "#A0AEC0",
      500: "#718096",
      600: "#4A5568",
      700: "#2D3748",
      800: "#1A202C",
      900: "#171923",
    },

    gray2: {
      main: "#576d8d",
      50: "#eef2f6",
      100: "#d0d7e0",
      200: "#b0bccc",
      300: "#90a1b9",
      400: "#7086a7",
      500: "#576d8d",
      600: "#44556e",
      700: "#313d4d",
      800: "#1e252e",
      900: "#090c11",
    },
  },
  components: {
    Button: {
      defaultProps: {},
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("#f8f8ff", "#20232B")(props),
      },
    }),
  },
});

export default theme;
