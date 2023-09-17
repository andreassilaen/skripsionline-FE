import {
  Box,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  Select,
  MenuItem,
  Button,
  TextField,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputLabel,
  Modal,
  CircularProgress,
  Divider,
  TableContainer,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import {
  LastPage,
  FirstPage,
  ArrowForwardIos,
  ArrowBackIos,
  Print,
  Search,
  RemoveRedEye,
  Block,
  Refresh,
} from "@mui/icons-material/";
import ModalInputWrapper from "../../components/ModalInputWrapper";
import { getStorage } from "../../utils/storage";
import api from "../../services/logistic";
import { debounce,isUndefined } from "lodash";
import * as dayjs from "dayjs";
import { useRouter } from "next/router";
import { formatRupiah } from "../../utils/text";

const GenerateFakturFTZ = () => {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const language = getStorage("language");
  const PTID = JSON.parse(getStorage("pt")).pt_id;
  const gudangID = JSON.parse(getStorage("outlet")).out_code;
  const nip = JSON.parse(getStorage("outlet")).nip;
  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const [responseHeader, setResponseHeader] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openPagination, setOpenPagination] = useState(false);
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_GENERATE_FAKTUR_FTZ")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    p: 4,
  };

  const styleModalResponse = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    p: 4,
  };

  function allyProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  function refresh() {
    debounceMountGetListDestination();

    debounceMountGetTotalFaktur();
    debounceMountGetListTrannoUnprocess();

    debounceMountGetListHistoryFTZ();
    debounceMountGetTotalHistory();
  }

  //Tab Proses...
  const [listDestination, setListDestination] = useState([]);
  const [listTrannoUnprocess, setListTrannoUnprocess] = useState([]);
  const [destination, setDestination] = useState("0");
  const [maxPage, setMaxPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [editCurrentPage, setEditCurrentPage] = useState(1);
  const [arrProduct, setArrProduct] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  function handleNextPage() {
    var next = 0;
    next = parseInt(editCurrentPage) + 1;
    setEditCurrentPage(next);
    setCurrentPage(next);
    if (editCurrentPage > maxPage) {
      setEditCurrentPage(maxPage);
      setCurrentPage(maxPage);
    } else if (editCurrentPage < 1) {
      setEditCurrentPage(1);
      setCurrentPage(1);
    }
  }

  function handlePrevPage() {
    var prev = 0;
    prev = parseInt(editCurrentPage) - 1;
    setEditCurrentPage(prev);
    setCurrentPage(prev);
    if (editCurrentPage > maxPage) {
      setEditCurrentPage(maxPage);
      setCurrentPage(maxPage);
    } else if (editCurrentPage < 1) {
      setEditCurrentPage(1);
      setCurrentPage(1);
    }
  }

  function handleLastPage() {
    setEditCurrentPage(maxPage);
    setCurrentPage(maxPage);
    if (editCurrentPage > maxPage) {
      setEditCurrentPage(maxPage);
      setCurrentPage(maxPage);
    } else if (editCurrentPage < 1) {
      setEditCurrentPage(1);
      setCurrentPage(1);
    }
  }

  function handleFirstPage() {
    setEditCurrentPage(1);
    setCurrentPage(1);
    if (editCurrentPage > maxPage) {
      setEditCurrentPage(maxPage);
      setCurrentPage(maxPage);
    } else if (editCurrentPage < 1) {
      setEditCurrentPage(1);
      setCurrentPage(1);
    }
  }

  const debounceMountGetListTrannoUnprocess = useCallback(
    debounce(mountGetListTrannoUnprocess, 400)
  );

  async function mountGetListTrannoUnprocess() {
    setIsLoading(true);
    const offset = limit * currentPage - limit;
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      buyername: destination,
      offset: offset,
      limit: limit,
    };
    try {
      const getList = await api.getListTrannoUnprocess(newParams);
      const { data } = getList.data;
      if (data !== null) {
        setListTrannoUnprocess(data);
        setIsLoading(false);
      } else {
        setListTrannoUnprocess([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("err", error);
      setResponseModalIsOpen(true);
      setResponseHeader(language === "ID" ? "Gagal" : "Failed");
      setResponseBody(error.message);
      setIsLoading(false);
    }
  }

  const debounceMountGetListDestination = useCallback(
    debounce(mountGetListDestination, 400)
  );

  async function mountGetListDestination() {
    setIsLoading(true);
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
    };
    try {
      const getList = await api.getListDestination(newParams);
      const { data } = getList.data;
      if (data !== null) {
        setListDestination(data);
        setIsLoading(false);
      } else {
        setListDestination([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("err", error);
      setResponseModalIsOpen(true);
      setResponseHeader(language === "ID" ? "Gagal" : "Failed");
      setResponseBody(error.message);
      setIsLoading(false);
    }
  }

  const debounceMountSearchHistoryFakturFTZ = useCallback(
    debounce(mountSearchHistoryFakturFTZ, 400)
  );

  async function mountSearchHistoryFakturFTZ() {
    setIsLoading(true);
    setOpenRefreshButton(true);
    setCheckboxHistory([]);
    setOpenPagination(false);
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      fakturpajak: inputtedFakturpajak,
    };
    try {
      const searchList = await api.searchHistoryFakturFTZ(newParams);
      const { data } = searchList.data;
      if (data !== undefined && data !== null) {
        setListHistory([data]);
        setIsLoading(false);
      } else {
        setListHistory([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("err", error);
      setResponseModalIsOpen(true);
      setResponseHeader(language === "ID" ? "Gagal" : "Failed");
      setResponseBody(error.message);
      setIsLoading(false);
    }
  }

  const debounceMountGetTotalFaktur = useCallback(
    debounce(mountGetTotalFaktur, 400)
  );

  async function mountGetTotalFaktur(value) {
    setIsLoading(true);
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      buyername: value,
    };
    try {
      const getTotalFaktur = await api.getTotalFakturUnprocess(newParams);
      const { data, metadata } = getTotalFaktur.data;
      setMaxPage(parseInt(Math.ceil(metadata / limit)));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setResponseModalIsOpen(true);
      setResponseHeader(language === "ID" ? "Gagal" : "Failed");
      setResponseBody(error.message);
      setIsLoading(false);
    }
  }

  const debounceMountProsesFTZ = useCallback(debounce(mountProsesFTZ, 400));

  async function mountProsesFTZ() {
    setIsLoading(true);
    const payload = {
      ptid: PTID,
      outcode: gudangID,
      buyername: destination,
      trannum: arrProduct,
    };

    console.log("payload", payload);

    try {
      const option = {
        method: "POST",
        json: true,
        body: JSON.stringify(payload),
      };

      const prosesFTZ = await api.prosesFTZ(arrProduct[0], payload);
      console.log("prosesFTZ", prosesFTZ);
      // const urlPrint = prosesFTZ.config.baseURL + prosesFTZ.config.url;
      // fetch(urlPrint, option).then((response) => {
      //   response.blob().then((blob) => {
      //     let url = window.URL.createObjectURL(blob);
      //     let a = document.createElement("a");
      //     a.href = url;
      //     a.download = arrProduct[0] + ".pdf";
      //     a.click();
      //   });
      // });
      refresh();
      setIsLoading(false);
    } catch (error) {
      console.log("err", error);
      setResponseModalIsOpen(true);
      setResponseHeader(language === "ID" ? "Gagal" : "Failed");
      setResponseBody(error.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    debounceMountGetListDestination();
  }, []);

  useEffect(() => {
    debounceMountGetListTrannoUnprocess();
  }, [limit, currentPage, destination]);

  function onChangeDestination(e) {
    const value = e.target.value;
    setDestination(e.target.value);
    debounceMountGetListTrannoUnprocess();
    debounceMountGetTotalFaktur(value);
  }

  function onChangeLimit(e) {
    setLimit(e.target.value);
    setCurrentPage(1);
    setEditCurrentPage(1);
  }

  function toDetailTranno(item) {
    router.push(`/generatefakturftz/${item}`);
  }

  // handleInputChangeList
  function handleInputChangeList(event, item, index) {
    var cbAll = document.getElementById("checkboxAll");
    const target = event.target;
    const value = target.value;
    var tempArr = [...arrProduct];
    if (target.checked === true && tempArr.filter((item) => item !== value)) {
      tempArr.push(value);
      setArrProduct(tempArr);
    }

    if (target.checked === false) {
      cbAll.checked = false;
      tempArr = tempArr.filter((item) => !item.includes(value));
      setArrProduct(tempArr);
    }
  }

  // handleAllChecked
  function handleAllChecked(event, item) {
    var datas = listTrannoUnprocess;
    var tempArr = arrProduct;
    const target = event.target;

    if (event.target.checked === true) {
      tempArr = datas.map((product) => {
        return `${product.fak_trannum}`;
      });
      setArrProduct(tempArr);
    }
    if (event.target.checked === false) {
      setArrProduct([]);
    }
  }

  const handleChange = (e) => {
    var regexNumber = /^-?\d*\.?\d*$/;
    if (maxPage !== "") {
      if (!regexNumber.test(e.target.value)) {
      } else {
        setEditCurrentPage(e.target.value);
      }
    }
  };

  function handleEnterPressPage(e) {
    var code = e.charCode || e.which;
    if (code === 13 && editCurrentPage !== "") {
      e.preventDefault();
      if (parseInt(editCurrentPage) > maxPage) {
        setEditCurrentPage(maxPage);
        setCurrentPage(maxPage);
      } else if (
        parseInt(editCurrentPage) < 0 ||
        parseInt(editCurrentPage) == 0
      ) {
        setEditCurrentPage(1);
        setCurrentPage(1);
      } else {
        setEditCurrentPage(e.target.value);
        setCurrentPage(e.target.value);
      }
    }
  }

  //Tab History...
  const [listHistory, setListHistory] = useState([]);
  const [inputtedFakturpajak, setInputtedFakturpajak] = useState("");
  const [openRefreshButton, setOpenRefreshButton] = useState(false);
  const [limitHistory, setLimitHistory] = useState(50);
  const [maxPageHistory, setMaxPageHistory] = useState(0);
  const [editCurrentPageHistory, setEditCurrentPageHistory] = useState(1);
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const [checkboxHistory, setCheckboxHistory] = useState([]);

  const debounceMountGetListHistoryFTZ = useCallback(
    debounce(mountGetListHistoryFTZ, 400)
  );

  async function mountGetListHistoryFTZ() {
    setIsLoading(true);
    const offset = limitHistory * currentPageHistory - limitHistory;
    setOpenRefreshButton(false);
    setInputtedFakturpajak("");
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      offset: offset,
      limit: limitHistory,
    };
    try {
      const getListHistoryFTZ = await api.getHistoryFakturFTZ(newParams);
      const { data } = getListHistoryFTZ.data;
      console.log("data", data);
      if (data !== null) {
        setListHistory(data);
        setIsLoading(false);
        setOpenPagination(true);
      } else {
        setListHistory([]);
        setIsLoading(false);
        setOpenPagination(false);
      }
    } catch (error) {
      console.log("err", error);
      setResponseModalIsOpen(true);
      setResponseHeader(language === "ID" ? "Gagal" : "Failed");
      setResponseBody(error.message);
      setOpenPagination(false);
      setIsLoading(false);
    }
  }

  const debounceMountGetTotalHistory = useCallback(
    debounce(mountGetTotalHistoryFTZ, 400)
  );

  async function mountGetTotalHistoryFTZ() {
    setIsLoading(true);
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
    };
    try {
      const getTotalHistoryFTZ = await api.getTotalHistoryFTZ(newParams);
      const { data, metadata } = getTotalHistoryFTZ.data;
      setMaxPageHistory(parseInt(Math.ceil(metadata / limitHistory)));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setResponseModalIsOpen(true);
      setResponseHeader(language === "ID" ? "Gagal" : "Failed");
      setResponseBody(error.message);
      setIsLoading(false);
    }
  }

  const debounceMountPrintFakturFTZ = useCallback(
    debounce(mountPrintFakturFTZ, 400)
  );

  async function mountPrintFakturFTZ(item) {
    setIsLoading(true);
    try {
      await api.printFakturFTZ(PTID, gudangID, item.fak_fakturpajak);
      setIsLoading(false);
    } catch (error) {
      console.log("err", error);
      setIsLoading(false);
      setResponseModalIsOpen(true);
      setResponseHeader(language === "ID" ? "Gagal" : "Failed");
      setResponseBody(error.message);
    }
  }

  function onChangeLimitHistory(e) {
    setLimitHistory(e.target.value);
    setCurrentPageHistory(1);
    setEditCurrentPageHistory(1);
  }

  function toDetailHistory(item) {
    router.push(`/generatefakturftz/history/${item}`);
  }

  function enterPressSearch(e) {
    var code = e.charCode || e.which;
    if (code === 13 && inputtedFakturpajak !== "") {
      e.preventDefault();
      debounceMountSearchHistoryFakturFTZ();
    }
  }

  function handleNextPageHistory() {
    var next = 0;
    next = parseInt(editCurrentPageHistory) + 1;
    setEditCurrentPageHistory(next);
    setCurrentPageHistory(next);
    if (editCurrentPageHistory > maxPageHistory) {
      setEditCurrentPageHistory(maxPageHistory);
      setCurrentPageHistory(maxPageHistory);
    } else if (editCurrentPageHistory < 1) {
      setEditCurrentPageHistory(1);
      setCurrentPageHistory(1);
    }
  }

  function handlePrevPageHistory() {
    var prev = 0;
    prev = parseInt(editCurrentPageHistory) - 1;
    setEditCurrentPageHistory(prev);
    setCurrentPageHistory(prev);
    if (editCurrentPageHistory > maxPageHistory) {
      setEditCurrentPageHistory(maxPageHistory);
      setCurrentPageHistory(maxPageHistory);
    } else if (editCurrentPageHistory < 1) {
      setEditCurrentPageHistory(1);
      setCurrentPageHistory(1);
    }
  }

  function handleLastPageHistory() {
    setEditCurrentPageHistory(maxPageHistory);
    setCurrentPageHistory(maxPageHistory);
    if (editCurrentPageHistory > maxPageHistory) {
      setEditCurrentPageHistory(maxPageHistory);
      setCurrentPageHistory(maxPageHistory);
    } else if (editCurrentPageHistory < 1) {
      setEditCurrentPageHistory(1);
      setCurrentPageHistory(1);
    }
  }

  function handleFirstPageHistory() {
    setEditCurrentPageHistory(1);
    setCurrentPageHistory(1);
    if (editCurrentPageHistory > maxPageHistory) {
      setEditCurrentPageHistory(maxPageHistory);
      setCurrentPageHistory(maxPageHistory);
    } else if (editCurrentPageHistory < 1) {
      setEditCurrentPageHistory(1);
      setCurrentPageHistory(1);
    }
  }

  const handleChangeHistory = (e) => {
    var regexNumber = /^-?\d*\.?\d*$/;
    if (maxPageHistory !== "") {
      if (!regexNumber.test(e.target.value)) {
      } else {
        setEditCurrentPageHistory(e.target.value);
      }
    }
  };

  function handleEnterPressPageHistory(e) {
    var code = e.charCode || e.which;
    if (code === 13 && editCurrentPageHistory !== "") {
      e.preventDefault();
      if (parseInt(editCurrentPageHistory) > maxPageHistory) {
        setEditCurrentPageHistory(maxPageHistory);
        setCurrentPageHistory(maxPageHistory);
      } else if (
        parseInt(editCurrentPageHistory) < 0 ||
        parseInt(editCurrentPageHistory) == 0
      ) {
        setEditCurrentPageHistory(1);
        setCurrentPageHistory(1);
      } else {
        setEditCurrentPageHistory(e.target.value);
        setCurrentPageHistory(e.target.value);
      }
    }
  }

  function handleCheckboxHistory(e, item, index) {
    var tempIndex = [...checkboxHistory];
    var target = e.target;

    if (target.checked === true && tempIndex.filter((item) => item !== index)) {
      tempIndex.push(index);
      if (tempIndex.length > 1) {
        var temp = tempIndex[0];
        tempIndex = tempIndex.filter(function (item) {
          return item != temp;
        });
      }
      setCheckboxHistory(tempIndex);
    }

    if (target.checked === false) {
      tempIndex = tempIndex.filter(function (item) {
        return item !== index;
      });
      setCheckboxHistory(tempIndex);
    }
  }

  const debounceMountConfirmSp = useCallback(debounce(mountConfirmSp, 400));

  async function mountConfirmSp(item) {
    console.log("item", item);
    setIsLoading(true);
    const payload = {
      pt_id: PTID,
      project_id: item.fak_projectid,
      outcode: gudangID,
      sp_id: item.spid,
      updated_by: nip,
    };
    console.log("payload", payload);
    try {
      await api.downloadSP(item.spid, payload);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
      setResponseModalIsOpen(true);
      setResponseHeader(language === "ID" ? "Gagal" : "Failed");
      setResponseBody(error.message);
    }
  }

  function printHistory(item) {
    debounceMountPrintFakturFTZ(item);
    if (item.spid !== "") {
      debounceMountConfirmSp(item);
    }
  }

  useEffect(() => {
    debounceMountGetListHistoryFTZ();
    debounceMountGetTotalHistory();
  }, [limitHistory, currentPageHistory]);

  return (
    <Box sx={{ width: "100%", p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, textAlign: "center" }}>
        Generate Faktur FTZ
      </Typography>
      {/* <Grid> */}
      <Divider sx={{ marginTop: 2, marginBottom: 2 }}></Divider>
      {/* </Grid> */}
      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab label="Proses" {...allyProps(0)}></Tab>
        <Tab label="History" {...allyProps(1)}></Tab>
      </Tabs>
      <Paper>
        {tabValue === 0 ? (
          <>
            {" "}
            <br></br>
            <Grid container ml={2}>
              <ModalInputWrapper
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "9em" }}
              >
                <Typography sx={{ ml: 2, fontWeight: 400 }}>
                  {" "}
                  DESTINATION{" "}
                </Typography>
              </ModalInputWrapper>
              <FormControl
                sx={{ width: "50%", ml: 2, textAlign: "center" }}
                size="small"
              >
                <Select
                  defaultValue="0"
                  onChange={(e) => onChangeDestination(e)}
                  value={destination}
                >
                  <MenuItem value={"0"}>
                    {" "}
                    {listDestination.length === 0
                      ? "No Destination"
                      : "--- Pilih Destinasi ---"}
                  </MenuItem>
                  {listDestination &&
                    listDestination.map((item, index) => (
                      <MenuItem key={index} value={item.fak_buyername}>
                        {item.fak_buyername}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ textAlign: "center" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        <Checkbox
                          id="checkboxAll"
                          indeterminate={
                            arrProduct.length !== 0 &&
                            arrProduct.length !== listTrannoUnprocess.length
                          }
                          checked={
                            listTrannoUnprocess.length === 0
                              ? false
                              : arrProduct.length === listTrannoUnprocess.length
                          }
                          disabled={listTrannoUnprocess.length === 0}
                          onChange={(e, item, index) =>
                            handleAllChecked(e, item, index)
                          }
                        ></Checkbox>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        Transaction Number
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        {" "}
                        Transaction Date
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        {" "}
                        Destination
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        {" "}
                        Total
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        {" "}
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listTrannoUnprocess &&
                      listTrannoUnprocess.map((item, index) => (
                        <TableRow key={item}>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Checkbox
                              name={item.fak_trannum}
                              checked={arrProduct.includes(item.fak_trannum)}
                              value={item.fak_trannum}
                              onChange={(e) =>
                                handleInputChangeList(e, item, index)
                              }
                            ></Checkbox>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.fak_trannum === "" ||
                            item.fak_trannum === null
                              ? ""
                              : item.fak_trannum}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.sale_trandate === "" ||
                            item.sale_trandate === null
                              ? ""
                              : dayjs(item.sale_trandate).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.fak_buyername === "" ||
                            item.fak_buyername === null
                              ? ""
                              : item.fak_buyername}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.sale_trantotal === "" ||
                            item.sale_trantotal === null
                              ? ""
                              : formatRupiah(item.sale_trantotal)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button
                              variant="contained"
                              onClick={() => toDetailTranno(item.fak_trannum)}
                            >
                              {<RemoveRedEye />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Collapse in={listTrannoUnprocess.length === 0}>
                <Box
                  sx={{
                    height: 300,
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h4" sx={{ color: "red" }}>
                    No Item <Block sx={{ width: 30, height: 30 }} />
                  </Typography>
                </Box>
              </Collapse>
              <Collapse
                in={listTrannoUnprocess.length !== 0}
                sx={{ marginRight: 10 }}
              >
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: "center" }}
                  mt={2}
                >
                  <Grid item justifyContent="flex-end">
                    <Select
                      size="small"
                      value={limit}
                      onChange={(e) => onChangeLimit(e)}
                    >
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={200}>200</MenuItem>
                      <MenuItem value={300}>300</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ m: 0 }}
                      variant="contained"
                      onClick={() => handleFirstPage()}
                      disabled={parseInt(editCurrentPage) === 1}
                    >
                      <FirstPage />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ m: 0 }}
                      variant="contained"
                      disabled={parseInt(editCurrentPage) === 1}
                      onClick={() => handlePrevPage()}
                    >
                      <ArrowBackIos />{" "}
                    </Button>
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      sx={{ width: "5em" }}
                      value={editCurrentPage}
                      onChange={(e) => handleChange(e)}
                      onKeyDown={(e) => handleEnterPressPage(e)}
                    ></TextField>
                  </Grid>
                  <Grid item>
                    <Typography variant="h4">/</Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      sx={{ width: "5em" }}
                      size="small"
                      value={maxPage}
                      disabled
                    ></TextField>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="normal"
                      disabled={parseInt(editCurrentPage) === parseInt(maxPage)}
                      onClick={() => handleNextPage()}
                    >
                      <ArrowForwardIos />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => handleLastPage()}
                      disabled={parseInt(editCurrentPage) === parseInt(maxPage)}
                    >
                      <LastPage />
                    </Button>
                  </Grid>
                </Grid>
              </Collapse>
              <Collapse in={listTrannoUnprocess.length !== 0}>
                <Button
                  variant="contained"
                  sx={{ marginBottom: "2%", marginTop: "1%" }}
                  disabled={arrProduct.length === 0}
                  onClick={() => debounceMountProsesFTZ()}
                >
                  Proses
                </Button>
              </Collapse>
            </Grid>{" "}
          </>
        ) : (
          <>
            <br></br>
            <Grid container border="medium" ml={2}>
              <Grid item flex={8}>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ width: "100%" }}
                >
                  <InputLabel size="small">{"Search"}</InputLabel>
                  <OutlinedInput
                    label={"Search"}
                    onChange={(e) => setInputtedFakturpajak(e.target.value)}
                    value={inputtedFakturpajak}
                    onKeyDown={(e) => enterPressSearch(e)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          disabled={inputtedFakturpajak === ""}
                          aria-label="toggle password visibility"
                          onClick={() => debounceMountSearchHistoryFakturFTZ()}
                          edge="end"
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item flex={1} ml={2}>
                <Collapse in={openRefreshButton}>
                  <Button
                    size="normal"
                    variant="contained"
                    onClick={() => debounceMountGetListHistoryFTZ()}
                  >
                    {<Refresh />}
                  </Button>
                </Collapse>
              </Grid>
            </Grid>
            <Grid sx={{ textAlign: "center" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Checkbox
                          disabled={true}
                          indeterminate={true}
                        ></Checkbox>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        No Faktur Pajak
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        Tanggal Faktur
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        Destination
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        Total
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listHistory &&
                      listHistory.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Checkbox
                              checked={checkboxHistory.includes(index)}
                              onChange={(e) =>
                                handleCheckboxHistory(e, item, index)
                              }
                            ></Checkbox>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.fak_fakturpajak === "" ||
                            item.fak_fakturpajak === null
                              ? "-"
                              : item.fak_fakturpajak}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.fak_tglfaktur === "" ||
                            item.fak_tglfaktur === null
                              ? "-"
                              : dayjs(item.fak_tglfaktur).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.fak_buyername === "" ||
                            item.fak_buyername === null
                              ? "-"
                              : item.fak_buyername}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.fak_total === "" || item.fak_total === null
                              ? "-"
                              : formatRupiah(item.fak_total)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button
                              variant="contained"
                              size="normal"
                              onClick={() => {
                                item.fak_fakturpajak === "" ||
                                item.fak_fakturpajak === null
                                  ? ""
                                  : toDetailHistory(item.fak_fakturpajak);
                              }}
                            >
                              {<RemoveRedEye />}
                            </Button>
                            <Button
                              disabled={!checkboxHistory.includes(index)}
                              onClick={() => printHistory(item)}
                              variant="contained"
                              size="normal"
                              sx={{ ml: "1%" }}
                            >
                              {<Print />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Collapse
                // in={listHistory.length !== 0}
                in={openPagination}
                sx={{ marginRight: 10 }}
              >
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: "center" }}
                  mt={2}
                  mb={2}
                >
                  <Grid item>
                    <Select
                      size="small"
                      value={limitHistory}
                      onChange={(e) => onChangeLimitHistory(e)}
                    >
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={200}>200</MenuItem>
                      <MenuItem value={300}>300</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ m: 0 }}
                      // fullWidth
                      variant="contained"
                      onClick={() => handleFirstPageHistory()}
                      disabled={parseInt(editCurrentPageHistory) === 1}
                    >
                      <FirstPage />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ m: 0 }}
                      variant="contained"
                      disabled={parseInt(editCurrentPageHistory) === 1}
                      onClick={() => handlePrevPageHistory()}
                    >
                      <ArrowBackIos />{" "}
                    </Button>
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      sx={{ width: "5em" }}
                      value={editCurrentPageHistory}
                      onChange={(e) => handleChangeHistory(e)}
                      onKeyDown={(e) => handleEnterPressPageHistory(e)}
                    ></TextField>
                  </Grid>
                  <Grid item>
                    <Typography variant="h4">/</Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      sx={{ width: "5em" }}
                      size="small"
                      value={maxPageHistory}
                      disabled
                    ></TextField>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="normal"
                      disabled={
                        parseInt(editCurrentPageHistory) ===
                        parseInt(maxPageHistory)
                      }
                      onClick={() => handleNextPageHistory()}
                    >
                      <ArrowForwardIos />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => handleLastPageHistory()}
                      disabled={
                        parseInt(editCurrentPageHistory) ===
                        parseInt(maxPageHistory)
                      }
                    >
                      <LastPage />
                    </Button>
                  </Grid>
                </Grid>
              </Collapse>
              <Collapse in={listHistory.length === 0}>
                <Box
                  sx={{
                    height: 300,
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h4" sx={{ color: "red" }}>
                    No Item <Block sx={{ width: 30, height: 30 }} />
                  </Typography>
                </Box>
              </Collapse>
            </Grid>{" "}
          </>
        )}
      </Paper>

      <Modal open={isLoading}>
        <Box sx={style} style={{ textAlign: "center" }}>
          <Box>
            PLEASE WAIT... <CircularProgress></CircularProgress>
          </Box>
        </Box>
      </Modal>

      <Modal open={responseModalIsOpen}>
        <Box sx={styleModalResponse}>
          <Grid textAlign="center">
            <Typography variant="h6" fontWeight={600}>
              {responseHeader}
            </Typography>
          </Grid>
          <Grid mt={2} mb={2}>
            <Divider fullWidth />
          </Grid>
          <Grid textAlign="center">
            <Typography>{responseBody}</Typography>
          </Grid>
          <Grid mt={2} textAlign="center">
            <Button
              variant="contained"
              color="error"
              onClick={() => setResponseModalIsOpen(false)}
            >
              CLOSE
            </Button>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default GenerateFakturFTZ;
