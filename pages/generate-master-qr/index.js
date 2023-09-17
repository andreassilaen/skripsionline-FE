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
  Icon,
  Autocomplete,
  Stack,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Delete,
  Edit,
  Save,
  Backspace,
  ArrowBackTwoTone,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { AddCircle, CheckBox, PictureAsPdf, Today } from "@mui/icons-material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import qr from "../../services/qr";
import api_chc from "../../services/services/api-chc";
import { debounce, set } from "lodash";
import { formatDate } from "../../utils/text";
import { format } from "date-fns";
import { detailApprovalBool, setDetailApprovalBool } from "../approval/index";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import useToast from "../../utils/toast";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import { display } from "@mui/system";
import { getStorage } from "../../utils/storage";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const GenerateMasterQR = () => {
  const styleModalCreate = {
    position: "absolute",
    // justifyContent:"center",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "65%",
    bgcolor: "background.paper",
    p: 4,
  };

  const styleModalPrint = {
    position: "absolute",
    // justifyContent:"center",
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    p: 4,
  };

  const styleModalEdit = {
    position: "absolute",
    // justifyContent:"center",
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    p: 4,
  };

  const styleModalPrintRange = {
    position: "absolute",
    // justifyContent:"center",
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    p: 4,
  };

  const [displayToast] = useToast();

  const [listQRMasterCode, setListQRMasterCode] = useState([]);
  const [qrMasterCodeByProcode, setQrMasterCodeByProcode] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [inputSearch, setInputSearch] = useState({
    pro_name: "",
    pro_code: "",
  });

  const [inputProcode, setInputProcode] = useState({
    pro_name: "",
    pro_code: "",
  });
  const [inputBatch, setInputBatch] = useState("");
  const [inputTotal, setInputTotal] = useState("");

  const [collapseEditPrint, setCollapseEditPrint] = useState(false);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);
  const [modalPrintRange, setModalPrintRange] = useState(false);

  const [selectedExpDate, setSelectedExpDate] = useState("");
  const today1 = dayjs("");
  const today = dayjs("date");
  const tomorrow = dayjs().add(1, "day");

  const currentDate = new Date();
  const formattedDate = formatDate(currentDate, "YYYYMMDD");

  const [editJumlah, setEditJumlah] = useState("");

  const [isOpen, setIsOpen] = useState([]);
  const [disableJumlah, setDisableJumlah] = useState(true);
  const [disableButtonSave, setDisableButtonSave] = useState(true);

  const [productByProcode, setProductByProcode] = useState("");
  const [productByProcodeNoReg, setProductByProcodeNoReg] = useState("");

  const nip = getStorage("userNIP");

  const [disabledBatch, setDisabledBatch] = useState(true);
  const [disabledTotal, setDisabledTotal] = useState(true);
  const [disabledProddate, setDisabledProddate] = useState(true);
  const [disabledExpdate, setDisabledExpdate] = useState(true);
  // const [disabledButtonInsert, setDisabledButtonInsert] = useState(true);
  const isEnabled =
    inputBatch !== "" &&
    inputTotal !== "" &&
    selectedProdDate !== "" &&
    selectedExpDateCreate !== "";

  const [selectedProdDate, setSelectedProdDate] = useState("");
  const [selectedExpDateCreate, setSelectedExpDateCreate] = useState("");
  const [printCount, setPrintCount] = useState(0);
  const [generateDate, setGenerateDate] = useState("");
  const [printItem, setPrintItem] = useState("");

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "black",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const tableHeader = [
    {
      name: "NIE",
    },
    {
      name: "Batch",
    },
    {
      name: "Production Date",
    },
    {
      name: "Expired Date",
    },
    {
      name: "Procode",
    },
    {
      name: "Total",
    },
    {
      name: "Print Count",
    },
    {
      name: "Generate Date",
    },
    {
      name: "Generated By",
    },
    {
      name: "Action",
    },
  ];

  const tableHeader2 = [
    {
      name: "NIE",
    },
    {
      name: "Batch",
    },
    {
      name: "Expired Date",
    },
    {
      name: "Procode",
    },
    {
      name: "Total",
    },
    {
      name: "Print Count",
    },
    {
      name: "Generate Date",
    },
    {
      name: "Generated By",
    },
  ];

  const debounceMountGetProductByProcode = useCallback(
    debounce(mountGetProductByProcode, 400)
  );
  async function mountGetProductByProcode(procode) {
    try {
      // if (modalCreate === true){
      const getProductByProcode = await api_chc.getProductByProcode(procode);
      const { data } = getProductByProcode.data;
      console.log("procode +>", procode);
      console.log("getProductByProcode +>", getProductByProcode.config);
      console.log("getProductByProcode +>", data);
      if (data.pro_noreg === undefined || data === undefined) {
        setProductByProcodeNoReg("");
      }
      setProductByProcode(data);

      setProductByProcodeNoReg(data.pro_noreg);
      if (data.pro_noreg !== undefined) {
        setDisabledBatch(false);
        setDisabledTotal(false);
        setDisabledProddate(false);
        setDisabledExpdate(false);
      }
    } catch (error) {
      console.log(error);
      // if(data.pro_noreg === undefined){
      if (inputProcode.pro_code === "") {
        displayToast("error", "Procode Tidak Tersedia");
      }
      console.log("inputProcode", inputProcode);
      setInputBatch("");
      setInputTotal("");
      setProductByProcodeNoReg("");
      setDisabledBatch(true);
      setDisabledTotal(true);
      setDisabledProddate(true);
      setDisabledExpdate(true);
      setSelectedProdDate("");
      setSelectedExpDateCreate("");
      // }
    }
  }

  const debounceMountCreateMasterQr = useCallback(
    debounce(mountCreateMasterQr, 400)
  );
  async function mountCreateMasterQr() {
    try {
      var payload = {
        data: {
          mtr_nie: productByProcode.pro_noreg,
          mtr_batch: inputBatch,
          mtr_proddate: formatDate(selectedProdDate, "YYMMDD"),
          mtr_expdate: formatDate(selectedExpDateCreate, "YYMMDD"),
          mtr_proname: inputProcode.pro_name,
          mtr_procode: inputProcode.pro_code,
          mtr_jumlah: parseInt(inputTotal),
          mtr_jml_print: 0,
          mtr_generated_by: nip,
        },
      };

      const createMasterQr = await qr.createMasterQr(payload);
      const { data } = createMasterQr.data;
      setModalCreate(false);
      console.log("payload +>", data);
      console.log("nie", data.mtr_nie);
      debounceMountGetListAllQRMasterCode();
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetQrCodeByProcode = useCallback(
    debounce(mountGetQrCodeByProcode, 400)
  );
  async function mountGetQrCodeByProcode(procode) {
    try {
      const getQrByProcode = await qr.getQrCodeByProcode(procode);
      const { data } = getQrByProcode.data;
      if (modalPrint === false) {
        setQrMasterCodeByProcode(data);
      }
      if (modalPrint === true) {
        // setQrMasterCodeByProcode(data);
        setListQRMasterCode(data);
      }
      console.log("modalPrint", modalPrint);
      // setListQRMasterCode(data);
      console.log("*procode =>", inputSearch.pro_code);
      console.log("*GetQrCodeByProcode =>", data);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountSearchMasterQrByProcode = useCallback(
    debounce(mountSearchMasterQrByProcode, 400)
  );

  async function mountSearchMasterQrByProcode(procode) {
    try {
      const serachMasterQrByProcode = await qr.serachMasterQrByProcode(procode);
      const { data } = serachMasterQrByProcode.data;
      // setQrMasterCodeByProcode(data);
      setListQRMasterCode(data);
      console.log("procode =>", inputSearch.pro_code);
      console.log("serachMasterQrByProcode =>", data);
    } catch (error) {
      console.log(error);
    }
  }

  async function printQrCode(e, item, index) {
    setModalPrint(true);
    debounceMountGetQrCodeByProcode(item.mtr_procode);
    setPrintItem(item);
    console.log("printItem", item);
  }

  async function printRangeQrCode() {
    console.log("masuk print range");
    setModalPrintRange(true);
    // debounceMountGetQrCodeByProcode(item.mtr_procode);
  }

  const debounceMountEditJumlah = useCallback(debounce(mountEditJumlah, 400));
  async function mountEditJumlah(e, item, index) {
    let newIsOpen = [...isOpen];
    newIsOpen.splice(index, 1, !newIsOpen[index]);
    setIsOpen(newIsOpen);

    try {
      if (editJumlah === "" || editJumlah === 0) {
        // displayToast("error", "Please ")
        // setEditJumlah(item.mtr_jumlah);
        var payload = {
          data: {
            mtr_jumlah: item.mtr_jumlah,
            mtr_nie: item.mtr_nie,
            mtr_batch: item.mtr_batch,
            mtr_procode: item.mtr_procode,
            // mtr_expdate: formatDate(item.mtr_expdate, "YYYYMMDD"),

            // mtr_jml_print: item.mtr_jml_print,
            // mtr_generatedate: formatDate(item.mtr_generatedate,"YYYYMMDD"),
            // mtr_generated_by: item.mtr_generated_by,
          },
        };
        console.log("jumlah kosong balik ke semula");
        displayToast("error", "Total was not edited");
      } else {
        var payload = {
          data: {
            mtr_jumlah: parseInt(editJumlah),
            mtr_nie: item.mtr_nie,
            mtr_batch: item.mtr_batch,
            mtr_procode: item.mtr_procode,
            // mtr_expdate: formatDate(item.mtr_expdate, "YYYYMMDD"),

            // mtr_jml_print: item.mtr_jml_print,
            // mtr_generatedate: formatDate(item.mtr_generatedate,"YYYYMMDD"),
            // mtr_generated_by: item.mtr_generated_by,
          },
        };
      }

      const editDataJumlah = await qr.updateJumlahQrCode(payload);
      const { data } = editDataJumlah.data;
      // setEditJumlah(data);
      debounceMountGetListAllQRMasterCode();
      console.log("Payload Edit Jumlah", payload);
    } catch (error) {
      console.log(error);
    }
  }

  function changeButton(item, index) {
    return (
      <Box>
        {isOpen[index] === false ? (
          <Button
            size="small"
            variant="contained"
            sx={{
              backgroundColor: "error.main",
            }}
            onClick={(e) => mountEditJumlah(e, item, index)}
            // disabled={disableButtonSave}
          >
            <Save />
          </Button>
        ) : (
          <Button
            size="small"
            variant="contained"
            sx={{
              backgroundColor: "warning.main",
            }}
            onClick={(e) => saveJumlah(e, item, index)}
          >
            <Edit />
          </Button>
        )}

        <Button
          size="small"
          variant="contained"
          // onClick={() => setModalPrint(true)}
          onClick={(e) => printQrCode(e, item, index)}
          sx={{
            // backgroundColor: "green",
            marginLeft: "1em",
          }}
        >
          Print
        </Button>
      </Box>
    );
  }

  const debounceMountGetListAllproduct = useCallback(
    debounce(mountGetListAllProduct, 400)
  );

  async function mountGetListAllProduct() {
    try {
      const getListProduct = await qr.getListAllProduct();
      const { data } = getListProduct.data;
      setListProduct(data);
      console.log("ListProduct =>", data);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetListAllQRMasterCode = useCallback(
    debounce(mountGetListQRMasterCode, 400)
  );

  async function mountGetListQRMasterCode() {
    try {
      const getListMasterQRCode = await qr.getListQRMasterCode();
      const { data } = getListMasterQRCode.data;
      setListQRMasterCode(data);
      console.log("ListQRMasterCode =>", data);
      if (data !== null) {
        setListQRMasterCode(data);

        let arrayOfData = [];
        for (let i = 0; i <= data.length - 1; i++) {
          arrayOfData.push(true);
        }
        setIsOpen(arrayOfData);
        console.log("modalPrint", modalPrint);
      } else {
        setListQRMasterCode([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function saveJumlah(e, item, index) {
    let newIsOpen = [...isOpen];
    newIsOpen.splice(index, 1, !newIsOpen[index]);
    setIsOpen(newIsOpen);
    console.log("isOpen Save", isOpen);
  }

  useEffect(() => {
    debounceMountGetListAllproduct();
    debounceMountGetListAllQRMasterCode();
    console.log("[X|>>>>>|] UseEffect Parent [|<<<<<<|X]");
  }, []);

  // useEffect(() => {

  // }, [Item]);

  function backModal() {
    setModalCreate(false);
    setInputBatch("");
    setInputTotal("");
    setProductByProcodeNoReg("");
    setDisabledBatch(true);
    setDisabledTotal(true);
    setDisabledProddate(true);
    setDisabledExpdate(true);
    setSelectedProdDate("");
    setSelectedExpDateCreate("");
    inputProcode.pro_code = "";
    inputProcode.pro_name = "";
    // console.log("inputProcode", inputProcode);
    // inputProcode.pro_code("");
  }

  function createButton() {
    setModalCreate(true);
    setGenerateDate(formatDate(currentDate, "DD MMMM YYYY"));
    console.log("inputProcode", inputProcode);
  }

  const debounceMountPrintAll = useCallback(debounce(mountPrintAll, 400));

  // async function mountPrintAll() {
  //   try {
  //     var payload = {
  //       data: {
  //         mtr_nie: printItem.mtr_nie,
  //         mtr_batch: printItem.mtr_batch,
  //         mtr_expdate: formatDate(printItem.mtr_expdate, "YYMMDD"),
  //         mtr_procode: printItem.mtr_procode,
  //       },
  //     };
  //     console.log("masukkkkkkkkkkkkkkkkkkkkkkkk2");

  //     const printAlls = await qr.printAll(payload);
  //     const { data } = printAlls.data;
  //     console.log("printAll", printAlls);
  //     console.log("payload", payload);
  //     // console.log("startDate", startDate);
  //     // console.log("endDate", endDate);
  //     // debounceMountListPPNOUT();
  //     setModalPrint(false);
  //   } catch (error) {
  //     console.log("masukkkkkkkkkkkkkkkkkkkkkkkk");
  //     console.log(error);
  //     // setResponseModalIsOpen(true);
  //     // setResponseHeader("Data not Found");
  //     // setResponseBody("");
  //   }
  // }

  async function mountPrintAll() {
    try {
      console.log("masukkkkkkkkkkkkkkkkkkkkkkkk2");

      const printAlls = await qr.printAll(
        printItem.mtr_nie,
        printItem.mtr_batch,
        formatDate(printItem.mtr_expdate, "YYMMDD"),
        printItem.mtr_procode
      );
      // console.log("startDate", startDate);
      // console.log("endDate", endDate);
      // debounceMountListPPNOUT();
    } catch (error) {
      console.log("masukkkkkkkkkkkkkkkkkkkkkkkk");
      console.log(error);
      // setResponseModalIsOpen(true);
      // setResponseHeader("Data not Found");
      // setResponseBody("");
    }
  }

  return (
    <Box
      sx={{ width: "100%", textAlign: "center", background: "", margin: "1%" }}
    >
      <Grid container item xs={10}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mt: 0.5, textAlign: "left", ml: 2, mb: 3 }}
        >
          GENERATE MASTER QR
        </Typography>
      </Grid>

      <Paper sx={{ mt: 5, width: "98%" }}>
        <Grid
          container
          fullWidth
          sx={{
            p: 1,
            pt: 2,
            borderTop: "3px solid smoke",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            // backgroundColor:"",
          }}
        >
          <Grid item sm={5} ml={2}>
            <Autocomplete
              options={listProduct}
              // sx={{ backgroundColor: "white", ml: 3, mt: 5, width: "100%" }}
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
                  label="Search Product by Procode"
                />
              )}
              onChange={(event, newValue) => {
                setInputSearch({
                  ...inputSearch,
                  pro_code: newValue === null ? "" : newValue.pro_code,
                  pro_name: newValue === null ? "" : newValue.pro_name,
                });
                debounceMountSearchMasterQrByProcode(
                  inputSearch.pro_code === "" ? newValue.pro_code : ""
                );
              }}
              value={inputSearch.pro_name === "" ? null : inputSearch}
            />
          </Grid>

          {/* <Grid item sm={0}>
            <FormControl sx={{ width: "10%" }} size="small">
              <Button
                size="small"
                variant="contained"
                // onClick={debounceMountSearchMasterQrByProcode(inputSearch.pro_code)}
                sx={{
                  mt: 0.5,
                }}
              >
                select 1
              </Button>
            </FormControl>
          </Grid> */}

          <Grid item sm={2} border={0}>
            <FormControl
              size="small"
              sx={{
                // position:"",
                left: 350,
              }}
            >
              <Button
                size="small"
                variant="contained"
                onClick={() => createButton()}
                sx={{
                  mt: 0.5,
                  backgroundColor: "green",
                }}
              >
                Create
              </Button>
            </FormControl>
          </Grid>
        </Grid>

        <Divider objectFit="contain" sx={{ mt: 0 }} />
        <Divider objectFit="contain" />
        <Divider objectFit="contain" />
        <Table>
          <TableHead>
            <TableRow>
              {tableHeader &&
                tableHeader.map((head, index) => (
                  <StyledTableCell
                    sx={{
                      fontWeight: "600",
                      textAlign: "center",
                      // textAlign:
                      //   head.name === "COA" || head.name === "Keterangan COA"
                      //     ? "left"
                      //     : "right",
                    }}
                    key={index}
                  >
                    {head.name}
                  </StyledTableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {listQRMasterCode &&
              listQRMasterCode.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.mtr_nie}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.mtr_batch}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.mtr_proddate === "" || item.mtr_proddate === null
                      ? "-"
                      : formatDate(item.mtr_proddate, "DD MMMM YYYY")}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.mtr_expdate === "" || item.mtr_expdate === null
                      ? "-"
                      : formatDate(item.mtr_expdate, "DD MMMM YYYY")}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.mtr_procode}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {isOpen[index] === false ? (
                      <FormControl>
                        <TextField
                          size="small"
                          variant="outlined"
                          sx={{ width: "7em" }}
                          // label={item.mtr_jumlah}
                          value={editJumlah}
                          onChange={(e) => setEditJumlah(e.target.value)}
                          // disabled={editJumlah === "" ? true : false}
                        ></TextField>
                      </FormControl>
                    ) : item.mtr_jumlah === "" || item.mtr_jumlah === null ? (
                      "-"
                    ) : (
                      item.mtr_jumlah
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.mtr_jml_print}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.mtr_generatedate === "" ||
                    item.scan_submitdate === null
                      ? "-"
                      : formatDate(item.mtr_generatedate, "DD MMMM YYYY")}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.mtr_generated_by}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {changeButton(item, index)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Divider objectFit="contain" sx={{ mt: 0 }} />
        <Divider objectFit="contain" />
        <Divider objectFit="contain" />

        {/* <Grid>
          <Stack direction="row" spacing={2} justifyContent="center"
          sx={{ 
            mx: 5, 
          // background:"yellow", 
          }}> 

            <FormControl>
              <Button
                variant="contained">
                  Generate
              </Button>
            </FormControl>
          
          </Stack>
        </Grid> */}
        <Modal open={modalCreate}>
          <Box sx={styleModalCreate}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              // component="h2"

              textAlign="center"
              sx={{
                mb: 0.0,
                fontWeight: 600,
                // borderBottom: "5px solid lightgrey",
              }}
            >
              Create New QR Code
            </Typography>
            <Divider objectFit="contain" sx={{ mt: 0 }} />
            <Divider objectFit="contain" />
            <Divider objectFit="contain" />
            <Divider objectFit="contain" />
            <Divider objectFit="contain" />

            <Grid
              // full grid
              container
              fullWidth
              sx={{
                p: 1,
                // backgroundColor: "green",
              }}
            >
              <Grid
                container
                width="60%"
                sx={{
                  p: 1,
                  // backgroundColor: "blue",
                }}
              >
                <Grid
                  container
                  fullWidth
                  sx={{
                    p: 1,
                    // backgroundColor: "yellow",
                  }}
                >
                  <FormControl fullWidth sx={{ border: "" }}>
                    <Grid
                      container
                      fullWidth
                      sx={
                        {
                          // border: "2px solid red",
                        }
                      }
                    >
                      <Grid item sm={3} sx={{ backgroundColor: "", mt: 1 }}>
                        <Typography
                          variant="h7"
                          sx={{ marginTop: 3, fontWeight: 600, border: "" }}
                        >
                          Procode
                        </Typography>
                      </Grid>
                      <Grid item sm={0.5} sx={{ backgroundColor: "", mt: 1 }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600, border: "" }}
                        >
                          :
                        </Typography>
                      </Grid>

                      <Grid item sm={8.5} border="">
                        <Autocomplete
                          options={listProduct}
                          // sx={{ backgroundColor: "white", ml: 3, mt: 5, width: "100%" }}
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
                              label="Select Procode"
                            />
                          )}
                          onChange={(event, newValue) => {
                            setInputProcode({
                              ...inputProcode,
                              pro_code:
                                newValue === null ? "" : newValue.pro_code,
                              pro_name:
                                newValue === null ? "" : newValue.pro_name,
                            }),
                              debounceMountGetProductByProcode(
                                inputProcode.pro_code === ""
                                  ? newValue.pro_code
                                  : ""
                              ),
                              console.log("masukprocode", inputProcode);
                          }}
                          value={
                            inputProcode.pro_name === "" ? null : inputProcode
                          }
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>

                <Grid
                  container
                  fullWidth
                  sx={{
                    p: 1,
                    // backgroundColor: "orange",
                  }}
                >
                  <FormControl fullWidth sx={{ border: "", mb: 1 }}>
                    <Grid
                      container
                      item
                      fullWidth
                      sx={
                        {
                          // border: "2px solid red",
                        }
                      }
                    >
                      <Grid item sm={3} sx={{ backgroundColor: "", mt: 1 }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600 }}
                        >
                          Batch
                        </Typography>
                      </Grid>
                      <Grid item sm={0.5} sx={{ backgroundColor: "", mt: 1 }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600, border: "" }}
                        >
                          :
                        </Typography>
                      </Grid>

                      <Grid item sm={8.5}>
                        <TextField
                          size="small"
                          type="text"
                          textAlign="right"
                          // label="Input Batch"
                          placeholder={"Input Batch Number"}
                          onChange={(e) => setInputBatch(e.target.value)}
                          // width="100%"
                          fullWidth
                          disabled={disabledBatch}
                        ></TextField>
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth sx={{ border: "", mb: 1, mt: 1 }}>
                    <Grid
                      container
                      item
                      fullWidth
                      sx={
                        {
                          // border: "2px solid red",
                        }
                      }
                    >
                      <Grid item sm={3} sx={{ backgroundColor: "", mt: 1 }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600 }}
                        >
                          Total
                        </Typography>
                      </Grid>
                      <Grid item sm={0.5} sx={{ backgroundColor: "", mt: 1 }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600, border: "" }}
                        >
                          :
                        </Typography>
                      </Grid>

                      <Grid item sm={8.5}>
                        <TextField
                          size="small"
                          type="number"
                          textAlign="right"
                          // label="Input Total"
                          placeholder={"Input Total"}
                          onChange={(e) => setInputTotal(e.target.value)}
                          // width={1000}
                          fullWidth
                          disabled={disabledTotal}
                        ></TextField>
                      </Grid>
                    </Grid>
                  </FormControl>

                  <FormControl fullWidth sx={{ border: "", mb: 1, mt: 1 }}>
                    <Grid
                      container
                      item
                      fullWidth
                      sx={{
                        py: 0.5,
                        // border: "2px solid red",
                      }}
                    >
                      <Grid item sm={3} sx={{ backgroundColor: "" }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600 }}
                        >
                          Production Date
                        </Typography>
                      </Grid>
                      <Grid item sm={0.5} sx={{ backgroundColor: "" }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600, border: "" }}
                        >
                          :
                        </Typography>
                      </Grid>

                      <Grid item flex={2}>
                        <DesktopDatePicker
                          label="Production Date"
                          value={selectedProdDate}
                          onChange={(newValue) => {
                            setSelectedProdDate(newValue);
                          }}
                          disabled={disabledProddate}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              {...params}
                              sx={{ background: "white", width: "100%" }}
                              disabled={disabledProddate}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>

                  <FormControl fullWidth sx={{ border: "", mb: 1, mt: 1 }}>
                    <Grid
                      container
                      item
                      fullWidth
                      sx={{
                        py: 0.5,
                        // border: "2px solid red",
                      }}
                    >
                      <Grid item sm={3} sx={{ backgroundColor: "" }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600 }}
                        >
                          Expired Date
                        </Typography>
                      </Grid>
                      <Grid item sm={0.5} sx={{ backgroundColor: "" }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600, border: "" }}
                        >
                          :
                        </Typography>
                      </Grid>

                      <Grid item flex={2}>
                        <DesktopDatePicker
                          label="Expired Date"
                          value={selectedExpDateCreate}
                          onChange={(newValue) => {
                            setSelectedExpDateCreate(newValue);
                          }}
                          disabled={disabledProddate}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              {...params}
                              sx={{ background: "white", width: "100%" }}
                              disabled={disabledExpdate}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>

                  <FormControl fullWidth sx={{ border: "", mb: 1 }}>
                    <Grid
                      container
                      item
                      fullWidth
                      sx={{
                        py: 0.5,
                        // border: "2px solid red",
                      }}
                    >
                      <Grid item sm={3} sx={{ backgroundColor: "" }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600 }}
                        >
                          NIE
                        </Typography>
                      </Grid>
                      <Grid item sm={0.5} sx={{ backgroundColor: "" }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600, border: "" }}
                        >
                          :
                        </Typography>
                      </Grid>

                      <Grid item sm={8.5}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 500 }}
                        >
                          {/* abcdefgh */}
                          {/* {productByProcode.pro_noreg} */}
                          {productByProcode === "" ||
                          productByProcodeNoReg === "" ||
                          productByProcodeNoReg === null
                            ? "-"
                            : productByProcodeNoReg}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>

                  <FormControl fullWidth sx={{ border: "", mb: 1 }}>
                    <Grid
                      container
                      item
                      fullWidth
                      sx={{
                        py: 0.5,
                        // border: "2px solid red",
                      }}
                    >
                      <Grid item sm={3} sx={{ backgroundColor: "" }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600 }}
                        >
                          Print Count
                        </Typography>
                      </Grid>
                      <Grid item sm={0.5} sx={{ backgroundColor: "" }}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 600, border: "" }}
                        >
                          :
                        </Typography>
                      </Grid>

                      <Grid item sm={8.5}>
                        <Typography
                          variant="h7"
                          sx={{ mt: 0, fontWeight: 500 }}
                        >
                          {printCount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid
                // grid kanan
                container
                width="40%"
                height="0"
                sx={{
                  mt: 1.5,
                  p: 1,
                  // backgroundColor: "red",
                }}
              >
                <FormControl fullWidth sx={{ border: "", mb: 1 }}>
                  <Grid
                    container
                    item
                    fullWidth
                    sx={{
                      py: 0.5,
                      border: "",
                    }}
                  >
                    <Grid
                      item
                      sm={5.5}
                      sx={{ backgroundColor: "", border: "" }}
                    >
                      <Typography variant="h7" sx={{ mt: 0, fontWeight: 600 }}>
                        Generated By
                      </Typography>
                    </Grid>
                    <Grid item sm={0.5} sx={{ backgroundColor: "" }}>
                      <Typography
                        variant="h7"
                        sx={{
                          mt: 0,
                          fontWeight: 600,
                          border: "",
                        }}
                      >
                        :
                      </Typography>
                    </Grid>

                    <Grid item sm={4}>
                      <Typography variant="h7" sx={{ mt: 0, fontWeight: 500 }}>
                        {nip}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>

                <FormControl fullWidth sx={{ border: "", mb: 1 }}>
                  <Grid
                    container
                    item
                    fullWidth
                    sx={{
                      mt: 2,
                      pb: 1,
                      // border: "2px solid red",
                    }}
                  >
                    <Grid
                      item
                      sm={5.5}
                      sx={{ backgroundColor: "", border: "" }}
                    >
                      <Typography variant="h7" sx={{ mt: 0, fontWeight: 600 }}>
                        Generate Date
                      </Typography>
                    </Grid>
                    <Grid item sm={0.5} sx={{ backgroundColor: "" }}>
                      <Typography
                        variant="h7"
                        sx={{
                          mt: 0,
                          fontWeight: 600,
                          border: "",
                        }}
                      >
                        :
                      </Typography>
                    </Grid>

                    <Grid item sm={5}>
                      <Typography variant="h7" sx={{ mt: 0, fontWeight: 500 }}>
                        {generateDate}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>

                <FormControl fullWidth sx={{ border: "", mb: 1 }}>
                  <Grid
                    textAlign="center"
                    justifyContent={"center"}
                    container
                    item
                    fullWidth
                    sx={{
                      mt: 2,
                      pb: 1,
                      // border: "2px solid red",
                    }}
                  >
                    <Grid
                      textAlign="center"
                      item
                      sm={13}
                      sx={{ backgroundColor: "", border: "" }}
                    >
                      <Button
                        size="small"
                        fullWidth
                        variant="contained"
                        onClick={() => debounceMountCreateMasterQr()}
                        sx={
                          {
                            // backgroundColor: "green",
                          }
                        }
                        disabled={!isEnabled}
                      >
                        Create 1
                      </Button>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
            </Grid>

            {/* <Grid textAlign="center">
              <Button
                size="small"
                variant="contained"
                onClick={() => setModalCreate(false)}
                sx={
                  {
                    // backgroundColor: "green",
                  }
                }
              >
                Create
              </Button>
            </Grid> */}

            <Grid textAlign="right">
              <Button
                size="small"
                variant="contained"
                // onClick={() => setModalCreate(false)}
                onClick={() => backModal()}
                sx={{
                  mt: 2,
                  // backgroundColor: "green",
                }}
              >
                Back 1 <ArrowBackTwoTone />
              </Button>
            </Grid>
          </Box>
        </Modal>

        <Modal open={modalPrint}>
          <Box sx={styleModalPrint}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              fontWeight="600"
              textAlign="center"
              sx={{ mb: 2 }}
            >
              Print QR Code
            </Typography>

            <Divider objectFit="contain" sx={{ mt: 0 }} />
            <Divider objectFit="contain" />
            <Divider objectFit="contain" />

            <Table>
              <TableHead>
                <TableRow>
                  {tableHeader2 &&
                    tableHeader2.map((head, index) => (
                      <StyledTableCell
                        sx={{
                          fontWeight: "600",
                          textAlign: "center",
                          // textAlign:
                          //   head.name === "COA" || head.name === "Keterangan COA"
                          //     ? "left"
                          //     : "right",
                        }}
                        key={index}
                      >
                        {head.name}
                      </StyledTableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {qrMasterCodeByProcode &&
                  qrMasterCodeByProcode.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.mtr_nie}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.mtr_batch}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.mtr_expdate === "" || item.mtr_expdate === null
                          ? "-"
                          : formatDate(item.mtr_expdate, "DD MMMM YYYY")}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.mtr_procode}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.mtr_jumlah}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.mtr_jml_print}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.mtr_generatedate === "" ||
                        item.scan_submitdate === null
                          ? "-"
                          : formatDate(item.mtr_generatedate, "DD MMMM YYYY")}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.mtr_generated_by}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* {qrMasterCodeByProcode &&
              qrMasterCodeByProcode.map((item, index) => (
                <Typography
                  id="modal-modal-title"
                  // variant="h6"
                  component="h2"
                  // fontWeight= "600"
                  // textAlign="center"
                  sx={{ py: 2 }}
                >
                  Code QR : {item.mtr_nie}
                </Typography>
              ))} */}

            <Divider objectFit="contain" sx={{ mt: 0 }} />
            <Divider objectFit="contain" />
            <Divider objectFit="contain" />

            <Grid
              sx={{
                py: 1,
                textAlign: "center",
                // backgroundColor: "grey",
              }}
            >
              <Button
                size="small"
                variant="contained"
                onClick={() => debounceMountPrintAll()}
                sx={{
                  ml: 2,
                  // backgroundColor: "green",
                }}
              >
                Print All
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={() => printRangeQrCode()}
                sx={{
                  ml: 2,
                  // backgroundColor: "green",
                }}
              >
                Print Range
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={() => setModalPrint(false)}
                sx={{
                  ml: 2,
                  // backgroundColor: "green",
                }}
              >
                Print Single
              </Button>
            </Grid>

            <Divider objectFit="contain" sx={{ mt: 0 }} />
            <Divider objectFit="contain" />
            <Divider objectFit="contain" />
            <Divider objectFit="contain" sx={{ mb: 2 }} />

            <Grid sx={{ textAlign: "right" }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setModalPrint(false);
                  debounceMountGetListAllQRMasterCode();
                }}
                sx={{
                  ml: 2,
                  // backgroundColor: "green",
                }}
              >
                Back
              </Button>
            </Grid>
          </Box>
        </Modal>

        <Modal open={modalPrintRange}>
          <Box sx={styleModalPrintRange}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              textAlign="center"
              sx={{
                mb: 1,
              }}
            >
              Print Range
            </Typography>
            <Divider objectFit="contain" sx={{ mt: 0 }} />
            <Divider objectFit="contain" />
            <Divider objectFit="contain" />

            <Grid container fullWidth sx={{ p: 2, backgroundColor: "" }}>
              <TextField
                size="small"
                variant="outlined"
                sx={{ width: "5em" }}
                label={"Min"}
                // value={editJumlah}
                onChange={(e) => setEditJumlah(e.target.value)}
                // disabled={editJumlah === "" ? true : false}
              ></TextField>

              <Typography
                variant="h6"
                component="h2"
                sx={{
                  mt: 0.4,
                  mx: 2,
                }}
              >
                --
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                sx={{ width: "5em" }}
                label={"Max"}
                value={editJumlah}
                onChange={(e) => setEditJumlah(e.target.value)}
                // disabled={editJumlah === "" ? true : false}
              ></TextField>

              <Button
                size="small"
                variant="contained"
                sx={{
                  ml: 2,
                  mt: 0,
                }}
              >
                Print
              </Button>
            </Grid>

            <Grid textAlign="right">
              <Button
                size="small"
                variant="contained"
                onClick={() => setModalPrintRange(false)}
                sx={{
                  mt: 2,
                  // backgroundColor: "green",
                }}
              >
                Back 1 <ArrowBackTwoTone />
              </Button>
            </Grid>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
};

export default GenerateMasterQR;
