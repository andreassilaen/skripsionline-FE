import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Stack,
  Grid,
  Divider,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useRouter } from "next/router";
import Image from "next/image";

import api from "../services/core";
import { setStorage, getStorage, deleteStorage } from "../utils/storage";
import useToast from "../utils/toast";
import CenturyLogo from "../public/static/logo/century.png";
import CircularProgress from "@mui/material/CircularProgress";

import Link from "../utils/link";

const Login = () => {
  const router = useRouter();
  const [displayToast] = useToast();
  const passwordRef = useRef();

  const [loginValue, setLoginValue] = useState({
    nip: "",
    password: "",
  });
  var [loading, setLoading] = useState(false);
  const handleChange = (event) => {
    setLoginValue({ ...loginValue, [event.target.name]: event.target.value });
  };

  const handleKeyDownNIP = (event) => {
    if (event.key === "Enter") {
      passwordRef.focus();
    }
  };

  const handleKeyDownPassword = (event) => {
    if (event.key === "Enter") {
      onFinish();
    }
  };

  async function getAccessList() {
    try {
      const payloadAccessList = {
        pt_id: 0,
        nip: loginValue.nip,
        app_id: parseInt(process.env.NEXT_PUBLIC_APP_ID),
      };
      const accessList = await api.getAccessList(payloadAccessList);
      const { data } = accessList.data;
      setStorage("access_list", JSON.stringify(data));
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function onFinish() {
    try {
      setLoading((loading = true));
      const login = await api.login(loginValue);
      const { data } = login.data;
      setStorage("access_token", `${data.token_type} ${data.access_token}`);
      setStorage("expires_at", data.expires_at);
      setStorage("userNIP", loginValue.nip);
      setStorage("language", "EN");
      var accessResult = await getAccessList();
      console.log("access", accessResult);
      router.push("/company-outlet-selection",);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      displayToast("error", "Login failed.");
    }
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
                width: "380px",
                background: "#FFFFFF",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
                borderRadius: " 12px",
                padding: "10px 0px",
              }}
            >
              <CardContent>
                <Stack component="form" spacing={2} noValidate>
                  <Box display={"flex"} justifyContent={"center"}>
                    <Image
                      src={CenturyLogo}
                      width={100}
                      height={100}
                      alt="Century Logo"
                    />
                  </Box>
                  <Divider sx={{ marginTop: "16px" }} />
                  <TextField
                    label="NIP"
                    name="nip"
                    value={loginValue.nip}
                    onChange={handleChange}
                    onKeyDown={handleKeyDownNIP}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    inputRef={(el) => (passwordRef = el)}
                    value={loginValue.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDownPassword}
                  />
                  <Divider sx={{ mt: 2 }} />
                  <Button
                    disabled={
                      !loginValue.nip || !loginValue.password || loading
                    }
                    onClick={onFinish}
                    sx={{ mt: 3 }}
                    variant="contained"
                    startIcon={
                      loading && (
                        <CircularProgress size="1rem" color="inherit" />
                      )
                    }
                  >
                    Log In
                  </Button>
                  <Link
                    href="/reset-password"
                    sx={{ textDecoration: "none" }}
                    align={"center"}
                  >
                    <Typography variant="subtitle2">Reset Password</Typography>
                  </Link>
                </Stack>
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

export default Login;
