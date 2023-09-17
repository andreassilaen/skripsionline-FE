import {
  Box,
  Stack,
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState, useCallback, useEffect } from "react";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useRouter } from "next/router";
import api from "../../../services/api";
import Link from "../../../utils/link";
import useToast from "../../../utils/toast";
import InputWrapper from "../../../components/InputWrapper";

import { debounce,isUndefined } from "lodash";
import { getStorage } from "../../../utils/storage";

const CreateEkspedisi = () => {
  const router = useRouter();
  const [displayToast] = useToast();

  const debounceCreateEkspedisi = useCallback(
    debounce(createEkspedisi, 1000),
    []
  );

  const [inputValue, setInputValue] = useState({
    ex_nama: "",
  });
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_MASTER_EKSPEDISI"].includes(
          "LOGISTIC_MASTER_EKSPEDISI_CREATE"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  const handleChange = (event) => {
    setInputValue({
      ...inputValue,
      [event.target.name]: event.target.value,
    });
  };

  async function createEkspedisi(newVal) {
    let postData = {
      ex_nama: newVal.ex_nama,
      update_by: "TESTING",
    };

    try {
      await api.createEkspedisi(postData);

      router.push(`/master/ekspedisi`);
    } catch (error) {
      displayToast("error", "Failed to create new Ekspedisi");
    }
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container item xs={6}>
          <Link href={`/master/ekspedisi`} sx={{ mr: 2 }}>
            <IconButton aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Create Ekspedisi
          </Typography>
        </Grid>
        <Grid container item xs={6} justifyContent={"flex-end"}>
          <Button
            disabled={!inputValue.ex_nama}
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => debounceCreateEkspedisi(inputValue)}
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Nama Ekspedisi
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="ex_nama"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.ex_nama}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
    </Box>
  );
};

export default CreateEkspedisi;
