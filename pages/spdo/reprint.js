import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  InputAdornment,
  OutlinedInput,
  Modal,
  CircularProgress,
  CardContent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { debounce, isNull, isUndefined } from "lodash";
import { formatDate } from "../../utils/text";
import useToast from "../../utils/toast";
import { getStorage } from "../../utils/storage";
import SearchIcon from "@mui/icons-material/Search";
import logistic from "../../services/logistic";
import core from "../../services/core";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  p: 4,
};

const Reprint = () => {
  const router = useRouter();
  const [displayToast] = useToast();
  const debounceMountSPtoReprint = useCallback(
    debounce(getDataSPToReprint, 400),
    []
  );
  const debounceReprintDokumenSP = useCallback(
    debounce(getDokumentReprint, 400),
    []
  );
  const debounceMountListProject = useCallback(
    debounce(mountListProject, 400),
    []
  );
  var [dataAvailable, setDataAvailable] = useState(false);
  var [inputSearch, setInputSearch] = useState("");
  var [headerSP, setHeaderSP] = useState(null);
  var [detailSP, setDetailSP] = useState(null);
  const [listProject, setListProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userPT = JSON.parse(getStorage("pt"));
  const userOutlet = JSON.parse(getStorage("outlet"));

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_STOCK")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (!router.isReady) return;
    debounceMountListProject();
  }, [router.isReady]);

  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      debounceMountSPtoReprint(inputSearch, userPT.pt_id, userOutlet.out_code);
    }
  };

  async function getDataSPToReprint(noSP, pt, outcode) {
    setIsLoading(true);
    try {
      const newParams = {
        pt: pt,
        outcode: outcode,
      };
      const getDetailSP = await logistic.getSPToReprint(noSP, newParams);
      const { data, error } = getDetailSP.data;
      if (error.status === false) {
        setHeaderSP(data);
        setDetailSP(data.details);
        setDataAvailable(true);
      } else {
        setHeaderSP(null);
        setDetailSP(null);
        setDataAvailable(false);
        displayToast("error", error.msg.split("-")[1]);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function getDokumentReprint(noref, pt, outlet) {
    setIsLoading(true);
    try {
      var newParams = {
        pt: pt,
        outcode: outlet,
      };
      const getDokumen = await logistic.getDocumentSP(noref, newParams);
      const { data } = getDokumen;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Dokumen_${outlet}_${noref}.pdf`);
      document.body.appendChild(link);
      link.click();
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  }

  async function mountListProject() {
    setIsLoading(true);
    try {
      const getProject = await core.getListProject();
      const { data, error } = getProject.data;
      if (error.status === false) {
        setListProject(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const returnProjectName = (item) => {
    var tempArr = [...listProject];
    var foundProject = tempArr.find((tp) => tp.prj_id === item.project_id);
    if (!isUndefined(foundProject)) {
      return foundProject.prj_name;
    } else {
      return "NOT FOUND";
    }
  };

  const returnTipeSP = (tipe) => {
    if (tipe === "S") {
      return "SALES";
    } else if (tipe == "T") {
      return "TRANSFER";
    }
  };

  const returnQtyOrder = (item) => {
    if (item.sell_pack === item.med_pack) {
      return `${item.qty_order} ${item.sell_pack_name}`;
    } else {
      return `${item.qty_order} ${item.sell_pack_name} (${
        item.qty_order / item.sell_unit
      } ${item.med_pack_name})`;
    }
  };

  const returnQtyScan = (item) => {
    let qtyColor = "red";

    if (item.qty_scan === item.qty_order) {
      qtyColor = "green";
    } else if (item.qty_scan === 0) {
      qtyColor = "red";
    } else if (item.qty_scan > 0) {
      qtyColor = "darkorange";
    }

    if (!isNull(headerSP) && headerSP.tipebisnis !== "B2C") {
      return (
        <Typography
          variant="subtitle2"
          sx={{ color: qtyColor, fontWeight: 400 }}
        >{`${item.qty_scan} ${item.sell_pack_name} (${Math.floor(
          item.qty_scan / item.sell_unit
        )} ${item.med_pack_name})`}</Typography>
      );
    }

    if (!isNull(headerSP) && headerSP.tipebisnis === "B2C") {
      return (
        <Typography
          variant="subtitle2"
          sx={{ color: qtyColor, fontWeight: 400 }}
        >{`${item.qty_scan} ${item.sell_pack_name}`}</Typography>
      );
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            REPRINT PDF SP
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid item flex={8}>
          <OutlinedInput
            fullWidth
            size="small"
            startAdornment={
              <InputAdornment>
                <SearchIcon />
              </InputAdornment>
            }
            placeholder="Masukan no SP dan tekan Enter untuk Mencari"
            sx={{ bgcolor: "white" }}
            onChange={(e) => setInputSearch(e.target.value)}
            onKeyPress={(event) => enterPressed(event)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      {dataAvailable ? (
        <CardContent>
          <Grid container spacing={2}>
            <Grid item flex={3}>
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                PROJECT
              </Typography>
              <TextField
                value={
                  !isNull(headerSP) && !isNull(listProject)
                    ? returnProjectName(headerSP)
                    : ""
                }
                name="no_sp"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "white" }}
                fullWidth
              />
            </Grid>
            <Grid item flex={3}>
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                NO SP
              </Typography>
              <TextField
                value={!isNull(headerSP) && headerSP.sp_id}
                name="no_sp"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "white" }}
                fullWidth
              />
            </Grid>
            <Grid item flex={3}>
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                TGL SP
              </Typography>
              <TextField
                value={!isNull(headerSP) && formatDate(headerSP.tglsp)}
                name="tgl_do"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "white" }}
                fullWidth
              />
            </Grid>
            <Grid item flex={3}>
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                TIPE
              </Typography>
              <TextField
                value={returnTipeSP(!isNull(headerSP) && headerSP.tipe)}
                name="outlet"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "white" }}
                fullWidth
              />
            </Grid>
            <Grid item flex={3}>
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                OUTLET
              </Typography>
              <TextField
                value={!isNull(headerSP) && headerSP.tujuan}
                name="outlet"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "white" }}
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      ) : (
        <Grid></Grid>
      )}
      {dataAvailable && <Divider sx={{ my: 1 }} />}

      <Paper
        sx={{
          width: "100%",
          my: 2,
        }}
      >
        {dataAvailable ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      PROCODE
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      PRONAME
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      BATCH
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      ED BATCH
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      QTY ORDER
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      QTY SCAN
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isNull(detailSP) &&
                  detailSP.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 400 }}
                        >
                          {item.procode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 400 }}
                        >
                          {item.pro_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 400 }}
                        >
                          {item.batch}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 400 }}
                        >
                          {formatDate(item.exp_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 400 }}
                        >
                          {returnQtyOrder(item)}
                        </Typography>
                      </TableCell>
                      <TableCell>{returnQtyScan(item)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid></Grid>
        )}

        {dataAvailable && (
          <Box sx={{ textAlign: "center" }}>
            <Button
              color="success"
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              onClick={() =>
                debounceReprintDokumenSP(
                  headerSP.noref,
                  userPT.pt_id,
                  userOutlet.out_code
                )
              }
            >
              Print
            </Button>
          </Box>
        )}
      </Paper>

      {/* MODAL LOADING */}
      <Modal open={isLoading}>
        <Box sx={style} style={{ textAlign: "center" }}>
          <Typography>Mohon Tunggu Permintaan Anda Sedang Di Proses</Typography>
          <CircularProgress></CircularProgress>
        </Box>
      </Modal>
      {/* MODAL LOADING */}
    </Box>
  );
};

export default Reprint;
