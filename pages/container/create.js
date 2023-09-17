import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { debounce, isUndefined } from "lodash";

import api from "../../services/api";
import useToast from "../../utils/toast";
import InputWrapper from "../../components/InputWrapper";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { getStorage } from "../../utils/storage";

const CreateContainer = () => {
  const router = useRouter();
  const [displayToast] = useToast();

  const debounceCreateContainer = useCallback(
    debounce(createContainer, 400),
    []
  );

  const [inputValue, setInputValue] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_MASTER_CONTAINER"].includes(
          "LOGISTIC_MASTER_CONTAINER_CREATE"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  const handleInputChange = (event) => {
    setInputValue({ ...inputValue, [event.target.name]: event.target.value });
  };

  async function createContainer(newVal) {
    setIsLoading(true);
    var payload = {
      deskripsi: newVal.deskripsi,
      panjang: parseFloat(newVal.panjang),
      lebar: parseFloat(newVal.lebar),
      tinggi: parseFloat(newVal.tinggi),
      berat: parseFloat(newVal.berat),
      update_by: "",
    };

    console.log(payload, "payload");
    try {
      await api.createContainer(payload);

      setIsLoading(false);
      displayToast("success", "Succeed to create new container");
      router.push(`/Container`);
    } catch (error) {
      console.log("error");
      displayToast("error", "Create container failed");
    }
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container item xs={4}>
          <Link href="/Container" sx={{ mr: 2 }}>
            <IconButton aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Create Container
          </Typography>
        </Grid>
        <Grid container item xs={2} justifyContent={"flex-end"}>
          <Button
            disabled={
              !inputValue.deskripsi ||
              !inputValue.panjang ||
              !inputValue.lebar ||
              !inputValue.tinggi ||
              !inputValue.berat
            }
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => debounceCreateContainer(inputValue)}
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container justifyContent={"space-between"}>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Keterangan
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="deskripsi"
              value={inputValue.deskripsi}
              onChange={(e) => handleInputChange(e)}
              size="small"
              fullWidth
              sx={{ backgroundColor: "white" }}
            />
          </InputWrapper>
        </Grid>

        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Panjang (Cm)
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="panjang"
              value={inputValue.panjang}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">cm</InputAdornment>
                ),
                inputProps: { min: 1 },
              }}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Lebar (Cm)
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="lebar"
              value={inputValue.lebar}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">cm</InputAdornment>
                ),
                inputProps: { min: 1 },
              }}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Tinggi (Cm)
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="tinggi"
              value={inputValue.tinggi}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">cm</InputAdornment>
                ),
                inputProps: { min: 1 },
              }}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Berat (g)
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="berat"
              value={inputValue.berat}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
                inputProps: { min: 1 },
              }}
            />
          </InputWrapper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateContainer;
