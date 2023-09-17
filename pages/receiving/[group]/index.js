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

import api from "../../../services/receiving";
// import Link from "../../utils/link";
import { formatDate } from "../../../utils/text";
import useToast from "../../../utils/toast";
import useResponsive from "../../../utils/responsive";
import { getStorage } from "../../../utils/storage";

import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

const ReceivingHeader = (props) => {
  const router = useRouter();
  const [displayToast] = useToast();

  const pt = getStorage("pt");
  const pt_id = JSON.parse(pt).pt_id;
  const outcodeData = getStorage("outlet");
  const outcode = JSON.parse(outcodeData).out_code;
  // var language = 'EN'
  var language = props.language;
  var group = router.query.group;
  var [accessReceive, setAccessReceive] = useState([]);

  const isMobile = useResponsive().isMobile;
  // console.log('innerwidth', isMobile)

  const debounceMountListReceivingHeader = useCallback(
    debounce(mountListReceiveHeader, 400),
    []
  );
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_RECEIVING")) {
        router.push("/403");
      }
      setAccessReceive((accessReceive = parsedAccess.LOGISTIC_RECEIVING))
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (!router.isReady) return;

    // setSearchGroup(1)
    // setInputSearch("")
    window.localStorage.removeItem("confirmPO");
    window.sessionStorage.removeItem("dataRecv");

    if (outcode === undefined) {
      router.push("/company-outlet-selection");
    } else {
      debounceMountListReceivingHeader(
        group,
        pt_id,
        outcode,
        searchGroup,
        inputSearch,
        params
      );
    }
  }, [router.isReady]);

  useEffect(() => {
    //reset page
    var resetpage = {
      page: 0,
      length: 5,
    };

    setParams((params = resetpage));

    setSearchGroup(1);
    setInputSearch((inputSearch = ""));
    document.getElementById("searchbar").value = "";
    // window.sessionStorage.removeItem('dataRecv');
    setDataAvailable(true);
    debounceMountListReceivingHeader(
      group,
      pt_id,
      outcode,
      searchGroup,
      inputSearch,
      params
    );
  }, [group]);

  // useEffect(() => {

  //   setInputSearch((inputSearch = ""))
  //   document.getElementById('searchbar').value = ''
  //   setDataAvailable(true)
  //   debounceMountListReceivingHeader(group, pt_id, outcode, searchGroup, inputSearch, params)

  // }, [searchGroup]);

  const [listReceivingHeader, setListReceivingHeader] = useState([]);
  var [dataAvailable, setDataAvailable] = useState(false);

  const [totalData, setTotalData] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    length: 5,
  });

  var [inputSearch, setInputSearch] = useState("");
  var [searchGroup, setSearchGroup] = useState(1);

  async function mountListReceiveHeader(
    group,
    pt,
    outcode,
    searchgroup,
    keyword,
    params
  ) {
    try {
      setDataAvailable((dataAvailable = true));
      // console.log('hit be', group, pt, outcode, searchgroup, keyword)
      const getReceivingHeader = await api.getReceivingHeader(
        group,
        pt,
        outcode,
        searchgroup,
        keyword,
        params
      );
      const { data, metadata, error } = getReceivingHeader.data;
      // console.log("data receiving header", getReceivingHeader);

      if (error.status === true) {
        displayToast("error", error.msg);
        if (error.code === 401) {
          displayToast("error", "Token is expired please login again !");
          window.sessionStorage.clear();
          // history.push('/#/login')
        }
      } else {
        if (metadata.Status === "OK") {
          setListReceivingHeader(data);
          setDataAvailable(false);
        } else {
          displayToast("error", metadata.Message);
          setDataAvailable(false);
          if (metadata.Message.toLowerCase().includes("expired")) {
            window.sessionStorage.clear();
            // history.push('/#/login')
          }
        }
        setTotalData(metadata.TotalData);
      }
    } catch (error) {
      console.log(error);
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

    setDataAvailable(true);
    debounceMountListReceivingHeader(
      group,
      pt_id,
      outcode,
      searchGroup,
      inputSearch,
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

    setDataAvailable(true);
    debounceMountListReceivingHeader(
      group,
      pt_id,
      outcode,
      searchGroup,
      inputSearch,
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
      setDataAvailable(true);
      debounceMountListReceivingHeader(
        group,
        pt_id,
        outcode,
        searchGroup,
        inputSearch,
        newParams
      );
    }
  };

  const getBadge = (data) => {
    if (data === "N") {
      return (
        <Chip
          label={language === "EN" ? "Not Confirmed" : "Belum Terkonfirmasi"}
          color="error"
          // sx={{bgcolor: 'red', color:'white'}}
        />
      );
    } else if (data === "P") {
      return (
        <Chip
          label={language === "EN" ? "Confirmed" : "Sudah Terkonfirmasi"}
          color="success"
        />
      );
    } else if (data === "C") {
      return (
        <Chip
          label={
            language === "EN" ? "Receive is Canceled" : "Receive Dibatalkan"
          }
          sx={{ bgcolor: "gold" }}
        />
      );
    } else if (data === "") {
      return (
        <Chip
          label={language === "EN" ? "Data is Invalid" : "Data Tidak Valid"}
          sx={{ bgcolor: "darkslategray", color: "white" }}
        />
      );
    }
  };

  const buttonPrint = (data) => {
    if (data.rcvh_suppliername === "") {
      return (
        <Button color="info" disabled variant="contained">
          <PrintIcon />
        </Button>
      );
    } else if (data.rcvh_suppliername !== "") {
      return (
        <Button
          color="info"
          variant="contained"
          onClick={changePageState("PRINT", { ...data })}
        >
          <PrintIcon />
        </Button>
      );
    }
  };

  const changePageState =
    (pageState, data = {}) =>
    () => {
      if (pageState === "DETAIL") {
        // console.log('FLAG : ', data.rcvh_flag)
        if (data.rcvh_flag === "P" || data.rcvh_flag === "C") {
          router.push(
            `/receiving/${router.query.group}/view/${data.rcvh_norecv}`
          );
          window.sessionStorage.setItem("dataRecv", JSON.stringify(data));
        } else {
          if(!accessReceive.includes("LOGISTIC_RECEIVING_CREATE")){ // 26/01/2023 kl gada akses create, ke view
            router.push(
              `/receiving/${router.query.group}/view/${data.rcvh_norecv}`
            );
          } else {
            router.push(`/receiving/${router.query.group}/create`);
            // window.sessionStorage.setItem('groupRecv', JSON.stringify(group));
            window.sessionStorage.setItem("dataRecv", JSON.stringify(data));
          }
        }
      } else if (pageState === "NEW") {
        router.push(`/receiving/${router.query.group}/create`);
        // window.sessionStorage.setItem('groupRecv', JSON.stringify(group));
      } else if (pageState === "PRINT") {
        if (data.rcvh_flag === "P") {
          router.push(
            `/receiving/${router.query.group}/print/${data.rcvh_norecv}`
          );
          window.sessionStorage.setItem("dataRecv", JSON.stringify(data));
        } else {
          displayToast(
            "error",
            "Cannot be printed because it has not been confirmed !"
          );
        }
      }
      // console.log('DATA RCVH', data.rcvh_flag);
    };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            {group === "1" ? "Receiving Apotek" : "Receiving Floor"}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Grid container justifyContent={"space-between"} display="flex">
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <TextField
            size="small"
            value={searchGroup}
            onChange={(e) => setSearchGroup(e.target.value)}
            sx={!isMobile ? { mr: 2 } : { mb: 1 }}
            displayEmpty
            select
          >
            <MenuItem value={1}>Receive No.</MenuItem>
            <MenuItem value={2}>PO No.</MenuItem>
          </TextField>
          <OutlinedInput
            fullWidth={isMobile && true}
            id="searchbar"
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
          md={4}
          lg={4}
          display={!isMobile && "flex"}
          justifyContent={!isMobile && "flex-end"}
        >
          {accessReceive.includes("LOGISTIC_RECEIVING_CREATE") && // 26/01/2023 hrs ada akses create
            <Button
              size="small"
              variant="contained"
              sx={!isMobile ? { height: "100%" } : { mt: 1 }}
              onClick={() =>
                router.push(`/receiving/${router.query.group}/create`)
              }
            >
              New Receive
            </Button>
          }
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Paper sx={{ width: "100%", my: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    No Recv.
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Supplier
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    No. PO
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Invoice No" : "No. Faktur"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Recv. Date" : "Tgl Recv"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Status
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Print
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
              ) : listReceivingHeader.length !== 0 ? (
                listReceivingHeader.map((item) => (
                  <TableRow key={item.rcvh_norecv}>
                    <TableCell>
                      <Link
                        // href={`/receiving/${router.query.group}/view/${item.rcvh_norecv}`}
                        onClick={changePageState("DETAIL", { ...item })}
                        sx={{ cursor: "pointer" }}
                      >
                        {item.rcvh_norecv}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      {item.rcvh_suppliername === ""
                        ? "-"
                        : item.rcvh_suppliername}
                    </TableCell>
                    <TableCell align="center">{item.rcvh_nopo}</TableCell>
                    <TableCell align="center">
                      {item.rcvh_nofaktur === "" ? "-" : item.rcvh_nofaktur}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(item.rcvh_tglrecv, "ddd MMMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      {getBadge(item.rcvh_flag)}
                    </TableCell>
                    <TableCell align="center">{buttonPrint(item)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={12}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, mt: 0.5, color: "gray" }}
                    >
                      {language === "EN" ? "NO DATA" : "TIDAK ADA DATA"}
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
    </Box>
  );
};

export default ReceivingHeader;
