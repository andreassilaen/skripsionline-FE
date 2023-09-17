import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Select,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { debounce, isUndefined } from "lodash";

import api from "../../services/api";
import Link from "../../utils/link";
import useToast from "../../utils/toast";
import InputWrapper from "../../components/InputWrapper";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { getStorage } from "../../utils/storage";

const CreateDistributor = () => {
  const router = useRouter();
  const [displayToast] = useToast();

  const debounceCreateDistributor = useCallback(
    debounce(createDistributor, 400),
    []
  );

  const [inputValue, setInputValue] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_MASTER_DISTRIBUTOR"].includes(
          "LOGISTIC_MASTER_DISTRIBUTOR_CREATE"
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

  async function createDistributor(newVal) {
    setIsLoading(true);
    var payload = {
      nama_distributor: newVal.nama_distributor,
      nama_pajak: newVal.nama_pajak,
      alamat_pajak: newVal.alamat_pajak,
      pkpyn: newVal.pkpyn,
      pphyn: newVal.pphyn,
      npwp: newVal.npwp,
      update_by: "",
    };

    console.log(payload, "payload");
    try {
      await api.createDistributor(payload);

      setIsLoading(false);
      displayToast("success", "Succeed to create new distributor");
      router.push(`/Distributor`);
    } catch (error) {
      console.log("error");
      displayToast("error", "Create distributor failed");
    }
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container item xs={4}>
          <Link href="/distributor" sx={{ mr: 2 }}>
            <IconButton aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Create Distributor
          </Typography>
        </Grid>
        <Grid container item xs={2} justifyContent={"flex-end"}>
          <Button
            disabled={
              !inputValue.nama_distributor ||
              !inputValue.nama_pajak ||
              !inputValue.alamat_pajak ||
              !inputValue.pkpyn ||
              !inputValue.pphyn ||
              !inputValue.npwp
            }
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => debounceCreateDistributor(inputValue)}
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
              Nama Distributor
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="nama_distributor"
              value={inputValue.nama_distributor}
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
              Nama Pajak
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="nama_pajak"
              value={inputValue.nama_pajak}
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
              Alamat Pajak
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="alamat_pajak"
              value={inputValue.alamat_pajak}
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
              PKP
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <Select
              name="pkpyn"
              size="small"
              fullWidth
              sx={{
                backgroundColor: "white",
              }}
              value={inputValue.pkpyn}
              onChange={(e) => handleInputChange(e)}
            >
              <MenuItem value="Y">Yes</MenuItem>
              <MenuItem value="N">No</MenuItem>
            </Select>
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              PPH
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <Select
              name="pphyn"
              size="small"
              fullWidth
              sx={{
                backgroundColor: "white",
              }}
              value={inputValue.pphyn}
              onChange={(e) => handleInputChange(e)}
            >
              <MenuItem value="Y">Yes</MenuItem>
              <MenuItem value="N">No</MenuItem>
            </Select>
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              NPWP
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="npwp"
              value={inputValue.npwp}
              onChange={(e) => handleInputChange(e)}
              size="small"
              fullWidth
              sx={{ backgroundColor: "white" }}
            />
          </InputWrapper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateDistributor;
