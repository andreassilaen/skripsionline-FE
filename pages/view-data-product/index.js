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
  MenuItem,
  Collapse,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { AddCircle, CheckBox } from "@mui/icons-material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { debounce, set, isUndefined } from "lodash";
import qr from "../../services/qr";
import { getStorage } from "../../utils/storage";

const ViewDataProduct = () => {
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
  const [flag, setFlag] = useState("Y");
  const test = "12346 - Name of Product 2";
  const test1 = "AAAA-123456-01";
  const test2 = "10 UB";
  const test3 = "DBL653783700870A1";
  const test4 = "03 January 2023";
  const test5 = "23 June 2025";
  const [collapseDetailScanNewBatch, setCollapseDetailScanNewBatch] =
    useState(true);

  const [masterCodeBox, setMasterCodeBox] = useState("");
  const [unitBox1, setUnitBox1] = useState("");
  const [unitBox2, setUnitBox2] = useState("");
  const [unitBox3, setUnitBox3] = useState("");
  const [unitBox4, setUnitBox4] = useState("");
  const [unitBox5, setUnitBox5] = useState("");
  const [unitBox6, setUnitBox6] = useState("");
  const [unitBox7, setUnitBox7] = useState("");
  const [unitBox8, setUnitBox8] = useState("");
  const [unitBox9, setUnitBox9] = useState("");
  const [unitBox10, setUnitBox10] = useState("");

  const [unitBox1Disabled, setUnitBox1Disabled] = useState(true);
  const [unitBox2Disabled, setUnitBox2Disabled] = useState(true);
  const [unitBox3Disabled, setUnitBox3Disabled] = useState(true);
  const [unitBox4Disabled, setUnitBox4Disabled] = useState(true);
  const [unitBox5Disabled, setUnitBox5Disabled] = useState(true);
  const [unitBox6Disabled, setUnitBox6Disabled] = useState(true);
  const [unitBox7Disabled, setUnitBox7Disabled] = useState(true);
  const [unitBox8Disabled, setUnitBox8Disabled] = useState(true);
  const [unitBox9Disabled, setUnitBox9Disabled] = useState(true);
  const [unitBox10Disabled, setUnitBox10Disabled] = useState(true);

  const [modalStartScanNewBatch, setModalStartScanNewBatch] = useState(false);
  const [modalScanningPackagingNotFull, setModalScanningPackagingNotFull] =
    useState(false);
  const [modalPackingSelesai, setModalPackingSelesai] = useState(false);
  const [modalPackingSelesai2, setModalPackingSelesai2] = useState(false);
  const [modalValidationSaveAndFinish, setModalValidationSaveAndFinish] =
    useState(false);

  const [collapseDeleteUnitBox1, setCollapseDeleteUnitBox1] = useState(false);
  const [collapseDeleteUnitBox2, setCollapseDeleteUnitBox2] = useState(false);
  const [collapseDeleteUnitBox3, setCollapseDeleteUnitBox3] = useState(false);
  const [collapseDeleteUnitBox4, setCollapseDeleteUnitBox4] = useState(false);
  const [collapseDeleteUnitBox5, setCollapseDeleteUnitBox5] = useState(false);
  const [collapseDeleteUnitBox6, setCollapseDeleteUnitBox6] = useState(false);
  const [collapseDeleteUnitBox7, setCollapseDeleteUnitBox7] = useState(false);
  const [collapseDeleteUnitBox8, setCollapseDeleteUnitBox8] = useState(false);
  const [collapseDeleteUnitBox9, setCollapseDeleteUnitBox9] = useState(false);
  const [collapseDeleteUnitBox10, setCollapseDeleteUnitBox10] = useState(false);

  const [
    collapseDetailScanNewBatchButtonUp,
    setCollapseDetailScanNewBatchButtonUp,
  ] = useState(true);
  const [
    collapseDetailScanNewBatchButtonDown,
    setCollapseDetailScanNewBatchButtonDown,
  ] = useState(false);

  const [listProduct, setListProduct] = useState([]);
  // const [product, setProduct] = useState([]);
  1;

  const [payloadHeader, setPayloadHeader] = useState("");

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["QR_BPOM_VIEW_DATA_PRODUCT"].includes(
          "QR_BPOM_VIEW_DATA_PRODUCT_VIEW"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  async function start() {
    if (selectBatchNumber === "" || selectBatchNumber === undefined) {
      setModalScanBatch(true);
    }
    if (selectBatchNumber !== "") {
      setModalStartScanNewBatch(true);
    }

    // if (masterCodeBox === "") {
    //   setModalValidationSaveAndFinish(true);
    // }
    console.log("selectBatchNumber", selectBatchNumber);
  }

  async function hideDetailScanNewBatch() {
    // if (
    //   (selectProduct === 0) &
    //   (selectProduct === 0) &
    //   (selectBatchNumber === "") &
    //   (selectBatchNumber === 0)
    // ) {
    //   // setModalScanBatch(true);
    // }
    setCollapseDetailScanNewBatch(false);
    setCollapseDetailScanNewBatchButtonUp(false);
    setCollapseDetailScanNewBatchButtonDown(true);
  }

  async function showDetailScanNewBatch() {
    // if (
    //   (selectProduct === 0) &
    //   (selectProduct === 0) &
    //   (selectBatchNumber === "") &
    //   (selectBatchNumber === 0)
    // ) {
    //   // setModalScanBatch(true);
    // }
    setCollapseDetailScanNewBatch(true);
    setCollapseDetailScanNewBatchButtonUp(true);
    setCollapseDetailScanNewBatchButtonDown(false);
  }

  async function packaging() {
    // if (
    //   (selectProduct === 0) &
    //   (selectProduct === 0) &
    //   (selectBatchNumber === "") &
    //   (selectBatchNumber === 0)
    // ) {
    //   // setModalScanBatch(true);
    // }
    setFlag("P");
  }

  useEffect(() => {
    debounceMountGetListAllProduct();
    // if (selectProduct !== "" && selectProduct !== 0) {
    //   debounceMountGetListProduct(listProduct.pro_code, listProduct.pro_name);
    // }
    // console.log("item", payloadHeader);
    // console.log("products", selectProduct);
    if (masterCodeBox !== 0 && masterCodeBox !== "") {
      setUnitBox1Disabled(false);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox1 !== 0 && unitBox1 !== "") {
      setUnitBox2Disabled(false);
      setCollapseDeleteUnitBox1(true);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox2 !== 0 && unitBox2 !== "") {
      setUnitBox3Disabled(false);
      setCollapseDeleteUnitBox2(true);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox3 !== 0 && unitBox3 !== "") {
      setUnitBox4Disabled(false);
      setCollapseDeleteUnitBox3(true);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox4 !== 0 && unitBox4 !== "") {
      setUnitBox5Disabled(false);
      setCollapseDeleteUnitBox4(true);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox5 !== 0 && unitBox5 !== "") {
      setUnitBox6Disabled(false);
      setCollapseDeleteUnitBox5(true);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox6 !== 0 && unitBox6 !== "") {
      setUnitBox7Disabled(false);
      setCollapseDeleteUnitBox6(true);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox7 !== 0 && unitBox7 !== "") {
      setUnitBox8Disabled(false);
      setCollapseDeleteUnitBox7(true);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox8 !== 0 && unitBox8 !== "") {
      setUnitBox9Disabled(false);
      setCollapseDeleteUnitBox8(true);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox9 !== 0 && unitBox9 !== "") {
      setUnitBox10Disabled(false);
      setCollapseDeleteUnitBox9(true);
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox10 !== 0 && unitBox10 !== "") {
      // setUnitBox10Disabled(false)
      setCollapseDeleteUnitBox10(true);
      // console.log("unitbox1",masterCodeBox)
    }
  }, [
    masterCodeBox,
    unitBox1Disabled,
    unitBox1,
    unitBox2Disabled,
    unitBox2,
    unitBox3Disabled,
    unitBox3,
    unitBox4Disabled,
    unitBox4,
    unitBox5Disabled,
    unitBox5,
    unitBox6Disabled,
    unitBox6,
    unitBox7Disabled,
    unitBox7,
    unitBox8Disabled,
    unitBox8,
    unitBox9Disabled,
    unitBox9,
    unitBox10Disabled,
    unitBox10,
    // selectProduct,
    // payloadHeader,
  ]);

  async function saveAndContinueButton() {
    if (
      (unitBox1 !== 0 && unitBox1 !== "") ||
      (unitBox2 !== 0 && unitBox2 !== "") ||
      (unitBox3 !== 0 && unitBox3 !== "") ||
      (unitBox4 !== 0 && unitBox4 !== "") ||
      (unitBox5 !== 0 && unitBox5 !== "") ||
      (unitBox6 !== 0 && unitBox6 !== "") ||
      (unitBox7 !== 0 && unitBox7 !== "") ||
      (unitBox8 !== 0 && unitBox8 !== "") ||
      (unitBox9 !== 0 && unitBox9 !== "")
    ) {
      setModalScanningPackagingNotFull(true);
    }
    if (masterCodeBox === "") {
      setModalValidationSaveAndFinish(true);
    }
    if (unitBox10 !== 0 && unitBox10 !== "") {
      saveAndContinueFinish();
    }
  }

  async function saveAndContinueFinish() {
    setMasterCodeBox("");
    setUnitBox1("");
    setUnitBox2("");
    setUnitBox3("");
    setUnitBox4("");
    setUnitBox5("");
    setUnitBox6("");
    setUnitBox7("");
    setUnitBox8("");
    setUnitBox9("");
    setUnitBox10("");
    setCollapseDeleteUnitBox1(false);
    setCollapseDeleteUnitBox2(false);
    setCollapseDeleteUnitBox3(false);
    setCollapseDeleteUnitBox4(false);
    setCollapseDeleteUnitBox5(false);
    setCollapseDeleteUnitBox6(false);
    setCollapseDeleteUnitBox7(false);
    setCollapseDeleteUnitBox8(false);
    setCollapseDeleteUnitBox9(false);
    setCollapseDeleteUnitBox10(false);
    setModalScanningPackagingNotFull(false);
  }

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

  async function deleteUnitBox1() {
    setUnitBox1("");
    setCollapseDeleteUnitBox1(false);
  }

  async function deleteUnitBox2() {
    setUnitBox2("");
    setCollapseDeleteUnitBox2(false);
  }

  async function deleteUnitBox3() {
    setUnitBox3("");
    setCollapseDeleteUnitBox3(false);
  }

  async function deleteUnitBox4() {
    setUnitBox4("");
    setCollapseDeleteUnitBox4(false);
  }

  async function deleteUnitBox5() {
    setUnitBox5("");
    setCollapseDeleteUnitBox5(false);
  }

  async function deleteUnitBox6() {
    setUnitBox6("");
    setCollapseDeleteUnitBox6(false);
  }

  async function deleteUnitBox7() {
    setUnitBox7("");
    setCollapseDeleteUnitBox7(false);
  }

  async function deleteUnitBox8() {
    setUnitBox8("");
    setCollapseDeleteUnitBox8(false);
  }

  async function deleteUnitBox9() {
    setUnitBox9("");
    setCollapseDeleteUnitBox9(false);
  }

  async function deleteUnitBox10() {
    setUnitBox10("");
    setCollapseDeleteUnitBox10(false);
  }

  async function packingFinish() {
    setModalPackingSelesai(true);
  }

  async function packingFinishModal() {
    setModalPackingSelesai2(false);
    setModalPackingSelesai(false);
  }

  async function finishScanningPackaging() {
    // if (
    //   (unitBox1 !== 0 && unitBox1 !== "") ||
    //   (unitBox2 !== 0 && unitBox2 !== "") ||
    //   (unitBox3 !== 0 && unitBox3 !== "") ||
    //   (unitBox4 !== 0 && unitBox4 !== "") ||
    //   (unitBox5 !== 0 && unitBox5 !== "") ||
    //   (unitBox6 !== 0 && unitBox6 !== "") ||
    //   (unitBox7 !== 0 && unitBox7 !== "") ||
    //   (unitBox8 !== 0 && unitBox8 !== "") ||
    //   (unitBox9 !== 0 && unitBox9 !== "") ||
    //   (unitBox10 !== 0 && unitBox10 !== "")
    // ) {
    //   setModalScanningPackagingNotFull(true);
    // }
    if (masterCodeBox === "") {
      setModalValidationSaveAndFinish(true);
    }
    if (masterCodeBox !== "") {
      setFlag("D");
      saveAndContinueFinish();
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

  // const debounceMountGetListProduct = useCallback(
  //   debounce(mountGetListProduct, 400)
  // );

  // async function mountGetListProduct(procode, proname) {
  //   try {
  //     const getListProducts = await qr.getListProduct(procode, proname);
  //     const { data } = getListProducts.data;
  //     setProduct(data);
  //     console.log("dataGetListProduct", data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Grid container justifyContent={"space-between"} sx={{ margin: "1%" }}>
        <Grid container item xs={10}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mt: 0.5, textAlign: "left", ml: 2 }}
          >
            View Data Product
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "75vh", minWidth: "185vh" }}
      >
        <Paper sx={{}}>
          <Grid sx={{ ml: 2, mr: 2 }}>
            {/* <Paper sx={{ marginRight: "35px", marginLeft: "35px" }}> */}
            <Grid
            // sx={{ margin: "1%" }}
            >
              <FormControl
                sx={{
                  backgroundColor: "white",
                  width: "100vh",
                  mt: 3,
                  //   height: "50vh",
                }}
              >
                <InputLabel>Select Product</InputLabel>
                <Select
                  variant="outlined"
                  size="small"
                  label="Select Product"
                  // value={selectProduct}
                  onChange={(e) => setSelectProduct(e.target.value)}
                >
                  {/* {getOutlet &&
                      getOutlet.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item.comco} - {item.name}
                        </MenuItem>
                      ))} */}

                  {listProduct &&
                    listProduct.map((item) => (
                      <MenuItem
                        onClick={() => setPayloadHeader(item)}
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
            {/* <Grid
              // sx={{ margin: "1%" }}
              sx={{ mt: 1 }}
            >
              <FormControl
                sx={{
                  backgroundColor: "white",
                  width: "50vh",
                  marginTop: 1,
                }}
              >
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder={"Input Batch Number"}
                  onChange={(e) => setSelectBatchNumber(e.target.value)}
                ></TextField>
              </FormControl>

              <Grid sx={{ textAlign: "right", marginTop: 2 }}>
                <Button
                  variant="contained"
                  sx={{ marginBottom: 2 }}
                  onClick={() => start()}
                >
                  Start
                </Button>
              </Grid>
            </Grid> */}
          </Grid>

          {/* <Grid container sx={{ ml: 6 }}> */}
          <Grid container sx={{ mt: 6 }}>
            <Grid item>
              <Typography
                // variant="h5"
                sx={{
                  fontWeight: 600,
                  // mt: 3,
                  textAlign: "left",
                  ml: 3,
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
                  ml: 11,
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
              >
                {/* {test} */}
                {payloadHeader.pro_nie !== "" ? payloadHeader.pro_nie : "-"}
              </Typography>
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
                  ml: 3,
                }}
              >
                MB Size
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                // variant="h5"
                sx={{
                  fontWeight: 600,
                  // mt: 3,
                  textAlign: "left",
                  ml: 6.7,
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
              >
                {/* {test1} */}
                {payloadHeader.pro_mbsize !== ""
                  ? payloadHeader.pro_mbsize
                  : "-"}
              </Typography>
            </Grid>
          </Grid>

          <Collapse in={collapseDetailScanNewBatch}>
            <Grid container sx={{ mt: 1 }}>
              <Grid item>
                <Typography
                  // variant="h5"
                  sx={{
                    fontWeight: 600,
                    // mt: 3,
                    textAlign: "left",
                    ml: 3,
                  }}
                >
                  XXXXX
                </Typography>
              </Grid>

              <Grid item>
                <Typography
                  // variant="h5"
                  sx={{
                    fontWeight: 600,
                    // mt: 3,
                    textAlign: "left",
                    ml: 7.7,
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
                >
                  {/* {test2} */}
                </Typography>
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
                    ml: 3,
                  }}
                >
                  XXXXX
                </Typography>
              </Grid>

              <Grid item>
                <Typography
                  // variant="h5"
                  sx={{
                    fontWeight: 600,
                    // mt: 3,
                    textAlign: "left",
                    ml: 7.7,
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
                >
                  {/* {test3} */}
                </Typography>
              </Grid>
            </Grid>

            <Grid container sx={{ mt: 1 }}>
              <Grid item>
                <Typography
                  // varian t="h5"
                  sx={{
                    fontWeight: 600,
                    // mt: 3,
                    textAlign: "left",
                    ml: 3,
                  }}
                >
                  XXXXX
                </Typography>
              </Grid>

              <Grid item>
                <Typography
                  // variant="h5"
                  sx={{
                    fontWeight: 600,
                    // mt: 3,
                    textAlign: "left",
                    ml: 7.7,
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
                >
                  {/* {test4} */}
                </Typography>
              </Grid>
            </Grid>

            <Grid container sx={{ mt: 1, mb: 2 }}>
              <Grid item>
                <Typography
                  // variant="h5"
                  sx={{
                    fontWeight: 600,
                    // mt: 3,
                    textAlign: "left",
                    ml: 3,
                  }}
                >
                  XXXXX
                </Typography>
              </Grid>

              <Grid item>
                <Typography
                  // variant="h5"
                  sx={{
                    fontWeight: 600,
                    // mt: 3,
                    textAlign: "left",
                    ml: 7.7,
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
                >
                  {/* {test5} */}
                </Typography>
              </Grid>
            </Grid>
          </Collapse>
          {/* <Divider width="93%" objectFit="contain" sx={{ mt: 4 }} />
          <Divider width="93%" objectFit="contain" /> */}
          {/* </Grid> */}
        </Paper>
      </Grid>
    </Box>
  );
};

export default ViewDataProduct;
