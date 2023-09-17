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
  IconButton,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { debounce,isUndefined } from "lodash";

import api from "../../../../services/tukarguling";
// import Link from "../../utils/link";
import { formatDate } from "../../../../utils/text";
import useToast from "../../../../utils/toast";
import useResponsive from "../../../../utils/responsive";
import { getStorage } from "../../../../utils/storage";

import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { ArrowBack, Save } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync";

const TukarGulingNew = (props) => {
  const router = useRouter();
  const [displayToast] = useToast();

  const pt_id = JSON.parse(getStorage("pt")).pt_id;
  const outcode = JSON.parse(getStorage("outlet")).out_code;
  const userNIP = getStorage("userNIP");
  var group = router.query.group;
  const currDate = new Date();
  const dataTG = JSON.parse(window.sessionStorage.getItem("dataTG"));

  var language = props.language;
  const isMobile = useResponsive().isMobile;
  const isTablet = useResponsive().isTablet;
  const isDesktop = useResponsive().isDesktop;

  const debounceMountDeleteBatchAdd = useCallback(
    debounce(mountDeleteBatchAdd, 400),
    []
  );

  const debounceMountGetSupplier = useCallback(
    debounce(mountGetSupplier, 400),
    []
  );

  const debounceMountInsertHeader = useCallback(
    debounce(mountInsertHeader, 400),
    []
  );

  const debounceMountInsertDetail = useCallback(
    debounce(mountInsertDetail, 400),
    []
  );

  const debounceMountListGetProduct = useCallback(
    debounce(mountListGetProduct, 400),
    []
  );

  const debounceMountListGetBatch = useCallback(
    debounce(mountListGetBatch, 400),
    []
  );

  const debounceMountListGetReason = useCallback(
    debounce(mountListGetReason, 400),
    []
  );

  const debounceMountGetInsertDetail = useCallback(
    debounce(mountGetInsertDetail, 400),
    []
  );

  const debounceMountSaveTukarGuling = useCallback(
    debounce(mountSaveTukarGuling, 400),
    []
  );

  const debounceMountPrintTukarGuling = useCallback(
    debounce(mountPrintTukarGuling, 400),
    []
  );

  const debounceMountTukarGulingDetail = useCallback(
    debounce(mountTukarGulingDetail, 400),
    []
  );

  const debounceMountGetTukarGulingDetailAll = useCallback(
    debounce(mountGetTukarGulingDetailAll, 400),
    []
  );

  var [listTampil, setListTampil] = useState([]);
  var [currentRecv, setCurrentRecv] = useState([]);
  var [dataAvailable, setDataAvailable] = useState(false);
  var [dataAvailableSupplier, setDataAvailableSupplier] = useState(false);

  var [listSupplier, setListSupplier] = useState([]);
  var [listBatch, setListBatch] = useState([]);
  var [listReason, setListReason] = useState([]);

  const [totalData, setTotalData] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    length: 5,
  });
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_TUKAR_GULING"].includes(
          "LOGISTIC_TUKAR_GULING_CREATE"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#e0e0e0",
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: "start",
    color: theme.palette.text.secondary,
    minHeight: "40px",
  }));

  var [currProcod, setCurrProcod] = useState(""); // procod yang lagi discan (untuk field edit procod)
  var [realCurrProcod, setRealCurrProcod] = useState(""); // procod yang discan
  var [currProd, setCurrProd] = useState({}); //array tampung hasil scan
  var [isAdding, setIsAdding] = useState(true);
  var [isScan, setIsScan] = useState(false);
  var [show, setShow] = useState(true);
  var [loading, setLoading] = useState(false);
  var [validTglDO, setValidTglDO] = useState(false);
  var [validTglFaktur, setValidTglFaktur] = useState(false);
  var [showForm, setShowForm] = useState(false);
  var [detailAddBatch, setDetailAddBatch] = useState({});
  var [quantityTotal, setQuantityTotal] = useState(0);
  var [quantitybonuspo, setQuantitybonuspo] = useState(0);
  var [isDisabled, setIsDisabled] = useState(false);
  var [currentBatch, setCurrentBatch] = useState({});
  var [kodeSupplier, setKodeSupplier] = useState("");
  var [namaSupplier, setNamaSupplier] = useState("");
  var [exchangeID, setExchangeID] = useState("");
  var [procod, setProcod] = useState("");
  var [prodes, setProdes] = useState("");
  var [sellpackName, setSellpackName] = useState("");
  var [objModal, setObjModal] = useState({});
  var [batch, setBatch] = useState([]);
  var [expDate, setExpDate] = useState(new Date());
  var [qtyOut, setQtyOut] = useState("");
  var [alasan, setAlasan] = useState([]);
  var [dataDetail, setDataDetail] = useState([]);
  var [canAdd, setCanAdd] = useState(false);

  var [modalAddBatch, setModalAddBatch] = useState(false);
  const [modalKonfirmasi, setModalKonfirmasi] = useState(false);
  var [modalSaveRecv, setModalSaveRecv] = useState(false); //modal_nested
  var [modalSupplierIsOpen, setModalSupplierIsOpen] = useState(false);

  //ADD BATCH FORM
  var [validInputBatchED, setValidInputBatchED] = useState(false);
  var [invalidInputBatchED, setInvalidInputBatchED] = useState(false);

  var [validInputBatchNo, setValidInputBatchNo] = useState(false);
  var [invalidInputBatchNo, setInvalidInputBatchNo] = useState(false);

  var [validInputBatchQty, setValidInputBatchQty] = useState(false);
  var [invalidInputBatchQty, setInvalidInputBatchQty] = useState(false);

  var [validInputBatchBonus, setValidInputBatchBonus] = useState(false);
  var [invalidInputBatchBonus, setInvalidInputBatchBonus] = useState(false);

  var tukargulingID = dataTG ? dataTG.exchangeid : exchangeID;

  useEffect(() => {
    if (!router.isReady) return;
    // console.log('datatg', dataTG, pt_id, outcode, canAdd)
  }, [router.isReady]);

  useEffect(() => {
    // var y = document.getElementById('listBottom');
    var displayScan = document.getElementById("scanKodeSupplier");

    if (listTampil && listTampil.length > 0) {
      if (!canAdd) {
        // y.style.display = 'block';
        // displayScan.style.display = 'none'
        setCanAdd(true);
        // setIsScan(true);
      }
    }
  }, [listTampil]);

  useEffect(() => {
    var displayScan = document.getElementById("scanKodeSupplier");
    if (dataTG !== null) {
      if (displayScan !== null) {
        // displayScan.style.display = 'none';
      }
      // debounceMountTukarGulingDetail(pt_id, outcode, dataTG.exchangestatus, dataTG.supcode, dataTG.exchangeid, group);
      setCanAdd(true);
      debounceMountGetTukarGulingDetailAll(pt_id, tukargulingID, params);
      // debounceMountListDetailPOAgain(pt_id, dataRecv, outcode, group)
    }
  }, []);

  useEffect(() => {
    if (namaSupplier !== "") {
      var obj = {
        ptid: parseInt(pt_id),
        outcode: outcode,
        groupprod: parseInt(group),
        supcode: kodeSupplier,
        supname: namaSupplier,
        exchangedate: currDate,
        exchangestatus: "",
        printdate: "0000-00-00 00:00:00",
        printbynip: "",
        printbynipm: "",
        receivedate: "0000-00-00 00:00:00",
        updateby: userNIP, //userID
        lastupdated: currDate,
        oldexchangeid: "",
      };

      debounceMountInsertHeader(obj);
    }
  }, [namaSupplier]);

  //USE EFFECT setiap modalAddBatch = false (Empt Input Form)
  useEffect(() => {
    // setEmptyInputForm()
    refreshModalAdd();
    if (modalAddBatch === true) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalAddBatch]);

  //USE EFFECT untuk disable / undisabled tombol SAVE ADD BATCH
  useEffect(() => {
    //24/05/22 tambah validasi quantityTotal + quantitybonuspo > 0
    var totalQty = quantityTotal + quantitybonuspo;
    if (
      validInputBatchED === true &&
      validInputBatchNo === true &&
      validInputBatchQty === true &&
      validInputBatchBonus === true &&
      totalQty > 0
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    validInputBatchED,
    validInputBatchNo,
    validInputBatchQty,
    validInputBatchBonus,
  ]);

  //USE EFFECT AFTER CURRPROD UPDATED
  useEffect(() => {
    // console.log('CURRPROD : ', currProd, isEmpty(currProd))
    if (
      isEmpty(currProd) ||
      currProd.rcvd_nobatch === "" ||
      currProd.batch[0].rcvd_nobatch === ""
    ) {
      setCurrentRecv([]);
      // console.log('sinimasuknya')
    } else {
      setCurrentRecv([...currProd["batch"]]);
      // console.log('CURRENT RECV : ', currentRecv)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currProd]);

  async function mountGetSupplier(group) {
    try {
      const getSupplierData = await api.getSupplier(group);
      const { data, error } = getSupplierData.data;
      // console.log("GET SUPPLIER DATA", getSupplierData);

      if (error.status === false) {
        setModalSupplierIsOpen(true);
        setListSupplier(data);
        setDataAvailableSupplier(false);
      } else {
        displayToast("error", error.msg);
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountInsertHeader(payload) {
    try {
      // console.log('payload insert header', payload)
      const insertHeader = await api.insertHeaderTukarGuling(payload);
      const { data, metadata, error } = insertHeader.data;
      // console.log("INSERT HEADER TUKAR GULING", insertHeader);

      if (error.status === false) {
        setExchangeID(data.exchangeid);
        setCanAdd(true);
        // setIsLoading(false);
      } else {
        displayToast("error", metadata.message);
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountDeleteBatchAdd(procod, exchangeid, batch, pt) {
    try {
      // setLoading((loading = true))

      const deleteBatchAdd = await api.deleteBatchAdd(
        procod,
        exchangeid,
        batch,
        pt
      );
      const { data } = deleteBatchAdd.data;
      // console.log("DELETE BATCH ADD", deleteBatchAdd);

      if (data.status === "TRUE") {
        debounceMountGetInsertDetail(pt, exchangeid, procod);
        displayToast("success", data.message);
      } else {
        displayToast("error", data.message);
      }
    } catch (error) {
      // setLoading((loading = false))
      console.log("ini errornya delete", error);
      displayToast("error", error.code);
    }
  }

  async function mountListGetProduct(procod, outcode, supcode) {
    try {
      const getListProduct = await api.getProduct(outcode, supcode);
      const { data, error } = getListProduct.data;
      console.log("GET PRODUCT DATA", getListProduct);

      // console.log('procod supcode', procod, supcode)

      var allData = data.details;

      if (error.status === false) {
        var findProduct = allData.filter(
          (item) => item.pro_code === procod && item.pro_supcode === supcode
        );

        console.log("find product", findProduct[0]);

        if (findProduct.length !== 0) {
          setProdes((prodes = findProduct[0].pro_name));
          setSellpackName(findProduct[0].pro_sellpackname);

          displayToast("success", "Product Found!");
        } else {
          setProdes((prodes = ""));
          displayToast("error", "Product Not Found!");
        }
      } else {
        displayToast("error", error.msg);
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountListGetBatch(pt, outcode, procode, batch, params) {
    try {
      // console.log('hit be get batch', pt, outcode, procode, batch)
      const getListBatch = await api.getBatch(
        pt,
        outcode,
        procode,
        batch,
        params
      );
      const { data, error } = getListBatch.data;
      // console.log("GET BATCH DATA", getListBatch);

      if (error.status === false) {
        setListBatch(data);
      } else {
        displayToast("error", error.msg);
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountListGetReason() {
    try {
      const getListReason = await api.getReasonList();
      const { data, error } = getListReason.data;
      // console.log("GET REASON DATA", getListReason);

      if (error.status === false) {
        setListReason(data);
      } else {
        displayToast("error", error.msg);
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountGetInsertDetail(pt, exchangeid, procod) {
    try {
      // console.log('hit be get insert detail', pt, exchangeID, procod)
      const getInsertDetail = await api.getInsertDetailData(
        pt,
        exchangeid,
        procod
      );
      const { data, error } = getInsertDetail.data;
      // console.log("GET INSERT DETAIL DATA", getInsertDetail);

      if (error.status === false) {
        setDataDetail(data);
      } else {
        displayToast("error", error.msg);
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountInsertDetail(payload, pt, exchangeid, procod) {
    try {
      console.log("payload insert detail", payload);
      const insertDetail = await api.insertDetailTukarGuling(payload);
      const { data, error } = insertDetail.data;
      console.log("INSERT DETAIL TUKAR GULING", insertDetail);

      if (error.status === false) {
        debounceMountGetInsertDetail(pt, exchangeid, procod);
        setModalAddBatch(false);
        // saveAddNewBatch();
      } else {
        displayToast("error", "Gagal Update Data");
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountSaveTukarGuling(payload, group, exchangeid) {
    try {
      setLoading((loading = true));
      // console.log('payload save tukarguling', payload, group, exchangeid)
      const saveTukarGuling = await api.saveTukarGuling(payload);
      const { data } = saveTukarGuling.data;
      // console.log("SAVE TUKAR GULING", saveTukarGuling);

      if (data.status === "TRUE") {
        printTukarGuling();
        router.push(`/tukarguling/view/${group}/${exchangeid}`);
      } else {
        displayToast("error", "Gagal menyimpan Tukar Guling");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      displayToast("error", error.code);
    }
  }

  async function mountPrintTukarGuling(payload) {
    try {
      // console.log('hit ke be print tukar guling', payload)
      const printTukarGuling = await api.printTukarGuling(payload);
      // console.log('print tukar guling', printTukarGuling)

      //kalau error generate PDF
      if (printTukarGuling.headers["content-type"] === "application/json") {
        let arrayBufferConverted = JSON.parse(
          String.fromCharCode.apply(null, new Uint8Array(printTukarGuling.data))
        );
        console.log("ERROR BE PRINT", arrayBufferConverted);
        // setIsLoading(false);
        // displayToast('error', language === 'EN' ? arrayBufferConverted.metadata.message.Id : arrayBufferConverted.metadata.message.Eng);
      } else {
        const urlblob = window.URL.createObjectURL(
          new Blob([printTukarGuling.data], { type: "application/pdf" })
        );
        window.open(urlblob);
        // const link = document.createElement("a");
        // link.href = urlblob;
        // link.setAttribute(
        //   "download",
        //   `PRINT_TUKARGULING_${exchangeID}.pdf`
        // );
        // document.body.appendChild(link);
        // link.click();
      }
      mountPrintTukarGuling;
    } catch (error) {
      console.log("print tukar guling error", error);
      // displayToast('error', error)
    }
  }

  async function mountTukarGulingDetail(
    pt,
    outcode,
    status,
    supcode,
    exchangeid,
    group
  ) {
    try {
      // console.log('hit be header detail', pt, outcode, status, supcode, exchangeid, group)
      setDataAvailable((dataAvailable = true));
      const getTukarGulingDetail = await api.getTukarGulingHeaderDetail(
        pt,
        outcode,
        status,
        supcode,
        exchangeid,
        group
      );
      const { data } = getTukarGulingDetail.data;
      // console.log("data tukar guling detail all", getTukarGulingDetail);

      if (data[0].details === null) {
        setListTampil([]);
      } else {
        setListTampil(data[0].details);
      }

      setDataAvailable(false);
    } catch (error) {
      setDataAvailable(false);
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountGetTukarGulingDetailAll(pt, exchangeid, params) {
    try {
      setDataAvailable((dataAvailable = true));
      const getTukarGulingDetailAll = await api.getTukarGulingDetail(
        pt,
        exchangeid,
        params
      );
      const { data } = getTukarGulingDetailAll.data;
      // console.log("data tukar guling detail all", getTukarGulingDetailAll);

      setListTampil(data);

      setDataAvailable(false);
    } catch (error) {
      setDataAvailable(false);
      console.log(error);
      displayToast("error", error.code);
    }
  }

  function insertDetail() {
    // var tukargulingID = exchangeID ? exchangeID : dataTG.exchangeid

    var obj = {
      ptid: parseInt(pt_id),
      exchangeid: tukargulingID,
      procod: procod,
      proname: prodes,
      batch: batch.stck_batchnumber,
      exchangeby: userNIP,
      exchangedate: currDate,
      expireddate: new Date(expDate),
      qtyout: parseInt(qtyOut),
      qtyin: 0,
      qtystk: 0,
      reasonid: alasan.reasonid,
      reasonname: alasan.reasonname,
      sellpack: sellpackName,
      norecv: "",
      recvdate: "0000-00-00 00:00:00",
      nofaktur: "",
      fakturdate: "0000-00-00 00:00:00",
      updatedby: userNIP,
      lastupdated: currDate,
    };

    // console.log('obj insert detail', obj)

    debounceMountInsertDetail(obj, pt_id, tukargulingID, procod);
  }

  function printTukarGuling() {
    var obj = {
      ptid: parseInt(pt_id),
      exchangeid: exchangeID,
      supcode: kodeSupplier,
    };

    // console.log('obj print', obj)

    debounceMountPrintTukarGuling(obj);
  }

  function saveTukarGuling() {
    // var tukargulingID = exchangeID ? exchangeID : dataTG.exchangeid

    var obj = {
      ptid: parseInt(pt_id),
      outcode: outcode,
      exchangeid: tukargulingID,
      groupprod: parseInt(group),
      printbynip: userNIP,
      updateby: userNIP, //userID
    };

    debounceMountSaveTukarGuling(obj, group, tukargulingID);
  }

  function deleteBatch(data) {
    // console.log('batch yg mau didelete', data.batch)

    // var tukargulingID = exchangeID ? exchangeID : dataTG.exchangeid

    debounceMountDeleteBatchAdd(procod, tukargulingID, data.batch, pt_id);
  }

  function refreshModalAdd() {
    setBatch([]);
    setExpDate(new Date());
    setQtyOut();
    setAlasan("");
  }

  function getSupplier() {
    setDataAvailableSupplier(true);
    setModalSupplierIsOpen(true);
    debounceMountGetSupplier(group);
  }

  function closeModalSupplier(item) {
    setObjModal((objModal = item));
    setKodeSupplier(objModal.sup_code);
    setNamaSupplier(objModal.sup_name);
    setModalSupplierIsOpen(false);
  }

  function getProductDetail() {
    debounceMountListGetBatch(pt_id, outcode, procod, batch, params);
    debounceMountListGetReason();
  }

  const myFunction = (event) => {
    if (
      event.key === "Enter" &&
      event.target.value !== "" &&
      event.target.value.trim() !== "" &&
      event.target.value.trim().length > 0
    ) {
      event.preventDefault();

      // if(kodeSupplier === '') {
      // debounceMountListGetProduct(procod, dataTG.supcode);
      // } else {
      debounceMountListGetProduct(
        procod,
        outcode,
        dataTG ? dataTG.supcode : kodeSupplier
      );
      // }
      getProductDetail();

      // var tukargulingID = exchangeID ? exchangeID : dataTG.exchangeid

      debounceMountGetInsertDetail(pt_id, tukargulingID, procod);
      return false;
    }
  };

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  function finishScan() {
    // setListTampil(dataDetail)

    setProcod("");
    setProdes("");
    setDataDetail([]);

    debounceMountGetTukarGulingDetailAll(pt_id, tukargulingID, params);

    console.log("list tampil", listTampil);
    setIsScan(false);
  }

  function validateQty(data) {
    if (data > batch.stck_qtystock) {
      displayToast("error", "Qty out melebihi qty stock");
    } else {
      setQtyOut(data);
    }
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Link href={`/tukarguling`}>
            <IconButton aria-label="back">
              <ArrowBack />
            </IconButton>
          </Link>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            {group === "1"
              ? "Add Tukar Guling Apotek"
              : "Add Tukar Guling Floor"}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Paper
        elevation={1}
        sx={{ width: "100%", mb: 2, mt: 4 }}
        // id="scanKodeSupplier"
        // style={{ display: '' }}
      >
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={!isMobile && { mb: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, mt: 0.5, ml: 3 }}
            >
              {language === "EN" ? "Supplier Code" : "Kode Supplier"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} sx={isMobile && { mx: 3 }}>
            <Item>{dataTG === null ? kodeSupplier : dataTG.supcode}</Item>
          </Grid>
          <Grid item xs={12} sm={12} md={1} lg={1} sx={isMobile && { ml: 2 }}>
            <Button
              variant="contained"
              style={
                dataTG !== null
                  ? { display: "none" }
                  : { marginLeft: "2%", display: "block" }
              }
              id="searchButton"
              onClick={() => getSupplier()}
              disabled={exchangeID !== ""}
            >
              {language === "EN" ? "Search" : "Cari"}
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={!isMobile && { mb: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, mt: 0.5, ml: 3 }}
            >
              {language === "EN" ? "Supplier Name" : "Nama Supplier"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} sx={isMobile && { mx: 3 }}>
            <Item>{dataTG === null ? namaSupplier : dataTG.supname}</Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={!isMobile && { mb: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, mt: 0.5, ml: 3 }}
            >
              {language === "EN" ? "Exchange ID" : "ID Tukar Guling"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            lg={3}
            sx={isMobile ? { mx: 3, mb: 3 } : { mb: 2 }}
          >
            <Item>{dataTG === null ? exchangeID : dataTG.exchangeid}</Item>
          </Grid>
        </Grid>
      </Paper>
      <Paper
        elevation={2}
        sx={{ width: "100%", mb: 2 }}
        style={isScan === false ? { display: "none" } : {}}
      >
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12} md={1} lg={1} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              PROCOD
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <OutlinedInput
              fullWidth={(isMobile || isTablet) && true}
              size="small"
              sx={{ bgcolor: "white", mr: "2%" }}
              disabled={dataDetail.length !== 0}
              onChange={(e) => setProcod((procod = e.target.value))}
              onKeyPress={(e) => myFunction(e)}
              value={procod}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={isDesktop ? { mt: 2 } : { mt: 2, pl: 2, pr: 2 }}
          >
            <Typography
              variant="subtitle1"
              sx={
                isDesktop
                  ? { fontWeight: 600, textAlign: "right" }
                  : { fontWeight: 600 }
              }
            >
              {language === "EN" ? "PRODUCT DESCRIPTION" : "DESKRIPSI PRODUK"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <Item>&nbsp;{prodes}</Item>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2 }} />
        <TableContainer sx={{ px: 2 }}>
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
                    {language === "EN" ? "Exp Date" : "Kadaluarsa"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty Out
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Sell Pack
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Reason" : "Alasan"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Delete Batch" : "Hapus Batch"}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataDetail.length !== 0 ? (
                dataDetail.map((item) => (
                  <TableRow key={item.batch}>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell>
                      {formatDate(item.expireddate, "ddd MMMM DD YYYY")}
                    </TableCell>
                    <TableCell>{item.qtyout}</TableCell>
                    <TableCell>{item.sellpack}</TableCell>
                    <TableCell>{item.reasonname}</TableCell>
                    <TableCell align="center">
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => deleteBatch(item)}
                      >
                        <DeleteIcon />
                      </Button>
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
                      {language === "EN" ? "NO DATA" : "TIDAK ADA DATA"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          sx={{ my: 4, ml: 2, width: "150px" }}
          // disabled={prodes === ''}
          onClick={() => setModalAddBatch((modalAddBatch = true))}
        >
          {language === "EN" ? "Add" : "Tambah"}
        </Button>
        <Button
          variant="contained"
          sx={{ my: 4, ml: 2, width: "250px" }}
          onClick={() => finishScan()}
        >
          {language === "EN" ? "Finish Scan" : "Selesai Scan"}
        </Button>
      </Paper>
      <Paper
        elevation={2}
        sx={{ width: "100%", mb: 2 }}
        id="listBottom"
        style={!canAdd ? { display: "none" } : {}}
      >
        <Button
          variant="contained"
          sx={{ mt: 2, ml: 2, mb: 1 }}
          disabled={isScan}
          onClick={() => setIsScan(true)}
        >
          {language === "EN" ? "Add Item" : "Tambah Item"}
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Procod
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN"
                      ? "Product Description"
                      : "Deskripsi Produk"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Batch
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Exp Date" : "Kadaluarsa"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty Out
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Sell Pack
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Reason" : "Alasan"}
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
              ) : listTampil.length !== 0 ? (
                listTampil.map((item) => (
                  <TableRow key={item.procod}>
                    <TableCell>{item.procod}</TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      {item.proname === "" ? "-" : item.proname}
                    </TableCell>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell>
                      {formatDate(item.expireddate, "ddd MMMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">{item.qtyout}</TableCell>
                    <TableCell align="center">{item.sellpack}</TableCell>
                    <TableCell align="center">{item.reasonname}</TableCell>
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
          </Table>
        </TableContainer>
        <Grid container justifyContent={"flex-end"}>
          <Button
            size="large"
            variant="contained"
            disabled={listTampil.length === 0}
            sx={{ my: 4, mr: 2, width: "200px" }}
            onClick={() => setModalKonfirmasi(true)}
          >
            {language === "EN" ? "Save & Print" : "Simpan & Print"}
          </Button>
        </Grid>
      </Paper>

      {/* MODAL SUPPLIER */}
      <Dialog
        open={modalSupplierIsOpen}
        onClose={() => setModalSupplierIsOpen(false)}
        fullWidth
        PaperProps={{ sx: { position: "fixed", top: 10 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          <Grid container sx={{ mt: 1.5 }}>
            <Grid container item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                List Supplier
              </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "20%" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Supcode
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Supname
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataAvailableSupplier ? (
                  <TableRow>
                    <TableCell align="center" colSpan={12}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : listSupplier.length !== 0 ? (
                  listSupplier.map((item) => (
                    <TableRow key={item.sup_code}>
                      <TableCell align="center">
                        {item.sup_code === "" ? "-" : item.sup_code}
                      </TableCell>
                      <TableCell>{item.sup_name}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => closeModalSupplier(item)}
                        >
                          Choose
                        </Button>
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
                        {language === "EN" ? "NO DATA" : "TIDAK ADA DATA"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {/* <TableFooter>
                    <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        count={totalData}
                        rowsPerPage={paramsModal.length}
                        page={paramsModal.page}
                        onPageChange={handlePageChangeModal}
                        onRowsPerPageChange={handleRowsPerPageChangeModal}
                    />
                    </TableRow>
                </TableFooter> */}
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
      {/* MODAL SUPPLIER */}

      {/* MODAL ADD */}
      <Dialog
        open={modalAddBatch}
        onClose={() => setModalAddBatch((modalAddBatch = false))}
        fullWidth
        // maxWidth='xs'
        PaperProps={{ sx: { position: "fixed", top: 10 } }}
      >
        <DialogTitle>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {language === "EN" ? "Add Batch Product" : "Tambah Batch Produk"}{" "}
            {procod}
          </Typography>
        </DialogTitle>
        <Divider sx={{ mb: 0.5 }} />
        {showForm && (
          <DialogContent>
            <Grid container>
              <Grid container item xs={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pt: 0.5 }}
                >
                  Batch
                </Typography>
              </Grid>
              <Grid container item xs={8} justifyContent={"flex-end"}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  value={batch}
                  // defaultValue=""
                  onChange={(e) => setBatch(e.target.value)}
                >
                  {listBatch.map((option) => (
                    <MenuItem key={option.stck_batchnumber} value={option}>
                      {option.stck_batchnumber}
                    </MenuItem>
                  ))}
                  {/* {console.log('batch value', batch)} */}
                </TextField>
                {/* <Select
                  fullWidth
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                >
                  {listBatch.map((option) => (
                      <MenuItem key={option.stck_batchnumber} value={option} >
                        {option.stck_batchnumber}
                      </MenuItem>
                    ))}
                </Select> */}
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid container item xs={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pt: 0.5 }}
                >
                  {language === "EN" ? "Exp Date" : "Kadaluarsa"}
                </Typography>
              </Grid>
              <Grid container item xs={8} justifyContent={"flex-end"}>
                <TextField
                  type="date"
                  variant="outlined"
                  size="small"
                  margin={"none"}
                  fullWidth
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid container item xs={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pt: 0.5 }}
                >
                  Qty Out
                </Typography>
              </Grid>
              <Grid container item xs={8}>
                <TextField
                  variant="outlined"
                  size="small"
                  margin={"none"}
                  fullWidth
                  value={qtyOut}
                  onChange={(e) => validateQty(e.target.value)}
                />
                <Typography variant="body2" color={"red"}>
                  {batch.length === 0
                    ? "Current QTY Stock = 0"
                    : "Current QTY Stock = " + batch.stck_qtystock}
                </Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid container item xs={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pt: 0.5 }}
                >
                  {language === "EN" ? "Reason" : "Alasan"}
                </Typography>
              </Grid>
              <Grid container item xs={8} justifyContent={"flex-end"}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  value={alasan}
                  // defaultValue=""
                  onChange={(e) => setAlasan(e.target.value)}
                >
                  {listReason.map((option) => (
                    <MenuItem key={option.reasonname} value={option}>
                      {option.reasonname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
        )}
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            disabled={
              batch.length === 0 ||
              expDate === "" ||
              qtyOut === "" ||
              alasan.length === 0
            }
            onClick={() => insertDetail()}
            id="saveButton"
          >
            {language === "EN" ? "Save" : "Simpan"}
          </Button>
          <Button
            variant="outlined"
            size="medium"
            type="reset"
            onClick={() => setModalAddBatch((modalAddBatch = false))} //sini
          >
            {language === "EN" ? "Cancel" : "Batal"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* MODAL ADD */}

      {/* MODAL KONFIRMASI */}
      <Dialog
        open={modalKonfirmasi}
        onClose={() => setModalKonfirmasi(false)}
        fullWidth
        PaperProps={{ sx: { position: "fixed", top: 10 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Konfirmasi Simpan dan Print Tukar Guling
        </DialogTitle>
        <Divider sx={{ mb: 1 }} />
        <DialogContent>
          <Typography variant="body1">
            Apakah anda yakin ingin menyimpan dan mencetak Tukar Guling ini?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            color="success"
            disabled={loading}
            onClick={() => saveTukarGuling()}
          >
            {!loading && <span>Yes</span>}
            {loading && <SyncIcon />}
            {loading && <span>Processing...</span>}
          </Button>
          {!loading && (
            <Button
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

export default TukarGulingNew;
