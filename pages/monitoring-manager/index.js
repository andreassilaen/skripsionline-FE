import {
  Box,
  Paper,
  Table,
  TableHead,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Button,
  TextField,
  TableRow,
  TableCell,
  Typography,
  Modal,
  Divider,
  TableBody,
  TableFooter,
  MenuItem,
  Collapse,
  Fade,
  Grow,
  Zoom,
  Slide,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import qr from "../../services/qr";
import { debounce, set, isUndefined } from "lodash";
import LogoutIcon from "@mui/icons-material/Logout";
import { AddCircle, CheckBox } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import BackspaceIcon from "@mui/icons-material/Backspace";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from '@mui/icons-material/Info';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { formatDate } from "../../utils/text";
import { fontWeight } from "@mui/system";
import { useRouter } from "next/router";
import { getStorage } from "../../utils/storage";

const ScanNewBatch = () => {
  const styleModalErr = {
    position: "absolute",
    top: "30%",
    left: "60%",
    transform: "translate(-50%, -50%)",
    width: "35%",
    bgcolor: "background.paper",
    p: 4,
  };

  const styleModalStart = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "35%",
    bgcolor: "background.paper",
    p: 4,
  };

  const [selectProduct, setSelectProduct] = useState("");
  const [selectBatchNumber, setSelectBatchNumber] = useState("");
  const [modalScanBatch, setModalScanBatch] = useState(false);

  const [listMonitor, setListMonitor] = useState([]);
  const [listProduct, setListProduct] = useState([]);

  const [searchMonitorByDate, setSearchMonitorByDate] = useState("");

  const [filterByDateBool, setFilterByDateBool] = useState(false);

  const [dataScanStatus, setDataScanStatus] = useState([]);

  const [totalOnProcess, setTotalOnProcess] = useState("");
  const [totalDone, setTotalDone] = useState("");
  const [totalReject, setTotalReject] = useState("");
  const [totalUploaded, setTotalUploaded] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterRefresh, setFilterRefresh] = useState("");

  const [collapseDate, setCollapseDate] = useState(false);
  const [collapseRefresh, setCollapseRefresh] = useState(false);
  const [collapseAllData, setCollapseAllData] = useState(true);
  const [collapseEmpty, setCollapseEmpty] = useState(false);
  const [collapseDefault, setCollapseDefault] = useState(true);

  const debounceMountGetFilter = useCallback(debounce(mountGetFilter, 400));

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["QR_BPOM_MONITORING_MANAGER"].includes(
          "QR_BPOM_MONITORING_MANAGER_CREATE"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  async function mountGetFilter(procode, status, submitdate) {
    var date = formatDate(submitdate, "YYMMDD");
    try {
      const getFilter = await qr.getFilterHeader(procode, status, date);
      const { data } = getFilter.data;

      setListMonitor(data);
      setTotalOnProcess(data[0].onp);
      setTotalDone(data[0].dn);
      setTotalReject(data[0].rjt);
      setTotalUploaded(data[0].upd);
      console.log("list =>", data);
      setCollapseEmpty(false);
      if (getFilter.data.length < 0) {
        setCollapseEmpty(true);
      }
    } catch (error) {
      console.log("error getfilter", error);
      setCollapseEmpty(true);
    }
  }

  const [inputSearch, setInputSearch] = useState({
    pro_name: "",
    pro_code: "",
  });

  const router = useRouter();

  var myObject = {
    key: "something",
    "other-key": "something else",
    "another-key": "another thing",
  };
  var count = Object.keys(myObject).length;

  async function start() {
    if (
      (selectProduct === 0) &
      (selectProduct === 0) &
      (selectBatchNumber === "") &
      (selectBatchNumber === 0)
    ) {
      setModalScanBatch(true);
    }
  }

  const tableHeader = [
    {
      name: "Procode",
    },
    {
      name: "Product Name",
    },
    {
      name: "Batch Number",
    },
    {
      name: "Status",
    },
    {
      name: "Submitted On",
    },
  ];

  const debounceMountGetListBatchToMonitor = useCallback(
    debounce(mountGetListBatchToMonitor, 400)
  );

  async function mountGetListBatchToMonitor() {
    try {
      var i;
      const getBatchToMonitor = await qr.getListBatchToMonitor();
      const { data } = getBatchToMonitor.data;
      setTotalOnProcess(data[0].onp);
      setTotalDone(data[0].dn);
      setTotalReject(data[0].rjt);
      setTotalUploaded(data[0].upd);
      console.log("ListBatchToMonitor", getBatchToMonitor);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetListAllProduct = useCallback(
    debounce(mountGetListAllProduct, 400)
  );

  async function mountGetListAllProduct() {
    try {
      const getListProduct = await qr.getListAllProduct();

      const { data } = getListProduct.data;
      setListProduct(data);
      console.log("data getlistAllProduct", data);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetBatchMonitorByProcode = useCallback(
    debounce(mountGetBatchMonitorByProcode, 400)
  );

  async function mountGetBatchMonitorByProcode(procode) {
    try {
      const getBatchToReview = await qr.getBatchMonitorByProcode(procode);
      const { data } = getBatchToReview.data;
      setListMonitor(data);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetBatchMonitorByDate = useCallback(
    debounce(mountGetBatchMonitorByDate, 400)
  );

  async function mountGetBatchMonitorByDate(date) {
    try {
      const getBatchToReview = await qr.getBatchMonitorByDate(date);
      const { data } = getBatchToReview.data;
      setListMonitor(data);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetBatchMonitorByStatus = useCallback(
    debounce(mountGetBatchMonitorByStatus, 400)
  );

  async function mountGetBatchMonitorByStatus(statusscan) {
    try {
      const getBatchToReview = await qr.getBatchMonitorByStatus(statusscan);
      const { data } = getBatchToReview.data;
      setListMonitor(data);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountCollapseDate = useCallback(
    debounce(mountCollapseDate, 400)
  );

  async function mountCollapseDate() {}

  async function deleteDate() {
    setCollapseDate(false);
  }

  async function deleteRefresh() {
    setCollapseRefresh(false);
    setCollapseAllData(true);
    setCollapseEmpty(false);
    setFilterRefresh(null);
    setFilterDate(null);
    setFilterStatus("");
    setListMonitor([]);
    setInputSearch({
      ...inputSearch,
      pro_code: "",
      pro_name: "",
    });
    deleteDate();
  }

  async function getAllBatch() {
    debounceMountGetFilter("", "", "");

    setInputSearch({
      ...inputSearch,
      pro_code: "",
      pro_name: "",
    });
    setFilterStatus("");
    setFilterDate(null);
    deleteDate();

    setCollapseRefresh(true);
    setCollapseAllData(false);
  }

  // Sekali panggil
  useEffect(() => {
    debounceMountGetListBatchToMonitor();
    debounceMountGetListAllProduct();
    console.log("[X|>>>>>|] UseEffect Parent [|<<<<<<|X]");
  }, []);

  useEffect(() => {
    console.log(
      " **************************** UseEffect **************************** "
    );

    console.log(">> collapseDefault", collapseDefault); 

    if (inputSearch.pro_code !==""||inputSearch.pro_name !=="" || filterStatus !=="" ||  (filterDate !=="" && filterDate !== null)){
      console.log("| ceking IF ==> Filter terisi");
      debounceMountGetFilter(inputSearch.pro_code, filterStatus, filterDate);
      setCollapseAllData(true);
      setCollapseDefault(false);
      // if (){

      // }
    } else if (inputSearch.pro_code ===""&&inputSearch.pro_name ===""&&filterStatus ==="" && (filterDate !=="" || filterDate !== null) && (collapseAllData === true || collapseRefresh ===false)){
      console.log("| ceking IF ==> Filter kosong");
      setListMonitor([]);
      setCollapseRefresh(false);
      setCollapseEmpty(false);
      setCollapseDefault(true);
      setCollapseAllData(true);
      if (collapseAllData === true) {
        setCollapseRefresh(false);

        console.log("| ceking IF ==> Default");
      }
    } else if (collapseAllData === false) {
      console.log("| ceking IF ==> Get ALLData ");
    }

    var date = formatDate(filterDate, "YYMMDD");
    if (inputSearch.pro_code !== "" || filterStatus !== "" || date !== "") {
      setCollapseRefresh(true);
    }

    console.log("| inputSearch.pro-code +>", inputSearch.pro_code);
    console.log("| inputSearch.pro-name +>", inputSearch.pro_name);
    console.log("| filterStatus +>", filterStatus);
    console.log("| filterDate +>", filterDate);
    console.log("| date +>", date);
    console.log("| collapse Date", collapseDate);
    console.log("| collapse Refresh", collapseRefresh);
    console.log("| listMonitor ", listMonitor);
    console.log(" ******************************************************** ");
  }, [inputSearch.pro_code, inputSearch.pro_name, filterStatus, filterDate, collapseDate, collapseRefresh, collapseDefault]);




  const listStatus = [
    { value: "", label: "None" },
    { value: "O", label: "O" },
    { value: "D", label: "D" },
    { value: "R", label: "R" },
    { value: "U", label: "U" },
  ];

  const debounceMountGenerateCSVBpom = useCallback(
    debounce(mountGenerateCSVBpom, 400)
  );

  async function mountGenerateCSVBpom(scanid) {
    try {
      var i;
      const generateCSVBPOM = await qr.generateCSVBPOM(scanid);
    } catch (error) {
      console.log(error);
    }
  }

  async function detailMonitoring(item) {
    router.push(`/monitoring-manager/${item.scan_id}`);
  }

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Grid container justifyContent={"space-between"} sx={{ margin: "1%" }}>
        <Grid container item xs={10}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mt: 0.5,
              textAlign: "left",
              ml: 2,
              mb: 1,
            }}
          >
            Monitoring Manager
          </Typography>
        </Grid>
      </Grid>
      {/* ------------------------------------------------------------ */}

      <Grid container sx={{ mb: 5 }}>
        <Grid
          container
          justifyContent={"space-between"}
          spacing={2}
          sx={{ marginBottom: "1%" }}
        >
          <Grid item flex={2} sx={{ ml: 3 }}>
            <Typography
              sx={{
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              On Process
            </Typography>
            <TextField
              InputProps={{
                sx: {
                  "& input": {
                    textAlign: "center",
                  },
                  fontSize: {
                    lg: 30,
                    md: 20,
                    sm: 20,
                    xs: 10,
                  },
                  fontWeight: 700,
                },
              }}
              sx={{
                width: "100%",
                float: "center",
                fontWeight: 700,
              }}
              disabled
              value={totalOnProcess !== "" ? totalOnProcess : "-"}
            ></TextField>
          </Grid>
          <Grid item flex={2}>
            <Typography
              sx={{
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              Saved
            </Typography>
            <TextField
              InputProps={{
                sx: {
                  "& input": {
                    textAlign: "center",
                  },
                  fontSize: {
                    lg: 30,
                    md: 20,
                    sm: 20,
                    xs: 10,
                  },
                  fontWeight: 700,
                },
              }}
              sx={{ width: "100%", fontWeight: 600 }}
              disabled
              value={totalReject !== "" ? totalReject : "-"}
            ></TextField>
          </Grid>
          <Grid item flex={2}>
            <Typography
              sx={{
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              Submitted
            </Typography>
            <TextField
              InputProps={{
                sx: {
                  "& input": {
                    textAlign: "center",
                  },
                  fontSize: {
                    lg: 30,
                    md: 20,
                    sm: 20,
                    xs: 10,
                  },
                  fontWeight: 700,
                },
              }}
              sx={{ width: "100%" }}
              disabled
              value={totalDone !== "" ? totalDone : "-"}
            ></TextField>
          </Grid>
          <Grid item flex={2} sx={{ mr: 2 }}>
            <Typography
              sx={{
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              Uploaded
            </Typography>
            <TextField
              InputProps={{
                sx: {
                  "& input": {
                    textAlign: "center",
                  },
                  fontSize: {
                    lg: 30,
                    md: 20,
                    sm: 20,
                    xs: 10,
                  },
                  fontWeight: 700,
                },
              }}
              sx={{ width: "100%", height: "100%" }}
              disabled
              value={totalUploaded !== "" ? totalUploaded : "-"}
            ></TextField>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 1 }}>
          <Grid item flex={2}>
            <Autocomplete
              options={listProduct}
              sx={{ backgroundColor: "white", ml: 3, mt: 5, width: "100%" }}
              getOptionLabel={(option) =>
                `${option.pro_name} - ${option.pro_code}`
              }
              isOptionEqualToValue={(option, value) => {
                option.pro_code === value.pro_code;
                option.pro_name === value.pro_name;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Filter by Product..."
                />
              )}
              onChange={(event, newValue) => {
                setInputSearch({
                  ...inputSearch,
                  pro_code: newValue === null ? "" : newValue.pro_code,
                  pro_name: newValue === null ? "" : newValue.pro_name,
                });
              }}
              value={inputSearch.pro_name === "" ? null : inputSearch}
            />
          </Grid>

          <Grid item flex={2}>
            <FormControl fullWidth sx={{ ml: 5, mt: 5, width: "100%" }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                label="Filter by Status"
                size="small"
                value={filterStatus}
              >
                {listStatus &&
                  listStatus.map((item) => (
                    <MenuItem
                      onClick={() => {
                        setFilterStatus(item.value);
                      }}
                      key={item}
                      value={item.value}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item flex={2}>
            <FormControl fullWidth sx={{ ml: 7, mt: 5, width: "100%" }}>
              <DesktopDatePicker
                label="Filter by Date"
                value={filterDate}
                onChange={(newValue) => {
                  newValue !== null || newValue === ""
                    ? (setFilterDate(newValue), setCollapseDate(true))
                    : (setFilterDate(newValue), setCollapseDate(false));
                }}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    sx={{
                      background: "white",
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Collapse in={collapseDate}>
            <Grid item flex={2}>
              <FormControl
                fullWidth
                sx={{
                  ml: -3,
                  mt: 5.6,
                  width: "2%",
                  height: "2%",
                }}
              >
                <Button
                  fullWidth
                  onClick={() => {
                    setFilterDate(null), deleteDate();
                  }}
                  sx={{
                    width: 1,
                    height: "1%",
                    borderRadius: 100,

                    maxWidth: "30px",
                    maxHeight: "30px",
                    minWidth: "30px",
                    minHeight: "30px",
                  }}
                >
                  <BackspaceIcon
                    sx={{ fontSize: 20, color: "grey" }}
                    size="small"
                  />
                </Button>
              </FormControl>
            </Grid>
          </Collapse>

          <Grow direction="down" in={collapseRefresh}>
            <Grid item flex={2}>
              <FormControl
                fullWidth
                sx={{
                  ml: 6,
                  mt: 5.6,
                  width: "2%",
                  height: "2%",
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    deleteRefresh();
                  }}
                  sx={{
                    width: 1,
                    height: "1%",
                    backgroundColor: "darkred",

                    maxWidth: "90px",
                    maxHeight: "30px",
                    minWidth: "90px",
                    minHeight: "30px",
                  }}
                >
                  CLEAR
                </Button>
              </FormControl>
            </Grid>
          </Grow>

          <Grow in={collapseAllData}>
            <Grid item flex={1}>
              <FormControl
                fullWidth
                sx={{
                  ml: 6,
                  mt: 5.6,
                  width: "2%",
                  height: "2%",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => {
                    //  deleteRefresh();
                    getAllBatch();
                  }}
                  sx={{
                    minWidth: "150px",
                    minHeight: "30px",
                    backgroundColor: "teal",
                  }}
                >
                  ALL DATA
                </Button>
              </FormControl>
            </Grid>
          </Grow>

          <Grid item flex={2}></Grid>
        </Grid>
      </Grid>

      {/* ------------------------------------------------------------ */}
      <Paper sx={{ mt: 3, ml: 3, mr: 2 }}>
        <Divider width="93%" objectFit="contain" sx={{ mt: 2 }} />
        <Divider width="93%" objectFit="contain" />
        <Table size="small">
          <TableHead>
            <TableRow>
              {tableHeader &&
                tableHeader.map((head, index) => (
                  <TableCell
                    sx={{
                      fontWeight: "600",
                    }}
                    key={index}
                  >
                    {head.name}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {listMonitor &&
              listMonitor.map((item, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>{item.scan_procode}</TableCell>
                    <TableCell>{item.scan_proname}</TableCell>
                    <TableCell>{item.scan_batch}</TableCell>
                    <TableCell>{item.scan_status}</TableCell>
                    <TableCell>
                      {item.scan_submitdate === "" ||
                      item.scan_submitdate === null
                        ? "-"
                        : formatDate(
                            item.scan_submitdate,
                            "DD MMMM YYYY HH:mm"
                          )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{ mr: 2, backgroundColor: "#EDBE4B" }}
                        onClick={() => detailMonitoring(item)}
                      >
                        Detail
                      </Button>
                      <Button
                        parameter
                        variant="contained"
                        sx={{ backgroundColor: "#4BA1B4", mr: 2 }}
                        size="large"
                        onClick={() =>
                          debounceMountGenerateCSVBpom(item.scan_id)
                        }
                      >
                        Export
                      </Button>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
          <TableFooter></TableFooter>

          <Collapse in={collapseEmpty}>
            <Grid
              sx={{
                width: "100%",
                ml: "190%",
              }}
            >
              <Grid
                sx={{
                  mt: 6,
                }}
              >
                <InfoIcon
                  sx={{
                    mt: 2,
                  }}
                />
              </Grid>
              <Grid sx={{}}>
                <Typography
                  sx={{
                    mb: "30%",
                    width: "100%",
                  }}
                >
                  Data not found.
                </Typography>
              </Grid>
            </Grid>
            </Collapse>

            <Collapse in={collapseDefault}>
            <Grid
            sx={{
              // border:"2px solid red",
              width:"100%",
              ml:"200%"}}>
                <Grid
                sx={{ 
                // border:"2px solid red
                mt:6,}}>
                <EmojiEmotionsIcon
                sx={{ 
                mt:2,
                color:"teal",
                // border:"2px solid black"
                }}/>
                </Grid>
                <Grid sx={{ 
                  // border:"2px solid blue"
                  }}>
               
              <Typography
              sx={{
                // border:"2px solid red",
                mb:"30%",
                // ml:"200%",
                width:"100%",
                // border:"2px solid red",
                }}> 
                
                Choose Filter First.
              </Typography>

              </Grid>
            </Grid>
            </Collapse>
        </Table>
      </Paper>
    </Box>
  );
};

export default ScanNewBatch;
