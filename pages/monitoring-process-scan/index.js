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
  Divider,
  TableBody,
  TableFooter,
  MenuItem,
  Collapse,
  Grow,
  Autocomplete,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import qr from "../../services/qr";
import { debounce, set, isUndefined } from "lodash";
import BackspaceIcon from "@mui/icons-material/Backspace";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import InfoIcon from "@mui/icons-material/Info";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { formatDate } from "../../utils/text";
import { fontWeight } from "@mui/system";
import { useRouter } from "next/router";
import { getStorage } from "../../utils/storage";

const MonitoringProcessScan = () => {
  const [totalOnProcess, setTotalOnProcess] = useState("");
  const [totalDone, setTotalDone] = useState("");
  const [totalReject, setTotalReject] = useState("");
  const [totalUploaded, setTotalUploaded] = useState("");

  const router = useRouter();

  ///----- buat filter & collapse
  const [inputSearch, setInputSearch] = useState({
    pro_name: "",
    pro_code: "",
  });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterRefresh, setFilterRefresh] = useState("");

  const [collapseDate, setCollapseDate] = useState(false);
  const [collapseRefresh, setCollapseRefresh] = useState(false);
  const [collapseAllData, setCollapseAllData] = useState(true);
  const [collapseEmpty, setCollapseEmpty] = useState(false);

  const [collapseDefault, setCollapseDefault] = useState(true);
  const [listProduct, setListProduct] = useState([]);
  const [listMonitor, setListMonitor] = useState([]);

  const debounceMountGetFilter = useCallback(debounce(mountGetFilter, 400));

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["QR_BPOM_MONITORING_OPERATOR"].includes(
          "QR_BPOM_MONITORING_OPERATOR_CREATE"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  async function deleteDate() {
    setCollapseDate(false);
  }

  async function mountGetFilter(procode, status, submitdate) {
    console.log("=== === Func GetFilter === ===");
    console.log("procode", procode);
    console.log("status", status);
    console.log("date", submitdate);
    var date = formatDate(submitdate, "YYMMDD");
    console.log("datebaru", date);
    try {
      const getFilter = await qr.getFilterHeader(procode, status, date);
      const { data } = getFilter.data;

      if (data !== null) {
        setListMonitor(data);
        setTotalOnProcess(data[0].onp);
        setTotalDone(data[0].dn);
        setTotalReject(data[0].rjt);
        setTotalUploaded(data[0].upd);
        console.log("list =>", data);
        setCollapseEmpty(false);
        setCollapseDefault(false);
        if (getFilter.data.length < 0) {
          console.log("cek collapse Empty");
          setCollapseEmpty(true);
          setCollapseDefault(false);
        }
      } else {
        setCollapseEmpty(true);
        setCollapseDefault(false);
      }
    } catch (error) {
      console.log("error getFilter", error);
      setCollapseEmpty(true);
    }
    console.log("============================");
  }

  async function deleteRefresh() {
    setCollapseRefresh(false);
    setCollapseAllData(true);
    setCollapseEmpty(false);
    setCollapseDefault(true);
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
    // debounceMountGetFilter(inputSearch.pro_code, filterStatus, filterDate);

    console.log(">> collapseDefault", collapseDefault);

    if (
      inputSearch.pro_code !== "" ||
      inputSearch.pro_name !== "" ||
      filterStatus !== "" ||
      (filterDate !== "" && filterDate !== null)
    ) {
      console.log("| ceking IF ==> Filter terisi");
      debounceMountGetFilter(inputSearch.pro_code, filterStatus, filterDate);
      setCollapseAllData(true);
    } else if (
      inputSearch.pro_code === "" &&
      inputSearch.pro_name === "" &&
      filterStatus === "" &&
      (filterDate !== "" || filterDate !== null) &&
      (collapseAllData === true || collapseRefresh === false)
    ) {
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
  }, [
    inputSearch.pro_code,
    inputSearch.pro_name,
    filterStatus,
    filterDate,
    collapseDate,
    collapseRefresh,
    collapseDefault,
  ]);

  // const [status, setStatus] = useState("");

  var myObject = {
    key: "something",
    "other-key": "something else",
    "another-key": "another thing",
  };

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
    } catch (error) {
      console.log(error);
    }
  }

  const listStatus = [
    { value: "", label: "None" },
    { value: "O", label: "O" },
    { value: "D", label: "D" },
    { value: "R", label: "R" },
    { value: "U", label: "U" },
  ];

  async function detailMonitoring(item) {
    router.push(`/monitoring-process-scan/${item.scan_id}`);
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
            Monitoring Process Scan
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
          <Grid item flex={7}>
            <Autocomplete
              options={listProduct}
              sx={{ backgroundColor: "white", ml: 3, mt: 5, width: "100%" }}
              getOptionLabel={(option) =>
                `${option.pro_name} [${option.pro_code}]`
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
                }),
                  setCollapseRefresh(true);
              }}
              value={inputSearch.pro_name === "" ? null : inputSearch}
            />
          </Grid>

          <Grid item flex={4}>
            <FormControl
              fullWidth
              sx={{ ml: 5, mt: 5, width: "100%" }}
              size="small"
            >
              <InputLabel>Filter by Status</InputLabel>
              <Select label="Filter by Status" value={filterStatus}>
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

          <Grid item flex={4}>
            <FormControl fullWidth sx={{ ml: 7, mt: 5, width: "110%" }}>
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
                  ml: -1,
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
                  width: "1%",
                  height: "2%",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => {
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
          <Grid item flex={2}></Grid>
        </Grid>
      </Grid>

      {/* ------------------------------------------------------------ */}
      <Paper sx={{ mt: 3, ml: 3, mr: 2 }}>
        <Divider width="100%" objectFit="contain" sx={{ mt: 2 }} />
        <Divider width="100%" objectFit="contain" />
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
                <TableRow key={index}>
                  <TableCell>{item.scan_procode}</TableCell>
                  <TableCell>{item.scan_proname}</TableCell>
                  <TableCell>{item.scan_batch}</TableCell>
                  <TableCell>{item.scan_status}</TableCell>
                  <TableCell>
                    {item.scan_submitdate === "" ||
                    item.scan_submitdate === null
                      ? "-"
                      : formatDate(item.scan_submitdate, "DD MMMM YYYY HH:mm")}
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
                  </TableCell>
                </TableRow>
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
            </Grid>
          </Collapse>

          <Collapse in={collapseDefault}>
            <Grid
              sx={{
                // border:"2px solid red",
                width: "100%",
                ml: "200%",
              }}
            >
              <Grid
                sx={{
                  // border:"2px solid red
                  mt: 6,
                }}
              >
                <EmojiEmotionsIcon
                  sx={{
                    mt: 2,
                    color: "teal",
                    // border:"2px solid black"
                  }}
                />
              </Grid>
              <Grid
                sx={
                  {
                    // border:"2px solid blue"
                  }
                }
              >
                <Typography
                  sx={{
                    // border:"2px solid red",
                    mb: "30%",
                    // ml:"200%",
                    width: "100%",
                    // border:"2px solid red",
                  }}
                >
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

export default MonitoringProcessScan;
