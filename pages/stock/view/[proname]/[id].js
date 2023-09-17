import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
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
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput,
  Radio,
  RadioGroup,
  FormGroup,
  FormLabel,
  radioClasses,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { debounce,isUndefined } from "lodash";

import api from "../../../../services/stock";
import Link from "../../../../utils/link";
import { formatDate } from "../../../../utils/text";
import useToast from "../../../../utils/toast";
import useResponsive from "../../../../utils/responsive";
import { getStorage } from "../../../../utils/storage";

import CircularProgress from "@mui/material/CircularProgress";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import { ArrowBack } from "@mui/icons-material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import SearchIcon from "@mui/icons-material/Search";

const initialResultBatch = {
  stck_batchnumber: "",
  stck_expdate: "",
  stck_outcode: "",
  stck_procod: "",
  stck_qtyavailable: 0,
  stck_qtybook: 0,
  stck_qtystock: 0,
};

const initialEditBatchDeff = [
  {
    batchLama: "",
    qtyLama: 0,
    batchBaru: "",
    qtyBaru: 0,
  },
];

const StockDetail = (props) => {
  const router = useRouter();
  const [displayToast] = useToast();

  const pt_id = getStorage("pt");
  const pt = JSON.parse(pt_id).pt_id;
  const outcodeData = getStorage("outlet");
  const outcode = JSON.parse(outcodeData).out_code;
  const userNIP = getStorage("userNIP");
  const procod = router.query.id;
  var [proname, setProname] = useState('')

  // const language = 'EN';
  var language = props.language;
  const isMobile = useResponsive().isMobile;
  var [accessStock, setAccessStock] = useState([]);

  const debounceMountListStockDetail = useCallback(
    debounce(mountListStockDetail, 400),
    []
  );

  const debounceMountUpdateBatch = useCallback(
    debounce(mountUpdateBatch, 400),
    []
  );
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!parsedAccess["LOGISTIC_STOCK"].includes("LOGISTIC_STOCK_VIEW")) {
        router.push("/403");
      }
      setAccessStock((accessStock = parsedAccess.LOGISTIC_STOCK))
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.proname !== ''){
      var decodeProname = atob(router.query.proname)

      setProname((proname = decodeProname))
    }

    debounceMountListStockDetail(procod, pt, outcode, inputSearch, params);
  }, [router.isReady]);

  const [result, setResult] = useState([]);

  const [inputSearch, setInputSearch] = useState("");
  const [totalData, setTotalData] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    length: 5,
  });

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#e0e0e0",
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: "start",
    color: theme.palette.text.secondary,
  }));

  const [isLoading, setIsLoading] = useState(false);

  var [dataAvailable, setDataAvailable] = useState(false);

  var [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  var [modalConfirmEditIsOpen, setModalConfirmEditIsOpen] = useState(false);
  var [objStock, setObjStock] = useState({});
  var [currBatch, setCurrBatch] = useState(initialResultBatch);
  var [editBatchDeff, setEditBatchDeff] = useState(initialEditBatchDeff[0]);
  var [qtyBaru, setQtyBaru] = useState(0);
  var [disabledDropdown, setDisabledDropdown] = useState(false);
  var [disabledInput, setDisabledInput] = useState(false);
  var [isEnabledUpdate, setIsEnabledUpdate] = useState(canBeUpdate());
  var [expiredDate, setExpiredDate] = useState("");
  var [invalidDate, setInvalidDate] = useState(false);
  var today = new Date().toJSON().slice(0, 10);

  const [radioValue, setRadioValue] = useState("");
  var [showDropdown, setShowDropdown] = useState(false);
  var [showField, setShowField] = useState(false);
  var [selectDropdown, setSelectDropdown] = useState(0);

  function resetEditBatchDeff() {
    setEditBatchDeff((editBatchDeff = initialEditBatchDeff[0]));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (modalEditIsOpen === false) {
      var dropdownChecked = document.getElementById("checkboxDropdown");
      var inputChecked = document.getElementById("checkboxInput");
      var dropdownDisabled = document.getElementById("batchBaruDropdown");
      var inputDisabled = document.getElementById("batchBaru");
      var tanggalExpired = document.getElementById("tanggalExpired");

      resetEditBatchDeff();
      updateInputValue(0, "qtyBaru");

      setDisabledDropdown(false);
      setDisabledInput(false);
      setExpiredDate(""); //31/12/21
      setInvalidDate(false);
      setSelectDropdown(0);
      // dropdownChecked.checked = false
      // inputChecked.checked = false
      // inputDisabled.value = ''
      // tanggalExpired.value = ''
      // dropdownDisabled.value = 0
      // inputDisabled.style.display = 'none'
      // dropdownDisabled.style.display = 'none'
      // tanggalExpired.style.display = 'none'
      setShowDropdown(false);
      setShowField(false);
      setRadioValue("");

      // debounceMountListStockDetail(inputSearch, outcode, pt, router.query.id, 'DESC', params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalEditIsOpen]);

  async function mountListStockDetail(procod, pt, outcode, batch, params) {
    try {
      setDataAvailable((dataAvailable = true));
      const getStockDetail = await api.getStockDetailBatch(
        procod,
        pt,
        outcode,
        batch,
        params
      );
      const { data, metadata, error } = getStockDetail.data;
      // console.log("data detail stock", getStockDetail);
      setResult(data);
      setDataAvailable(false);

      if (error.status === true) {
        displayToast("error", error.msg);
        if (error.code === 401) {
          displayToast("error", "Token is expired please login again !");
          window.sessionStorage.clear();
          // window.location.href('/#/login')
        }
      } else {
        if (data === null) {
          setResult([]);
        } else {
          setResult(data);
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

  async function mountUpdateBatch(
    payload,
    procod,
    pt,
    outcode,
    inputsearch,
    params
  ) {
    try {
      // console.log('hit ke be update', payload)
      setIsLoading(true);
      const updateStock = await api.updateBatch(payload);
      const { error } = updateStock.data;
      // console.log('TEST DATA update', updateStock)

      if (error.status === false) {
        displayToast(
          "success",
          error.msg === "" ? "Success to edit batch!" : error.msg
        );
      } else {
        displayToast("error", error.msg);
      }

      debounceMountListStockDetail(procod, pt, outcode, inputsearch, params);

      setModalEditIsOpen(false);
      setModalConfirmEditIsOpen(false);
      setIsLoading(false);
    } catch (error) {
      // console.log('update err', error);
      console.log(error);
      setIsLoading(false);
      displayToast(
        "error",
        language === "EN"
          ? "Failed to connect to server"
          : "Koneksi ke server gagal."
      );
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
    debounceMountListStockDetail(procod, pt, outcode, inputSearch, newParams);
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
    debounceMountListStockDetail(procod, pt, outcode, inputSearch, newParams);
  };

  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      // setCurrentPage((currentPage = 1))
      // setDataAvailable(false)
      const newParams = {
        ...params,
        page: 0,
        length: params.length,
      };
      setParams(newParams);

      setDataAvailable(false);
      debounceMountListStockDetail(procod, pt, outcode, inputSearch, newParams);
    }
  };

  function validateTgl(e) {
    var d1 = Date.parse(today);
    var d2 = Date.parse(e);

    if (isNaN(d2)) {
      // console.log('isNaN(d2)')
      setInvalidDate(true);
      setIsEnabledUpdate((isEnabledUpdate = canBeUpdate()));
    } else {
      if (d1 > d2) {
        // showNotification('The End Date cannot be less than the Start Date! ', 'error')
        setInvalidDate(true);
        setExpiredDate((expiredDate = e));
        setIsEnabledUpdate((isEnabledUpdate = canBeUpdate()));
      } else {
        // console.log('else')
        setInvalidDate(false);
        setExpiredDate((expiredDate = e));
        setIsEnabledUpdate((isEnabledUpdate = canBeUpdate()));
      }
    }
  }

  function ToggleEdit(todo) {
    setModalEditIsOpen(true);
    // console.log('TODO toggle edit : ', todo)
    setCurrBatch(todo);
    setQtyBaru((qtyBaru = todo.stck_qtystock));
    setEditBatchDeff(
      (editBatchDeff = {
        qtyLama: todo.stck_qtystock,
        batchLama: todo.stck_batchnumber,
        qtyBaru: 0,
        batchBaru: "",
      })
    );
  }

  function updateInputValue(value, field) {
    let newEditBatchDeff = editBatchDeff;
    newEditBatchDeff[field] = value;
    var qtyStock = isNaN(currBatch.stck_qtystock) ? 0 : currBatch.stck_qtystock;
    var qtyBaru = isNaN(editBatchDeff.qtyBaru) ? 0 : editBatchDeff.qtyBaru;

    if (field === "qtyBaru") {
      setEditBatchDeff((editBatchDeff = newEditBatchDeff));
      setQtyBaru((qtyBaru = qtyStock - qtyBaru));
      setIsEnabledUpdate((isEnabledUpdate = canBeUpdate()));
      // console.log('NEW EDIT BATCH : ', editBatchDeff.qtyBaru)
      // console.log('QTY BARUU : ', qtyBaru)
    } else {
      setEditBatchDeff((editBatchDeff = newEditBatchDeff));
      setIsEnabledUpdate((isEnabledUpdate = canBeUpdate()));
      // console.log('CAN BE UPDATE : ', canBeUpdate(), isEnabledUpdate)
      // console.log('NEW EDIT BATCH : ', editBatchDeff)
    }
  }

  function handleClick(evt) {
    setRadioValue((radioValue = evt.target.value));
    // console.log('radio value', evt.target.value)

    var dropdownChecked = document.getElementById("checkboxDropdown");
    var inputChecked = document.getElementById("checkboxInput");
    var dropdownDisabled = document.getElementById("batchBaruDropdown");
    var inputDisabled = document.getElementById("batchBaru");
    var tanggalExpired = document.getElementById("tanggalExpired");
    var dropdownValue = document.getElementById("batchBaruDropdownValue");
    var inputBatch = document.getElementById("batchBaru");
    // var deff = document.getElementById('deff');

    // if (dropdownChecked.checked) {

    //   setDisabledDropdown(false)
    //   setDisabledInput(true)
    //   inputDisabled.value = ''
    //   inputDisabled.style.display = 'none'
    //   dropdownDisabled.style.display = 'block'
    //   tanggalExpired.style.display = 'none'

    //   setExpiredDate((expiredDate = ''))
    //   setIsEnabledUpdate(false)
    // }
    // console.log('dropdown', dropdownDisabled)

    if (radioValue === "1") {
      setDisabledDropdown(false);
      setDisabledInput(true);
      // inputDisabled.value = ''
      // inputDisabled.style.display = 'none'
      // dropdownDisabled.style.display = 'block'
      // tanggalExpired.style.display = 'none'
      inputBatch.value = "";
      editBatchDeff.batchBaru = "";
      setShowDropdown((showDropdown = true));
      setShowField((showField = false));
      setExpiredDate((expiredDate = ""));
      setIsEnabledUpdate((isEnabledUpdate = false));
      // console.log('dropdown value', selectDropdown)
    }

    if (radioValue === "2") {
      setDisabledInput(false);
      setDisabledDropdown(true);
      setShowDropdown((showDropdown = false));
      setShowField((showField = true));
      // inputDisabled.value = ''
      // dropdownDisabled.value = 0
      // dropdownDisabled.style.display = 'none'
      // inputDisabled.style.display = 'block'
      // tanggalExpired.style.display = 'block'
      // dropdownValue.firstChild.nodeValue = ''
      // dropdownValue.value = 0
      setSelectDropdown(0);
      setEditBatchDeff({ ...editBatchDeff, batchBaru: "" });
      setExpiredDate("");
      setIsEnabledUpdate((isEnabledUpdate = false));
      // console.log('dropdown value', selectDropdown)
    }

    // if (inputChecked.checked) {

    //   setDisabledInput(false)
    //   setDisabledDropdown(true)
    //   // setPilihBatch('')
    //   inputDisabled.value = ''
    //   dropdownDisabled.value = 0
    //   dropdownDisabled.style.display = 'none'
    //   inputDisabled.style.display = 'block'
    //   tanggalExpired.style.display = 'block'
    //   setEditBatchDeff({...editBatchDeff, batchBaru : ''})
    //   setExpiredDate('')
    //   setIsEnabledUpdate(false)
    // }
  }

  const setBatch = (event) => {
    var inputDisabled = document.getElementById("batchBaru");

    setSelectDropdown((selectDropdown = event.target.value));

    var found = result.find(function (element) {
      return element.stck_batchnumber === selectDropdown;
    });
    // console.log('event value', selectDropdown)

    // console.log('found', found)

    setEditBatchDeff(
      (editBatchDeff = {
        batchBaru: event.target.value,
        batchLama: editBatchDeff.batchLama,
        qtyLama: editBatchDeff.qtyLama,
        qtyBaru: editBatchDeff.qtyBaru,
      })
    );

    setExpiredDate((expiredDate = found.stck_expdate));

    inputDisabled.value = "";
    setIsEnabledUpdate((isEnabledUpdate = canBeUpdate()));
  };

  function updateStock(first_param) {
    var updateStock = first_param;

    setIsLoading((isLoading = true));

    var payload = {}; //31/12/21

    if (expiredDate === "") {
      payload = {
        batchbaru: updateStock.batchBaru,
        batchlama: updateStock.batchLama,
        qtybaru: updateStock.qtyBaru,
        updatedby: userNIP,
        expireddate: new Date(),
        outcode: outcode,
        procod: procod[0],
        pt: pt,
      };
    } else {
      payload = {
        batchbaru: updateStock.batchBaru,
        batchlama: updateStock.batchLama,
        qtybaru: updateStock.qtyBaru,
        updatedby: userNIP,
        expireddate: new Date(expiredDate),
        outcode: outcode,
        procod: procod,
        pt: pt,
      };
    }

    debounceMountUpdateBatch(payload, procod, pt, outcode, inputSearch, params);
  }

  function canBeUpdate() {
    var dropdownChecked = document.getElementById("checkboxDropdown");
    var inputChecked = document.getElementById("checkboxInput");
    var namaLama = currBatch && currBatch.stck_batchnumber;
    var nilaiLama = parseInt(currBatch && currBatch.stck_qtystock);
    var namaBaru = editBatchDeff.batchBaru;
    var nilaiBaru = parseInt(editBatchDeff.qtyBaru);
    var tanggalExpired = expiredDate;
    var d1 = Date.parse(today);
    var d2 = Date.parse(expiredDate);

    // console.log('CAN BE UPDATED', namaLama, nilaiLama, namaBaru, nilaiBaru, tanggalExpired);
    //  console.log('CAN BE UPDATED', dropdownChecked, inputChecked);

    if (dropdownChecked === null || inputChecked === null) {
      dropdownChecked = false;
      inputChecked = false;
    }
    // console.log('CHECKED', dropdownChecked.checked, inputChecked.checked)
    // if (dropdownChecked.checked){
    //   // console.log('canBeUpdate Dropdown checked',
    //   //   namaLama !== namaBaru ,
    //   //   namaBaru !== '' ,
    //   //   nilaiBaru !== '' ,
    //   //   nilaiLama !== nilaiBaru,
    //   //   !isNaN(nilaiBaru)
    //   // )
    //   return (
    //     namaLama !== namaBaru &&
    //     namaBaru !== '' &&
    //     nilaiBaru !== '' &&
    //     nilaiLama !== nilaiBaru &&
    //     !isNaN(nilaiBaru)
    //   );
    // }

    // if(inputChecked.checked){
    //   // console.log('input checked',

    //   // namaLama ,
    //   // editBatchDeff.batchBaru ,
    //   // nilaiBaru,
    //   // nilaiLama,
    //   // !isNaN(nilaiBaru),
    //   // tanggalExpired,
    //   // d2 >= d1
    //   // )

    //   return (
    //     namaLama !== editBatchDeff.batchBaru &&
    //     editBatchDeff.batchBaru !== '' &&
    //     nilaiBaru !== '' &&
    //     nilaiLama !== nilaiBaru &&
    //     !isNaN(nilaiBaru) &&
    //     tanggalExpired !== '' &&
    //     d2 >= d1
    //   );
    // }

    if (radioValue === "1") {
      return (
        namaLama !== namaBaru &&
        namaBaru !== "" &&
        nilaiBaru !== "" &&
        nilaiLama !== nilaiBaru &&
        !isNaN(nilaiBaru)
      );
    }

    if (radioValue === "2") {
      return (
        namaLama !== editBatchDeff.batchBaru &&
        editBatchDeff.batchBaru !== "" &&
        nilaiBaru !== "" &&
        nilaiLama !== nilaiBaru &&
        !isNaN(nilaiBaru) &&
        tanggalExpired !== "" &&
        d2 >= d1
      );
    }
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Link href="/stock">
            <IconButton aria-label="back">
              <ArrowBack />
            </IconButton>
          </Link>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Detail Inventory Stock
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid item xs={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {proname} ({router.query.id})
          </Typography>
        </Grid>
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
            placeholder={
              language === "EN" ? "Search Batch..." : "Cari Batch..."
            }
            sx={{ bgcolor: "white" }}
            onChange={(e) => setInputSearch((inputSearch = e.target.value))}
            onKeyPress={(event) => enterPressed(event)}
          />
        </Grid>
      </Grid>

      <Paper sx={{ width: "100%", my: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Batch
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Expiry Date" : "Kadaluarsa"}
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
                {accessStock.includes("LOGISTIC_STOCK_EDIT") && // 26/01/2023 ada akses edit
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Edit Batch
                    </Typography>
                  </TableCell>
                }
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
              ) : result ? (
                result.map((item) => (
                  <TableRow key={item.stck_batchnumber}>
                    <TableCell>
                      {item.stck_batchnumber === ""
                        ? "-"
                        : item.stck_batchnumber}
                    </TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      {formatDate(item.stck_expdate, "ddd MMMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">{item.stck_qtystock}</TableCell>
                    <TableCell align="center">{item.stck_qtybook}</TableCell>
                    <TableCell align="center">
                      {item.stck_qtyavailable}
                    </TableCell>
                    {accessStock.includes("LOGISTIC_STOCK_EDIT") && // 26/01/2023 ada akses edit
                      <TableCell align="center">
                        <IconButton color="info" onClick={() => ToggleEdit(item)}>
                          <EditIcon fontSize="medium" />
                        </IconButton>
                      </TableCell>
                    }
                    <TableCell align="center">
                      <Link
                        href={`/stock/detailStockTurnover/${router.query.proname}/${router.query.id}/${item.stck_batchnumber}`}
                        sx={{ textDecoration: "none" }}
                      >
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

      {/* MODAL EDIT */}
      <Dialog
        open={modalEditIsOpen}
        onClose={() => setModalEditIsOpen(false)}
        fullWidth
        PaperProps={{ sx: { position: "fixed", top: 10 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Edit Batch
          </Typography>
        </DialogTitle>
        <Divider sx={{ mb: 0.5 }} />
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Batch
          </Typography>
          <Item>&nbsp;{currBatch && currBatch.stck_batchnumber}</Item>
          <FormGroup>
            <Grid container sx={{ mt: 3 }}>
              <Grid item xs={2} sx={{ pt: 1 }}>
                <Typography variant="body1">
                  {language === "EN" ? "Current Qty" : "Qty Saat Ini"}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Item>&nbsp;{currBatch && currBatch.stck_qtystock}</Item>
              </Grid>
              <Grid item xs={2} sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body1">
                  {language === "EN" ? "New Qty" : "Qty Baru"}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <OutlinedInput
                  type="number"
                  size="small"
                  placeholder="Fill Quantity"
                  sx={{ bgcolor: "white" }}
                  value={parseInt(editBatchDeff && editBatchDeff.qtyBaru)}
                  onChange={(e) =>
                    updateInputValue(parseInt(e.target.value), "qtyBaru")
                  }
                />
              </Grid>
            </Grid>
          </FormGroup>
          <Divider
            sx={{ mt: 3, mb: 2, borderBottomWidth: 3, bgcolor: "black" }}
          />

          <Grid container>
            <Typography variant="body1">
              {language === "EN"
                ? "Change batch number for qty:"
                : "Ubah batch untuk qty:"}
              &nbsp;
            </Typography>
            <Typography variant="body1" color={"red"}>
              {qtyBaru}
            </Typography>
          </Grid>

          <Grid container alignItems="center">
            <Radio
              checked={radioValue === "1"}
              // onChange={handleClick}
              onClick={(e) => handleClick(e)}
              value="1"
              name="radio-buttons"
              inputProps={{ "aria-label": "A" }}
            />
            <FormLabel sx={{ color: "#212121" }}>
              {language === "EN" ? "Choose Batch" : "Pilih Batch"}
            </FormLabel>
            {/* </FormControl>
            </FormGroup> */}
          </Grid>
          <Grid
            container
            id="batchBaruDropdown"
            sx={showDropdown ? {} : { display: "none" }}
            // style={{display:}}
          >
            <FormControl fullWidth>
              <Select
                displayEmpty
                value={selectDropdown}
                onChange={(e) => setBatch(e)}
              >
                <MenuItem value={0} disabled>
                  Please choose a batch
                </MenuItem>
                {result.map((option) => (
                  <MenuItem
                    key={option.stck_batchnumber}
                    value={option.stck_batchnumber}
                  >
                    {option.stck_batchnumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid container alignItems="center">
            <Radio
              checked={radioValue === "2"}
              // onChange={handleClick}
              onClick={(e) => handleClick(e)}
              value="2"
              name="radio-buttons"
              inputProps={{ "aria-label": "B" }}
            />
            <FormLabel sx={{ color: "#212121" }}>Input Batch</FormLabel>
          </Grid>
          <Grid container style={{}}>
            <OutlinedInput
              // size="small"
              id="batchBaru"
              placeholder="Input New Batch"
              // sx={{bgcolor:'white'}}
              sx={showField ? { ml: 4, bgcolor: "white" } : { display: "none" }}
              defaultValue={editBatchDeff && editBatchDeff.batchBaru}
              onChange={(e) => updateInputValue(e.target.value, "batchBaru")}
              // name="batchBaru"
              // style={{ display: 'none' }}
              disabled={disabledInput}
              fullWidth
            />
          </Grid>
          <Grid container id="tanggalExpired" style={{}}>
            <FormGroup>
              <FormLabel
                sx={
                  showField
                    ? { ml: 4, mt: 2, color: "black" }
                    : { display: "none" }
                }
              >
                {language === "EN" ? "Expiry Date" : "Tanggal Expired"}
              </FormLabel>
              <TextField
                type="date"
                sx={
                  showField
                    ? { ml: 4, background: "white", width: "520px" }
                    : { display: "none" }
                }
                value={expiredDate}
                onChange={(e) => validateTgl(e.target.value)}
                invalid={invalidDate}
                helperText={
                  invalidDate
                    ? "The End Date cannot be less than the Start Date!"
                    : ""
                }
                error={invalidDate ? true : false}
              />
            </FormGroup>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "right" }}>
          <Button
            disabled={!isEnabledUpdate}
            variant="contained"
            onClick={() => setModalConfirmEditIsOpen(true)}
          >
            {language === "EN" ? "Save" : "Simpan"}
          </Button>
          <Button variant="outlined" onClick={() => setModalEditIsOpen(false)}>
            {language === "EN" ? "Cancel" : "Batal"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* MODAL EDIT */}

      {/* MODAL KONFIRMASI */}
      <Dialog
        open={modalConfirmEditIsOpen}
        onClose={() => setModalConfirmEditIsOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { position: "fixed", top: 10 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {language === "EN"
            ? "Saving Data Confirmation"
            : "Konfirmasi Penyimpanan"}
        </DialogTitle>
        <Divider sx={{ mb: 0.5 }} />
        <DialogContent>
          <Grid container>
            <Grid item sx={{ mt: 2 }}>
              <Typography variant="body1">
                {language === "EN" ? "Old Batch : " : "Batch Lama : "}
              </Typography>
            </Grid>
            <Grid item sx={{ ml: 4.5 }}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={currBatch && currBatch.stck_batchnumber}
                margin={"dense"}
                // fullWidth
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={{ mt: 2 }}>
              <Typography variant="body1">
                {language === "EN" ? "Old Qty : " : "Qty Lama : "}
              </Typography>
            </Grid>
            <Grid item sx={{ ml: 6.5 }}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={currBatch && currBatch.stck_qtystock}
                margin={"dense"}
                // fullWidth
              />
            </Grid>
            <Grid item sx={{ mt: 2, ml: 3 }}>
              <Typography variant="body1">
                {language === "EN" ? "New Qty : " : "Qty Baru : "}
              </Typography>
            </Grid>
            <Grid item sx={{ ml: 17 }}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={editBatchDeff && editBatchDeff.qtyBaru}
                margin={"dense"}
                // fullWidth
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, borderBottomWidth: 3, bgcolor: "black" }} />
          <Grid container>
            <Grid item sx={{ mt: 2 }}>
              <Typography variant="body1">
                {language === "EN" ? "New Batch : " : "Batch Baru : "}
              </Typography>
            </Grid>
            <Grid item sx={{ ml: 5.5 }}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={editBatchDeff && editBatchDeff.batchBaru}
                margin={"dense"}
                // fullWidth
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={{ mt: 2 }}>
              <Typography variant="body1">
                {language === "EN" ? "Expiry Date : " : "Tanggal Expired : "}
              </Typography>
            </Grid>
            <Grid item sx={{ ml: 1 }}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={
                  expiredDate === ""
                    ? "-"
                    : formatDate(expiredDate, "ddd, MMM DD, YYYY")
                }
                margin={"dense"}
                // fullWidth
              />
            </Grid>
            <Grid item sx={{ mt: 2, ml: 2 }}>
              <Typography variant="body1">
                {language === "EN"
                  ? "Qty Total Moved : "
                  : "Total Qty yang dipindahkan : "}
              </Typography>
            </Grid>
            <Grid item sx={{ ml: 1.5 }}>
              <TextField
                disabled
                variant="filled"
                size="small"
                label={qtyBaru}
                margin={"dense"}
                sx={{ maxWidth: 250 }}
              />
            </Grid>
          </Grid>
          <Typography variant="body1" sx={{ fontWeight: "bold", mt: 5 }}>
            {language === "EN"
              ? "Are you sure to save the data?"
              : "Apakah Anda yakin ingin menyimpan data ini?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            color="success"
            disabled={isLoading}
            onClick={() => updateStock(editBatchDeff)}
          >
            {!isLoading && <span>{language === "EN" ? "Yes" : "Ya"}</span>}
            {isLoading && <SyncIcon />}
            {isLoading && <span>Processing...</span>}
          </Button>
          {!isLoading && (
            <Button
              variant="contained"
              size="medium"
              color="error"
              onClick={() => setModalConfirmEditIsOpen(false)}
            >
              {language === "EN" ? "No" : "Tidak"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* MODAL KONFIRMASI */}
    </Box>
  );
};

export default StockDetail;
