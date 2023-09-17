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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import qr from "../../services/qr";
import { debounce, set } from "lodash";
import LogoutIcon from "@mui/icons-material/Logout";
import { AddCircle, CheckBox } from "@mui/icons-material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { formatDate } from "../../utils/text";
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
  const [listMonitorStatus, setListMonitorStatus] = useState([]);
  const [listProduct, setListProduct] = useState([]);

  const [searchMonitorByDate, setSearchMonitorByDate] = useState("");

  const [filterByDateBool, setFilterByDateBool] = useState(false);

  const [dataScanStatus, setDataScanStatus] = useState([]);

  // const [status, setStatus] = useState("");

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

  // const listMonitor = [
  //   {
  //     scan_procode: 1,
  //     scan_proname: "Panadol Merah",
  //     scan_batch: "X3",
  //     scan_status: "O",
  //     scan_submitteddate: "2023-02-17 00:00:00",
  //   },
  //   {
  //     scan_procode: 1,
  //     scan_proname: "Panadol Merah",
  //     scan_batch: "X3",
  //     scan_status: "O",
  //     scan_submitteddate: "2023-02-17 00:00:00",
  //   },
  //   {
  //     scan_procode: 1,
  //     scan_proname: "Panadol Merah",
  //     scan_batch: "X3",
  //     scan_status: "O",
  //     scan_submitteddate: "2023-02-17 00:00:00",
  //   },
  //   {
  //     scan_procode: 1,
  //     scan_proname: "Panadol Merah",
  //     scan_batch: "X3",
  //     scan_status: "O",
  //     scan_submitteddate: "2023-02-17 00:00:00",
  //   },
  //   {
  //     scan_procode: 1,
  //     scan_proname: "Panadol Merah",
  //     scan_batch: "X3",
  //     scan_status: "O",
  //     scan_submitteddate: "2023-02-17 00:00:00",
  //   },
  // ];

  const debounceMountGetListBatchToMonitor = useCallback(
    debounce(mountGetListBatchToMonitor, 400)
  );

  async function mountGetListBatchToMonitor() {
    try {
      var i;
      const getBatchToMonitor = await qr.getListBatchToMonitor();
      const { data } = getBatchToMonitor.data;
      // const countData = Object.keys(data).length;
      // console.log("lengthjsonData", countData);
      // console.log("datamountGetListBatchToMonitor", data);
      // console.log("datamountGetListBatchToMonitorStatus", data.scan_status);
      // console.log("callDataStatus", data[0].scan_status);
      // for (i = 0; i <= countData; i++) {
      //   dataScanStatus = data[i].scan_procode;
      //   console.log("dataFor", i);
      // }
      setListMonitor(data);
      setListMonitorStatus(data);
      console.log(getBatchToMonitor);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log(listMonitor.length);
  }, [listMonitor]);

  const debounceMountGetListAllProduct = useCallback(
    debounce(mountGetListAllProduct, 400)
  );

  async function mountGetListAllProduct() {
    try {
      const getListProduct = await qr.getListAllProduct();
      const { data } = getListProduct.data;
      setListProduct(data);
      // setListApproval(data);
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

  useEffect(() => {
    debounceMountGetListBatchToMonitor();
    debounceMountGetListAllProduct();
    searchMonitorByDate;
    if (searchMonitorByDate !== 0 && searchMonitorByDate !== "") {
      console.log("searchApprovalByDate", searchMonitorByDate);
      debounceMountGetBatchMonitorByDate(
        formatDate(searchMonitorByDate, "YYMMDD")
      );
    }
    console.log("lengthjson", count);
    console.log("dataStatus", dataScanStatus);
  }, [searchMonitorByDate, count, dataScanStatus]);

  const listStatus = [
    { value: "O", label: "O" },
    { value: "D", label: "D" },
    { value: "R", label: "O" },
    { value: "U", label: "U" },
  ];

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

      <Grid container>
        <Grid
          container
          justifyContent={"space-between"}
          spacing={2}
          sx={{ marginBottom: "1%" }}
        >
          <Grid item flex={2} sx={{ ml: 3 }}>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                // ml: 2,
              }}
            >
              On Process
            </Typography>
            <TextField
              sx={{
                width: "100%",
                // maxWidth: "30px",
                // maxHeight: "30px",
                // minWidth: "30px",
                // minHeight: "30px",
                float: "center",
              }}
              disabled
              value={
                listMonitorStatus.scan_status === "O"
                  ? Object.keys(listMonitorStatus.scan_status).length
                  : "-"
              }
              // size=""
            ></TextField>
          </Grid>
          <Grid item flex={2}>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                // ml: 3,
              }}
            >
              Saved
            </Typography>
            <TextField sx={{ width: "100%" }}></TextField>
          </Grid>
          <Grid item flex={2}>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                // ml: 2,
              }}
            >
              Submitted
            </Typography>
            <TextField sx={{ width: "100%" }}></TextField>
          </Grid>
          <Grid item flex={2} sx={{ mr: 2 }}>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                // ml: 3,
              }}
            >
              Uploaded
            </Typography>
            <TextField sx={{ width: "100%", height: "100%" }}></TextField>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 1 }}>
          <Grid item flex={2}>
            <FormControl fullWidth sx={{ ml: 3, mt: 5, width: "100%" }}>
              <InputLabel id="bulan-label">Filter by Product</InputLabel>
              <Select label="Filter by Product" size="small">
                {listProduct &&
                  listProduct.map((item) => (
                    <MenuItem
                      // onClick={() => filterByProduct(item)}
                      onClick={() =>
                        debounceMountGetBatchMonitorByProcode(item.pro_code)
                      }
                      key={item}
                      value={item}
                    >
                      {/* {item.comco} -  */}
                      {item.pro_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item flex={2}>
            <FormControl fullWidth sx={{ ml: 5, mt: 5, width: "100%" }}>
              <InputLabel id="bulan-label">Filter by Status</InputLabel>
              <Select label="Filter by Product" size="small">
                {listStatus &&
                  listStatus.map((item) => (
                    <MenuItem
                      onClick={() =>
                        debounceMountGetBatchMonitorByStatus(item.value)
                      }
                      key={item}
                      value={item}
                    >
                      {/* {item.comco} -  */}
                      {item.value}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item flex={2}>
            <FormControl fullWidth sx={{ ml: 7, mt: 5, width: "100%" }}>
              {/* <InputLabel id="bulan-label">Filter by Date</InputLabel> */}

              <DesktopDatePicker
                label="Filter by Date"
                value={searchMonitorByDate}
                onChange={(newValue) =>
                  setSearchMonitorByDate(newValue) && setFilterByDateBool(true)
                }
                // onClick={() => {
                //   // debounceMountGetReviewBatchByDate(newValue);
                //   // approvalSearchByDate(newValue);
                //   // );
                // }}
                renderInput={(params) => (
                  <TextField
                    // layout="responsive"
                    size="small"
                    {...params}
                    sx={{
                      background: "white",
                      // mr: 1,
                      // width: "14vw",
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item flex={2}>
            {/* <Select
              label="Filter by Product"
              sx={{ ml: 3, mt: 5, width: "100%" }}
            ></Select> */}
          </Grid>
          <Grid item flex={2}>
            {/* <Select
              label="Filter by Product"
              sx={{ ml: 3, mt: 5, width: "100%" }}
            ></Select> */}
          </Grid>
        </Grid>

        {/* <Grid container sx={{ mt: 1 }}>
          <Grid item>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                ml: 2,
              }}
            >
              NIE
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                ml: 15.4,
              }}
            >
              :
            </Typography>
          </Grid>

          <Grid>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                // mt: 1,
                textAlign: "left",
                ml: 5,
              }}
            ></Typography>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 1 }}>
          <Grid item>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                ml: 2,
              }}
            >
              Production Date
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                ml: 3.3,
              }}
            >
              :
            </Typography>
          </Grid>

          <Grid>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                // mt: 1,
                textAlign: "left",
                ml: 5,
              }}
            ></Typography>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 1 }}>
          <Grid item>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                ml: 2,
              }}
            >
              Expired Date
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                textAlign: "left",
                ml: 6.5,
              }}
            >
              :
            </Typography>
          </Grid>

          <Grid>
            <Typography
              // variant="h5"
              sx={{
                fontWeight: 600,
                // mt: 3,
                // mt: 1,
                textAlign: "left",
                ml: 5,
              }}
            ></Typography>
          </Grid>
        </Grid> */}
        {/* </Collapse> */}
      </Grid>

      {/* ------------------------------------------------------------ */}
      {/* <Paper fullWidth fullHeight> */}
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
                      // textAlign:
                      //   head.name === "COA" || head.name === "Keterangan COA"
                      //     ? "left"
                      //     : "right",
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
                  <TableCell>
                    {/* <Link
                      href={`/general-ledger/${item.tahun}/${item.bulan}/${item.coa_id}`}
                    > */}
                    {item.scan_procode}
                    {/* </Link> */}
                  </TableCell>
                  <TableCell>{item.scan_proname}</TableCell>
                  <TableCell
                  // sx={{
                  //   textAlign: "right",
                  // }}
                  >
                    {/* {formatNumber(item.saldo_awal)} */}
                    {item.scan_batch}
                  </TableCell>
                  <TableCell
                  // sx={{
                  //   color: formatColor("DEBIT", item.total_debit),
                  //   textAlign: "right",
                  // }}
                  >
                    {/* {formatNumber(item.total_debit)} */}
                    {item.scan_status}
                  </TableCell>
                  <TableCell
                  // sx={{
                  //   color: formatColor("AKHIR", item.saldo_akhir),
                  //   textAlign: "right",
                  // }}
                  >
                    {/* {formatNumber(item.saldo_akhir)} */}
                    {item.scan_submitdate === "" ||
                    item.scan_submitdate === null
                      ? "-"
                      : item.scan_submitdate}
                  </TableCell>
                  <TableCell
                  // sx={{
                  //   color: formatColor("AKHIR", item.saldo_akhir),
                  //   textAlign: "right",
                  // }}
                  >
                    <Button
                      variant="contained"
                      // startIcon={
                      //   <ArrowDownwardIcon sx={{ ml: 1 }} />
                      // }
                      size="large"
                      sx={{ mr: 2, backgroundColor: "#EDBE4B" }}
                      // onClick={
                      //   () => debounceMountDownloadPPNOUT(item)
                      //   // mountDownloadPPNOUT2()
                      // }
                      // href={`http://storage.googleapis.com/staging.cfu-main.appspot.com/sales-ppn-out/2022092712450492712.csv`}
                    >
                      Detail
                    </Button>
                    <Button
                      parameter
                      variant="contained"
                      sx={{ backgroundColor: "#4BA1B4", mr: 2 }}
                      // startIcon={<DeleteIcon sx={{ ml: 1 }} />}
                      size="large"
                      // onClick={() => mountDeletePPNOUT(item)}
                      // onClick={() => setModalDeletePPNOUT(true)}
                      // onClick={() => deletePPNOUT1(item)}
                      // onClick={() => setModalUploadToBPOM(true)}
                    >
                      Export
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            {/* <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                count={totalData}
                rowsPerPage={params.length}
                page={params.page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </TableRow> */}
          </TableFooter>
        </Table>
      </Paper>

      {/* </Paper> */}
    </Box>
  );
};

export default ScanNewBatch;
