import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  styled,
  InputAdornment,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { debounce,isUndefined } from "lodash";

import api from "../../services/stock";
// import Link from "../../utils/link";
import { formatDate } from "../../utils/text";
import useToast from "../../utils/toast";
import useResponsive from "../../utils/responsive";
import { getStorage } from "../../utils/storage";

import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

const StockHeader = (props) => {
  const router = useRouter();
  const [displayToast] = useToast();

  const pt = getStorage("pt");
  const pt_id = JSON.parse(pt).pt_id;
  const outcodeData = getStorage("outlet");
  const outcode = JSON.parse(outcodeData).out_code;

  // const language = 'EN';
  var language = props.language;
  const isMobile = useResponsive().isMobile;

  const debounceMountListStockHeader = useCallback(
    debounce(mountListStockHeader, 400),
    []
  );
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
    // console.log('LANGUAGE TEST', language)
  }, [language]);

  useEffect(() => {
    if (!router.isReady) return;
    // console.log('PROPS PAGE', props)
    debounceMountListStockHeader(
      pt_id,
      outcode,
      inputSearch,
      urutkanStock,
      params
    );
  }, [router.isReady]);

  const [listStockHeader, setListStockHeader] = useState([]);
  var [dataAvailable, setDataAvailable] = useState(false);

  const [totalData, setTotalData] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    length: 5,
  });

  var [inputSearch, setInputSearch] = useState("");

  var [urutkanStock, setUrutkanStock] = useState("ASC");
  var [modalStockIsOpen, setModalStockIsOpen] = useState(false);
  var [objStock, setObjStock] = useState({});

  async function mountListStockHeader(pt, outcode, procod, sort, params) {
    try {
      setDataAvailable((dataAvailable = true));
      const getStockHeader = await api.getStockHeaderPagination(
        pt,
        outcode,
        procod,
        sort,
        params
      );
      const { data, metadata, error } = getStockHeader.data;
      // console.log("data stock header", getStockHeader);

      if (error.status === true) {
        displayToast("error", error.msg);
        if (error.code === 401) {
          displayToast("error", "Token is expired please login again");
          window.sessionStorage.clear();
          // history.push('/#/login')
        }
      } else {
        if (data === null || data === undefined) {
          setListStockHeader([]);
        } else {
          setListStockHeader(data);
        }
        setTotalData(metadata.total_data);
        setDataAvailable(false);
      }
    } catch (error) {
      console.log(error);
      setDataAvailable(false);
      displayToast("error", error.code);
    }
  }

  const handlePageChange = (event, newPage) => {
    if (params.page === newPage) {
      return;
    }

    const newParams = {
      ...params,
      page: newPage,
      length: params.length,
    };
    setParams(newParams);

    setDataAvailable(false);
    debounceMountListStockHeader(
      pt_id,
      outcode,
      inputSearch,
      urutkanStock,
      newParams
    );
  };

  const handleRowsPerPageChange = async (event, newRows) => {
    if (params.length === newRows) {
      return;
    }

    const newParams = {
      ...params,
      page: 0,
      length: event.target.value,
    };
    setParams(newParams);

    setDataAvailable(false);
    debounceMountListStockHeader(
      pt_id,
      outcode,
      inputSearch,
      urutkanStock,
      newParams
    );
  };

  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      // setCurrentPage((currentPage = 1))
      const newParams = {
        ...params,
        page: 0,
        length: params.length,
      };
      setParams(newParams);
      setDataAvailable(false);
      debounceMountListStockHeader(
        pt_id,
        outcode,
        inputSearch,
        urutkanStock,
        newParams
      );
    }
  };

  function getModalStock(procod) {
    var index = listStockHeader.findIndex(
      (item) => item.stck_procod === procod
    );
    setObjStock((objStock = listStockHeader[index]));
    setModalStockIsOpen(true);
  }

  function setSort(sortType) {
    setUrutkanStock((urutkanStock = sortType));

    const newParams = {
      ...params,
      page: 0,
      length: params.length,
    };
    setParams(newParams);

    setDataAvailable(true);
    debounceMountListStockHeader(
      pt_id,
      outcode,
      inputSearch,
      urutkanStock,
      newParams
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Inventory Stock
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <OutlinedInput
            fullWidth={isMobile && true}
            size="small"
            startAdornment={
              <InputAdornment>
                <SearchIcon />
              </InputAdornment>
            }
            placeholder={language === "EN" ? "Search..." : "Cari..."}
            sx={{ bgcolor: "white" }}
            onChange={(e) => setInputSearch((inputSearch = e.target.value))}
            onKeyPress={(event) => enterPressed(event)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          display={"flex"}
          justifyContent={!isMobile && "flex-end"}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, pt: 0.5 }}>
            {language === "EN" ? "Order Stock By:" : "Urutkan Stock:"}
          </Typography>
          <FormControl sx={{ ml: 2, minWidth: 150 }} size="small">
            <Select
              value={urutkanStock}
              onChange={(e) => setSort(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={"ASC"}>
                {language === "EN" ? "Smallest" : "Terkecil"}
              </MenuItem>
              <MenuItem value={"DESC"}>
                {language === "EN" ? "Biggest" : "Terbesar"}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container justifyContent={!isMobile && "flex-end"}>
        <Grid
          item
          xs={12}
          sm={12}
          md={2}
          lg={2}
          sx={!isMobile && { textAlign: "right" }}
        >
          <Button
            variant="contained"
            sx={{ height: "100%" }}
            onClick={() => router.push(`/stock/mapped-stock`)}
          >
            Mapped Stock
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ width: "100%", my: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Procod
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Product Description" : "Nama Produk"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Current Stock" : "Stok Fisik"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Booked Stock" : "Stok Dipesan"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Available Stock" : "Stok Tersedia"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Status
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Last Update" : "Update Terakhir"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Check Turnover" : "Cek Mutasi"}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataAvailable ? (
                <TableRow>
                  <TableCell align="center" colSpan={12}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : listStockHeader.length !== 0 ? (
                listStockHeader.map((item) => (
                  <TableRow key={item.stck_procod}>
                    <TableCell>
                      <Link
                        href={`/stock/view/${
                          item.stck_proname === "" ? "-" : btoa(item.stck_proname)
                        }/${item.stck_procod}`}
                        sx={{ fontWeight: 600 }}
                      >
                        {item.stck_procod}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      {item.stck_proname === "" ? "-" : item.stck_proname}
                    </TableCell>
                    <TableCell align="center">{item.stck_qtystock}</TableCell>
                    <TableCell align="center">
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => getModalStock(item.stck_procod)}
                      >
                        {item.stck_qtybook}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      {item.stck_qtyavailable}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          item.stck_activeyn === "Y"
                            ? "Active"
                            : item.stck_activeyn === "N"
                            ? "Not Active"
                            : "-"
                        }
                        color={
                          item.stck_activeyn === "Y"
                            ? "success"
                            : item.stck_activeyn === "N"
                            ? "error"
                            : "default"
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(item.stck_lastupdate, "ddd MMMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        href={`/stock/stockTurnover/${
                          item.stck_proname === "" ? "-" : btoa(item.stck_proname)
                        }/${item.stck_procod}`}
                        sx={{ textDecoration: "none" }}
                      >
                        {/* <Button size="small" variant="outlined" color="primary">
                          View
                        </Button> */}
                        <AssignmentIcon fontSize="large" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={12}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, mt: 0.5, color: "gray" }}
                    >
                      {/* {language === 'EN' ? 'NO DATA' : 'TIDAK ADA DATA'} */}
                      TIDAK ADA DATA
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  count={totalData}
                  rowsPerPage={params.length}
                  page={params.page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>

      {/* MODAL BOOK STOCK */}
      <Dialog
        open={modalStockIsOpen}
        onClose={() => setModalStockIsOpen(false)}
        fullWidth
        PaperProps={{ sx: { position: "fixed", top: 10 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Book Stock Detail
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent={"flex-end"}>
              <Typography variant="subtitle1">
                {objStock.stck_procod === "" ? "-" : objStock.stck_procod}
              </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider sx={{ my: 1 }} />
        <DialogContent>
          <Grid container justifyContent={"flex-end"}>
            <Button
              variant="contained"
              onClick={() =>
                router.push(
                  `/stock/bookStockTurnover/${
                    objStock.stck_proname === "" ? "-" : btoa(objStock.stck_proname)
                  }/${objStock.stck_procod}`
                )
              }
            >
              {language === "EN"
                ? "Check Book Stock Turnover"
                : "Cek Mutasi Book Stock"}
            </Button>
          </Grid>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", pt: 1 }}
              >
                Book SP
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent={"flex-end"}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={objStock.stck_qtybooksp}
                margin={"none"}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", pt: 1 }}
              >
                Book Hold Order Distributor
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent={"flex-end"}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={objStock.stck_qtybookholdro}
                margin={"none"}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", pt: 1 }}
              >
                Book Unpaid B2B
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent={"flex-end"}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={objStock.stck_qtybookunpaidb2b}
                margin={"none"}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", pt: 1 }}
              >
                Book Tukar Guling
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent={"flex-end"}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={objStock.stck_qtybooktukarguling}
                margin={"none"}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", pt: 1 }}
              >
                Book Receiving PO Order Toko
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent={"flex-end"}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={objStock.stck_qtybookrecvortok}
                margin={"none"}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", pt: 1 }}
              >
                Book LPB
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent={"flex-end"}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={objStock.stock_qtybooklpb}
                margin={"none"}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", pt: 1 }}
              >
                Book Other
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent={"flex-end"}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={objStock.stck_qtybookother}
                margin={"none"}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", pt: 1 }}
              >
                Total
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent={"flex-end"}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={objStock.stck_qtybook}
                margin={"none"}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => setModalStockIsOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* MODAL BOOK STOCK */}
    </Box>
  );
};

export default StockHeader;
