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

import api from "../../services/tukarguling";
// import Link from "../../utils/link";
import { formatDate } from "../../utils/text";
import useToast from "../../utils/toast";
import useResponsive from "../../utils/responsive";
import { getStorage } from "../../utils/storage";

import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import SyncIcon from "@mui/icons-material/Sync";

const TukarGulingHeader = (props) => {
  const router = useRouter();
  const [displayToast] = useToast();

  const pt_id = JSON.parse(getStorage("pt")).pt_id;
  const outcode = JSON.parse(getStorage("outlet")).out_code;

  var language = props.language;
  const isMobile = useResponsive().isMobile;

  const debounceMountListTukarGulingHeader = useCallback(
    debounce(mountListTukarGulingHeader, 400),
    []
  );

  const debounceMountCheckUnprocess = useCallback(
    debounce(mountCheckUnprocess, 400),
    []
  );

  const debounceMountDeleteUnprocess = useCallback(
    debounce(mountDeleteUnprocess, 400),
    []
  );

  useEffect(() => {
    if (!router.isReady) return;

    window.sessionStorage.removeItem("dataRecv");
    window.sessionStorage.removeItem("dataTG");
    window.sessionStorage.removeItem("groupProd");
    window.sessionStorage.removeItem("exchangeID");

    debounceMountListTukarGulingHeader(
      pt_id,
      outcode,
      selectedTGType,
      selectedFilter,
      inputSearch,
      searchGroup,
      params
    );
  }, [router.isReady]);

  const [listTukarGuling, setListTukarGuling] = useState([]);
  var [dataAvailable, setDataAvailable] = useState(false);
  var [loading, setLoading] = useState(false);

  const [totalData, setTotalData] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    length: 5,
  });

  var [inputSearch, setInputSearch] = useState("");
  var [searchGroup, setSearchGroup] = useState("0");

  var [selectedTGType, setSelectedTGType] = useState("1");
  var [selectedFilter, setSelectedFilter] = useState("");
  const [modalKonfirmasi, setModalKonfirmasi] = useState(false);
  var [modalTitle, setModalTitle] = useState("");
  var [modalMessage, setModalMessage] = useState("");
  var [modalType, setModalType] = useState("");
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_TUKAR_GULING")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    setInputSearch((inputSearch = ""));
    document.getElementById("searchbar").value = "";

    if (searchGroup === "0") {
      setDataAvailable(true);
      debounceMountListTukarGulingHeader(
        pt_id,
        outcode,
        selectedTGType,
        selectedFilter,
        inputSearch,
        "",
        params
      );
    }
  }, [searchGroup]);

  async function mountListTukarGulingHeader(
    pt,
    outcode,
    group,
    filter,
    keyword,
    searchtype,
    params
  ) {
    try {
      setDataAvailable((dataAvailable = true));
      const getTukarGulingHeader = await api.getTukarGuling(
        pt,
        outcode,
        group,
        filter,
        keyword,
        searchtype,
        params
      );
      const { data, metadata, error } = getTukarGulingHeader.data;
      // console.log("data tukarguling header", getTukarGulingHeader);

      if (error.status === true) {
        displayToast("error", error.msg);
        if (error.code === 401) {
          displayToast("error", "Token is expired please login again !");
          window.sessionStorage.clear();
          //   history.push('/#/login')
        }
      } else {
        setListTukarGuling(data);
      }

      setTotalData(metadata.totaldata);
      setDataAvailable(false);
    } catch (error) {
      console.log(error);
      setDataAvailable(false);
      displayToast("error", error.code);
    }
  }

  async function mountCheckUnprocess(group, pt, outcode) {
    try {
      setLoading((loading = true));
      const checkUnprocess = await api.checkUnprocess(group, pt, outcode);
      const { metadata } = checkUnprocess.data;
      // console.log("check unprocess", checkUnprocess);

      if (metadata.Status === "Edit") {
        setModalType("EDIT");
        setModalTitle("Notice");
        setModalMessage(
          metadata.Message +
            ". " +
            "Please process it first before adding new Tukar Guling."
        );
        setModalKonfirmasi(true);
      } else if (metadata.Status === "Delete") {
        setModalType("DELETE");
        setModalTitle("Delete Tukar Guling Confirmation");
        setModalMessage(
          metadata.Message + ". " + "Do you want to delete this Tukar Guling?"
        );
        setModalKonfirmasi(true);
      } else {
        router.push(`/tukarguling/create/${group}`);
      }
      setLoading((loading = false));
    } catch (error) {
      console.log(error);
      setLoading((loading = false));
      displayToast("error", error.code);
    }
  }

  async function mountDeleteUnprocess(outcode, pt, group) {
    try {
      setLoading((loading = true));
      // console.log('hit be delete unprocess', outcode, pt, group)
      const deleteUnprocess = await api.autoDeleteUnprocess(outcode, pt, group);
      const { metadata } = deleteUnprocess.data;
      // console.log("delete unprocess", deleteUnprocess);

      if (metadata.Status === "OK") {
        setModalKonfirmasi(false);
        router.push(`/tukarguling/create/${group}`);
      } else {
        debounceMountListTukarGulingHeader(
          pt,
          outcode,
          group,
          selectedFilter,
          inputSearch,
          searchGroup,
          params
        );
      }
      setLoading((loading = false));
    } catch (error) {
      console.log(error);
      setLoading((loading = false));
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
    debounceMountListTukarGulingHeader(
      pt_id,
      outcode,
      selectedTGType,
      selectedFilter,
      inputSearch,
      "",
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
    debounceMountListTukarGulingHeader(
      pt_id,
      outcode,
      selectedTGType,
      selectedFilter,
      inputSearch,
      "",
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
      debounceMountListTukarGulingHeader(
        pt_id,
        outcode,
        selectedTGType,
        selectedFilter,
        inputSearch,
        searchGroup,
        newParams
      );
    }
  };

  function setTGGroup(event) {
    setSelectedTGType((selectedTGType = event.target.value));

    const newParams = {
      ...params,
      page: 0,
      length: params.length,
    };
    setParams(newParams);
    setDataAvailable(true);
    debounceMountListTukarGulingHeader(
      pt_id,
      outcode,
      selectedTGType,
      selectedFilter,
      inputSearch,
      "",
      newParams
    );
  }

  function setFilter(event) {
    setSelectedFilter((selectedFilter = event.target.value));

    const newParams = {
      ...params,
      page: 0,
      length: params.length,
    };
    setParams(newParams);
    setDataAvailable(true);
    debounceMountListTukarGulingHeader(
      pt_id,
      outcode,
      selectedTGType,
      selectedFilter,
      inputSearch,
      "",
      newParams
    );
  }

  function selectSearchGroup(event) {
    setSearchGroup((searchGroup = event.target.value));
  }

  function canBeAdd() {
    debounceMountCheckUnprocess(selectedTGType, pt_id, outcode);
  }

  function deleteUnprocess() {
    debounceMountDeleteUnprocess(outcode, pt_id, selectedTGType);
  }

  const changePageDetail =
    (data = {}) =>
    () => {
      if (data.exchangestatus === "P" || data.exchangestatus === "R") {
        router.push(`/tukarguling/view/${selectedTGType}/${data.exchangeid}`);
        // window.sessionStorage.setItem('dataTG', JSON.stringify(data));
      } else {
        router.push(`/tukarguling/create/${selectedTGType}`);
        window.sessionStorage.setItem("dataTG", JSON.stringify(data));
      }
    };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Tukar Guling
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <Select
              value={selectedTGType}
              onChange={(e) => setTGGroup(e)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={"1"}>Apotek</MenuItem>
              <MenuItem value={"2"}>Floor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={3}
          lg={3}
          display={"flex"}
          justifyContent={"flex-end"}
        >
          <Button
            variant="contained"
            sx={{ height: "100%", minWidth: 150 }}
            onClick={() => canBeAdd()}
          >
            {language === "EN" ? "Add" : "Tambah"}
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container justifyContent={"space-between"} display="flex">
        <Grid item xs={12} sm={12} md={5} lg={5}>
          <TextField
            size="small"
            value={searchGroup}
            onChange={(e) => selectSearchGroup(e)}
            displayEmpty
            select
            sx={{ minWidth: 150, mr: 2 }}
          >
            <MenuItem value={"0"}>Search By</MenuItem>
            <MenuItem value={"ID"}>ID</MenuItem>
            <MenuItem value={"SUPCODE"}>
              {language === "EN" ? "Supcode" : "Kode Supplier"}
            </MenuItem>
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
            sx={!isMobile ? { bgcolor: "white" } : { mt: 1 }}
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
          sx={isMobile && { mt: 1 }}
        >
          <FormControl sx={{ minWidth: 150 }} size="small">
            <Select
              value={selectedFilter}
              onChange={(e) => setFilter(e)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={""}>All</MenuItem>
              <MenuItem value={"P"}>Print</MenuItem>
              <MenuItem value={"R"}>Received</MenuItem>
              <MenuItem value={"N"}>Not Process</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Paper sx={{ width: "100%", my: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Date" : "Tanggal"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Supcode" : "Kode Supplier"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Supname" : "Nama Supplier"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Status
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
              ) : listTukarGuling.length !== 0 ? (
                listTukarGuling.map((item) => (
                  <TableRow key={item.exchangeid}>
                    <TableCell>
                      <Link
                        onClick={changePageDetail({ ...item })}
                        sx={{ fontWeight: 600, cursor: "pointer" }}
                      >
                        {item.exchangeid}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {formatDate(item.exchangedate, "ddd MMMM DD YYYY")}
                    </TableCell>
                    <TableCell>
                      {item.supcode === "" ? "-" : item.supcode}
                    </TableCell>
                    <TableCell>
                      {item.supname === "" ? "-" : item.supname}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          item.exchangestatus === "P"
                            ? "Print"
                            : item.exchangestatus === "R"
                            ? "Received"
                            : "Not Process"
                        }
                        color={
                          item.exchangestatus === "P"
                            ? "info"
                            : item.exchangestatus === "R"
                            ? "success"
                            : "error"
                        }
                      />
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

      {/* MODAL KONFIRMASI */}
      <Dialog
        open={modalKonfirmasi}
        onClose={() => setModalKonfirmasi(false)}
        fullWidth
        PaperProps={{ sx: { position: "fixed", top: 10 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>{modalTitle}</DialogTitle>
        <Divider sx={{ mb: 1 }} />
        <DialogContent>
          <Typography variant="body1">{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            style={modalType === "DELETE" ? { display: "none" } : {}}
            variant="contained"
            size="medium"
            disabled={loading}
            onClick={() => setModalKonfirmasi(false)}
          >
            Close
          </Button>
          <Button
            style={modalType === "EDIT" ? { display: "none" } : {}}
            variant="contained"
            size="medium"
            color="success"
            disabled={loading}
            onClick={() => deleteUnprocess()}
          >
            {!loading && <span>Yes</span>}
            {loading && <SyncIcon />}
            {loading && <span>Processing...</span>}
          </Button>
          {!loading && (
            <Button
              style={modalType === "EDIT" ? { display: "none" } : {}}
              variant="contained"
              size="medium"
              color="error"
              onClick={() => setModalKonfirmasi(false)}
            >
              No
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* MODAL KONFIRMASI */}
    </Box>
  );
};

export default TukarGulingHeader;
