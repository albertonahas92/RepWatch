import React, { FC, useEffect } from "react";
import { Provider } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";
import { ConfirmProvider } from "material-ui-confirm";
import { BrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import store from "../../store/store";
import { QueryClient, QueryClientProvider } from "react-query";

export const useAppDispatch = () => store.dispatch;

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export const Providers: FC = ({ children }) => {
  const initialState =
    JSON.parse(localStorage.getItem("mode") as string) || "light";
  const [mode, setMode] = React.useState<"light" | "dark">(initialState);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  useEffect(() => {
    localStorage.setItem("mode", JSON.stringify(mode));
  }, [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#0098B3",
          },
          secondary: {
            main: grey[500],
          },
        },
      }),
    [mode]
  );

  const paypalClientId = {
    sandbox:
      "Ae30WnZCRnL3Ja9fUfJnbpIr1L4OOheOUbRvErTgVlrk0bW7ky7ko8N4Xpfm1NBz_IaRJYjlKfKrQCxv",
    live: "ARv9ES9WHwzwJDtEvdipM1uCcXbTLqjZHRPz5cBPIuNGbZ8GP2Opfc6mRZ2V-x4Qqajd8k6AHpGuEBG4",
  };

  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <ConfirmProvider>
            <PayPalScriptProvider
              options={{ "client-id": paypalClientId.sandbox }}
            >
              <QueryClientProvider client={queryClient}>
                <Provider store={store}>{children}</Provider>
              </QueryClientProvider>
            </PayPalScriptProvider>
          </ConfirmProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
};
