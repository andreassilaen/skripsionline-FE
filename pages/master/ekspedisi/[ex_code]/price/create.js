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
import api from "../../../../../services/api";
import Link from "../../../../../utils/link";
import useToast from "../../../../../utils/toast";
import InputWrapper from "../../../../../components/InputWrapper";

import { debounce,isUndefined } from "lodash";

const CreateEkspedisiPrice = () => {
  const router = useRouter();
  const [displayToast] = useToast();

  const debounceCreateEkspedisiPrice = useCallback(
    debounce(createEkspedisiPrice, 1000),
    []
  );

  const [params, setParams] = useState({
    code: "",
  });

  useEffect(() => {
    if (!router.isReady) return;
    const { ex_code } = router.query;

    setParams({ code: ex_code });
  }, [router.isReady]);

  const [inputValue, setInputValue] = useState({
    exp_kode: "",
    kode_area: "",
    tipe_layanan: "",
    lokasi: "",
    fee: "",
    min_kirim: "",
    min_terima: "",
    disc: "",
    disc_value: "",
    ppn: "",
    ppn_value: "",
    waktu_kirim: "",
    update_by: "",
  });

  const handleChange = (event) => {
    setInputValue({
      ...inputValue,
      [event.target.name]: event.target.value,
    });
  };

  async function createEkspedisiPrice(params, newVal) {
    let postData = {
      exp_kode: params.code,
      kode_area: newVal.kode_area,
      tipe_layanan: newVal.tipe_layanan,
      lokasi: newVal.lokasi,
      fee: parseFloat(newVal.fee),
      min_kirim: parseInt(newVal.min_kirim),
      min_terima: parseInt(newVal.min_terima),
      disc: parseFloat(newVal.disc),
      disc_value: parseFloat(newVal.disc_value),
      ppn: parseFloat(newVal.ppn),
      ppn_value: parseFloat(newVal.ppn_value),
      waktu_kirim: parseInt(newVal.waktu_kirim),
      update_by: "TESTING",
    };

    try {
      await api.createEkspedisiPrice(params, postData);

      router.push(`/master/ekspedisi/${params.code}/detail`);
    } catch (error) {
      displayToast("error", "Failed to create new Ekspedisi Price");
    }
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container item xs={6}>
          <Link href={`/master/ekspedisi/${params.code}/price`} sx={{ mr: 2 }}>
            <IconButton aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Create Ekspedisi Price - {params.code}
          </Typography>
        </Grid>
        <Grid container item xs={6} justifyContent={"flex-end"}>
          <Button
            disabled={
              !inputValue.exp_kode ||
              !inputValue.kode_area ||
              !inputValue.tipe_layanan ||
              !inputValue.lokasi ||
              !inputValue.fee ||
              !inputValue.min_kirim ||
              !inputValue.min_terima ||
              !inputValue.disc ||
              !inputValue.disc_value ||
              !inputValue.ppn ||
              !inputValue.waktu_kirim
            }
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => debounceCreateEkspedisiPrice(params, inputValue)}
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Kode Area
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="kode_area"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.kode_area}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Tipe Layanan
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="tipe_layanan"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.tipe_layanan}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Lokasi
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="lokasi"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.lokasi}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Fee
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="fee"
            variant="outlined"
            size="small"
            type="number"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.fee}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Min Kirim
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="min_kirim"
            variant="outlined"
            size="small"
            type="number"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.min_kirim}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Min Terima
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="min_terima"
            variant="outlined"
            size="small"
            type="number"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.min_terima}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Disc
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="disc"
            variant="outlined"
            size="small"
            type="number"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.disc}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Disc Value
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="disc_value"
            variant="outlined"
            size="small"
            type="number"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.disc_value}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            PPN
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="ppn"
            variant="outlined"
            size="small"
            type="number"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.ppn}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            PPN Value
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="ppn_value"
            variant="outlined"
            size="small"
            type="number"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.ppn_value}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
      <Grid container item>
        <InputWrapper>
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            Waktu Kirim
          </Typography>
        </InputWrapper>
        <InputWrapper sx={{ backgroundColor: "white" }}>
          <TextField
            name="waktu_kirim"
            variant="outlined"
            size="small"
            type="number"
            sx={{ backgroundColor: "white" }}
            fullWidth
            value={inputValue.waktu_kirim}
            onChange={handleChange}
          />
        </InputWrapper>
      </Grid>
    </Box>
  );
};

export default CreateEkspedisiPrice;
