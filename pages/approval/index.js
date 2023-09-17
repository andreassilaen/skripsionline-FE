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
import React, { useCallback, useEffect, useRef, useState } from "react";
import qr from "../../services/qr";
import { debounce, reject, set, isUndefined } from "lodash";
import LogoutIcon from "@mui/icons-material/Logout";
import { AddCircle, CheckBox } from "@mui/icons-material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BackspaceIcon from "@mui/icons-material/Backspace";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import InfoIcon from "@mui/icons-material/Info";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { formatDate } from "../../utils/text";
import { useRouter } from "next/router";
// import Link from "next/link";
import { getStorage } from "../../utils/storage";

// import // setFlag,
// // setDetailBool,
// // debounceMountGetScanningPackagingData,
// // listHeader,
// // mbSizeDetail,
// // setCollapseSaveUnitBox1,
// // setCollapseSaveUnitBox2,
// // setCollapseSaveUnitBox3,
// // setCollapseSaveUnitBox4,
// // setCollapseSaveUnitBox5,
// // setCollapseSaveUnitBox6,
// // setCollapseSaveUnitBox7,
// // setCollapseSaveUnitBox8,
// // setCollapseSaveUnitBox9,
// // setCollapseSaveUnitBox10,
// // ScanNewBatch,
// "../scan-new-batch/index";

