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
  Autocomplete,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { debounce,isUndefined } from "lodash";

import api from "../../../../services/api";
import Link from "../../../../utils/link";
import useToast from "../../../../utils/toast";
import InputWrapper from "../../../../components/InputWrapper";

import { DesktopDatePicker } from "@mui/x-date-pickers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";

const CreateCabangDistributor = () => {
  const router = useRouter();
  const [displayToast] = useToast();
  const [params, setParams] = useState({
    kodeDist: "",
  });

  const debounceCreateCabangDistributor = useCallback(
    debounce(createCabangDistributor, 400),
    []
  );

  useEffect(() => {
    if (!router.isReady) return;
    const { dist_code } = router.query;
    setDistCode(dist_code);
  }, [router.isReady]);

  const [distCode, setDistCode] = useState("");
  const [inputValue, setInputValue] = useState({
    distributor_code: "",
    cabang_distributor_code: "",
    area_code: "",
    nama_cabang: "",
    alamat_cabang: "",
    kota: "",
    kode_pos: "",
    latitude: "",
    longitude: "",
    tgl_pengukuhan: dayjs(),
    email: "",
    telp1: "",
    telp2: "",
    fax: "",
    update_by: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputValue({ ...inputValue, [event.target.name]: event.target.value });
  };

  async function createCabangDistributor(newVal, dist_code) {
    setIsLoading(true);
    var payload = {
      distributor_code: "88",
      // cabang_distributor_code: dist_code.cabang_distributor_code,
      // area_code: dist_code.area_code,
      cabang_distributor_code: newVal.cabang_distributor_code,
      area_code: newVal.area_code,
      nama_cabang: newVal.nama_cabang,
      alamat_cabang: newVal.alamat_cabang,
      kota: parseInt(newVal.kota),
      kode_pos: newVal.kode_pos,
      latitude: parseFloat(newVal.latitude),
      longitude: parseFloat(newVal.longitude),
      tgl_pengukuhan: newVal.tgl_pengukuhan,
      email: newVal.email,
      telp1: newVal.telp1,
      telp2: newVal.telp2,
      fax: newVal.fax,
      update_by: "TESTING",
    };

    console.log(payload, "payload");
    try {
      await api.createCabangDistributor(payload, dist_code);

      setIsLoading(false);
      displayToast("success", "Succeed to create new distributor branch");
      router.push(`/distributor/${dist_code}/cabang`);
    } catch (error) {
      console.log("error");
      displayToast("error", "Create distributor branch failed");
    }
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container item xs={4}>
          <Link href={`/distributor/${distCode}/cabang`} sx={{ mr: 2 }}>
            <IconButton aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Create Cabang Distributor
          </Typography>
        </Grid>
        <Grid container item xs={2} justifyContent={"flex-end"}>
          <Button
            disabled={
              !inputValue.cabang_distributor_code ||
              !inputValue.area_code ||
              !inputValue.nama_cabang ||
              !inputValue.alamat_cabang ||
              !inputValue.kota ||
              !inputValue.kode_pos ||
              !inputValue.latitude ||
              !inputValue.longitude ||
              !inputValue.tgl_pengukuhan ||
              !inputValue.email ||
              !inputValue.telp1 ||
              !inputValue.telp2 ||
              !inputValue.fax
            }
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() =>
              debounceCreateCabangDistributor(inputValue, distCode)
            }
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
              Kode Distributor
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="distributor_code"
              value={distCode}
              disabled
              size="small"
              fullWidth
              sx={{ backgroundColor: "white" }}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Kode Cabang Distributor
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="cabang_distributor_code"
              value={inputValue.cabang_distributor_code}
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
              Kode Area Cabang
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="area_code"
              value={inputValue.area_code}
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
              Nama Cabang
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="nama_cabang"
              value={inputValue.nama_cabang}
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
              Alamat Cabang
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="alamat_cabang"
              value={inputValue.alamat_cabang}
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
              Kota
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="kota"
              value={inputValue.kota}
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
              Kode Pos
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <TextField
              name="kode_pos"
              value={inputValue.kode_pos}
              onChange={(e) => handleInputChange(e)}
              size="small"
              fullWidth
              sx={{ backgroundColor: "white" }}
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Latitude (bujur)
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="latitude"
              value={inputValue.latitude}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Longitude (lintang)
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="longitude"
              value={inputValue.longitude}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Tanggal Pengukuhan
            </Typography>
          </InputWrapper>
          <InputWrapper>
            <DesktopDatePicker
              inputFormat="DD MMMM YYYY"
              value={inputValue.tgl_pengukuhan}
              onChange={(newVal) =>
                setInputValue({ ...inputValue, tgl_pengukuhan: newVal })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Email
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="email"
              value={inputValue.email}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="email"
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Telp 1
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="telp1"
              value={inputValue.telp1}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Telp 2
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="telp2"
              value={inputValue.telp2}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </InputWrapper>
        </Grid>
        <Grid container item>
          <InputWrapper>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              Fax
            </Typography>
          </InputWrapper>
          <InputWrapper sx={{ backgroundColor: "white" }}>
            <TextField
              name="fax"
              value={inputValue.fax}
              onChange={(e) => handleInputChange(e)}
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </InputWrapper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateCabangDistributor;
