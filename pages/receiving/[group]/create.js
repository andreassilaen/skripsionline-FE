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

import api from "../../../services/receiving";
// import Link from "../../utils/link";
import { formatDate } from "../../../utils/text";
import useToast from "../../../utils/toast";
import useResponsive from "../../../utils/responsive";
import { getStorage } from "../../../utils/storage";

import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { ArrowBack } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync";

// import LoadingButton from '@mui/lab/LoadingButton';

const initialLastBatch = {
  rcvd_ed: "",
  rcvd_nobatch: "test",
  rcvd_quantityrecv: "",
  rcvd_quantitybonus: "",
};

const ReceivingNew = (props) => {
  const router = useRouter();
  const [displayToast] = useToast();

  const pt = getStorage("pt");
  const pt_id = JSON.parse(pt).pt_id;
  const outcodeData = getStorage("outlet");
  const outcode = JSON.parse(outcodeData).out_code;
  const dataRecv = JSON.parse(window.sessionStorage.getItem("dataRecv"));
  const userNIP = getStorage("userNIP");
  var group = !router.query.group ? dataRecv.rcvh_group : router.query.group;
  // var language = 'EN'
  var language = props.language;

  const isMobile = useResponsive().isMobile;
  const isTablet = useResponsive().isTablet;
  const isDesktop = useResponsive().isDesktop;

  const debounceMountListDetailPO = useCallback(
    debounce(mountListDetailPO, 400),
    []
  );

  const debounceMountListDetailPOAgain = useCallback(
    debounce(mountListDetailPOAgain, 400),
    []
  );

  const debounceMountGetKaryawanData = useCallback(
    debounce(mountGetKaryawanData, 400),
    []
  );

  const debounceMountSaveAddBatch = useCallback(
    debounce(mountSaveAddBatch, 400),
    []
  );

  const debounceMountDeleteBatch = useCallback(
    debounce(mountDeleteBatch, 400),
    []
  );

  const debounceMountConfirmPO = useCallback(debounce(mountConfirmPO, 400), []);

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_RECEIVING"].includes(
          "LOGISTIC_RECEIVING_CREATE"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  // useEffect(() => {
  //   if (!router.isReady) return;

  //   debounceMountListReceivingDetail(router.query.id, pt_id, outcode, group)

  // }, [router.isReady]);

  useEffect(() => {
    var displayScan = document.getElementById("scanNoPO");
    if (dataRecv !== null) {
      if (displayScan !== null) {
        displayScan.style.display = "none";
      }
      // console.log('displayscan', displayScan)
      debounceMountListDetailPOAgain(pt_id, dataRecv, outcode, group);
    }
    // getAccess();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   console.log('setrealCurrProcod', realCurrProcod)
  // }, [realCurrProcod])

  const [listReceivingDetail, setListReceivingDetail] = useState([]);
  var [listTampil, setListTampil] = useState([]);
  var [currentRecv, setCurrentRecv] = useState([]);
  var [headerPO, setHeaderPO] = useState({});
  var [namaKaryawan, setNamaKaryawan] = useState("");
  var [firstLoad, setFirstLoad] = useState(true);
  var [dataAvailable, setDataAvailable] = useState(false);
  var [isLoading, setIsLoading] = useState(false);

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

  var [noPO, setNoPO] = useState("");
  var [nip, setNip] = useState("");
  var [noFaktur, setNoFaktur] = useState("");
  var [noDO, setNoDO] = useState("");
  var [tglFaktur, setTglFaktur] = useState("");
  var [tglDO, setTglDO] = useState("");
  var [nipRecv, setNipRecv] = useState("");
  var [currProcod, setCurrProcod] = useState(""); // procod yang lagi discan (untuk field edit procod)
  var [realCurrProcod, setRealCurrProcod] = useState(""); // procod yang discan
  var [currProd, setCurrProd] = useState({}); //array tampung hasil scan
  var [isAdding, setIsAdding] = useState(true);
  var [isScan, setIsScan] = useState(false);
  var [show, setShow] = useState(false);
  var [lastBatch, setLastBatch] = useState(initialLastBatch);
  var [loadingKaryawan, setLoadingKaryawan] = useState(true);
  var [loading, setLoading] = useState(false);
  var [nipRecv, setNipRecv] = useState("");
  var [totalCurrQty, setTotalCurrQty] = useState(0);
  var [remainingQty, setRemainingQty] = useState(0);
  var [totalCurrQtyBonus, setTotalCurrQtyBonus] = useState(0);
  var [remainingQtyBonus, setRemainingQtyBonus] = useState(0);
  var [validTglDO, setValidTglDO] = useState(false);
  var [validTglFaktur, setValidTglFaktur] = useState(false);
  var [showForm, setShowForm] = useState(false);
  var [detailAddBatch, setDetailAddBatch] = useState({});
  var [quantityTotal, setQuantityTotal] = useState(0);
  var [quantitybonuspo, setQuantitybonuspo] = useState(0);
  var [isDisabled, setIsDisabled] = useState(false);
  var [currentBatch, setCurrentBatch] = useState({});
  var [inputBatchBonus, setInputBatchBonus] = useState(0);
  var [inputBatchRecv, setInputBatchRecv] = useState(0);

  var [modalAddBatch, setModalAddBatch] = useState(false);
  var [modalConfirmIsOpen, setModalConfirmIsOpen] = useState(false);
  var [modalSaveRecv, setModalSaveRecv] = useState(false); //modal_nested

  //ADD BATCH FORM
  var [validInputBatchED, setValidInputBatchED] = useState(false);
  var [invalidInputBatchED, setInvalidInputBatchED] = useState(false);

  var [validInputBatchNo, setValidInputBatchNo] = useState(false);
  var [invalidInputBatchNo, setInvalidInputBatchNo] = useState(false);

  var [validInputBatchQty, setValidInputBatchQty] = useState(false);
  var [invalidInputBatchQty, setInvalidInputBatchQty] = useState(false);

  var [validInputBatchBonus, setValidInputBatchBonus] = useState(false);
  var [invalidInputBatchBonus, setInvalidInputBatchBonus] = useState(false);

  useEffect(() => {
    var x = document.getElementById("receivingUpper");
    var y = document.getElementById("receivingBottom");
    var displayScan = document.getElementById("scanNoPO");

    if (listTampil && listTampil.length > 0) {
      if (x && x.style.display === "none" && y && y.style.display === "none") {
        x.style.display = "block";
        y.style.display = "block";
        displayScan.style.display = "none";
      }
    }
    // console.log('listtampil', listTampil)
  }, [listTampil]);

  function setEmptyInputForm(e) {
    var tempInit = {};
    Object.assign(tempInit, initialLastBatch);
    setDetailAddBatch(
      (detailAddBatch = {
        rcvd_ed: "",
        rcvd_nobatch: "",
        rcvd_quantityrecv: "",
        rcvd_quantitybonus: "",
      })
    );
    setValidInputBatchED((validInputBatchED = ""));
    setInvalidInputBatchED((invalidInputBatchED = ""));

    setValidInputBatchNo((validInputBatchNo = ""));
    setInvalidInputBatchNo((invalidInputBatchNo = ""));

    setValidInputBatchQty((validInputBatchQty = ""));
    setInvalidInputBatchQty((invalidInputBatchQty = ""));

    setValidInputBatchBonus((validInputBatchBonus = ""));
    setInvalidInputBatchBonus((invalidInputBatchBonus = ""));
  }

  //USE EFFECT setiap modalAddBatch = false (Empt Input Form)
  useEffect(() => {
    setEmptyInputForm();
    if (modalAddBatch === true) {
      setShowForm((showForm = true));

      //get total current qty & remaining qty
      var obj = currProd["batch"];
      var totalQty = obj.length > 0 ? obj[0]["rcvd_quantityrecv"] : 0;
      var totalQtyBonus = obj.length > 0 ? obj[0]["rcvd_quantitybonus"] : 0;

      for (let i = 1; i < obj.length; i++) {
        totalQty += obj[i]["rcvd_quantityrecv"];
        totalQtyBonus += obj[i]["rcvd_quantitybonus"];
      }

      setTotalCurrQty(totalQty);
      setRemainingQty(currProd["rcvd_quantitysellunitpo"] - totalQty);

      setTotalCurrQtyBonus(totalQtyBonus);
      setRemainingQtyBonus(
        currProd["rcvd_quantitysellunitbonuspo"] - totalQtyBonus
      );

      // console.log('ini', totalCurrQty, remainingQty)
    } else {
      setShowForm((showForm = false));
      // console.log('ini2', modalAddBatch)
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
      if (inputBatchBonus === 0 && inputBatchRecv === 0) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    } else {
      setIsDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    validInputBatchED,
    validInputBatchNo,
    validInputBatchQty,
    validInputBatchBonus,
    inputBatchBonus,
    inputBatchRecv,
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

  async function mountListDetailPO(flag, payload) {
    try {
      // setDataAvailable((dataAvailable = true))
      var sb = document.getElementById("searchPOButton");
      // var sbr = document.getElementById('renewSearchPO')
      sb.style.display = "none";
      // sbr.style.display = 'block';
      // var profile = JSON.parse(window.sessionStorage.getItem('profile'));

      const getDetailPO = await api.getDetailPO(flag, payload);
      const { data, metadata, error } = getDetailPO.data;
      // console.log("GET DATA PO ", getDetailPO);

      if (error.status === false) {
        // console.log('MASUK ERROR STATUS FALSE');
        if (metadata.Status === "TRUE") {
          window.localStorage.setItem("listPO", JSON.stringify(data));
          window.localStorage.setItem("confirmPO", JSON.stringify(data));

          setHeaderPO((headerPO = data.header));
          setFirstLoad((firstLoad = false));

          var testDetail = !firstLoad && formatTabel1(data.detail);
          setListTampil(testDetail);

          displayToast("success", "PO Data Found!");

          // console.log("ISI HEADERPO", data.header);
        } else if (
          metadata.Status === "FALSE" ||
          metadata.Status === "FALSE_P"
        ) {
          // console.log('sini')
          displayToast("error", metadata.Message);
          sb.style.display = "block";
          // sbr.style.display = 'none';
        }
      } else {
        displayToast("error", error.msg);
        sb.style.display = "block";
        // sbr.style.display = 'none';
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountListDetailPOAgain(pt, datas, outcode, group) {
    try {
      //   setDataAvailable((dataAvailable = true))
      var noRecv;
      if (datas !== null) {
        noRecv = datas.rcvh_norecv;
      }
      const getReceivingDetail = await api.getReceivingDetail(
        noRecv,
        pt,
        outcode,
        group
      );
      const { data, metadata } = getReceivingDetail.data;
      // console.log("GET DATA PO AGAIN LIST", getReceivingDetail);

      if (metadata.Status === "TRUE") {
        window.localStorage.setItem("listPO", JSON.stringify(data));
        window.localStorage.setItem("confirmPO", JSON.stringify(data));

        if (
          data.detail === null ||
          data.detail === 0 ||
          data.detail.length === 0
        ) {
          setIsScan(true);
          displayToast("error", "There is no Receiving Detail Data");
        } else {
          setHeaderPO((headerPO = data.header));
          setFirstLoad((firstLoad = false));

          var testDetail = !firstLoad && formatTabel1(data.detail);
          setListTampil(testDetail);
          // console.log('testdetail', data.detail.length)

          //cek flag
          if (data.header.rcvh_flag !== "N") {
            router.push(
              `/receiving/${data.header.rcvh_group}/view/${data.header.rcvh_norecv}`
            );
          }
        }

        if (data.header.rcvh_niprecv !== "") {
          // getKaryawanData(header.rcvh_niprecv);
          setNamaKaryawan((namaKaryawan = data.header.rcvh_empname));
        }
      } else if (metadata.Status === "FALSE") {
        displayToast("error", metadata.Message);

        if (metadata.Message.toLowerCase().includes("expired")) {
          window.sessionStorage.clear();
          //   history.push('/#/login')
        }
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountSaveAddBatch(flag, payload, realProcod) {
    try {
      // setDataAvailable((dataAvailable = true))

      const getDetailPO = await api.getDetailPO(flag, payload);
      const { data, metadata, error } = getDetailPO.data;
      // console.log("save add batch", getDetailPO);

      var x = document.getElementById("saveButton");

      // console.log('datadetail', data.detail)
      if (data === undefined || data === null) {
        x.style.display = "block";
        // y.style.display = 'none';

        setModalAddBatch((modalAddBatch = false));
        displayToast("error", "Data Failed to save!");
      } else {
        if (error.status === false) {
          if (metadata.Status === "TRUE") {
            if (error.msg.toLowerCase().includes("expired")) {
              window.sessionStorage.clear();
              //  history.push('/#/login')
            }
            setModalAddBatch((modalAddBatch = false));
            setCurrProd((currProd = searchCurrProd(data.detail, realProcod)));
            setIsLoading(false);
            // x.style.display = 'block';
            // y.style.display = 'none';
            displayToast("success", "Data saved successfully");
          } else {
            //  x.style.display = 'block';
            //  y.style.display = 'none';
            setIsLoading(false);
            displayToast("error", metadata.Message);
          }
        } else {
          //  x.style.display = 'block';
          //  y.style.display = 'none';
          setIsLoading(false);
          displayToast("error", error.msg);
        }
      }
    } catch (error) {
      // x.style.display = 'block';
      // y.style.display = 'none';
      console.log(error);
      setIsLoading(false);
      setModalAddBatch(false);
      displayToast("error", error.code);
    }
  }

  async function mountGetKaryawanData(nip) {
    try {
      const getKaryawanData = await api.getKaryawan(nip);
      const { data, error } = getKaryawanData.data;
      // console.log("GET KARYAWAN DATA", getKaryawanData);

      if (error.status === true) {
        displayToast("error", error.msg);
      } else {
        // console.log('data karyawan', data)
        if (data === undefined) {
          setNamaKaryawan((namaKaryawan = ""));
          setLoadingKaryawan(true);
          displayToast("error", "PIC Not Found.");
        } else {
          setNamaKaryawan((namaKaryawan = data.KryNama));
          setLoadingKaryawan(true);
          setNipRecv(data.KryNIP);
          displayToast("success", data.KryNama + " found");
        }
      }
    } catch (error) {
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountDeleteBatch(payload, realProcod) {
    try {
      setLoading((loading = true));

      const deleteBatch = await api.deleteBatchReceiving(payload);
      const { data, metadata, error } = deleteBatch.data;
      // console.log("DELETE BATCH RECEIVING", deleteBatch);

      if (error.status === true) {
        displayToast("error", error.msg);
      } else {
        if (data.Status === "TRUE") {
          var detailProd = metadata.detail;
          setCurrProd((currProd = searchCurrProd(detailProd, realProcod)));
          setLoading((loading = false));
          displayToast("success", data.Message);
          setModalConfirmIsOpen((modalConfirmIsOpen = false));
          // console.log('currprod deletebatch', currProd)
        } else {
          displayToast("error", data.Message);
          setLoading((loading = false));
          setModalConfirmIsOpen((modalConfirmIsOpen = false));
        }
      }
      setModalConfirmIsOpen((modalConfirmIsOpen = false));
      setLoading((loading = false));
    } catch (error) {
      setModalConfirmIsOpen((modalConfirmIsOpen = false));
      setLoading((loading = false));
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountConfirmPO(flag, payload) {
    try {
      setLoading((loading = true));
      // console.log('payload confirm po', payload)

      const confirmPO = await api.getDetailPO(flag, payload);
      const { data, metadata, error } = confirmPO.data;
      // console.log('confirm po', confirmPO)

      if (error.status === false) {
        if (metadata.Status === "TRUE") {
          displayToast("success", metadata.Message);
          window.localStorage.removeItem("listPO");
          window.localStorage.removeItem("confirmPO");
          if (
            payload.rcvh_group === "2" ||
            parseInt(payload.rcvh_group) === 2
          ) {
            router.push(`/receiving/2`);
          } else if (
            payload.rcvh_group === "1" ||
            parseInt(payload.rcvh_group) === 1
          ) {
            router.push(`/receiving/1`);
          }
        } else if (metadata.Status === "FALSE") {
          displayToast("error", metadata.Message);
          debounceMountListDetailPOAgain(
            payload.rcvh_ptid,
            window.sessionStorage.getItem("dataRecv"),
            payload.rcvh_outcoderecv,
            payload.rcvh_group
          );
        }
      } else {
        displayToast("error", error.msg);
        setValidTglDO(false);
        setValidTglFaktur(false);
      }

      setModalSaveRecv(false);
      setValidTglDO(false);
      setValidTglFaktur(false);
      setLoading(false);
    } catch (error) {
      displayToast("error", error);
      setLoading((loading = false));
      setValidTglDO(false);
      setValidTglFaktur(false);
      console.log(error);
    }
  }

  function getDetailPO() {
    var payload = {
      group: parseInt(group),
      ptid: parseInt(pt_id),
      projectid: 0, // blm tau darimana parseInt(projectid)
      gudangID: outcode,
      NIP: userNIP,
      userID: userNIP,
      noref: noPO,
    };
    // console.log('New Receiving Payload', payload);

    debounceMountListDetailPO("N", payload);
  }

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  const showSupplier = (no = "", name = "") => {
    return no + " - " + name;
  };

  function formatTabel1(details) {
    // console.log('FORMAT TABEL : ',detail.rcvd_quantityrecv)
    for (let i = 0; i < details.length; i++) {
      var detail = details[i];
      if (detail.batch) {
        if (detail.batch.length > 1) {
          var objBatchRecv = detail.batch.map(function (batch) {
            var totalqty = batch.rcvd_quantityrecv + batch.rcvd_quantitybonus;

            // return batch.rcvd_nobatch + '(' + batch.rcvd_quantityrecv + ')'; // JANGAN LUPA COMMENT ganti yang bawah
            return batch.rcvd_nobatch + "(" + totalqty + ")"; // JANGAN LUPA UNCOMMENT
          });
          // Result: [154(2), 110(3), 156(4)] -> array
          //array.join() = returns an array as a string.
          detail["rcvd_nobatch"] = objBatchRecv.join();

          var objQtyRecv = detail.batch.map(function (batch) {
            return batch.rcvd_quantityrecv;
          });
          detail["rcvd_quantityrecv"] = objQtyRecv.reduce(function (
            acc,
            score
          ) {
            return acc + score;
          },
          0);

          //25/05/22 tampilin qty bonus di receiving bottom (diambil dari penjumlahan qty bonus per batch)
          //25/05/22 tampung semua qty bonus di batch ke dalam array
          var objQtyBonus = detail.batch.map(function (batch) {
            return batch.rcvd_quantitybonus;
          });
          //25/05/22 reduce : totalin qty bonus di semua batch (dari array tampungan objQtyBonus)
          detail["rcvd_quantitybonus"] = objQtyBonus.reduce(function (
            acc,
            score
          ) {
            return acc + score;
          },
          0);
        } else {
          detail["rcvd_nobatch"] = detail.batch[0]["rcvd_nobatch"];
          detail["rcvd_quantityrecv"] = detail.batch[0]["rcvd_quantityrecv"];
          detail["rcvd_quantitybonus"] = detail.batch[0]["rcvd_quantitybonus"]; //25/04/22 set qty bonus untuk data receviving bottom -> jika batch cuma 1
        }
      } else {
        detail["rcvd_nobatch"] = "";
        detail["rcvd_quantityrecv"] = 0;
        detail["rcvd_quantitybonus"] = 0; //25/04/22 set qty bonus untuk data receviving bottom -> jika tidak ada batch
      }
    }
    return details;
  }

  function updateFakturSupplier(value) {
    if (noFaktur === noDO) {
      setNoFaktur(value);
      setNoDO(value);
    } else {
      setNoFaktur(value);
    }
  }

  function validateTgl(value, field, arrayName, type) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    var d1 = Date.parse(value);
    var d2 = Date.parse(today);

    switch (type) {
      case "header":
        // console.log('TANGGALNYA ADALAH HEADER: ', value);
        if (d1 > d2) {
          if (field === "rcvh_tgldo") {
            setValidTglDO(false);
          } else {
            setValidTglFaktur(false);
          }
          displayToast("error", "Date cannot exceed today`s date!");
        } else {
          if (field === "rcvh_tgldo") {
            setValidTglDO(true);
            // setHeaderPO({...headerPO, rcvh_tgldo : value })
            setTglDO(value);
          } else {
            setValidTglFaktur(true);
            // setHeaderPO({...headerPO, rcvh_tglfaktur : value })
            setTglFaktur(value);
          }
        }
        break;

      case "detail":
        // console.log('TANGGALNYA ADALAH DETAIL: ', value);
        if (d1 < d2) {
          updateArrayObjectValue(value, field, arrayName);
          updateObjectValue(value, field, "lastBatch");
          displayToast("error", "The Date cannot be less than today");
        } else {
          updateArrayObjectValue(value, field, arrayName);
          updateObjectValue(value, field, "lastBatch");
        }
        break;

      default:
        break;
    }
  }

  function validateTglReturnBool(value, field, arrayName, type) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    var d1 = Date.parse(value);
    var d2 = Date.parse(today);

    switch (type) {
      case "header":
        if (d1 > d2) {
          updateObjectValue(today, field, arrayName);
          displayToast("error", "The Date cannot be less than today!");
          return false;
        } else {
          updateObjectValue(value, field, arrayName);
          return true;
        }

      case "detail":
        if (d1 < d2) {
          displayToast("error", "The Date cannot be less than today!");
          return false;
        } else {
          return true;
        }

      default:
        break;
    }
  }

  const validateAddBatch = (value, field, arrayName, type) => {
    //update ke object nya (lastBatch)
    updateObjectValue(value, field, arrayName);

    //JUMLAH TOTAL QTY & QTY BONUS
    var obj = currProd["batch"];
    var totalQty = obj.length > 0 ? obj[0]["rcvd_quantityrecv"] : 0;
    var totalQtyBonusPO = obj.length > 0 ? obj[0]["rcvd_quantitybonus"] : 0;

    for (let i = 1; i < obj.length; i++) {
      totalQty += obj[i]["rcvd_quantityrecv"];
      totalQtyBonusPO += obj[i]["rcvd_quantitybonus"];
    }

    //VALIDATE TGL
    if (type === "validateTgl") {
      if (
        validateTglReturnBool(value, field, arrayName, "detail") === false ||
        value === ""
      ) {
        setValidInputBatchED(false);
        setInvalidInputBatchED(true);
      } else {
        setValidInputBatchED(true);
        setInvalidInputBatchED(false);
      }
    } else if (type === "validateBatchNo") {
      if (value.length <= 0 || value.trim() === "") {
        displayToast("error", "Batch No must be filled");
        setValidInputBatchNo(false);
        setInvalidInputBatchNo(true);
      } else {
        setValidInputBatchNo(true);
        setInvalidInputBatchNo(false);
      }
    } else if (type === "validateQty") {
      setInputBatchRecv(value);
      totalQty += parseInt(value);
      if (totalQty <= currProd["rcvd_quantitysellunitpo"]) {
        setValidInputBatchQty(true);
        setInvalidInputBatchQty(false);
        setQuantityTotal(totalQty);
        // }
      } else if (totalQty > currProd["rcvd_quantitysellunitpo"]) {
        displayToast("error", "Quantity Exceeds Total PO");
        setValidInputBatchQty(false);
        setInvalidInputBatchQty(true);
      } else {
        displayToast("error", "Quantity Invalid");
        setValidInputBatchQty(false);
        setInvalidInputBatchQty(true);
      }
    } else if (type === "validateQtyBonus") {
      setInputBatchBonus(value);
      var newTotalQtyBonusPO = isNaN(totalQtyBonusPO) ? 0 : totalQtyBonusPO;
      newTotalQtyBonusPO += parseInt(value);
      if (newTotalQtyBonusPO <= currProd["rcvd_quantitysellunitbonuspo"]) {
        setValidInputBatchBonus(true);
        setInvalidInputBatchBonus(false);
        setQuantitybonuspo(newTotalQtyBonusPO);
      } else if (
        newTotalQtyBonusPO > currProd["rcvd_quantitysellunitbonuspo"]
      ) {
        displayToast("error", "Quantity Bonus Exceeds Total Bonus PO");
        setValidInputBatchBonus(false);
        setInvalidInputBatchBonus(true);
      } else {
        displayToast("error", "Quantity Bonus Invalid");
        setValidInputBatchBonus(false);
        setInvalidInputBatchBonus(true);
      }
    }
  };

  // function updateObjectValue hanya untuk mengupdate value pada object saja, tidak bisa array
  function updateObjectValue(value, field, Data) {
    // console.log('field update object value', field)
    let currentData = Data;

    currentData[field] = value;
  }

  // updateArrayObjevtValue -> untuk update array object (dipakai di validateTgl -> header)
  function updateArrayObjectValue(value, field, arrayName) {
    var index = parseInt(id);
    let currentData = arrayName;
    currentData["batch"][index][field] = value;
  }

  function getEnterForKaryawan(param) {
    setLoadingKaryawan(false);
    // getKaryawanData(param)
    debounceMountGetKaryawanData(param);
  }

  const scanTF = () => {
    // true untuk manual, false untuk login
    if (true) {
      setShow((show = true));
      setCurrProd((currProd = {}));
    }
  };

  const closeScan = () => {
    setShow((show = false));
    setLastBatch((lastBatch = initialLastBatch));
    setRealCurrProcod((realCurrProcod = ""));
    setCurrProcod((currProcod = ""));
    setCurrProd((currProd = []));
    setIsScan((isScan = false));
    setIsAdding((isAdding = true));
    // setNamaKaryawan('')
    // setNip('')

    var displayReceivingBottom = document.getElementById("receivingBottom");
    displayReceivingBottom.style.display = "block";
    // console.log('TERPANGGIL CLOSE SCAN')
    // getDetailPOAgain(group, data, gudangID);
    var param = dataRecv;
    if (param === null) {
      param = {
        rcvh_norecv: headerPO.rcvh_norecv,
      };
    }
    debounceMountListDetailPOAgain(pt_id, param, outcode, group);
  };

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

      if (currProd.rcvd_proname === undefined || currProcod === "") {
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

  function scanValidation(obj1 = null) {
    var obj = obj1["batch"];

    // console.log('SCAN VALIDATION : ', obj)

    var objQtyRecv = obj.map(function (batch) {
      return batch.rcvd_quantityrecv;
    });
    // Result: [154, 110, 156]
    var totalQtyRecv = objQtyRecv.reduce(function (acc, score) {
      return acc + score;
    }, 0);

    if (!obj || parseInt(totalQtyRecv) + 1 > parseInt(obj1.rcvd_quantitypo)) {
      return false;
    } else {
      return true;
    }
  }

  const scanProcod = (event) => {
    // console.log('EVENT SCAN PROCOD', event.target.value.trim())
    if (
      event.key === "Enter" &&
      event.target.value !== "" &&
      event.target.value.trim() !== "" &&
      event.target.value.trim().length > 0
    ) {
      var data1 = JSON.parse(window.localStorage.getItem("listPO"));
      var detail = data1.detail;
      var tempProcod = event.target.value.trim();
      var found;
      var searchList = listTampil;

      canBeAdd();
      canBeScan();

      // ELEMENT SUDAH DI SIMPAN DI FOUND
      found = searchList.find(function (element) {
        return element.rcvd_procode === tempProcod;
      });

      // console.log('FOUND ISINYA: ',found);

      if (found === undefined) {
        found = detail.find(function (element) {
          return element.rcvd_procode === tempProcod;
        });
      }
      //   if (found.batch)

      found = { ...found };

      //BATCH
      if (found === undefined || Object.keys(found).length === 0) {
        displayToast("error", "Procod is not on PO list.");
      } else {
        var batch;

        if (found["batch"] === null) {
          batch = [];
          found["batch"] = [];
        } else {
          batch = [...found["batch"]];
        }

        // console.log('REAL PROCOD', realCurrProcod , tempProcod)
        if (realCurrProcod !== tempProcod && found["batch"].length > 1) {
          var object = [];
          for (let i = 0; i < batch.length; i++) {
            object.push({ ...batch[i] });
          }

          // eslint-disable-next-line
          var batch = [...object];
          found = { ...found, batch: [...batch] };

          setRealCurrProcod((realCurrProcod = tempProcod));
          // console.log('SET REAL ', realCurrProcod , tempProcod)
          // setModal_chooseBatch((modal_chooseBatch = true))
          // setFound((found = { ...found }))
          setCurrProd((currProd = { ...found }));
          setLastBatch(
            (lastBatch = { ...found["batch"][found["batch"].length - 1] })
          );
          document.getElementById("satuanSellpack").style.display = "block";
          return;
        } else {
          if (found.rcvd_passIc !== "") {
            //this.toggle.bind(event, 'nested_parent_scan');
          } else {
            // console.log('REAL PROCOD : ', realCurrProcod, tempProcod)
            if (realCurrProcod !== tempProcod) {
              if (found["batch"].length > 1) {
                var quantity = found["batch"][0]["rcvd_quantityrecv"];
                if (found["batch"][0]["rcvd_quantityrecv"] <= quantity + 1) {
                  var object1 = {
                    ...batch[0],
                    rcvd_quantityrecv: quantity + 0,
                  };
                  batch[0] = { ...object1 };
                  found = { ...found, batch: [...batch] };
                  var newCurrProd = { ...found };

                  setRealCurrProcod((realCurrProcod = tempProcod));
                  // console.log('SET REAL ', realCurrProcod , tempProcod)
                  setCurrProd((currProcod = newCurrProd));
                  setLastBatch(
                    (lastBatch = {
                      ...newCurrProd["batch"][newCurrProd["batch"].length - 1],
                    })
                  );
                  document.getElementById("satuanSellpack").style.display =
                    "block";
                } else {
                  alert("offside2");
                }
              } else {
                // setCurrProd((currProcod = found))
                // document.getElementById('satuanSellpack').style.display = 'block'

                setRealCurrProcod((realCurrProcod = tempProcod));
                // console.log('SET REAL ', realCurrProcod , tempProcod)
                setCurrProd((currProcod = found));
                setLastBatch((lastBatch = initialLastBatch));
                document.getElementById("satuanSellpack").style.display =
                  "block";
              }
            } else {
              var newCurrProd1 = { ...currProd };
              if (scanValidation({ ...newCurrProd1 })) {
                newCurrProd1["batch"][id]["rcvd_quantityrecv"] =
                  lastBatch["rcvd_quantityrecv"] + 1;

                setCurrProd((currProd = newCurrProd1));
                setLastBatch(
                  (lastBatch = {
                    ...newCurrProd1["batch"][newCurrProd1["batch"].length - 1],
                  })
                );
                document.getElementById("satuanSellpack").style.display =
                  "block";
              } else {
                displayToast("error", "Recv QTY is the same as PO QTY");
              }
            }
          }

          setShow(true);
          // var qtyBonus = document.getElementById('qtyPOBonus')
          // qtyBonus.style.display = 'block'
        }
      }
    } else if (
      event.key === "Enter" &&
      event.target.value.trim().length === 0
    ) {
      alert("Procod Can Not Be Empty!");
    }
    // console.log('CURRPROD : ', currProd)
  };

  function searchCurrProd(detail, realProcod) {
    // var procod = realCurrProcod;
    var procod = realProcod;
    var found;

    // console.log('search', detail, realCurrProcod)
    found = detail.find(function (element) {
      return element.rcvd_procode === procod;
    });

    // console.log('SEARCH PROCOD : ', procod, found)

    //12/01/22 if batch === null after delete batch receiving
    if (found !== undefined) {
      if (found.batch === null) {
        found.batch = [];
        found["rcvd_nobatch"] = "";
        found["rcvd_quantityrecv"] = 0;
        // console.log('found batch null')
      }
    }

    // console.log('FOUND', found)
    return found;
  }

  const saveAddBatch = (param) => {
    setIsLoading(true);
    // var x = document.getElementById('saveButton')
    // var y = document.getElementById('renewButton')

    // x.style.display = 'none';
    // y.style.display = 'block';
    var data1 = JSON.parse(window.localStorage.getItem("listPO"));
    var header = data1.header;
    var detail = {};
    var tempCurrProd = currProd.batch[0];
    var profile = JSON.parse(window.sessionStorage.getItem("profile"));

    //Object.assign -> copy object agar bisa diupdate tanpa merubah object aslinya
    Object.assign(detail, tempCurrProd);

    if (typeof header.rcvh_group === "string") {
      header.rcvh_group = parseInt(header.rcvh_group);
    }

    //FORMAT DATE
    var efDate = param["rcvd_ed"];
    if (efDate !== null) {
      if (!efDate.includes("T")) {
        efDate = new Date(efDate);
        param["rcvd_ed"] = efDate;
      } else {
        efDate = new Date(efDate);
        param["rcvd_ed"] = efDate;
      }
    }

    //SET BATCH DATA
    // header['rcvh_userid'] =  profile.mem_nip;
    header["rcvh_userid"] = userNIP;

    detail["rcvd_ed"] = param["rcvd_ed"];
    detail["rcvd_nobatch"] = param["rcvd_nobatch"];
    detail["rcvd_passIc"] = currProd["rcvd_passIc"];
    detail["rcvd_procode"] = realCurrProcod;
    detail["rcvd_proname"] = currProd["rcvd_proname"];
    detail["rcvd_quantitybonus"] = param["rcvd_quantitybonus"];
    detail["rcvd_quantitybonuspo"] = currProd["rcvd_quantitybonuspo"];
    detail["rcvd_quantitypo"] = currProd["rcvd_quantitypo"];
    detail["rcvd_quantityrecv"] = param["rcvd_quantityrecv"];
    detail["rcvd_quantitysellunitbonuspo"] =
      currProd["rcvd_quantitysellunitbonuspo"];
    detail["rcvd_quantitysellunitpo"] = currProd["rcvd_quantitysellunitpo"];
    detail["rcvd_sellpack"] = currProd["rcvd_sellpack"];
    detail["rcvd_sellunit"] = currProd["rcvd_sellunit"];
    // detail['rcvd_userid'] =  profile.mem_nip;
    detail["rcvd_userid"] = userNIP;

    detail["rcvd_quantitybonuspo"] = quantitybonuspo;
    detail["rcvd_quantitytotal"] = quantityTotal;

    var payload = {
      header: header,
      detail: detail,
    };
    // console.log('BODY ADD BATCH : ', payload);

    debounceMountSaveAddBatch("S", payload, realCurrProcod);
  };

  const deleteBatchReceiving = (dataHeader, dataCurrBatch) => {
    var header = {
      rcvh_ptid: parseInt(dataHeader.rcvh_ptid),
      rcvh_projectid: parseInt(dataHeader.rcvh_projectid),
      rcvh_outcoderecv: dataHeader.rcvh_outcoderecv,
      rcvh_group: parseInt(dataHeader.rcvh_group), // JANGAN LUPA UNCOMMENT
      //rcvh_group : dataHeader.rcvh_group,
      rcvh_norecv: dataHeader.rcvh_norecv,
    };

    var detail = {
      rcvdsum_ptid: parseInt(currProd.rcvdsum_ptid),
      rcvdsum_projectid: parseInt(currProd.rcvdsum_projectid),
      // rcvd_norecv : dataCurrBatch.rcvh_norecv,
      rcvd_norecv: dataCurrBatch.rcvd_norecv,
      rcvd_procode: dataCurrBatch.rcvd_procode,
      rcvd_nobatch: dataCurrBatch.rcvd_nobatch,
    };

    var reqBody = {
      header: header,
      detail: detail,
    };

    // console.log('payload delete', reqBody)

    debounceMountDeleteBatch(reqBody, realCurrProcod);
  };

  const modalConfirmation = (type, currBatch) => {
    if (type === "openModalConfirm") {
      setModalConfirmIsOpen(true);
      setCurrentBatch((currentBatch = currBatch));
    } else if (type === "closeModalConfirm") {
      setModalConfirmIsOpen(false);
    } else if (type === "deleteBatch") {
      deleteBatchReceiving(headerPO, currentBatch);
    } else if (type === "closeModalMessage") {
      setModalMessageIsOpen(false);
      setModalMessageBatch(false);
    }
  };

  function canBeSubmittedConfirm() {
    var countBatch = 0;
    for (let i = 0; i < listTampil.length; i++) {
      if (listTampil[i].batch !== null) {
        countBatch += listTampil[i].batch.length;
      }
    }

    var tanggalFaktur = tglFaktur;
    var tanggalSurat = tglDO;
    if (tanggalSurat === undefined && tanggalFaktur === undefined) {
      return;
    }

    if (listTampil === null || listTampil === undefined) {
      return;
    }

    if (
      headerPO !== undefined &&
      listTampil !== undefined &&
      listTampil !== null &&
      tglDO !== "" &&
      tglFaktur !== "" &&
      noDO !== "" &&
      noFaktur !== "" &&
      nipRecv &&
      tanggalFaktur !== "" &&
      tanggalSurat !== "" &&
      namaKaryawan !== "" &&
      tglDO !== "0001-01-01T00:00:00+07:07" &&
      tglFaktur !== "0001-01-01T00:00:00+07:07" &&
      validTglDO === true &&
      validTglFaktur === true &&
      countBatch !== 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  const confirmPO = () => {
    //BELUM DIPAKAI

    var payload = { ...headerPO };
    var profile = JSON.parse(window.sessionStorage.getItem("profile")); //Ini untuk data pengguna
    // payload['rcvh_userid'] = profile.mem_nip;
    payload["rcvh_userid"] = userNIP;

    payload["rcvh_group"] = parseInt(headerPO["rcvh_group"]);
    payload["rcvh_ed"] = new Date(payload["rcvh_ed"]);
    payload["rcvh_tglrecv"] = new Date(payload["rcvh_tglrecv"]);

    payload["rcvh_tglfaktur"] = new Date(tglFaktur);
    payload["rcvh_tgldo"] = new Date(tglDO);
    payload["rcvh_niprecv"] = nipRecv;
    payload["rcvh_nodo"] = noDO;
    payload["rcvh_nofaktur"] = noFaktur;
    payload["rcvh_empname"] = namaKaryawan;

    debounceMountConfirmPO("P", payload);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Link href={`/receiving/${group}`}>
            <IconButton aria-label="back">
              <ArrowBack />
            </IconButton>
          </Link>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            {group === "1" ? "Receiving Apotek" : "Receiving Floor"}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Paper
        elevation={1}
        sx={{ width: "100%", mb: 2, mt: 4 }}
        id="scanNoPO"
        style={{ display: "" }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            display="flex"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, mt: 0.5, ml: "5%", mr: "2%" }}
            >
              NO PO
            </Typography>
            <OutlinedInput
              size="small"
              // placeholder="Search..."
              sx={{ bgcolor: "white", mr: "2%" }}
              disabled={listTampil && listTampil.length > 0 ? true : false}
              value={headerPO && headerPO.rcvh_nopo}
              onChange={(e) => setNoPO((noPO = e.target.value))}
              // onKeyPress={(e) => myFunction(e)}
            />
            <Button
              color="info"
              variant="contained"
              disabled={noPO === "" || listTampil.length > 0 ? true : false}
              style={{ marginLeft: "1%", marginRight: "5%", display: "block" }}
              id="searchPOButton"
              onClick={() => getDetailPO()}
            >
              <SearchIcon />
            </Button>
          </Grid>
          {/* <Grid item xs={6}></Grid> */}
        </Grid>
      </Paper>

      <Paper
        id="receivingUpper"
        style={{ display: "none" }}
        elevation={1}
        sx={{ width: "100%", mb: 2 }}
      >
        <Grid container alignItems="center">
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              NO RECV
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
              &nbsp;
              {headerPO && headerPO.rcvh_norecv ? headerPO.rcvh_norecv : ""}
            </Item>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={1}
            lg={1}
            sx={!isMobile ? { mt: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              NO PO
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={5}
            sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Item>
              &nbsp;{headerPO && headerPO.rcvh_nopo ? headerPO.rcvh_nopo : ""}
            </Item>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          sx={!isMobile ? { mt: 2 } : { mt: 1 }}
        >
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              SUPPLIER
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={10} sx={{ pl: 2, pr: 2 }}>
            <Item>
              &nbsp;
              {headerPO &&
                showSupplier(headerPO.rcvh_nosup, headerPO.rcvh_suppliername)}
            </Item>
          </Grid>
        </Grid>
        <Grid container alignItems="center" sx={{ mt: 2 }}>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "SUPPLIER INVOICE" : "FAKTUR SUPPLIER"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ pl: 2, pr: 2 }}>
            <OutlinedInput
              fullWidth={isMobile && true}
              size="small"
              sx={{ bgcolor: "white", mr: "2%" }}
              value={noFaktur}
              onChange={(event) => updateFakturSupplier(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ pl: 2, pr: 2 }}></Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={1}
            lg={1}
            sx={isMobile && { pl: 2, pr: 2, mt: 1 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "INVOICE DATE" : "TANGGAL FAKTUR"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5} sx={{ pl: 2, pr: 2 }}>
            <OutlinedInput
              fullWidth
              type="date"
              size="small"
              sx={{ bgcolor: "white", mr: "2%" }}
              value={tglFaktur}
              onChange={(event) =>
                validateTgl(
                  event.target.value,
                  "rcvh_tglfaktur",
                  headerPO,
                  "header"
                )
              }
            />
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          sx={!isMobile ? { mt: 2 } : { mt: 1 }}
        >
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "DELIVERY NOTE" : "SURAT JALAN"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ pl: 2, pr: 2 }}>
            <OutlinedInput
              fullWidth={isMobile && true}
              size="small"
              sx={{ bgcolor: "white", mr: "2%" }}
              value={noDO}
              onChange={(e) => setNoDO(e.target.value)}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} sx={{ pl: 2, pr: 2 }}></Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={1}
            lg={1}
            sx={isMobile && { pl: 2, pr: 2, mt: 1 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "DELIVERY NOTE DATE" : "TGL SURAT"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5} sx={{ pl: 2, pr: 2 }}>
            <OutlinedInput
              fullWidth
              type="date"
              size="small"
              sx={{ bgcolor: "white", mr: "2%" }}
              value={tglDO}
              onChange={(event) =>
                validateTgl(
                  event.target.value,
                  "rcvh_tgldo",
                  headerPO,
                  "header"
                )
              }
            />
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={!isMobile ? { mb: 5, pl: 2, pr: 2 } : { pl: 2, pr: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "PHYSICAL CHECK(NIP)" : "CEK FISIK(NIP)"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={!isMobile ? { mb: 5, pl: 2, pr: 2 } : { mb: 1, pl: 2, pr: 2 }}
          >
            <OutlinedInput
              fullWidth={isMobile && true}
              size="small"
              sx={{ bgcolor: "white", mr: "2%" }}
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  getEnterForKaryawan(event.target.value);
                } else if (event.key === "Backspace") {
                  if (namaKaryawan !== "") setNamaKaryawan("");
                }
              }}
            />
            <Typography variant="caption" sx={{ color: "red" }}>
              {language === "EN"
                ? "*press enter to show the PIC Name"
                : "*tekan enter pada inputan NIP untuk menampilkan nama karyawan"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={1}
            lg={1}
            sx={!isMobile ? { mb: 5, pl: 2, pr: 2 } : { pl: 2, pr: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "PIC NAME" : "NAMA KARYAWAN"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7} sx={{ mb: 5, pl: 2, pr: 2 }}>
            <Item>
              &nbsp;
              {loadingKaryawan === true && namaKaryawan === ""
                ? "-"
                : namaKaryawan === "" && loadingKaryawan === false
                ? "Searching..."
                : namaKaryawan}
            </Item>
          </Grid>
        </Grid>
      </Paper>

      {show && (
        <Paper
          elevation={2}
          sx={{ width: "100%", mb: 2 }}
          // style={{ display: '' }}
        >
          <Grid container alignItems="center">
            <Grid
              item
              xs={12}
              sm={12}
              md={1}
              lg={1}
              sx={{ mt: 2, pl: 2, pr: 2 }}
            >
              <Typography
                variant="subtitle1"
                sx={
                  isDesktop ? { fontWeight: 600, pl: 1.5 } : { fontWeight: 600 }
                }
              >
                PROCOD
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={2}
              lg={2}
              sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { mt: 1, pl: 2, pr: 2 }}
            >
              <OutlinedInput
                fullWidth={(isMobile || isTablet) && true}
                size="small"
                sx={{ bgcolor: "white", mr: "2%" }}
                disabled={currProd && currProd.rcvd_proname !== undefined}
                id="procod"
                onKeyPress={(e) => scanProcod(e)}
                // autoComplete="off"
                onChange={(e) => setCurrProcod((currProcod = e.target.value))}
                defaultValue={currProcod}
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
                PRODUCT DESC
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={7}
              lg={7}
              sx={!isMobile ? { mt: 2, pl: 2, pr: 2 } : { pl: 2, pr: 2 }}
            >
              <TextField
                disabled
                variant="filled"
                size="small"
                label={
                  !isEmpty(currProd) && currProd.rcvd_proname
                    ? currProd.rcvd_proname
                    : null
                }
                margin={"dense"}
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid container alignItems="center" id="qtyPOBonus" sx={{ mb: 1 }}>
            <Grid item xs={4} sm={4} md={1} lg={1} sx={{ mt: 2, px: 2 }}>
              <Typography
                variant="subtitle1"
                sx={
                  isDesktop ? { fontWeight: 600, pl: 1.5 } : { fontWeight: 600 }
                }
              >
                OTY P.O:
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              sm={8}
              md={2}
              lg={2}
              sx={{ mt: 2, px: 2 }}
              display="flex"
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, textAlign: "left" }}
              >
                {!isEmpty(currProd) &&
                  currProd.rcvd_quantitypo +
                    " " +
                    currProd.rcvd_buypack +
                    " / "}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, textAlign: "left", color: "green" }}
              >
                &nbsp;
                {!isEmpty(currProd) &&
                  currProd.rcvd_quantitysellunitpo +
                    " " +
                    currProd.rcvd_sellpack}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sm={4}
              md={2}
              lg={2}
              sx={!isMobile ? { mt: 2 } : { mt: 2, px: 2 }}
            >
              <Typography
                variant="subtitle1"
                sx={
                  isDesktop
                    ? { fontWeight: 600, textAlign: "right" }
                    : { fontWeight: 600 }
                }
              >
                QTY P.O BONUS:
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              sm={8}
              md={6}
              lg={6}
              sx={{ mt: 2, pl: 2, pr: 2 }}
              display="flex"
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, textAlign: "left" }}
              >
                {!isEmpty(currProd) &&
                  currProd.rcvd_quantitybonuspo +
                    " " +
                    currProd.rcvd_buypack +
                    " / "}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, textAlign: "left", color: "green" }}
              >
                &nbsp;
                {!isEmpty(currProd) &&
                  currProd.rcvd_quantitysellunitbonuspo +
                    " " +
                    currProd.rcvd_sellpack}
              </Typography>
            </Grid>
          </Grid>

          <Grid container id="satuanSellpack" style={{ display: "none" }}>
            <Grid item xs={12} sm={12} md={6} lg={6} sx={{ pl: 3, pr: 2 }}>
              <Chip
                icon={<InfoIcon />}
                style={{ height: "100%" }}
                color="error"
                size="small"
                // label={language === 'EN' ? "PLEASE INPUT RECV QTY IN UNIT OF " + (!isEmpty(currProd) && currProd.rcvd_sellpack
                // ? currProd.rcvd_sellpack
                // : null) : "MOHON INPUT QTY RECV DALAM SATUAN " +
                // (!isEmpty(currProd) && currProd.rcvd_sellpack
                // ? currProd.rcvd_sellpack
                // : null)
                // }
                label={
                  <Typography style={{ whiteSpace: "normal" }}>
                    {language === "EN"
                      ? "PLEASE INPUT RECV QTY IN UNIT OF " +
                        (!isEmpty(currProd) && currProd.rcvd_sellpack
                          ? currProd.rcvd_sellpack
                          : null)
                      : "MOHON INPUT QTY RECV DALAM SATUAN " +
                        (!isEmpty(currProd) && currProd.rcvd_sellpack
                          ? currProd.rcvd_sellpack
                          : null)}
                  </Typography>
                }
              />
            </Grid>
          </Grid>

          <Divider sx={{ mt: 2 }} />
          <TableContainer sx={{ px: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      E.D
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      align="center"
                      variant="subtitle1"
                      sx={{ fontWeight: 600 }}
                    >
                      Batch
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Qty Recv
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Qty Recv Bonus
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
                {currentRecv.length !== 0 ? (
                  currentRecv.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {formatDate(item.rcvd_ed, "ddd MMMM DD YYYY")}
                      </TableCell>
                      <TableCell align="center">{item.rcvd_nobatch}</TableCell>
                      <TableCell align="center">
                        {item.rcvd_quantityrecv}
                      </TableCell>
                      <TableCell align="center">
                        {item.rcvd_quantitybonus}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() =>
                            modalConfirmation("openModalConfirm", item)
                          }
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
            disabled={isAdding}
            onClick={() => setModalAddBatch((modalAddBatch = true))}
          >
            {language === "EN" ? "ADD" : "TAMBAH"}
          </Button>
          <Button
            variant="contained"
            sx={{ my: 4, ml: 2, width: "250px" }}
            onClick={closeScan}
          >
            {language === "EN" ? "Finish Scan" : "Selesai Scan"}
          </Button>
        </Paper>
      )}
      <Paper
        elevation={2}
        sx={{ width: "100%", mb: 2 }}
        id="receivingBottom"
        style={{ display: "none" }}
      >
        <Button
          variant="contained"
          sx={{ mt: 2, ml: 2, mb: 1 }}
          disabled={isScan}
          onClick={scanTF}
        >
          Scan Item
        </Button>
        <Typography variant="body2" color={"red"} sx={{ ml: 2 }}>
          {language === "EN"
            ? "*If any product is not delivered, there is no need to scan the product. Let it be empty."
            : "*Jika product kosong, tidak perlu discan dan tidak perlu ditambahkan."}
        </Typography>
        <Typography variant="body2" color={"red"} sx={{ ml: 2 }}>
          {language === "EN"
            ? "*Empty receiving quantity will mean that there is no receiving into the system for the particular product"
            : "*Product akan otomatis tidak direceive (dihapus) apabila qty recv kosong."}
        </Typography>
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
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty PO
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty Bonus PO
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Buypack
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty Sell Unit PO
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty Sell Unit Bonus PO
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty Recv
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Qty Bonus
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Sell Pack
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ width: "250px" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Batch
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
                  <TableRow key={item.rcvd_procode}>
                    <TableCell>{item.rcvd_procode}</TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      {item.rcvd_proname === "" ? "-" : item.rcvd_proname}
                    </TableCell>
                    <TableCell align="center">{item.rcvd_quantitypo}</TableCell>
                    <TableCell align="center">
                      {item.rcvd_quantitybonuspo}
                    </TableCell>
                    <TableCell align="center">{item.rcvd_buypack}</TableCell>
                    <TableCell align="center">
                      {item.rcvd_quantitysellunitpo}
                    </TableCell>
                    <TableCell align="center">
                      {item.rcvd_quantitysellunitbonuspo}
                    </TableCell>
                    <TableCell align="center">
                      {item.rcvd_quantityrecv}
                    </TableCell>
                    <TableCell align="center">
                      {item.rcvd_quantitybonus}
                    </TableCell>
                    <TableCell align="center">{item.rcvd_sellpack}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        wordWrap: "break-word",
                        width: "250px",
                        maxWidth: "250px",
                      }}
                    >
                      {item.rcvd_nobatch}
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
        <Grid container justifyContent={"flex-end"}>
          {/* <Button
              size="large"
              variant="outlined"
              sx={{ my: 4, mr: 2, width: '150px'}}
              // onClick = {()=> setModalAddBatch((modalAddBatch = true))}
            >
              BACK
            </Button> */}
          <Button
            size="large"
            variant="contained"
            disabled={canBeSubmittedConfirm()}
            sx={{ my: 4, mr: 2, width: "150px" }}
            onClick={() => setModalSaveRecv(true)}
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
            {language === "EN" ? "Add New Batch" : "Tambah Batch"}
            <br />
            (Procod : {realCurrProcod} &nbsp; Proname : {currProd.rcvd_proname})
          </Typography>
        </DialogTitle>
        <Divider sx={{ mb: 0.5 }} />
        {showForm && (
          <DialogContent>
            <Grid container>
              <Grid container item xs={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pt: 1 }}
                >
                  E.D
                </Typography>
              </Grid>
              <Grid container item xs={8} justifyContent={"flex-end"}>
                <TextField
                  type="date"
                  variant="outlined"
                  size="small"
                  margin={"none"}
                  fullWidth
                  defaultValue={detailAddBatch.rcvd_ed}
                  onChange={(event) =>
                    validateAddBatch(
                      event.target.value,
                      "rcvd_ed",
                      detailAddBatch,
                      "validateTgl"
                    )
                  }
                  valid={validInputBatchED}
                  invalid={invalidInputBatchED}
                  error={invalidInputBatchED ? true : false}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid container item xs={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pt: 1 }}
                >
                  BATCH
                </Typography>
              </Grid>
              <Grid container item xs={8} justifyContent={"flex-end"}>
                <TextField
                  variant="outlined"
                  size="small"
                  margin={"none"}
                  fullWidth
                  defaultValue={detailAddBatch.rcvd_nobatch}
                  onChange={(event) =>
                    validateAddBatch(
                      event.target.value,
                      "rcvd_nobatch",
                      detailAddBatch,
                      "validateBatchNo"
                    )
                  }
                  valid={validInputBatchNo}
                  invalid={invalidInputBatchNo}
                  error={invalidInputBatchNo ? true : false}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid container item xs={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pt: 1 }}
                >
                  QTY RECV
                </Typography>
              </Grid>
              <Grid container item xs={8}>
                <TextField
                  variant="outlined"
                  size="small"
                  margin={"none"}
                  fullWidth
                  defaultValue={detailAddBatch.rcvd_quantityrecv}
                  onChange={(event) =>
                    validateAddBatch(
                      parseInt(event.target.value),
                      "rcvd_quantityrecv",
                      detailAddBatch,
                      "validateQty"
                    )
                  }
                  valid={validInputBatchQty}
                  invalid={invalidInputBatchQty}
                  error={invalidInputBatchQty ? true : false}
                />
                <Typography variant="body2" color={"red"}>
                  {"Please input QTY Recv in unit of " +
                    (!isEmpty(currProd) && currProd.rcvd_sellpack
                      ? currProd.rcvd_sellpack
                      : null) +
                    " (Max " +
                    currProd.rcvd_quantitysellunitpo +
                    " " +
                    currProd.rcvd_sellpack +
                    " Per PRODUCT)"}
                </Typography>
                <Typography variant="body2" color={"red"}>
                  {"Current QTY Recv = " +
                    totalCurrQty +
                    "; " +
                    "Remaining QTY Recv = " +
                    remainingQty}
                </Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid container item xs={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pt: 1 }}
                >
                  QTY RECV BONUS
                </Typography>
              </Grid>
              <Grid container item xs={8}>
                <TextField
                  variant="outlined"
                  size="small"
                  margin={"none"}
                  fullWidth
                  defaultValue={detailAddBatch.rcvd_quantitybonus}
                  onChange={(event) =>
                    validateAddBatch(
                      parseInt(event.target.value),
                      "rcvd_quantitybonus",
                      detailAddBatch,
                      "validateQtyBonus"
                    )
                  }
                  valid={validInputBatchBonus}
                  invalid={invalidInputBatchBonus}
                  error={invalidInputBatchBonus ? true : false}
                />
                <Typography variant="body2" color={"red"}>
                  {"Please input QTY Recv in unit of " +
                    (!isEmpty(currProd) && currProd.rcvd_sellpack
                      ? currProd.rcvd_sellpack
                      : null) +
                    " (Max " +
                    currProd.rcvd_quantitysellunitbonuspo +
                    " " +
                    currProd.rcvd_sellpack +
                    " Per PRODUCT)"}
                </Typography>
                <Typography variant="body2" color={"red"}>
                  {"Current QTY Recv = " +
                    totalCurrQtyBonus +
                    "; " +
                    "Remaining QTY Recv = " +
                    remainingQtyBonus}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        )}
        {!isLoading ? (
          <DialogActions>
            <Button
              variant="contained"
              size="medium"
              disabled={!isDisabled}
              onClick={() => saveAddBatch(detailAddBatch)}
              id="saveButton"
            >
              {language === "EN" ? "Save" : "Simpan"}
            </Button>
            <Button
              id="cancelButton"
              variant="outlined"
              size="medium"
              type="reset"
              onClick={() => setModalAddBatch((modalAddBatch = false))} //sini
            >
              {language === "EN" ? "Cancel" : "Batal"}
            </Button>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button
              // variant="outlined"
              size="medium"
              disabled
            >
              {language === "EN" ? "Processing..." : "Sedang Diproses..."}
            </Button>
          </DialogActions>
        )}
      </Dialog>
      {/* MODAL ADD */}

      {/* MODAL KONFIRMASI DELETE */}
      <Dialog
        open={modalConfirmIsOpen}
        onClose={() => setModalConfirmIsOpen(false)}
        fullWidth
        PaperProps={{ sx: { position: "fixed", top: 10 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {language === "EN"
            ? "Delete Batch Confirmation"
            : "Konfirmasi Hapus Batch"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {language === "EN"
              ? "Are you sure want to delete batch"
              : "Apakah anda yakin ingin menghapus batch"}{" "}
            ({currentBatch.rcvd_nobatch}) ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            color="success"
            disabled={loading}
            onClick={() => modalConfirmation("deleteBatch")}
          >
            {!loading && <span>{language === "EN" ? "Yes" : "Ya"}</span>}
            {loading && <SyncIcon />}
            {loading && (
              <span>
                {language === "EN" ? "Processing..." : "Sedang Diproses..."}
              </span>
            )}
          </Button>
          {!loading && (
            <Button
              variant="contained"
              size="medium"
              color="error"
              onClick={() => modalConfirmation("closeModalConfirm")}
            >
              {language === "EN" ? "No" : "Tidak"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* MODAL KONFIRMASI DELETE */}

      {/* MODAL KONFIRMASI PO  */}
      <Dialog
        open={modalSaveRecv}
        onClose={() => setModalSaveRecv(false)}
        fullWidth
        PaperProps={{ sx: { position: "fixed", top: 10 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {language === "EN"
            ? "Saving Data Confirmation"
            : "Konfirmasi Penyimpanan"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {language === "EN"
              ? "Are you sure to save this data ?"
              : "Apakah Anda yakin ingin menyimpan data ini?"}
          </Typography>
          <Typography variant="body2" color={"red"}>
            {language === "EN"
              ? "*Pay attention to the NIP, Invoice Date, and Delivery Note Date not to be empty and wrong"
              : "*Perhatikan kembali NIP, tanggal Faktur dan tanggal Surat jangan sampai kosong dan Salah!"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            color="success"
            disabled={loading}
            onClick={() => confirmPO()}
          >
            {!loading && <span>{language === "EN" ? "Yes" : "Ya"}</span>}
            {loading && <SyncIcon />}
            {loading && (
              <span>
                {language === "EN" ? "Processing..." : "Sedang Diproses..."}
              </span>
            )}
          </Button>
          {!loading && (
            <Button
              variant="contained"
              size="medium"
              color="error"
              onClick={() => setModalSaveRecv((modalSaveRecv = false))}
            >
              {language === "EN" ? "No" : "Tidak"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* MODAL KONFIRMASI PO  */}
    </Box>
  );
};

export default ReceivingNew;