const Approval = () => {
  // const styleModalErr = {
  //   position: "absolute",
  //   top: "30%",
  //   left: "60%",
  //   transform: "translate(-50%, -50%)",
  //   width: "35%",
  //   bgcolor: "background.paper",
  //   p: 4,
  // };

  // const styleModalStart = {
  //   position: "absolute",
  //   top: "30%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: "35%",
  //   bgcolor: "background.paper",
  //   p: 4,
  // };

  const [modalCheckUploadToBPOM, setModalCheckUploadToBPOM] = useState(false);
  const [modalFinishUploadToBPOM, setModalFinishUploadToBPOM] = useState(false);

  const [modalCheckReject, setModalCheckReject] = useState(false);
  const [modalFinishReject, setModalFinishReject] = useState(false);

  const [listApproval, setListApproval] = useState([]);
  const [listProduct, setListProduct] = useState([]);

  const [searchApprovalByDate, setSearchApprovalByDate] = useState("");

  const [detailApprovalBool, setDetailApprovalBool] = useState(false);

  const [disabledUploadReject, setDisabledUploadReject] = useState(true);
  const [disabledDone, setDisabledDone] = useState(false);

  const [uploadItem, setUploadItem] = useState("");

  const [rejectItem, setRejectItem] = useState("");

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["QR_BPOM_UPLOAD_TO_BPOM"].includes(
          "QR_BPOM_UPLOAD_TO_BPOM_CREATE"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  // const {disabledUploadReject}

  const router = useRouter();

  const style = {
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  //   const testjson = {
  //     "posts": [
  //         {
  //             "scan_procode": 1,
  //             "scan_proname": "Post 1",
  //             "scan_batch": "This is the full content of post 1",
  //             "scan_submitteddate": "This is the full content of post 1"
  //         },
  //         {
  //           "scan_procode": 1,
  //           "scan_proname": "Post 1",
  //           "scan_batch": "This is the full content of post 1",
  //           "scan_submitteddate": "This is the full content of post 1"
  //         },
  //         {
  //           "scan_procode": 1,
  //           "scan_proname": "Post 1",
  //           "scan_batch": "This is the full content of post 1",
  //           "scan_submitteddate": "This is the full content of post 1"
  //         },
  //         {
  //           "scan_procode": 1,
  //           "scan_proname": "Post 1",
  //           "scan_batch": "This is the full content of post 1",
  //           "scan_submitteddate": "This is the full content of post 1"
  //         }
  //     ]
  // }

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
      name: "Keterangan",
    },
    {
      name: "Submitted On",
    },
  ];

  // const listApproval = [
  //       {
  //           "scan_procode": 1,
  //           "scan_proname": "Panadol Merah",
  //           "scan_batch": "X3",
  //           "scan_status": "O",
  //           "scan_submitteddate": "2023-02-17 00:00:00"
  //       },
  //       {
  //         "scan_procode": 1,
  //         "scan_proname": "Panadol Merah",
  //         "scan_batch": "X3",
  //         "scan_status": "O",
  //         "scan_submitteddate": "2023-02-17 00:00:00"
  //     },
  //     {
  //       "scan_procode": 1,
  //       "scan_proname": "Panadol Merah",
  //       "scan_batch": "X3",
  //       "scan_status": "O",
  //       "scan_submitteddate": "2023-02-17 00:00:00"
  //   },
  //   {
  //     "scan_procode": 1,
  //     "scan_proname": "Panadol Merah",
  //     "scan_batch": "X3",
  //     "scan_status": "O",
  //     "scan_submitteddate": "2023-02-17 00:00:00"
  // },
  // {
  //   "scan_procode": 1,
  //   "scan_proname": "Panadol Merah",
  //   "scan_batch": "X3",
  //   "scan_status": "O",
  //   "scan_submitteddate": "2023-02-17 00:00:00"
  // },

  //   ]

  async function finishUploadToBPOM(item) {
    setUploadItem(item);
    // setModalFinishUploadToBPOM(false);
    setModalCheckUploadToBPOM(true);
  }

  async function finishReject(item) {
    setRejectItem(item);
    // setModalFinishUploadToBPOM(false);
    setModalCheckReject(true);
  }

  const debounceMountGetReviewBatch = useCallback(
    debounce(mountGetReviewBatch, 400)
  );

  async function mountGetReviewBatch() {
    try {
      const getBatchToReview = await qr.getListBatchToReview();
      const { data } = getBatchToReview.data;
      setListApproval(data);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountetReviewBatchByProcode = useCallback(
    debounce(mountGetReviewBatchByProcode, 400)
  );

  async function mountGetReviewBatchByProcode(procode) {
    try {
      const getBatchToReview = await qr.getReviewBatchByProcode(procode);
      const { data } = getBatchToReview.data;
      setListApproval(data);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetReviewBatchByDate = useCallback(
    debounce(mountGetReviewBatchByDate, 400)
  );

  async function mountGetReviewBatchByDate(date) {
    try {
      const getBatchToReview = await qr.getReviewBatchByDate(date);
      const { data } = getBatchToReview.data;
      setListApproval(data);
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
      // setListApproval(data);
    } catch (error) {
      console.log(error);
    }
  }

  // async function filterByProduct(item) {
  //   debounceMountetReviewBatchByProcode(item.pro_code);
  // }

  // async function approvalSearchByDate(newValue) {
  //   setSearchApprovalByDate(formatDate(newValue, "YYMMDD"));

  //   debounceMountGetReviewBatchByDate(searchApprovalByDate);
  // }

  // useEffect(() => {
  //   debounceMountGetReviewBatch();
  //   debounceMountGetListAllProduct();
  // }, []);

  // useEffect(() => {
  //   if (searchApprovalByDate !== 0 && searchApprovalByDate !== "") {
  //     console.log("searchApprovalByDate", searchApprovalByDate);
  //     debounceMountGetReviewBatchByDate(
  //       formatDate(searchApprovalByDate, "YYMMDD")
  //     );
  //   }
  //   console.log("boolApproval-Approval", detailApprovalBool);
  // }, [searchApprovalByDate, detailApprovalBool]);

  async function detailApproval(item) {
    // const routers = `/scan-new-batch`;
    router.push(`/approval/${item.scan_id}`);
    // router.push(`:path/www.google.com`);
    setDetailApprovalBool(true);
    // if (routers === `/scan-new-batch`) {
    //   setFlag("P");
    //   setDetailBool(true);
    //   debounceMountGetScanningPackagingData(
    //     listHeader.scan_id,
    //     mbSizeDetail.scan_mbid
    //   );
    //   // setMbsizeDetail(item);
    //   // console.log("scanid", listHeader.scan_id);
    //   // console.log("itemMBID", item);
    //   // console.log("listScanningPackaging", listScanningPackaging);
    //   // console.log("product", product);
    //   // console.log("productEdit", productEdit);
    //   setCollapseSaveUnitBox1(false);
    //   setCollapseSaveUnitBox2(false);
    //   setCollapseSaveUnitBox3(false);
    //   setCollapseSaveUnitBox4(false);
    //   setCollapseSaveUnitBox5(false);
    //   setCollapseSaveUnitBox6(false);
    //   setCollapseSaveUnitBox7(false);
    //   setCollapseSaveUnitBox8(false);
    //   setCollapseSaveUnitBox9(false);
    //   setCollapseSaveUnitBox10(false);
    // }
  }

  async function uploadToBpom(scanid) {
    try {
      const uploadBpom = await qr.updateUploadBpom(scanid);
      const { data } = uploadBpom.data;
      // setModalPackingSelesai2(true);
      // debounceMountGetReviewBatch();
      debounceMountGetFilterApproval(inputSearch.pro_code, filterDate);
      // console.log("listScanningPackagingSeeMBList", listScanningPackaging);
      console.log("cek update", data);
    } catch (error) {
      console.log(error);
    }
  }

  async function rejectPackaging(scanid) {
    try {
      const mountUpdateUBID = await qr.updateReject(scanid);
      const { data } = mountUpdateUBID.data;
      // setModalPackingSelesai2(true);
      // debounceMountGetReviewBatch();
      debounceMountGetFilterApproval(inputSearch.pro_code, filterDate);
      // console.log("listScanningPackagingSeeMBList", listScanningPackaging);
      console.log("cek");
    } catch (error) {
      console.log(error);
    }
  }

  const [inputSearch, setInputSearch] = useState({
    pro_name: "",
    pro_code: "",
  });

  const [filterDate, setFilterDate] = useState("");

  const [collapseDate, setCollapseDate] = useState(false);
  const [collapseRefresh, setCollapseRefresh] = useState(false);
  const [collapseAllData, setCollapseAllData] = useState(true);
  const [collapseEmpty, setCollapseEmpty] = useState(false);
  const [collapseDefault, setCollapseDefault] = useState(true);

  const debounceMountGetFilterApproval = useCallback(
    debounce(mountGetFilterApproval, 400)
  );

  async function mountGetFilterApproval(procode, submitdate) {
    console.log("procode", procode);
    // console.log("status", status);
    console.log("date", submitdate);
    var date = formatDate(submitdate, "YYMMDD");
    var status = "";
    console.log("datebaru", date);
    try {
      const getFilterHeaderApproval = await qr.getFilterHeaderApproval(
        procode,
        date
      );
      const { data } = getFilterHeaderApproval.data;
      setListApproval(data);
      console.log("list =>", data);
      setCollapseEmpty(false);
      setCollapseDefault(false);
      if (data == null) {
        console.log("cek collapse Empty");
        setCollapseEmpty(true);
      }
    } catch (error) {
      console.log("error getFilterApproval", error);
      setCollapseEmpty(true);
    }
  }

  // useEffect(() => {
  //   debounceMountGetListAllProduct();
  //   debounceMountGetFilterApproval(inputSearch.pro_code, filterDate);
  // }, [inputSearch.pro_code, filterDate]);

  // useEffect(() => {
  //   console.log("============= Parameters =============");
  //   console.log("inputSearch name => ", inputSearch.pro_name);
  //   console.log("inputSearch code => ", inputSearch.pro_code);
  //   // console.log("filterStatus =>", filterStatus);
  //   console.log("filterDate => ", filterDate);
  //   // console.log("label", filterLabel);
  //   console.log("======================================");
  // }, [inputSearch.pro_name, inputSearch.pro_code, filterDate]);

  async function deleteDate() {
    // setFilterDate("cek2")
    setCollapseDate(false);
  }

  async function deleteRefresh() {
    // setFilterRefresh("cek3")
    setCollapseRefresh(false);
    setCollapseAllData(true);
    setCollapseEmpty(false);
    setCollapseDefault(true);
    setFilterDate(null);
    setListApproval([]);
    // setInputSearch(inputSearch.pro_code==="", inputSearch.pro_name==="");
    setInputSearch({
      ...inputSearch,
      pro_code: "",
      pro_name: "",
    });
    deleteDate();
  }

  async function getAllBatch() {
    debounceMountGetFilterApproval("", "");

    setInputSearch({
      ...inputSearch,
      pro_code: "",
      pro_name: "",
    });
    setFilterDate(null);
    deleteDate();

    setCollapseRefresh(true);
    setCollapseAllData(false);
  }

  // Sekali panggil
  useEffect(() => {
    debounceMountGetListAllProduct();
    console.log("[X|>>>>>|] UseEffect Parent [|<<<<<<|X]");
  }, []);

  useEffect(() => {
    console.log(
      " **************************** UseEffect **************************** "
    );
    // debounceMountGetFilterApproval(inputSearch.pro_code, filterDate);
    // debounceMountGetListBatchToMonitor();
    // debounceMountGetListAllProduct();

    // setCollapseDefault(true);
    console.log(">> collapseDefault", collapseDefault);

    if (
      inputSearch.pro_code !== "" ||
      inputSearch.pro_name !== "" ||
      (filterDate !== "" && filterDate !== null)
    ) {
      console.log("| ceking IF ==> Filter terisi");
      debounceMountGetFilterApproval(inputSearch.pro_code, filterDate);
      setCollapseAllData(true);
    } else if (
      inputSearch.pro_code === "" &&
      inputSearch.pro_name === "" &&
      (filterDate !== "" || filterDate !== null) &&
      (collapseAllData === true || collapseRefresh === false)
    ) {
      console.log("| ceking IF ==> Filter kosong");
      setListApproval([]);
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
    // else {
    //   console.log("| ceking IF ==> Kosong 2");
    //   setListMonitor([]);
    //   setCollapseRefresh(false);
    //   setCollapseAllData(true);
    // }
    // debounceMountGetListAllProduct();

    // setCollapseRefresh(false)

    var date = formatDate(filterDate, "YYMMDD");
    if (inputSearch.pro_code !== "" || date !== "") {
      setCollapseRefresh(true);
      // setCollapseDefault(false);
    }

    console.log("| inputSearch.pro-code +>", inputSearch.pro_code);
    console.log("| inputSearch.pro-name +>", inputSearch.pro_name);
    console.log("| filterDate +>", filterDate);
    console.log("| date +>", date);
    console.log("| collapse Date", collapseDate);
    console.log("| collapse Empty", collapseEmpty);
    // console.log("| collapse Refresh", collapseRefresh);
    console.log("| data +>", listApproval);
    console.log(" ******************************************************* ");
  }, [
    inputSearch.pro_code,
    inputSearch.pro_name,
    filterDate,
    collapseDate,
    collapseEmpty,
    collapseDefault,
  ]);

  // async function mountUpload(){
  //   debounceMountGetFilterApproval();
  //   setModalFinishUploadToBPOM(true);
  // }

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Grid container justifyContent={"space-between"} sx={{ margin: "1%" }}>
        <Grid container item xs={10}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mt: 0.5, textAlign: "left", ml: 2 }}
          >
            APPROVAL
          </Typography>
        </Grid>
      </Grid>

      <Grid container>
        <Grid container sx={{ mt: 1 }}>
          <Grid item flex={5}>
            <Autocomplete
              options={listProduct}
              sx={{
                backgroundColor: "white",
                ml: 3,
                mt: 5,
                width: "100%",
              }}
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

          {/* <Grid item flex={2}>
            <FormControl fullWidth sx={{ ml: 5, mt: 5, width: "100%" }}>
              <InputLabel id="bulan-label">Filter by Status</InputLabel>
              <Select label="Filter by Product" size="small"></Select>
            </FormControl>
          </Grid> */}

          <Grid item flex={4}>
            <FormControl fullWidth sx={{ ml: 7, mt: 5, width: "100%" }}>
              {/* <InputLabel id="bulan-label">Filter by Date</InputLabel> */}

              {/* <Select label="Filter by Product" size="small"></Select> */}
              <DesktopDatePicker
                label="Filter by Date"
                value={filterDate}
                onChange={(newValue) => {
                  newValue !== null || newValue === ""
                    ? (setFilterDate(newValue), setCollapseDate(true))
                    : (setFilterDate(newValue), setCollapseDate(false));
                }}
                // onChange={(newValue) => setSearchApprovalByDate(newValue)}
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

          <Collapse in={collapseDate}>
            <Grid item flex={2}>
              <FormControl
                fullWidth
                sx={{
                  ml: -3,
                  mt: 5.6,
                  width: "2%",
                  height: "2%",
                  // border: "2px solid green",
                }}
              >
                <Button
                  fullWidth
                  onClick={() => {
                    setFilterDate(null), deleteDate();
                  }}
                  sx={{
                    // border: "1px solid blue",

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

          {/* <Collapse in={collapseRefresh}>
            <Grid item flex={2}>
              <FormControl
                fullWidth
                sx={{
                  ml: 6,
                  mt: 5.6,
                  width: "2%",
                  height: "2%",
                  // border: "2px solid green",
                }}
              >
                <Button
                  fullWidth
                  onClick={() => {
                   deleteRefresh();
                  }}
                  sx={{
                    // border: "1px solid blue",

                    width: 1,
                    height: "1%",
                    borderRadius: "100%",

                    maxWidth: "30px",
                    maxHeight: "30px",
                    minWidth: "30px",
                    minHeight: "30px",
                  }}
                >
                  <RefreshIcon
                    sx={{
                      fontSize: 27,
                      color: "white",
                      backgroundColor: "teal",
                      borderRadius: "100%",
                    }}
                    size="small"
                  />
                </Button>
              </FormControl>
            </Grid>
          </Collapse> */}

          <Grow direction="down" in={collapseRefresh}>
            <Grid item flex={2}>
              <FormControl
                fullWidth
                sx={{
                  ml: 6,
                  mt: 5.6,
                  width: "2%",
                  height: "2%",
                  // border: "2px solid green",
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    deleteRefresh();
                  }}
                  sx={{
                    // border: "1px solid blue",

                    width: 1,
                    height: "1%",
                    backgroundColor: "darkred",
                    // borderRadius: "100%",

                    maxWidth: "90px",
                    maxHeight: "30px",
                    minWidth: "90px",
                    minHeight: "30px",
                  }}
                >
                  CLEAR
                  {/* <ClearIcon
                    sx={{
                      fontSize: 27,
                      color: "white",
                      backgroundColor: "red",
                      borderRadius: "100%",
                    }}
                    size="small"
                  /> */}
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
                  // border: "2px solid green",
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
                    // border: "1px solid blue",
                    // borderRadius: "90%",

                    minWidth: "150px",
                    // maxHeight: "30px",
                    // minWidth: "30px",
                    minHeight: "30px",
                    backgroundColor: "teal",
                  }}
                >
                  ALL DATA
                </Button>
              </FormControl>
            </Grid>
          </Grow>

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
      </Grid>
      <Paper sx={{ mt: 3, ml: 3, mr: 2 }}>
        <Divider width="100%" objectFit="contain" sx={{ mt: 2 }} />
        <Divider width="100%" objectFit="contain" />
        <Divider width="100%" objectFit="contain" />

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
            {listApproval &&
              listApproval.map((item, index) => (
                <React.Fragment key={index}>
                  {item.scan_status === "O" || item.scan_status === "R" ? (
                    ""
                  ) : (
                    <TableRow>
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
                      //   color: formatColor("KREDIT", item.total_kredit),
                      //   textAlign: "right",
                      // }}
                      >
                        {/* {formatNumber(item.total_kredit)} */}
                        {/* {item.scan_submitteddate} */}
                      </TableCell>
                      <TableCell
                      // sx={{
                      //   color: formatColor("AKHIR", item.saldo_akhir),
                      //   textAlign: "right",
                      // }}
                      >
                        {/* {formatNumber(item.saldo_akhir)} */}
                        {/* {item.scan_submitdate} */}
                        {formatDate(item.scan_submitdate, "DD MMMM YYYY")}
                      </TableCell>
                      <TableCell
                      // sx={{
                      //   color: formatColor("AKHIR", item.saldo_akhir),
                      //   textAlign: "right",
                      // }}
                      >
                        {/* <Link> */}
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
                          onClick={() => detailApproval(item)}
                          // href="www.google.com"
                          // src="www.google.com"
                          // onClick={() => Google}
                        >
                          Detail
                        </Button>
                        {/* </Link> */}

                        {/* {item.scan_status === "U" ? (
                          ""
                        ) : ( */}
                        <Button
                          parameter
                          variant="contained"
                          sx={{ backgroundColor: "#4BA1B4", mr: 2 }}
                          // startIcon={<DeleteIcon sx={{ ml: 1 }} />}
                          size="large"
                          // onClick={() => mountDeletePPNOUT(item)}
                          // onClick={() => setModalDeletePPNOUT(true)}
                          // onClick={() => deletePPNOUT1(item)}
                          onClick={() => finishUploadToBPOM(item)}
                          disabled={
                            item.scan_status == "U"
                              ? disabledUploadReject
                              : disabledDone
                          }
                          // value={
                          //   item.scan_status === "U"
                          //     ? : ""
                          // }
                        >
                          Upload
                        </Button>
                        {/* )} */}

                        {/* {item.scan_status === "U" ? (
                          ""
                        ) : ( */}
                        <Button
                          parameter
                          variant="contained"
                          sx={{ backgroundColor: "red" }}
                          // startIcon={<DeleteIcon sx={{ ml: 1 }} />}
                          size="large"
                          // onClick={() => mountDeletePPNOUT(item)}
                          onClick={() => finishReject(item)}
                          // onClick={() => {rejectPackaging(item.scan_id)}}
                          disabled={
                            item.scan_status == "U"
                              ? disabledUploadReject
                              : disabledDone
                          }
                        >
                          Reject
                        </Button>
                        {/* )} */}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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

          <Collapse in={collapseEmpty}>
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
                <InfoIcon
                  sx={{
                    mt: 2,
                    color: "black",
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
                  Data is Empty
                </Typography>
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
      <Modal open={modalCheckUploadToBPOM}>
        <Box sx={style}>
          <Grid>
            <Typography
              // sx={{ textAlign: "center", fontWeight: "bold" }}
              variant="h5"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Heads Up!
            </Typography>
            <Typography
            // sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Are you sure to upload this data:{"\n"}
              {uploadItem.scan_proname} to BPOM web?
            </Typography>
            <Divider sx={{ my: 2 }}></Divider>
            <Grid>
              {/* <Divider sx={{ my: 2 }}></Divider> */}
              <Button
                variant="contained"
                sx={{ backgroundColor: "primary.main", marginLeft: "27em" }}
                onClick={() => {
                  setModalCheckUploadToBPOM(false),
                    setModalFinishUploadToBPOM(true),
                    uploadToBpom(uploadItem.scan_id);
                }}
              >
                YES
              </Button>

              <Button
                variant="contained"
                sx={{ backgroundColor: "error.main", marginLeft: "1em" }}
                onClick={() => setModalCheckUploadToBPOM(false)}
              >
                NO
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal open={modalFinishUploadToBPOM}>
        <Box sx={style}>
          <Grid>
            <Typography
              // sx={{ textAlign: "center", fontWeight: "bold" }}
              variant="h5"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Congrats!
            </Typography>
            <Typography
            // sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Data successfully uploaded.
            </Typography>
            <Divider sx={{ my: 2 }}></Divider>
            <Grid>
              {/* <Divider sx={{ my: 2 }}></Divider> */}
              <Button
                variant="contained"
                sx={{ backgroundColor: "primary.main", marginLeft: "33em" }}
                onClick={() => setModalFinishUploadToBPOM(false)}
              >
                OK
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal open={modalCheckReject}>
        <Box sx={style}>
          <Grid>
            <Typography
              // sx={{ textAlign: "center", fontWeight: "bold" }}
              variant="h5"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Heads Up!
            </Typography>
            <Typography
            // sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Are you sure to reject this data?
            </Typography>
            <Divider sx={{ my: 2 }}></Divider>
            <Grid>
              {/* <Divider sx={{ my: 2 }}></Divider> */}
              <Button
                variant="contained"
                sx={{ backgroundColor: "primary.main", marginLeft: "27em" }}
                onClick={() => {
                  setModalCheckReject(false),
                    setModalFinishReject(true),
                    rejectPackaging(rejectItem.scan_id);
                }}
              >
                YES
              </Button>

              <Button
                variant="contained"
                sx={{ backgroundColor: "error.main", marginLeft: "1em" }}
                onClick={() => setModalCheckReject(false)}
              >
                NO
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal open={modalFinishReject}>
        <Box sx={style}>
          <Grid>
            <Typography
              // sx={{ textAlign: "center", fontWeight: "bold" }}
              variant="h5"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Congrats!...
            </Typography>
            <Typography
            // sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Data successfully rejected.
            </Typography>
            <Divider sx={{ my: 2 }}></Divider>
            <Grid>
              {/* <Divider sx={{ my: 2 }}></Divider> */}
              <Button
                variant="contained"
                sx={{ backgroundColor: "primary.main", marginLeft: "33em" }}
                onClick={() => setModalFinishReject(false)}
              >
                OK
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default Approval;
