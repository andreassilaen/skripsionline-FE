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

import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { ArrowBack } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync";

const TukarGulingDetail = (props) => {
  const router = useRouter();
  const [displayToast] = useToast();

  const pt_id = JSON.parse(getStorage("pt")).pt_id;
  const outcode = JSON.parse(getStorage("outlet")).out_code;
  const userNIP = getStorage("userNIP");
  var group = router.query.group;
  var exchange_id = router.query.id;
  const currDate = new Date();

  var language = props.language;
  const isMobile = useResponsive().isMobile;
  const isTablet = useResponsive().isTablet;
  const isDesktop = useResponsive().isDesktop;

  const debounceMountTukarGulingDetail = useCallback(
    debounce(mountTukarGulingDetail, 400),
    []
  );

  const debounceMountPrintTukarGuling = useCallback(
    debounce(mountPrintTukarGuling, 400),
    []
  );

  const debounceGetTempRecvByProcod = useCallback(
    debounce(mountGetTempRecvByProcod, 400),
    []
  );

  const debounceMountGetTempReceive = useCallback(
    debounce(mountGetTempReceive, 400),
    []
  );

  const debounceMountSaveReceive = useCallback(
    debounce(mountSaveReceive, 400),
    []
  );

  const debounceMountDeleteBatchReceive = useCallback(
    debounce(mountDeleteBatchReceive, 400),
    []
  );

  const debounceMountConfirmReceive = useCallback(
    debounce(mountConfirmReceive, 400),
    []
  );

  const debounceMountSaveTukarGuling = useCallback(
    debounce(mountSaveTukarGuling, 400),
    []
  );
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_TUKAR_GULING"].includes(
          "LOGISTIC_TUKAR_GULING_VIEW"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (!router.isReady) return;

    window.sessionStorage.setItem("groupProd", group);
    window.sessionStorage.setItem("exchangeID", exchange_id);

    debounceMountTukarGulingDetail(pt_id, outcode, "", "", exchange_id, group);
  }, [router.isReady]);

  var [dataAvailable, setDataAvailable] = useState(false);

  const [totalData, setTotalData] = useState(0);

  var [inputSearch, setInputSearch] = useState("");
  var [searchGroup, setSearchGroup] = useState(1);

  var [listTampil, setListTampil] = useState([]);
  var [tukarGulingID, setTukarGulingID] = useState("");
  var [oldTukarGulingID, setOldTukarGulingID] = useState("");
  var [tukarGulingDate, setTukarGulingDate] = useState("");
  var [pic, setPIC] = useState("");
  var [status, setStatus] = useState("");
  var [supcode, setSupcode] = useState("");
  var [supname, setSupname] = useState("");
  var [noFaktur, setNoFaktur] = useState("");
  var [fakturDate, setFakturDate] = useState(new Date());
  var [noFakturHeader, setNoFakturHeader] = useState("");
  var [fakturDateHeader, setFakturDateHeader] = useState(new Date());
  var [hasFaktur, setHasFaktur] = useState(false);
  var [listTempReceive, setListTempReceive] = useState([]);
  var [listTempRecvProcod, setListTempRecvProcod] = useState([]);
  var [isReceive, setIsReceive] = useState(false);
  var [currProd, setCurrProd] = useState({}); //array tampung hasil scan
  var [currProcod, setCurrProcod] = useState(""); // procod yang lagi discan (untuk field edit procod)
  var [realCurrProcod, setRealCurrProcod] = useState(""); // procod yang discan
  var [prodes, setProdes] = useState("");
  var [isAdding, setIsAdding] = useState(true);
  var [isScan, setIsScan] = useState(false);
  var [valid, setValid] = useState(true);
  var [showForm, setShowForm] = useState(false);
  var [batch, setBatch] = useState("");
  var [expDate, setExpDate] = useState(new Date());
  var [qtyIn, setQtyIn] = useState("");
  var [totalQty, setTotalQty] = useState(0);
  var [modalTitle, setModalTitle] = useState("");
  var [modalMessage, setModalMessage] = useState("");
  var [modalType, setModalType] = useState("");

  var [modalAddBatch, setModalAddBatch] = useState(false);
  const [modalKonfirmasi, setModalKonfirmasi] = useState(false);

  var [loading, setLoading] = useState(false);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#e0e0e0",
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: "start",
    color: theme.palette.text.secondary,
    minHeight: "40px",
  }));

  useEffect(() => {
    refreshModalAdd();
    if (modalAddBatch === true) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [modalAddBatch]);

  useEffect(() => {
    if (listTempReceive.length !== 0 && listTempRecvProcod.length !== 0) {
      var detailData = listTampil.filter((item) => item.procod === currProcod);

      var totalQtyDetail = detailData.reduce(
        (prev, curr) => prev + curr.qtyout,
        0
      );

      // console.log('detaildata', detailData, totalQtyDetail)

      var totalQtyRecv = listTempRecvProcod.reduce(
        (prev, curr) => prev + parseInt(curr.qtyin),
        0
      );

      var totalQtyOut = totalQtyDetail - totalQtyRecv;

      // console.log('total qty out', totalQtyOut)

      var total = totalQtyOut;

      // console.log('total qty', total)

      if (total > 0) {
        setTotalQty(total);
      } else {
        setTotalQty(0);
      }
    } else {
      var listDetail = listTampil.filter((item) => item.procod === currProcod);

      var totalQtyDetails = listDetail.reduce(
        (prev, curr) => prev + curr.qtyout,
        0
      );

      setTotalQty(totalQtyDetails);
    }
  }, [currProcod, listTempRecvProcod, listTempReceive]);

  useEffect(() => {
    if (isReceive) {
      getTempReceive();
    }
  }, [isReceive]);

  useEffect(() => {
    setCurrProcod("");
    setCurrProd([]);
    // setProdes('')
  }, [listTempReceive]);

  async function mountTukarGulingDetail(
    pt,
    outcode,
    status,
    supcode,
    exchangeid,
    group
  ) {
    try {
      setDataAvailable((dataAvailable = true));
      const getTukarGulingDetail = await api.getTukarGulingHeaderDetail(
        pt,
        outcode,
        status,
        supcode,
        exchangeid,
        group
      );
      const { data, metadata, error } = getTukarGulingDetail.data;
      // console.log("data tukar guling detail", getTukarGulingDetail);

      setTukarGulingID(data[0].header.exchangeid);
      setOldTukarGulingID(data[0].header.oldexchangeid);
      setTukarGulingDate(data[0].header.exchangedate);
      setStatus(data[0].header.exchangestatus);
      setSupcode(data[0].header.supcode);
      setSupname(data[0].header.supname);
      setPIC(data[0].header.updateby);
      setListTampil(data[0].details);
      getFakturDetail(data[0].details);

      setDataAvailable(false);
    } catch (error) {
      setDataAvailable(false);
      console.log(error);
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
        //   `PRINT_RECEIVING.pdf`
        // );
        // document.body.appendChild(link);
        // link.click();
      }
      mountPrintTukarGuling;
    } catch (error) {
      // setDataAvailable(false)
      console.log("print tukar guling error", error);
      displayToast("error", error.code);
    }
  }

  async function mountGetTempRecvByProcod(pt, exchangeid, procod) {
    try {
      // setDataAvailable((dataAvailable = true))
      // console.log('hit be temp recv procod', pt, exchangeid, procod)
      const getTempProcod = await api.getTempReceiveByProcod(
        pt,
        exchangeid,
        procod
      );
      const { data, error } = getTempProcod.data;
      // console.log("temp recv by procod", getTempProcod);

      if (error.status === false) {
        if (data.message === undefined || data.data.message === null) {
          setListTempRecvProcod(data);
        } else {
          displayToast("error", data.message);
        }
      } else {
        displayToast("error", data.message);
      }

      // setDataAvailable(false)
    } catch (error) {
      // setDataAvailable(false)
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountGetTempReceive(pt, exchangeid) {
    try {
      // setDataAvailable((dataAvailable = true))
      // console.log('hit be temp receive', pt, exchangeid)
      const getTempReceive = await api.getTempReceive(pt, exchangeid);
      const { data, error } = getTempReceive.data;
      // console.log("temp recv all", getTempReceive);

      if (error.status === false) {
        if (data.message === undefined || data.message === null) {
          setListTempReceive(data);
        } else {
          displayToast("error", data.message);
        }
      } else {
        displayToast("error", data.message);
      }

      // setDataAvailable(false)
    } catch (error) {
      // setDataAvailable(false)
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountSaveReceive(payload, pt, tukargulingid, procod) {
    try {
      // setDataAvailable((dataAvailable = true))
      // console.log('hit be save receive', payload)
      const saveReceive = await api.saveReceiveTukarGuling(payload);
      const { data, error } = saveReceive.data;
      // console.log("save receive", saveReceive);

      if (error.status === false) {
        if (data.message === undefined || data.message === null) {
          // getTempReceiveByProcod();
          debounceGetTempRecvByProcod(pt, tukargulingid, procod);
          setModalAddBatch(false);
          refreshModalAdd();
        } else {
          displayToast("error", data.message);
        }
      } else {
        displayToast("error", data.message);
      }

      // setDataAvailable(false)
    } catch (error) {
      // setDataAvailable(false)
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountDeleteBatchReceive(pt, procod, exchangeid, batch) {
    try {
      // setLoading((loading = true))
      // console.log('hit be delete batch receive', pt, procod, exchangeid, batch)
      const deleteBatchReceive = await api.deleteBatchReceive(
        pt,
        procod,
        exchangeid,
        batch
      );
      const { data } = deleteBatchReceive.data;
      // console.log("DELETE BATCH RECEIVE", deleteBatchReceive);

      if (data.status === "TRUE") {
        displayToast("success", data.message);
        // getTempReceiveByProcod();
        debounceGetTempRecvByProcod(pt, exchangeid, procod);
      } else {
        displayToast("error", data.message);
      }
    } catch (error) {
      // setLoading((loading = false))
      console.log("ini errornya delete", error);
      displayToast("error", error.code);
    }
  }

  async function mountConfirmReceive(payload) {
    try {
      setLoading((loading = true));
      // console.log('hit be confirm receive', payload)
      const confirmReceive = await api.confirmReceive(payload);
      const { data, error } = confirmReceive.data;
      // console.log("CONFIRM RECEIVE", confirmReceive);

      if (error.status === false) {
        setModalKonfirmasi(false);
        refreshModalAdd();
        refreshPage();
      } else {
        displayToast("error", "Error");
      }

      setLoading(false);
    } catch (error) {
      setLoading((loading = false));
      console.log("ini errornya delete", error);
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
        // printTukarGuling();
        // router.push(`/tukarguling/view/${group}/${exchangeid}`)
        refreshPage();
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

  function refreshPage() {
    setListTempReceive([]);
    setIsReceive(false);
    setModalKonfirmasi(false);

    var groupprod = window.sessionStorage.getItem("groupProd");
    var exchangeid = window.sessionStorage.getItem("exchangeID");
    // setIsLoading(true);
    debounceMountTukarGulingDetail(
      pt_id,
      outcode,
      "",
      "",
      exchangeid,
      groupprod
    );
  }

  function getTempReceive() {
    debounceMountGetTempReceive(pt_id, tukarGulingID);
  }

  // function getTempReceiveByProcod() {
  //   debounceGetTempRecvByProcod(pt_id, tukarGulingID, currProcod);
  // }

  function saveReceive() {
    var obj = {
      ptid: parseInt(pt_id),
      exchangeid: tukarGulingID,
      procod: currProcod,
      proname: currProd.proname,
      // batch: batch.label,
      batch: batch,
      reasonid: currProd.reasonid,
      reasonname: currProd.reasonname,
      sellpack: currProd.sellpack,
      exchangeby: userNIP, //userID
      updatedby: userNIP, //userID
      exchangedate: tukarGulingDate,
      expireddate: expDate,
      qtyin: parseInt(qtyIn),
    };

    debounceMountSaveReceive(obj, pt_id, tukarGulingID, currProcod);
  }

  function deleteBatch(data) {
    debounceMountDeleteBatchReceive(
      pt_id,
      currProcod,
      tukarGulingID,
      data.batch
    );
  }

  function refreshModalAdd() {
    setBatch("");
    setExpDate(new Date());
    setQtyIn();
  }

  function getFakturDetail(data) {
    var findFaktur = data.filter((item) => item.nofaktur !== "");
    // console.log('find faktur', findFaktur[0])

    if (findFaktur[0] !== undefined) {
      setNoFakturHeader(findFaktur[0].nofaktur);
      setFakturDateHeader(findFaktur[0].fakturdate);

      setHasFaktur(true);
    } else {
      setHasFaktur(false);
    }
  }

  function printTukarGuling() {
    // setIsLoading(true);

    var obj = {
      ptid: pt_id,
      exchangeid: tukarGulingID,
      supcode: supcode,
    };

    // console.log('obj print', obj)

    debounceMountPrintTukarGuling(obj);
  }

  function finishScan() {
    setRealCurrProcod((realCurrProcod = ""));
    setCurrProcod((currProcod = ""));
    setCurrProd((currProd = []));
    setProdes((prodes = ""));
    setListTempRecvProcod([]);

    getTempReceive();
    // debounceMountGetTempReceive(pt_id, exchange_id)
  }

  function canBeAdd() {
    // console.log('MASUK CURRPROD', currProd);
    if (!currProd.batch) {
      // console.log('MASUK IF');
      setIsAdding((isAdding = false));
      setIsScan((isScan = true));
    } else {
      var lastindex = parseInt(
        currProd["batch"].length - 1 < 0 ? 0 : currProd["batch"].length - 1
      );

      if (currProd.procod === undefined || currProcod === "") {
        // console.log('MASUK IF DALAM ELSE');
        setIsAdding((isAdding = true));
        setIsScan((isScan = true));
      } else if (isEmpty(currProd.batch[lastindex])) {
        // console.log('MASUK ELSE IF');
        setIsAdding((isAdding = true));
        setIsScan((isScan = true));
      } else {
        // console.log('MASUK ELSE 2');
        setIsAdding((isAdding = true));
        setIsScan((isScan = true));
      }
    }
  }

  function canBeScan() {
    var displayReceivingBottom = document.getElementById("receivingBottom");
    if (listTampil === null || listTampil === 0 || currProd === undefined) {
      setIsScan((isScan = false));
      displayReceivingBottom.style.display = "block";
    } else {
      setIsScan((isScan = true));
      displayReceivingBottom.style.display = "block";
    }
  }

  const scanProcod = (event) => {
    if (
      event.key === "Enter" &&
      event.target.value !== "" &&
      event.target.value.trim() !== "" &&
      event.target.value.trim().length > 0
    ) {
      var detail = listTampil;
      var tempProcod = event.target.value.trim();
      var found;
      var searchList = listTampil;

      // canBeAdd();
      // canBeScan();

      // ELEMENT SUDAH DI SIMPAN DI FOUND
      found = searchList.find(function (element) {
        return element.procod === tempProcod;
      });

      // console.log('FOUND ISINYA: ',found);

      found = { ...found };

      // setRealCurrProcod((realCurrProcod = tempProcod))
      // setCurrProd((currProcod = found))

      //BATCH
      if (found === undefined || Object.keys(found).length === 0) {
        setIsAdding(true);
        displayToast("error", "Procod is not on list.");
      } else {
        displayToast("success", "Procod found!");

        // getTempReceiveByProcod();
        debounceGetTempRecvByProcod(pt_id, tukarGulingID, currProcod);

        var batch;

        if (found["batch"] === null) {
          batch = [];
          found["batch"] = [];
        } else {
          batch = [...found["batch"]];
        }

        if (
          realCurrProcod !== tempProcod
          // && found['batch'].length > 1
        ) {
          setRealCurrProcod((realCurrProcod = tempProcod));
          setCurrProd((currProd = { ...found }));
          setProdes((prodes = currProd.proname));
          return;
        }
      }
    } else if (
      event.key === "Enter" &&
      event.target.value.trim().length === 0
    ) {
      displayToast("error", "Procod Can Not Be Empty!");
    }
  };

  function validateInput(data, type) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    var d1 = Date.parse(data);
    var d2 = Date.parse(today);

    if (type === "FakturDate") {
      if (d1 > d2) {
        setFakturDate(data);
        displayToast(
          "error",
          language === "EN"
            ? "Invoice Date cannot be more than today."
            : "Tanggal Faktur tidak boleh sesudah hari ini."
        );
        setValid(true);
      } else {
        setFakturDate(data);
        setValid(false);
      }
    } else if (type === "ExpiredDate") {
      if (d1 < d2) {
        setExpDate(data);
        displayToast(
          "error",
          language === "EN"
            ? "Expired Date cannot be less than today."
            : "Tanggal Kadaluarsa tidak boleh sebelum hari ini."
        );
        setValid(true);
      } else {
        setExpDate(data);
        setValid(false);
      }
    } else if (type === "QtyIn") {
      if (data > totalQty) {
        setQtyIn(data);
        displayToast("error", "Qty In melebihi Qty Out");
        setValid(true);
      } else {
        setQtyIn(data);
        setValid(false);
      }
    }
  }

  function saveTukarGuling() {
    var obj = {
      ptid: parseInt(pt_id),
      outcode: outcode,
      exchangeid: tukarGulingID,
      groupprod: parseInt(group),
      printbynip: userNIP,
      updateby: userNIP, //userID
    };

    debounceMountSaveTukarGuling(obj, group, tukarGulingID);
  }

  function confirmReceive() {
    var obj = {
      ptid: parseInt(pt_id),
      outcode: outcode,
      exchangeid: tukarGulingID,
      groupprod: parseInt(group),
      updateby: userNIP, //userID
      expireddate: expDate,
      supcode: supcode,
      supname: supname,
      nofaktur: noFaktur,
      fakturdate: fakturDate,
    };

    debounceMountConfirmReceive(obj);
  }

  function toggleModal(type) {
    if (type === "savePrint") {
      setModalTitle("Konfirmasi Simpan dan Print Tukar Guling");
      setModalMessage(
        "Apakah anda yakin ingin menyimpan dan mencetak Tukar Guling ini?"
      );
      setModalType("PRINT");
    } else if (type === "receive") {
      setModalTitle("Konfirmasi Simpan Receive");
      setModalMessage("Apakah anda yakin ingin menyimpan receive ini?");
      setModalType("RECEIVE");
    }
    setModalKonfirmasi(true);
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Link href={`/tukarguling`} sx={{ displayPrint: "none" }}>
            <IconButton aria-label="back">
              <ArrowBack />
            </IconButton>
          </Link>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            {group === "1"
              ? "Detail Tukar Guling Apotek"
              : "Detail Tukar Guling Floor"}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Paper elevation={2} sx={{ width: "100%", mb: 2, mt: 4 }}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "Exchange ID" : "ID Tukar Guling"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Item>&nbsp;{tukarGulingID}</Item>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={!isMobile ? { mt: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "Old Exchange ID" : "Old ID Tukar Guling"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Item>
              &nbsp;{oldTukarGulingID === "" ? "-" : oldTukarGulingID}
            </Item>
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "Exchange Date" : "Tanggal Tukar Guling"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Item>&nbsp;{formatDate(tukarGulingDate, "ddd MMMM DD YYYY")}</Item>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={!isMobile ? { mt: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Status
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Item>&nbsp;{status}</Item>
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "Supplier Code" : "Kode Supplier"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Item>&nbsp;{supcode}</Item>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={!isMobile ? { mt: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "Supplier Name" : "Nama Supplier"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Item>&nbsp;{supname}</Item>
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "Invoice No" : "No Faktur"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Item style={hasFaktur ? {} : { display: "none" }}>
              &nbsp;{noFakturHeader}
            </Item>
            <OutlinedInput
              style={hasFaktur ? { display: "none" } : {}}
              disabled={!isReceive}
              fullWidth
              size="small"
              value={noFaktur}
              onChange={(e) => setNoFaktur(e.target.value)}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={!isMobile ? { mt: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "Invoice Date" : "Tanggal Faktur"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Item style={hasFaktur ? {} : { display: "none" }}>
              &nbsp;{formatDate(fakturDateHeader, "ddd MMMM DD YYYY")}
            </Item>
            <OutlinedInput
              style={hasFaktur ? { display: "none" } : {}}
              disabled={!isReceive}
              type="date"
              fullWidth
              size="small"
              value={fakturDate}
              onChange={(e) => validateInput(e.target.value, "FakturDate")}
            />
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={
              !isMobile
                ? { mt: 2, pl: 2, pr: 2, mb: 5 }
                : { mt: 1, pl: 2, pr: 2 }
            }
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              PIC
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={
              !isMobile
                ? { mt: 2, pl: 2, pr: 2, mb: 5 }
                : { mt: 1, pl: 2, pr: 2, mb: 3 }
            }
          >
            <Item>&nbsp;{pic}</Item>
          </Grid>
        </Grid>
      </Paper>
      <Paper
        elevation={2}
        sx={{ width: "100%", mb: 2 }}
        style={isReceive === false ? { display: "none" } : {}}
      >
        <Grid container>
          <Grid item sx={{ my: 2, pl: 3.5, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Input Receive Tukar Guling
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 0.5 }} />
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12} md={1} lg={1} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <Typography
              variant="subtitle1"
              sx={
                isDesktop ? { fontWeight: 600, pl: 1.5 } : { fontWeight: 600 }
              }
            >
              PROCOD
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <OutlinedInput
              fullWidth={(isMobile || isTablet) && true}
              size="small"
              sx={{ bgcolor: "white", mr: "2%" }}
              disabled={listTempRecvProcod.length !== 0}
              onKeyPress={(e) => scanProcod(e)}
              onChange={(e) => setCurrProcod((currProcod = e.target.value))}
              value={currProcod}
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
        <Grid container>
          <Grid sx={{ pl: 3.5, pr: 2, mt: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, textAlign: "right" }}
            >
              QTY OUT : {totalQty} {currProd.sellpack}
            </Typography>
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
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty In
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Sell Pack
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
              {listTempRecvProcod.length !== 0 ? (
                listTempRecvProcod.map((item) => (
                  <TableRow key={item.batch}>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell>
                      {formatDate(item.expireddate, "ddd MMMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">{item.qtyin}</TableCell>
                    <TableCell align="center">{currProd.sellpack}</TableCell>
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
          disabled={currProd.proname === undefined}
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
        style={isReceive !== true ? { display: "none" } : {}}
      >
        <Grid container>
          <Grid item sx={{ my: 2, pl: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "Receive Products" : "Produk Receive"}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 0.5 }} />
        <TableContainer>
          <Table sx={{ mb: 4 }}>
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
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty In
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Sell Pack
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listTempReceive.length !== 0 ? (
                listTempReceive.map((item) => (
                  <TableRow key={item.procod}>
                    <TableCell>{item.procod}</TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      {item.proname === "" ? "-" : item.proname}
                    </TableCell>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell>
                      {formatDate(item.expireddate, "ddd MMMM DD YYYY")}
                    </TableCell>
                    <TableCell>{item.qtyin}</TableCell>
                    <TableCell>{item.sellpack}</TableCell>
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
          </Table>
        </TableContainer>
      </Paper>
      <Paper elevation={2} sx={{ width: "100%", mb: 2 }}>
        <Grid container>
          <Grid item sx={{ my: 2, pl: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "Exchange Products" : "Produk Tukar Guling"}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 0.5 }} />
        <TableContainer>
          <Table sx={{ mb: 4 }}>
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
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Batch
                  </Typography>
                </TableCell>
                <TableCell align="center">
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
                    Qty In
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
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    No. Recv
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {language === "EN" ? "Receive Date" : "Tanggal Receive"}
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
              ) : listTampil ? (
                listTampil.map((item) => (
                  <TableRow key={item.procod}>
                    <TableCell>{item.procod}</TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      {item.proname === "" ? "-" : item.proname}
                    </TableCell>
                    <TableCell align="center">{item.batch}</TableCell>
                    <TableCell align="center">
                      {formatDate(item.expireddate, "ddd MMMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">{item.qtyout}</TableCell>
                    <TableCell align="center">{item.qtyin}</TableCell>
                    <TableCell align="center">{item.sellpack}</TableCell>
                    <TableCell align="center">{item.reasonname}</TableCell>
                    <TableCell align="center">
                      {item.norecv === "0" || item.norecv === ""
                        ? "-"
                        : item.norecv}
                    </TableCell>
                    <TableCell align="center">
                      {item.recvdate === "0001-01-01T00:00:00Z" ||
                      item.recvdate === null
                        ? "-"
                        : formatDate(item.recvdate, "ddd MMMM DD YYYY")}
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
          </Table>
        </TableContainer>
        <Grid
          container
          justifyContent={"center"}
          sx={{ p: 2 }}
          style={
            isReceive === true ? { display: "none" } : { textAlign: "center" }
          }
        >
          {/* <Button
                  variant="contained"
                  onClick={() => toggleModal('savePrint')}
                  style={status === "N" ? {} : {display: 'none'}}
              >
                  Save & Print
              </Button> */}
          <Button
            variant="contained"
            onClick={() => printTukarGuling()}
            sx={{ displayPrint: "none", mr: 2 }}
            style={status === "N" ? { display: "none" } : {}}
          >
            Print Preview
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsReceive(true)}
            style={status === "R" || status === "N" ? { display: "none" } : {}}
          >
            Receive
          </Button>
        </Grid>
        <Grid
          container
          justifyContent={"flex-end"}
          sx={{ p: 2 }}
          style={
            isReceive === false ? { display: "none" } : { textAlign: "center" }
          }
        >
          <Button
            // size="large"
            variant="contained"
            onClick={() => router.push(`/tukarguling`)}
            sx={{ mr: 2, width: "100px" }}
            color="error"
          >
            {language === "EN" ? "Cancel" : "Batal"}
          </Button>
          <Button
            variant="contained"
            disabled={
              listTempReceive.length === 0 ||
              noFaktur === "" ||
              fakturDate === currDate
            }
            onClick={() => toggleModal("receive")}
            sx={{ width: "100px" }}
          >
            {language === "EN" ? "Save" : "Simpan"}
          </Button>
        </Grid>
      </Paper>

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
            {/* {currProcod} */}
            {language === "EN"
              ? "Add Batch Product"
              : "Tambah Batch Produk"}{" "}
            {currProcod}
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
                  variant="outlined"
                  size="small"
                  margin={"none"}
                  fullWidth
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                />
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
                  onChange={(e) => validateInput(e.target.value, "ExpiredDate")}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid container item xs={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pt: 0.5 }}
                >
                  Qty In
                </Typography>
              </Grid>
              <Grid container item xs={8}>
                <TextField
                  variant="outlined"
                  size="small"
                  margin={"none"}
                  fullWidth
                  value={qtyIn}
                  onChange={(e) => validateInput(e.target.value, "QtyIn")}
                />
              </Grid>
            </Grid>
          </DialogContent>
        )}
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            disabled={
              batch === "" ||
              qtyIn > totalQty ||
              qtyIn === "" ||
              expDate === currDate
            }
            onClick={() => saveReceive()}
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
        <DialogTitle sx={{ fontWeight: 600 }}>{modalTitle}</DialogTitle>
        <Divider sx={{ mb: 1 }} />
        <DialogContent>
          <Typography variant="body1">{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            color="success"
            disabled={loading}
            onClick={() => {
              modalType === "RECEIVE" ? confirmReceive() : saveTukarGuling();
            }}
          >
            {!loading && <span>{language === "EN" ? "Yes" : "Ya"}</span>}
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
              {language === "EN" ? "No" : "Tidak"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* MODAL KONFIRMASI */}
    </Box>
  );
};

export default TukarGulingDetail;
