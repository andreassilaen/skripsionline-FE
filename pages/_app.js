import React, { useState, useEffect } from "react";
import Head from "next/head";

import { Box, styled } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import store from "../redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

import { getStorage, clearStorage } from "../utils/storage";
import { ThemeConfig } from "../themes";

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  padding: 3,
  minHeight: "100vh",
  backgroundColor: "#F5F5F5;",
  flexGrow: 1,
  overflow: "hidden",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: (theme) => `-${theme.mixins.drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const MyApp = ({ Component, pageProps, router }) => {
  const [mounted, setMounted] = useState(false);
  const [currLanguage, setCurrLanguage] = useState("");

  useEffect(() => {
    setMounted(true);

    if (window.sessionStorage.getItem("language")) {
      setCurrLanguage(window.sessionStorage.getItem("language"));
    } else {
      languageChange("ID");
      setCurrLanguage("ID");
    }
  }, []);

  // useEffect(() => {
  //   if (getStorage("access_token")) {
  //     let date = new Date();
  //     if (Math.floor(date.getTime() / 1000) >= getStorage("expires_at")) {
  //       clearStorage();
  //       router.push("/login");
  //     }
  //   } else {
  //     clearStorage();
  //     router.push("/login");
  //   }
  // }, [pageProps, router]);

  function languageChange(language) {
    setCurrLanguage(language);
    window.localStorage.setItem("language", language); //untuk simpan languagenya
  }

  return (
    mounted && (
      <>
        <Head>
          <meta
            name="viewport"
            content="height=device-height, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0, width=device-width"
          />
          <meta name="googlebot" content="noindex" />
          <meta name="robots" content="noindex" />
          <title>QR BPOM | Pharmalink</title>
        </Head>

        <Provider store={store}>
          <ThemeConfig>
            <Toaster position="top-center" reverseOrder={false} gutter={8} />
            {router.pathname === "/login" ||
            router.pathname === "/company-outlet-selection" ||
            (typeof window !== "undefined" && !getStorage("access_token")) ? (
              <Component {...pageProps} />
            ) : (
              <Box display={"flex"}>
                <Sidebar
                  currLanguage={
                    window.localStorage.getItem("language")
                      ? window.localStorage.getItem("language")
                      : languageChange("ID")
                  }
                  languageChange={languageChange}
                  pt={JSON.parse(window.localStorage.getItem("outlet"))}
                />
                <Box sx={{ width: "100%" }}>
                  <Main>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Component {...pageProps} language={currLanguage} />
                    </LocalizationProvider>
                  </Main>
                </Box>
              </Box>
            )}
          </ThemeConfig>
        </Provider>
      </>
    )
  );
};

export default MyApp;
