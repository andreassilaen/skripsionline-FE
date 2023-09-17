/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Grid,
  Divider,
  Button,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useRouter } from "next/router";
import useToast from "../utils/toast";
import { clearStorage, getStorage, setStorage } from "../utils/storage";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import core from "../services/core";

import { debounce, isUndefined } from "lodash";

const CompanyOutletSelection = () => {
  const router = useRouter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceMountGetPT = useCallback(debounce(mountGetPT, 400), []);
  const debounceMountGetOutlet = useCallback(debounce(mountGetOutlet, 400), []);
  const [displayToast] = useToast();
  const [listPT, setListPT] = useState([]);
  const [listOutlet, setListOutlet] = useState([]);
  const [inputPT, setInputPT] = useState("");
  const [selectedPT, setSelectedPT] = useState("null");
  const [inputOutlet, setInputOutlet] = useState("null");
  const [selectedOutlet, setSelectedOutlet] = useState();
  const userNIP = getStorage("userNIP");
  const [params, setParams] = useState({
    page: 0,
    length: 10,
  });
  const language = getStorage("language");

  useEffect(() => {
    if (selectedPT !== "null") {
      debounceMountGetOutlet(selectedPT);
    }
  }, [selectedPT]);

  useEffect(() => {
    if (!router.isReady) return;
    debounceMountGetPT();
  }, [router.isReady]);

  async function mountGetPT() {
    try {
      const getPT = await core.getUserPT(userNIP, params);
      const { data } = getPT.data;
      setListPT(data);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function mountGetOutlet(userPT) {
    const newParams = {
      ...params,
      pt: userPT.pt_id,
    };
    try {
      const getOutlet = await core.getUserOutlet(userNIP, newParams);
      const { data } = getOutlet.data;
      setListOutlet(data);
    } catch (error) {
      console.log("error", error);
    }
  }

  function toDashboard() {
    setStorage("pt", JSON.stringify(selectedPT));
    setStorage("outlet", JSON.stringify(selectedOutlet));
    router.replace("/");
  }

  function logout() {
    clearStorage();
    router.push(`/login`);
  }
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#F5F5F5",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100vh",
          position: "absolute",
          left: 0,
        }}
      >
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid
            item
            xs={3}
            sx={{
              zIndex: "5",
            }}
          >
            <Card
              variant="outlined"
              sx={{
                width: "500px",
                background: "#FFFFFF",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
                borderRadius: " 12px",
              }}
            >
              <CardHeader
                sx={{ p: 3 }}
                action={
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => logout()}
                    fullWidth
                    startIcon={<LogoutIcon />}
                  >
                    {language === "EN" ? "Logout" : "Keluar"}
                  </Button>
                }
              ></CardHeader>
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    clearIcon={false}
                    options={listPT && listPT}
                    getOptionLabel={(option) =>
                      option.pt_name
                        ? option.pt_name
                        : language === "EN"
                        ? "==CHOOSE PT=="
                        : "==PILIH PT=="
                    }
                    inputValue={inputPT}
                    value={selectedPT}
                    onInputChange={(e, v) => setInputPT(v)}
                    onChange={(e, v) => setSelectedPT(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="PT"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete
                    disablePortal
                    fullWidth
                    clearIcon={false}
                    options={listOutlet && listOutlet}
                    getOptionLabel={(option) =>
                      option.out_name ? option.out_name : "==PILIH OUTLET=="
                    }
                    inputValue={inputOutlet}
                    value={selectedOutlet}
                    onInputChange={(e, v) => setInputOutlet(v)}
                    onChange={(e, v) => {
                      setSelectedOutlet(v);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Outlet"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </CardContent>
              <Divider />
              <CardContent>
                <Button
                  disabled={!selectedPT || !selectedOutlet}
                  sx={{ mt: 1 }}
                  variant="contained"
                  fullWidth
                  onClick={() => toDashboard()}
                  startIcon={<LoginIcon />}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Enter" : "Masuk"}
                  </Typography>
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Divider />
          <Typography
            variant="subtitle2"
            sx={{ color: "rgba(0, 0, 0, 0.87)", mt: 1.5 }}
          >
            {process.env.NEXT_PUBLIC_APP_VERSION}
          </Typography>
        </Grid>
      </Box>
    </>
  );
};

export default CompanyOutletSelection;
