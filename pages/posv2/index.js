import { Block, Edit, PaddingOutlined } from "@mui/icons-material";
import {
  Box,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Typography,
  TableBody,
  IconButton,
  Button,
  Paper,
  Divider,
  Select,
  Stack,
  Modal,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  Collapse,
  CircularProgress,
  TableContainer,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "../../utils/link";
import { Add, Search, Book, RemoveRedEye } from "@mui/icons-material";
import { useRouter } from "next/router";
import { debounce,isUndefined } from "lodash";
import ModalWrapper from "../../components/ModalWrapper";
import ModalInputWrapper from "../../components/ModalInputWrapper";
import api from "../../services/pos";
import { formatDate } from "../../utils/text";
import { getStorage } from "../../utils/storage";
import dayjs from "dayjs";
import "dayjs/locale/id";

const Posv2 = () => {
  const router = useRouter();
  const [locale, setLocale] = useState("EN");
  const scanInputRef = useRef(null);
  const PTID = JSON.parse(getStorage("pt")).pt_id;
  const gudangID = JSON.parse(getStorage("outlet")).out_code;
  const language = getStorage("language");
  const [selectedCategory, setSelectedCategory] = useState("b");
  const [resultHistoryHeader, setResultHistoryHeader] = useState([]);
  const [resultHistoryDetail, setResultHistoryDetail] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [validationError, setValidationError] = useState(false);
  const [today, setDate] = useState(new Date());
  const [ccNumber, setCcNumber] = useState("");
  const [strookNumber, setStrookNumber] = useState("");
  const [dateTrandHistory, setDateTrandHistory] = useState("");
  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const [newTransaction, setNewTransaction] = useState([]);
  const [newTempTransaction, setNewTempTransaction] = useState([]);
  const [total, setTotal] = useState(0);
  const [grandTotalTransaction, setGrandTotalTransaction] = useState(0);
  const [kembalian, setKembalian] = useState(0);
  const [cashValue, setCashValue] = useState(0);
  const [btnInsertTransaction, setBtnInsertTransaction] = useState(true);
  const [resultBatchHeader, setResultBatchHeader] = useState({});
  const [resultBatch, setResultBatch] = useState([]);
  const [paymentType, setPaymentType] = useState("Choose");
  // const [paymentTypeName, setPaymentTypeName] = useState(''); //eslint-disable-line
  const [paymentTypeHost, setPaymentTypeHost] = useState("");
  const [pembulatan, setPembulatan] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [responseHeader, setResponseHeader] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [numberQty, setNumberQty] = useState([]);

  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const [ScanNameTagModal, setScanNamtagModalIsOpen] = useState(false);
  const [MembershipModalIsOpen, setMembershipModalIsOpen] = useState(false);
  const [modalUploadFilesIsOpen, setModalUploadFilesIsOpen] = useState(false);
  const [modalTransfer, setModalTransfer] = useState(false);
  const [modalSave, setModalSave] = useState(false);
  const [modalBatch, setModalBatch] = useState(false);
  const [showCreditMethod, setShowCreditMethod] = useState(true);

  const [showVoucherMethod, setShowVoucherMethod] = useState(true);

  const [disableSearch, setDisableSearch] = useState(true);
  const [disabledSelectedCategory, setDisabledSelectedCategory] =
    useState(true);
  const [disableResep, setDisableResep] = useState(true);
  const [seeResep, setSeeResep] = useState(false);
  const [disableAdd, setDisableAdd] = useState(false);

  const [match, setMatch] = useState(false);

  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState();

  // barcodeasd
  const [scanned, setScanned] = useState(false);
  const [scannedNameTag, setScannedNameTag] = useState(false);
  const [noMember, setNoMember] = useState("");
  const [nipUser, setNipUser] = useState("");
  const [timer, setTimer] = useState(null);

  const [hideNOMember, setHideNOMember] = useState(true);
  const [tipeMember, setTipeMember] = useState("NonMember");
  const [hideNOMemberModal, setHideNOMemberModal] = useState(false);
  const [konfirmasiMember, setkonfirmasiMember] = useState(true);
  const [namaMember, setNamaMember] = useState("");
  const [runningID, setRunningID] = useState("");

  const [inputSearch, setInputSearch] = useState("");
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_POSV2")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  dayjs.locale(language);

  useEffect(() => {
    setLocale(language);
  }, [language]);

  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, {
    month: "long",
  })}\n\n`;
  // const hour = today.getHours();
  // const wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}, `;
  const time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
    second: "numeric",
  });
  const userID = JSON.parse(window.sessionStorage.getItem("profile"))
    ? JSON.parse(window.sessionStorage.getItem("profile")).mem_nip
    : "";
  // set input cc number

  const formatAndSetCcNumber = (e) => {
    const inputVal = e.target.value.replace(/ /g, "");
    let inputNumbersOnly = inputVal.replace(/\D/g, "");

    if (inputNumbersOnly.length > 16) {
      inputNumbersOnly = inputNumbersOnly.substr(0, 16);
    }

    const splits = inputNumbersOnly.match(/.{1,4}/g);

    let spacedNumber = "";
    if (splits) {
      spacedNumber = splits.join(" ");
    }
    setCcNumber(spacedNumber);
  };

  const searchby = [
    {
      label: "Barcode",
      value: "b",
    },
    {
      label: "Procode",
      value: "p",
    },
    {
      label: language === "ID" ? "Riwayat" : "History",
      value: "h",
    },
  ];
  const tableHeader = [
    { name: "Procode" },
    { name: "ProName" },
    { name: "Batch" },
    { name: "Qty" },
    { name: "Unit" },
    { name: "Price" },
    { name: "Disc Member" },
    { name: "Disc Value" },
    { name: "Disc Supl" },
    { name: "Disc Supl Value" },
    { name: "Sub Total" },
  ];
  const fieldsbatch = [
    { name: "Batch" },
    { name: "Expired" },
    { name: "Stock" },
    { name: "Qty" },
    { name: "Action" },
  ];

  // const toggleTransfer = () => {
  //   // setPaymentType('0')
  //   getPaymentType();
  //   // setModalTransfer(!modalTransfer);
  // };

  useEffect(() => {
    if (namaMember === "" || namaMember === "-") {
      setScanned(false);
      setNoMember("");
    } else {
      setScanned(true);
    }
  }, [strookNumber]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [locale]);

  useEffect(() => {
    if (resultHistoryHeader.length === 0) {
      setDisableAdd(true);
    } else {
      setDisableAdd(false);
    }
    // eslint-disable-next-line
  }, [resultHistoryHeader]);

  const toggleScanNameTag = () => {
    generateRunningID();
    setScanNamtagModalIsOpen(!ScanNameTagModal);
    setkonfirmasiMember(true);
    setScannedNameTag(false);
    setNipUser("");
    setHideNOMemberModal(false);
  };
  const closedtoggleScanNameTag = () => {
    setScanNamtagModalIsOpen(!ScanNameTagModal);
    setkonfirmasiMember(true);
    setScannedNameTag(false);
    setNipUser("");
    setHideNOMemberModal(false);
  };

  // toggle modal membership
  const toggleMembershipModal = () => {
    setMembershipModalIsOpen(!MembershipModalIsOpen);
    if (namaMember === "" || namaMember === "-") {
      setScanned(false);
      setNoMember("");
    } else {
      setScanned(true);
    }
  };

  const toggleCloseMembershipModal = () => {
    setMembershipModalIsOpen(false);
    setkonfirmasiMember(true);
    setHideNOMemberModal(false);
    setDisableAdd(false);
  };

  function toggleNotMembershipModal() {
    buttonDisabler();
    setMembershipModalIsOpen(false);
    setHideNOMemberModal(true);
    setTipeMember("NonMember");
    setHideNOMember(true);
    setHideNOMemberModal(false);
    setkonfirmasiMember(true);
    setResultHistoryHeader([]);
    setResultHistory([]);
    setResultHistoryDetail([]);
    setStrookNumber("");
  }

  function toggleOpenMembershipModalTESTING() {
    setTimeout(() => {}, 50);
    setNoMember("");
    setScanned(false);
    setHideNOMemberModal(true);
    setkonfirmasiMember(false);
  }

  function toggleOKMembershipModal() {
    getMemberDetail();
  }
  function getMemberDetail() {
    setHideNOMember(false);
    setDisableAdd(true);

    toggleCloseMembershipModal();
  }
  function resetAll() {
    window.location.reload();
    setDisableSearch(true);
    setDisabledSelectedCategory(true);
    setInputSearch("");
    debounceMountPOS();
    setDisableResep(true);
    setNewTransaction([]);
    setNumberQty([]);
    setCashValue(0);
    setKembalian(0);
    setStrookNumber("");
    setPaymentType("Choose");
    setNipUser("");
    setNoMember("");
    setNamaMember("");
  }
  function onChangePaymentOption(event) {
    var nama = paymentOption.find(function (element) {
      return element.pay_code === event.target.value;
    });
    setPaymentType(event.target.value);
    setPaymentTypeHost(nama.host_kdkartu);

    var tempsString = String(total);
    var temps = total;
    var tempTotal = tempsString.slice(-2);
    setPembulatan(Number(tempTotal));
    // console.log("tempTotal", tempTotal);

    if (event.target.value === "0") {
      if (tempTotal !== "00") {
        tempTotal = Math.floor(temps / 100) * 100;
        setTotal(Number(tempTotal));
      } else {
        setTotal(Number(total));
      }
    } else {
      var temp = 0;
      newTransaction.forEach((transaction) => {
        temp +=
          transaction.sale_sellqty * transaction.sale_saleprice -
          (transaction.sale_sellqty *
            transaction.sale_disccenpct *
            transaction.sale_saleprice) /
            100 -
          (transaction.sale_sellqty *
            transaction.sale_discmbrsup *
            transaction.sale_saleprice) /
            100;
      });
      setTotal(Number(temp));
      setPembulatan(Number(0));
    }
  }
  const changeHandler = (event) => {
    setSelectedFile(URL.createObjectURL(event.target.files[0]));
    setIsSelected(true);
  };
  useEffect(() => {
    setShowCreditMethod(false);
    if (paymentType === "0") {
      setShowCreditMethod(true);
      setShowVoucherMethod(true);
    } else {
      setShowCreditMethod(false);
      setShowVoucherMethod(true);
    }
  }, [paymentType]);

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("File", selectedFile);

    fetch("https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {})
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //todo
  const [paymentOption, setPaymentOption] = useState([]);

  const toggleResponseModal = () => {
    setResponseModalIsOpen(true);
  };
  function toggleCloseSaveModal() {
    setResponseModalIsOpen(false);
  }
  // modal upload
  const toggleModalUpload = () => {
    setModalUploadFilesIsOpen(true);
  };
  function toggleModalUploadClose() {
    setModalUploadFilesIsOpen(false);
  }

  const toggleTransfer = (type) => {
    getPaymentType();
  };

  const toggleTransferClosed = () => {
    setModalTransfer(false);
  };

  const toggleBatch = (item, index) => {
    setModalBatch(!modalBatch);
  };

  const toggleBatchClosed = () => {
    setModalBatch(false);
    setResultBatch([]);
    setResultBatchHeader([]);
  };

  const toggleModalSave = () => {
    setModalSave(true);
  };
  const toggleModalSaveClosed = () => {
    setModalSave(false);
  };

  function keyPresshandleChangeQty(item, index, e) {
    switch (e.key) {
      case "Enter":
        doneChangeQty(item, index);
        break;
      default:
    }
  }
  function onChangeNameTag(event) {
    setNipUser(event.target.value);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        setScannedNameTag(true);
        setNipUser(event.target.value);
      }, 10)
    );
  }

  useEffect(() => {
    setNipUser(nipUser);
    if (nipUser !== "" && scannedNameTag === true) {
      if (nipUser.length < 5) {
      } else {
        setScanNamtagModalIsOpen(false);
        toggleMembershipModal();
      }
    }
    // eslint-disable-next-line
  }, [nipUser, scannedNameTag]);

  useEffect(() => {
    setNoMember(noMember);
    if (noMember !== "" && scanned === true) {
      if (noMember.length < 2) {
        setTipeMember("NonMember");
        setNamaMember("-");
        setDisableSearch(false);
        setDisabledSelectedCategory(false);
        setDisableResep(false);
        setIsLoading(false);
      } else {
        getMemberTesting();
      }
    }
  }, [noMember, scanned]);
  function getMemberTesting() {
    setTipeMember("Member");
    setHideNOMember(false);
    setNamaMember(noMember);
    setDisableSearch(false);
    setDisabledSelectedCategory(false);
    setDisableResep(false);
    setIsLoading(false);
  }

  useEffect(() => {}, [ScanNameTagModal]);

  function onChangeBarcode(event) {
    setNoMember(event.target.value);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        setScanned(true);
        setNoMember(event.target.value);
        setResultHistoryHeader([]);
        setResultHistory([]);

        setResultHistoryDetail([]);
        setStrookNumber("");
        setMembershipModalIsOpen(!MembershipModalIsOpen);
      }, 10)
    );
  }

  function handleChangeQty(item, index, evt) {
    var tempArr = [];
    if (numberQty.length !== 0) {
      tempArr = [...numberQty];
      tempArr.splice(index, 1, Number(evt.target.value));
    } else {
      tempArr = new Array(resultBatch.length).fill(0, 0, resultBatch.length);
      tempArr.splice(index, 1, Number(evt.target.value));
    }
    setNumberQty(tempArr);
  }

  function doneChangeQty(item, index) {
    console.log("itemmmmmsa", item);
    setResultHistory([]);
    item.sale_proname =
      resultBatchHeader === null ? "-" : resultBatchHeader.pro_name;
    item.sale_activeyn = "Y";
    item.sale_racik = 0;
    item.sale_medqty = 0;
    item.sale_medqtybns = 0;
    item.sale_saleprice = 0;
    item.sale_sellqtybns = 0;
    item.sale_trannum = "";
    item.sale_recipenum = "0";
    item.sale_medprice = 0;
    item.sale_medpack = "";
    item.sale_vatvalue = 0;
    item.sale_counteryn = "";
    item.sale_procod = resultBatchHeader.pro_code;
    item.sale_batch = item.batch;
    item.sale_expdate = dayjs(item.expired_date).format("YYYY-MM-DD");
    item.sale_sellqty =
      newTempTransaction[index] &&
      newTempTransaction[index].sale_Batch === item.batch
        ? newTempTransaction[index].sale_sellqty
        : numberQty[index];
    item.sale_saleprice = resultBatchHeader.pro_saleprice;

    item.sale_sellpack = resultBatchHeader.pro_sellpackname;

    item.sale_disccen = 0;
    item.sale_discsup = 0;

    item.sale_discmbrcen =
      tipeMember === "NonMember"
        ? 0
        : (item.sale_sellqty * 2 * item.sale_saleprice) / 100;
    item.sale_discmbrsup = 0;

    item.sale_vouchsupp = 0;

    item.sale_discsuppct = 0;
    item.sale_disccenpct = tipeMember === "NonMember" ? 0 : 2;

    item.sale_reasonid_refund = 0;

    item.sale_vat = resultBatchHeader.pro_vat;
    item.sale_CanRefundYN = "N";
    item.sale_amount =
      item.sale_sellqty * item.sale_saleprice -
      (item.sale_sellqty * item.sale_disccenpct * item.sale_saleprice) / 100 -
      (item.sale_sellqty * item.sale_discmbrsup * item.sale_saleprice) / 100;

    var tempNewTempTransaction = [...newTempTransaction];
    tempNewTempTransaction.splice(index, 1, item);
    setNewTempTransaction(tempNewTempTransaction);

    if (newTransaction.length !== 0) {
      var found = newTransaction.find(
        (transaction) =>
          transaction.sale_batch === item.sale_batch &&
          transaction.sale_procod === item.sale_procod
      );
      newTransaction.forEach((element) => {
        if (element.sale_procod === item.sale_procod) {
          if (element.sale_batch === item.sale_batch) {
            item.sale_amount =
              (item.sale_sellqty + numberQty[index]) * item.sale_saleprice -
              ((item.sale_sellqty + numberQty[index]) *
                item.sale_disccenpct *
                item.sale_saleprice) /
                100 -
              ((item.sale_sellqty + numberQty[index]) *
                item.sale_discmbrsup *
                item.sale_saleprice) /
                100;
            index = 0;
            resultBatch.forEach((batch, i) => {
              if (batch.batch === element.sale_batch) {
                index = i;
              }
            });
            element.sale_sellqty += numberQty[index];
          }
        }

        if (found === undefined) {
          setNewTransaction([...newTransaction, item]);
          var temp = 0;
          newTransaction.forEach((transaction) => {
            temp +=
              transaction.sale_sellqty * transaction.sale_saleprice -
              (transaction.sale_sellqty *
                transaction.sale_disccenpct *
                transaction.sale_saleprice) /
                100 -
              (transaction.sale_sellqty *
                transaction.sale_discmbrsup *
                transaction.sale_saleprice) /
                100;
          });
          temp +=
            item.sale_sellqty * item.sale_saleprice -
            (item.sale_sellqty * item.sale_disccenpct * item.sale_saleprice) /
              100 -
            (item.sale_sellqty * item.sale_discmbrsup * item.sale_saleprice) /
              100;
          setTotal(temp);
        }
      });
    } else {
      setNewTransaction([...newTransaction, item]);
    }

    if (newTransaction.length !== 0) {
      if (found) {
        var temp = 0;
        newTransaction.forEach((transaction) => {
          transaction.sale_amount =
            transaction.sale_sellqty * transaction.sale_saleprice -
            (transaction.sale_sellqty *
              transaction.sale_disccenpct *
              transaction.sale_saleprice) /
              100 -
            (transaction.sale_sellqty *
              transaction.sale_discmbrsup *
              transaction.sale_saleprice) /
              100;

          temp +=
            transaction.sale_sellqty * transaction.sale_saleprice -
            (transaction.sale_sellqty *
              transaction.sale_disccenpct *
              transaction.sale_saleprice) /
              100 -
            (transaction.sale_sellqty *
              transaction.sale_discmbrsup *
              transaction.sale_saleprice) /
              100;
        });
        setTotal(temp);
      }
    } else {
      setTotal(
        item.sale_sellqty * item.sale_saleprice -
          (item.sale_sellqty * item.sale_disccenpct * item.sale_saleprice) /
            100 -
          (item.sale_sellqty * item.sale_discmbrsup * item.sale_saleprice) / 100
      );
    }

    var tempArr = [...numberQty];
    tempArr.splice(index, 1, 0);
    setNumberQty(tempArr);
  }

  useEffect(() => {
    if (newTransaction.length !== 0) {
      let calculate = total;
      setGrandTotalTransaction(calculate);
    }
  }, [total, newTransaction]);

  useEffect(() => {
    if (cashValue !== 0) {
      let calculateChange = cashValue - grandTotalTransaction;
      setKembalian(calculateChange);
      if (kembalian >= 0) {
        setBtnInsertTransaction(false);
      } else {
        setBtnInsertTransaction(true);
      }
    } else {
      setKembalian(0);
    }
  }, [grandTotalTransaction, cashValue, kembalian]);

  async function insertTransaction() {
    setBtnInsertTransaction(true);
    setIsLoading(true);

    var payload = {
      sale_runningid: runningID,
      sale_ptid: parseInt(PTID),
      sale_outcode: gudangID,
      sale_projectid: 0,
      sale_mbrcard: noMember,
      sale_trantotal: grandTotalTransaction,
      sale_tranpayment: cashValue,
      sale_tranchange: kembalian,
      sale_totdisccen: 0,
      sale_totdiscsup: 0,
      sale_totdiscmbrcen: 0,
      sale_totdiscbbrsup: 0,
      sale_trancashout: 0,
      sale_totvouchcen: 0,
      sale_totvouchsup: 0,
      sale_salesperson: nipUser,
      sale_rounding: pembulatan,
      sale_deliverynumber: "",
      sale_deliverydate: "",
      sale_orderidecommerce: "",
      sale_prevrounding: pembulatan,
      sale_paymentmethod: parseInt(paymentType),
      sale_cardnumber: ccNumber,
      sale_hostkdkartu: parseInt(paymentTypeHost),
      sale_recipenum: "",
      sale_urlprescription: "",
      sale_extradisc: 0,
      sale_outletb2b: "",

      faktur: {
        fak_sellername: "",
        fak_addressseller: "",
        fak_npwpseller: "",
        fak_buyername: "",
        fak_addressbuyer: "",
        fak_npwpbuyer: "",
      },
      refund: {
        sale_refundyn: "",
        sale_oldtrannum: "",
        sale_nosuratjalan: "",
      },
      detail: newTransaction,
    };
    console.log("payload", payload);
    try {
      const insert = await api.insertTransaction(payload);
      console.log("insert", insert);
      console.log("insert status", insert.status);
      if (insert.status === 200) {
        setIsLoading(false);
        setResponseHeader("SUCCESS!");

        setNewTransaction([]);
        setNumberQty([]);
        setResponseModalIsOpen(true);
        // resetAll();
        toggleModalSaveClosed();
      } else {
        setIsLoading(false);
        setResponseHeader("FAILED!");
        setResponseModalIsOpen(true);
        toggleModalSaveClosed();
      }
    } catch (error) {
      alert(error);
      setIsLoading(false);
      toggleModalSaveClosed();
    }
  }

  async function printHistoryStruk() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      trannum: strookNumber,
    };
    setIsLoading(true);
    try {
      const printStrook = await api.printHistoryStruk(
        PTID,
        gudangID,
        strookNumber
      );

      const url = printStrook.config.baseURL + printStrook.config.url;
      fetch(url).then((response) => {
        if (response.status === 200) {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = strookNumber + ".pdf";
            a.click();
            setIsLoading(false);
            const pdfWindow = window.open();
            pdfWindow.location.href = a;
          });
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (inputSearch.length === 7) {
      setMatch(true);
    } else if (inputSearch.length === 12) {
      setMatch(true);
      setDisableResep(true);
    } else if (inputSearch.length === 15) {
      setMatch(true);
    } else {
      setMatch(false);
    }
  }, [inputSearch]);

  function keydownjumlah(e) {
    switch (e.key) {
      case "Enter":
        toggleTransferClosed();
        break;
      default:
    }
  }

  function deleteNewTrans(index) {
    var tempDeletedItem =
      index.sale_sellqty * index.sale_saleprice -
      (index.sale_sellqty * index.sale_disccenpct * index.sale_saleprice) /
        100 -
      (index.sale_sellqty * index.sale_discmbrsup * index.sale_saleprice) / 100;
    var tempGrandTotal = grandTotalTransaction - tempDeletedItem;
    setTotal(tempGrandTotal);
    setGrandTotalTransaction(tempGrandTotal);
    var tempArr = [...newTransaction];
    var target = index;
    var tempsArr = tempArr.filter((item) => item !== target);
    setNewTransaction(tempsArr);
    if (newTransaction.length === 1) {
      setPembulatan(0);
      setGrandTotalTransaction(0);
      setKembalian(0);
      setCashValue(0);
      setBtnInsertTransaction(true);
      setTotal(0);
    }
  }

  function buttonDisabler(e) {
    setDisableSearch(false);
    setDisabledSelectedCategory(false);
    setDisableResep(false);
  }

  function keyPressHandle(e) {
    switch (e.key) {
      case "Enter":
        setResponseModalIsOpen(false);
        break;
      default:
    }
  }

  useEffect(() => {
    if (selectedCategory === "b") {
      setInputSearch("");
      setDisableResep(true);
      setSeeResep(false);
    } else if (selectedCategory === "p") {
      setInputSearch("");
      setDisableResep(true);
      setSeeResep(false);
    } else if (selectedCategory === "h") {
      setInputSearch("");
      setSeeResep(true);
    }
  }, [selectedCategory]);

  useEffect(() => {
    // if (userID === "") {
    //   history.push("/login");
    // } else {
    debounceMountPOS(PTID, gudangID);
    // }
  }, []);

  const debounceMountPOS = useCallback(
    debounce(mountGetHistoryTransactions, 400)
  );

  async function mountGetHistoryTransactions() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
    };
    setIsLoading(true);

    try {
      const getHistory = await api.getHistoryTransactions(newParams);
      const { data } = getHistory.data;
      console.log("data", data);
      // setResultHistory([data]);
      setResultHistoryHeader(data.header);
      setResultHistoryDetail(data.detail);
      // setResultHistory(data);
      setStrookNumber(data.header.sale_trannum);
      setDateTrandHistory(data.header.sale_trandate);
      if (data.header.sale_mbrcard !== "") {
        setTipeMember("Member");
        setNamaMember(data.header.sale_mbrName);
        setHideNOMember(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setStrookNumber("-");
      setResponseHeader("HISTORY NOT FOUND !!!");
      setResponseBody("");
      setResponseModalIsOpen(true);
      setResultHistoryHeader([]);
      setResultHistory([]);
      setResultHistoryDetail([]);
      setIsLoading(false);
    }
  }

  const debounceMountGetProductByProcode = useCallback(
    debounce(getProductByProcode, 400)
  );
  async function getProductByProcode() {
    const newParams = {
      outcode: gudangID,
      procode: inputSearch,
    };
    setIsLoading(true);
    try {
      const getProductByProcode = await api.getProductByProcode(newParams);
      const { data } = getProductByProcode.data;
      console.log("data", getProductByProcode);
      if (data !== null && data !== undefined) {
        if (data.stock !== null) {
          setIsLoading(false);
          setResultBatch(data.stock);
          numberQty.fill(0, 0, data.stock.length);
          newTempTransaction.fill(0, 0, data.stock.length);
          setResultBatchHeader(data);
          toggleBatch();
          // toggleMembershipModal()
        } else if (data.stock === null) {
          setIsLoading(false);
          setResultBatchHeader(data);
          toggleBatch();
        } else {
          setIsLoading(false);
          setResultBatch([]);
          setResponseHeader("NOT FOUND !!!");
          setResponseModalIsOpen(true);
        }
      } else {
        setResponseHeader(language === "ID" ? "GAGAL" : "FAILED");
        setResponseBody(language === "ID" ? "Tidak Ditemukan" : "Not Found");
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setResponseModalIsOpen(true);
      setResponseHeader("FAILED TO LOAD DATA");
      setResponseBody(error.message);
    }
  }

  const debounceMountGetProductByBarcode = useCallback(
    debounce(getProductByBarcode, 400)
  );

  async function getProductByBarcode() {
    const newParams = {
      outcode: gudangID,
      barcode: inputSearch,
    };
    setIsLoading(true);
    try {
      const getProductByBarcode = await api.getProductByBarcode(newParams);
      const { data } = getProductByBarcode.data;
      if (data !== null) {
        if (data.stock !== null) {
          setResultBatch(data.stock);
          numberQty.fill(0, 0, data.stock.length);
          newTempTransaction.fill(0, 0, data.stock.length);
          setResultBatchHeader(data);
          toggleBatch();
          // toggleMembershipModal()
          setIsLoading(false);
        } else if (data.stock === null) {
          setResultBatchHeader(data);
          toggleBatch();
          setIsLoading(false);
        } else {
          setResultBatch([]);
          setResponseHeader("DATA STOCK NOT FOUND !!!");
          setResponseModalIsOpen(true);
          setIsLoading(false);
        }
      } else {
        setResponseHeader("FAILED TO LOAD DATA");
        setResponseBody("NO DATA");
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
      if (getProductByBarcode.data.error.code === 500) {
        setResponseHeader("FAILED TO LOAD DATA");
        setResponseBody("Response Error 500");
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setResponseHeader("FAILED TO LOAD DATA");
      setResponseBody(error.message);
      setResponseModalIsOpen(true);
    }
  }

  async function findHistoryTransactions() {
    setIsLoading(true);
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      notranno: inputSearch,
    };
    try {
      const findHistory = await api.findHistoryTransactions(newParams);
      const { data } = findHistory.data;
      console.log("findhistorydata", data);
      if (data !== null) {
        if (data) {
          // setResultHistory(data);
          setResultHistoryHeader({
            sale_runningid: data[0].sale_runningid,
            sale_trannum: data[0].sale_trannum,
            sale_ptid: data[0].sale_ptid,
            sale_outcode: data[0].sale_outcode,
            sale_projectid: data[0].sale_projectid,
            sale_trandate: data[0].sale_trandate,
            sale_trantime: data[0].sale_trantime,
            sale_mbrcard: data[0].sale_mbrcard,
            sale_trantotal: data[0].sale_trantotal,
            sale_tranpayment: data[0].sale_tranpayment,
            sale_tranchange: data[0].sale_tranchange,
            sale_totdisccen: data[0].sale_totdisccen,
            sale_totdiscsup: data[0].sale_totdiscsup,
            sale_totdiscmbrcen: data[0].sale_totdiscmbrcen,
            sale_totdiscmbrsup: data[0].sale_totdiscmbrsup,
            sale_trancashout: data[0].sale_trancashout,
            sale_totvouchcen: data[0].sale_totvouchcen,
            sale_totvouchsup: data[0].sale_totvouchsup,
            sale_print: data[0].sale_print,
            sale_salesperson: data[0].sale_salesperson,
            sale_lastupdate: data[0].sale_lastupdate,
            sale_activeyn: data[0].sale_activeyn,
            sale_rounding: data[0].sale_rounding,
            sale_deliverynumber: data[0].sale_deliverynumber,
            sale_orderidecommerce: data[0].sale_orderidecommerce,
            sale_refundyn: data[0].sale_refundyn,
            sale_prevrounding: data[0].sale_prevrounding,
            sale_paymentmethod: data[0].sale_paymentmethod,
            sale_cardnumber: data[0].sale_cardnumber,
            sale_hostkdkartu: data[0].sale_hostkdkartu,
            sale_recipenum: data[0].sale_recipenum,
            sale_urlprescription: data[0].sale_urlprescription,
            sale_extradisc: data[0].sale_extradisc,
            sale_fakturpajak: data[0].sale_fakturpajak,
          });
          setResultHistoryDetail(data);
          setStrookNumber(data[0].sale_trannum);
          setDateTrandHistory(data[0].sale_trandate);
          if (data[0].sale_mbrcard !== "") {
            setTipeMember("Member");
            setNamaMember(data[0].sale_mbrname);
            setHideNOMember(false);
          }
          setIsLoading(false);
        } else {
          setStrookNumber("-");
          setResponseHeader("HISTORY NOT FOUND !!!");
          setResponseBody("");
          setResponseModalIsOpen(true);
          setResultHistoryHeader([]);
          setResultHistory([]);
          setResultHistoryDetail([]);
          setIsLoading(false);
        }
      } else {
        setResponseHeader("HISTORY NOT FOUND !!!");
        setResponseBody("");
        setResponseModalIsOpen(true);
        setResultHistoryHeader([]);
        setResultHistory([]);
        setResultHistoryDetail([]);
        setIsLoading(false);
      }
    } catch (error) {
      alert(error.message);
      setIsLoading(false);
    }
  }

  async function getPaymentType() {
    const newParams = {
      outcode: gudangID,
    };
    setIsLoading(true);
    try {
      const getPaymentType = await api.getPaymentType(newParams);
      console.log("getPaymentType", getPaymentType);
      if (getPaymentType.data.data !== null) {
        setPaymentOption(getPaymentType.data.data);
        setIsLoading(false);
        setModalTransfer(!modalTransfer);
      } else {
        setResponseHeader(getPaymentType.data.error.msg);
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setResponseModalIsOpen(true);
      setResponseHeader("FAILED TO GET DATA !!!");
      setResponseBody(error.message);
    }
  }

  function apiChecker(e) {
    switch (e.key) {
      case "Enter":
        if (selectedCategory === "b") {
          debounceMountGetProductByBarcode();
        } else if (selectedCategory === "p") {
          debounceMountGetProductByProcode();
        } else if (selectedCategory === "h") {
          findHistoryTransactions();
        }
        break;
      default:
    }
    if (e.button === 0) {
      if (selectedCategory === "b") {
        debounceMountGetProductByBarcode();
      } else if (selectedCategory === "p") {
        debounceMountGetProductByProcode();
      } else if (selectedCategory === "h") {
        findHistoryTransactions();
      }
    }
  }
  function generateRunningID() {
    var dates = formatDate(today, "YYYYMMDDhhmmsssss");

    setRunningID(gudangID + dates);
  }
  function handleMouseDownSearch(e) {
    // if (e.buttons == 1) {
    if (inputSearch === "" || inputSearch === " ") {
      setValidationError(true);
    } else {
      setValidationError(false);
    }
    // }
  }

  useEffect(() => {
    if (inputSearch === "" || inputSearch === " ") {
      setValidationError(true);
    } else {
      setValidationError(false);
    }
  }, [inputSearch]);

  function handleBlurSearch() {
    setValidationError(false);
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height: "auto",
    bgcolor: "background.paper",
    p: 4,
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid
        container
        justifyContent={"space-between"}
        sx={{ marginBottom: "1%" }}
      >
        <Grid container item xs={10}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mt: 0.5 }}
            fontSize={{
              lg: 30,
              md: 25,
              sm: 15,
              xs: 15,
            }}
          >
            POS
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: "1%" }}>
        <Grid item flex={2}>
          <FormControl fullWidth sx={{ backgroundColor: "white" }}>
            <InputLabel id="tahun-label">
              {language === "ID" ? "Pilih" : "Choose"}
            </InputLabel>
            <Select
              id="filter-type"
              size="small"
              value={selectedCategory}
              disabled={disabledSelectedCategory}
              label="Tahun"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {searchby.map((y) => (
                <MenuItem key={y.label} value={y.value}>
                  {y.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item flex={6}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>{language === "ID" ? "Cari" : "Search"}</InputLabel>
            <OutlinedInput
              id="component-error-text"
              disabled={disableSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={(e) => apiChecker(e)}
              onFocus={(e) => handleMouseDownSearch(e)}
              onBlur={(e) => handleBlurSearch(e)}
              label={language === "ID" ? "Cari" : "Search"}
              error={validationError}
              value={inputSearch}
              maxLength={15}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={(e) => apiChecker(e)}
                    edge="end"
                    disabled={inputSearch === ""}
                  >
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>

        <Grid item flex={1}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            size="large"
            disabled={disableAdd}
            onClick={(e) => toggleScanNameTag(e)}
          ></Button>
        </Grid>
        {seeResep === true ? (
          <Grid item flex={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<RemoveRedEye />}
              size="large"
            ></Button>
          </Grid>
        ) : (
          <Grid item flex={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Book />}
              size="large"
              disabled={disableResep}
              onClick={() => setModalUploadFilesIsOpen(true)}
            ></Button>
          </Grid>
        )}
      </Grid>
      <Grid
        item
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={6}>
          <Grid container sx={{ m: 1 }}>
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "9em" }}
            >
              <Typography variant="body1" sx={{ p: 1, fontWeight: 400 }}>
                {language === "ID" ? "Kini" : "Now"}
              </Typography>
            </ModalInputWrapper>
            <TextField
              sx={{ width: "60%" }}
              size="small"
              disabled
              value={date + " " + time}
            ></TextField>
          </Grid>

          {resultHistoryHeader.length !== 0 ? (
            <Grid container sx={{ m: 1 }}>
              <ModalInputWrapper
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "9em" }}
              >
                <Typography variant="body1" sx={{ p: 1, fontWeight: 400 }}>
                  {language === "ID" ? "Tgl Transaksi" : "Transaction Date"}
                </Typography>
              </ModalInputWrapper>
              <TextField
                sx={{ width: "60%" }}
                size="small"
                disabled
                value={formatDate(
                  resultHistoryHeader.sale_trandate,
                  "dddd, DD MMMM YYYY HH:mm:ss"
                )}
              ></TextField>
            </Grid>
          ) : null}

          <Grid container sx={{ m: 1 }}>
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "9em" }}
            >
              <Typography variant="body1" sx={{ p: 1, fontWeight: 400 }}>
                {language === "ID" ? "Tipe" : "Type"}
              </Typography>
            </ModalInputWrapper>
            <TextField
              sx={{ width: "60%" }}
              size="small"
              disabled
              value={tipeMember}
            ></TextField>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          {resultHistoryHeader.length !== 0 ? (
            <Grid container sx={{ m: 1 }}>
              <ModalInputWrapper
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "9em" }}
              >
                <Typography variant="body1" sx={{ p: 1, fontWeight: 400 }}>
                  {language === "ID" ? "Nomor Resi" : "Receipt Number"}
                </Typography>
              </ModalInputWrapper>
              <TextField
                sx={{ width: "60%" }}
                size="small"
                id="outlined-name"
                disabled
                value={strookNumber}
              ></TextField>
            </Grid>
          ) : null}

          <Grid container sx={{ m: 1 }}>
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "9em" }}
            >
              <Typography variant="body1" sx={{ p: 1, fontWeight: 400 }}>
                {language === "ID" ? "Sales Person" : "Sales Person"}
              </Typography>
            </ModalInputWrapper>
            <TextField
              sx={{ width: "60%" }}
              size="small"
              disabled
              value={
                resultHistoryHeader.length !== 0
                  ? resultHistoryHeader.sale_salesperson
                  : nipUser
              }
            ></TextField>
          </Grid>
          {!hideNOMember && (
            <Grid container item sx={{ m: 1 }}>
              <ModalInputWrapper
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "9em" }}
              >
                <Typography variant="body1" sx={{ p: 1, fontWeight: 400 }}>
                  Member
                </Typography>
              </ModalInputWrapper>
              <TextField
                sx={{ width: "60%" }}
                size="small"
                disabled
                value={namaMember}
              ></TextField>
            </Grid>
          )}
        </Grid>
      </Grid>

      {resultHistoryHeader.length === 0 ? (
        <Paper sx={{ mt: 2 }} elevation={6}>
          <Grid>
            <Typography sx={{ ml: 2, fontWeight: 700, p: 1 }}>
              {language === "ID" ? "Transaksi Baru" : "New Transaction"}
            </Typography>
          </Grid>
          <Divider sx={{ borderBottomWidth: 3, ml: 2, mr: 2 }} />
          <Grid sx={{ textAlign: "center" }}>
            <Table size="small" sx={{ mt: 2 }}>
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
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {head.name}
                        </Typography>
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {newTransaction &&
                  newTransaction.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.sale_procod === "" || item.sale_procod === null
                          ? "-"
                          : item.sale_procod}{" "}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        {item.sale_proname === "" || item.sale_proname === null
                          ? "-"
                          : item.sale_proname}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        {item.sale_batch === "" || item.sale_batch === null
                          ? "-"
                          : item.sale_batch}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        {item.sale_sellqty === "" || item.sale_sellqty === null
                          ? "-"
                          : item.sale_sellqty}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        {item.sale_sellpack === "" ||
                        item.sale_sellpack === null
                          ? "-"
                          : item.sale_sellpack}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        {item.sale_saleprice === "" ||
                        item.sale_saleprice === null
                          ? "-"
                          : "Rp" +
                            String(item.sale_saleprice).replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              "."
                            )}
                      </TableCell>
                      <TableCell>
                        {item.sale_disccenpct === "" ||
                        item.sale_disccenpct === null
                          ? "-"
                          : item.sale_disccenpct}
                        {"%"}
                      </TableCell>
                      <TableCell>
                        {item.sale_discmbrcen === "" ||
                        item.sale_discmbrcen === null
                          ? "-"
                          : (item.sale_sellqty *
                              item.sale_disccenpct *
                              item.sale_saleprice) /
                            100}
                      </TableCell>
                      <TableCell>
                        {item.sale_discmbrsup === "" ||
                        item.sale_discmbrsup === null
                          ? "-"
                          : item.sale_discmbrsup}
                        {"%"}
                      </TableCell>
                      <TableCell>
                        {item.sale_discmbrsup === "" ||
                        item.sale_discmbrsup === null
                          ? "-"
                          : (item.sale_sellqty *
                              item.sale_discmbrsup *
                              item.sale_saleprice) /
                            100}
                      </TableCell>
                      <TableCell>
                        {item.sale_amount === "" || item.sale_amount === null
                          ? "-"
                          : "Rp" +
                            String(
                              item.sale_sellqty * item.sale_saleprice -
                                (item.sale_sellqty *
                                  item.sale_disccenpct *
                                  item.sale_saleprice) /
                                  100 -
                                (item.sale_sellqty *
                                  item.sale_discmbrsup *
                                  item.sale_saleprice) /
                                  100
                            ).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={(e) => deleteNewTrans(item, index)}
                          color="error"
                        >
                          {<DeleteIcon />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <Collapse in={newTransaction.length === 0}>
              <Box
                sx={{
                  height: 300,
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h4" sx={{ color: "red" }}>
                  No Item <Block sx={{ width: 30, height: 30 }} />
                </Typography>
              </Box>
            </Collapse>
          </Grid>
        </Paper>
      ) : (
        <Paper sx={{ mt: 2 }} elevation={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{ ml: 2, fontWeight: 400, p: 1 }}
              fontSize={{
                lg: 17,
                md: 15,
                sm: 10,
                xs: 8,
              }}
            >
              {language === "ID" ? "Riwayat" : "History"} - {strookNumber}
            </Typography>
          </Box>
          <Divider sx={{ borderBottomWidth: 3, ml: 2, mr: 2 }} />
          <TableContainer>
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  {tableHeader &&
                    tableHeader.map((head, index) => (
                      <TableCell key={index}>
                        <Typography
                          textAlign="center"
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {head.name}
                        </Typography>
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {resultHistoryDetail &&
                  resultHistoryDetail.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_procod === "" || item.sale_procod === null
                            ? "-"
                            : item.sale_procod}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_proname === "" ||
                          item.sale_proname === null
                            ? "-"
                            : item.sale_proname}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_batch === "" || item.sale_batch === null
                            ? "-"
                            : item.sale_batch}{" "}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_sellqty === "" ||
                          item.sale_sellqty === null
                            ? "-"
                            : item.sale_sellqty}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_sellpack === "" ||
                          item.sale_sellpack === null
                            ? "-"
                            : item.sale_sellpack}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_saleprice === "" ||
                          item.sale_saleprice === null
                            ? "-"
                            : "Rp" +
                              String(Math.round(item.sale_saleprice)).replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                "."
                              )}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_disccenpct === "" ||
                          item.sale_disccenpct === null
                            ? "-"
                            : item.sale_disccenpct}
                          {"%"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_discmbrcen === "" ||
                          item.sale_discmbrcen === null
                            ? "-"
                            : "Rp" +
                              String(
                                Math.round(
                                  (item.sale_sellqty *
                                    item.sale_disccenpct *
                                    item.sale_saleprice) /
                                    100
                                )
                              ).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_discmbrsup === "" ||
                          item.sale_discmbrsup === null
                            ? "-"
                            : item.sale_discmbrsup}
                          {"%"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_discmbrsup === "" ||
                          item.sale_discmbrsup === null
                            ? "-"
                            : "Rp" +
                              String(
                                Math.round(
                                  item.sale_discmbrsup * item.sale_saleprice
                                )
                              ).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 17,
                            md: 15,
                            sm: 10,
                            xs: 8,
                          }}
                        >
                          {item.sale_amount === "" || item.sale_amount === null
                            ? "-"
                            : "Rp" +
                              String(Math.round(item.sale_amount)).replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                "."
                              )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {resultHistoryHeader.length === 0 ? (
        // new transaction
        <Collapse in={newTransaction.length !== 0}>
          <Stack alignItems={"flex-end"} sx={{ pt: 2 }}>
            <Box sx={{ width: "35%" }}>
              <Paper sx={{ ml: "1em" }} elevation={12} borderradius={25}>
                <Grid container alignItems="center" justifyContent="center">
                  <Typography
                    fontSize={{
                      lg: 17,
                      md: 17,
                      sm: 15,
                      xs: 10,
                    }}
                  >
                    {language === "ID"
                      ? "RINCIAN PEMBAYARAN"
                      : "DETAIL PAYMENT"}
                  </Typography>
                </Grid>
                <Divider sx={{ borderBottomWidth: 3, ml: 2, mr: 2 }} />

                <Grid container>
                  <Grid item xs={6} sx={{ ml: "1em" }}>
                    <Typography> Total </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{ float: "right" }}>
                    <Typography sx={{ float: "right" }}>
                      {total === 0
                        ? "-"
                        : "Rp" +
                          String(total).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </Typography>
                  </Grid>

                  <Grid container>
                    <Grid item xs={6} sx={{ ml: "1em" }}>
                      <Typography> Voucher </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{ float: "right" }}>
                      <Typography sx={{ float: "right" }}>
                        {resultHistoryHeader.length === 0
                          ? "Rp" + 0
                          : "Rp" +
                            String(
                              resultHistoryHeader.sale_TotVouchCen
                            ).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid xs={6} sx={{ ml: "1em" }}>
                      <Typography> VoucherSupplier </Typography>
                    </Grid>
                    <Grid xs={5} sx={{ float: "right" }}>
                      <Typography sx={{ float: "right" }}>
                        {resultHistoryHeader.length === 0
                          ? "Rp" + 0
                          : "Rp" +
                            String(
                              resultHistoryHeader.sale_TotVouchSup
                            ).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={6} sx={{ ml: "1em" }}>
                      <Typography> PrevRounding </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{ float: "right" }}>
                      <Typography sx={{ float: "right" }}>
                        {resultHistoryHeader.length === 0
                          ? "Rp" + 0
                          : "Rp" +
                            String(resultHistoryHeader.sale_Rounding).replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              "."
                            )}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={6} sx={{ ml: "1em" }}>
                      <Typography> Rounding </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{ float: "right" }}>
                      <Typography sx={{ float: "right" }}>
                        {"Rp" +
                          String(pembulatan).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={6} sx={{ ml: "1em" }}>
                      <Typography> GrandTotal </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{ float: "right" }}>
                      <Typography sx={{ float: "right" }}>
                        {grandTotalTransaction === 0
                          ? "-"
                          : "Rp" +
                            String(grandTotalTransaction).replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              "."
                            )}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={6} sx={{ ml: "1em" }}>
                      <Typography> Payment </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{ float: "right" }}>
                      <Typography sx={{ float: "right" }}>
                        {grandTotalTransaction === 0
                          ? "-"
                          : "Rp" +
                            String(cashValue).replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              "."
                            )}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={6} sx={{ ml: "1em" }}>
                      <Typography> Change </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{ float: "right" }}>
                      <Typography sx={{ float: "right" }}>
                        {"Rp" +
                          String(kembalian).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            <Box fullwidth sx={{ mt: 2 }}>
              <Grid container spacing={1}>
                <Grid item flex={1}>
                  <Button
                    sx={{ backgroundColor: "#21b6ae" }}
                    disabled={grandTotalTransaction === 0}
                    variant="contained"
                    size="small"
                    onClick={toggleTransfer.bind(this)}
                  >
                    PAYMENT
                  </Button>
                </Grid>
                <Grid item flex={1}>
                  <Button
                    sx={{ backgroundColor: "#D2042D" }}
                    disabled={grandTotalTransaction === 0}
                    variant="contained"
                    size="small"
                    onClick={(e) => resetAll(e)}
                  >
                    {language === "ID" ? "BATAL" : "CANCEL"}
                  </Button>
                </Grid>
                <Grid item flex={1}>
                  <Button
                    sx={{ backgroundColor: "#2cae6b" }}
                    disabled={btnInsertTransaction}
                    variant="contained"
                    size="small"
                    onClick={(e) => toggleModalSave(e)}
                  >
                    {language === "ID" ? "SIMPAN" : "SAVE"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Collapse>
      ) : (
        // history
        <Stack alignItems={"flex-end"} sx={{ pt: 2 }}>
          <Box sx={{ width: "35%" }}>
            <Paper sx={{ ml: "1em" }} elevation={12} borderradius={25}>
              <Grid container alignItems="center" justifyContent="center">
                <Typography
                  fontSize={{
                    lg: 17,
                    md: 15,
                    sm: 10,
                    xs: 8,
                  }}
                >
                  {" "}
                  {language === "ID" ? "RINCIAN PEMBAYARAN" : "DETAIL PAYMENT"}
                </Typography>
              </Grid>
              <Divider sx={{ borderBottomWidth: 3, ml: 2, mr: 2 }} />

              <Grid container>
                <Grid item xs={6} sx={{ ml: "1em" }}>
                  <Typography
                    fontSize={{
                      lg: 17,
                      md: 15,
                      sm: 10,
                      xs: 8,
                    }}
                  >
                    {" "}
                    Total{" "}
                  </Typography>
                </Grid>
                <Grid item xs={5} sx={{ float: "right" }}>
                  <Typography
                    sx={{ float: "right" }}
                    fontSize={{
                      lg: 17,
                      md: 15,
                      sm: 10,
                      xs: 8,
                    }}
                  >
                    {resultHistoryHeader.length === 0
                      ? "-"
                      : "Rp" +
                        String(resultHistoryHeader.sale_trantotal).replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          "."
                        )}
                  </Typography>
                </Grid>

                <Grid container>
                  <Grid item xs={6} sx={{ ml: "1em" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                    >
                      {" "}
                      Voucher{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{ float: "right" }}>
                    <Typography
                      sx={{ float: "right" }}
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                    >
                      {resultHistoryHeader.length === 0
                        ? "Rp" + 0
                        : "Rp" +
                          String(resultHistoryHeader.sale_totvouchcen).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid xs={6} sx={{ ml: "1em" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                    >
                      {" "}
                      VoucherSupplier{" "}
                    </Typography>
                  </Grid>
                  <Grid xs={5} sx={{ float: "right" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                      sx={{ float: "right" }}
                    >
                      {resultHistoryHeader.length === 0
                        ? "Rp" + 0
                        : "Rp" +
                          String(resultHistoryHeader.sale_totvouchsup).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={6} sx={{ ml: "1em" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                    >
                      {" "}
                      PrevRounding{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{ float: "right" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                      sx={{ float: "right" }}
                    >
                      {resultHistoryHeader.length === 0
                        ? "-"
                        : "Rp" +
                          String(resultHistoryHeader.sale_prevrounding).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={6} sx={{ ml: "1em" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                    >
                      {" "}
                      Rounding{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{ float: "right" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                      sx={{ float: "right" }}
                    >
                      {resultHistoryHeader.length === 0
                        ? "-"
                        : "Rp" +
                          String(resultHistoryHeader.sale_rounding).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={6} sx={{ ml: "1em" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                    >
                      {" "}
                      GrandTotal{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{ float: "right" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                      sx={{ float: "right" }}
                    >
                      {resultHistoryHeader.length === 0
                        ? "-"
                        : "Rp" +
                          String(resultHistoryHeader.sale_trantotal).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={6} sx={{ ml: "1em" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                    >
                      {" "}
                      Payment{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{ float: "right" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                      sx={{ float: "right" }}
                    >
                      {resultHistoryHeader.length === 0
                        ? "-"
                        : "Rp" +
                          String(resultHistoryHeader.sale_tranpayment).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={6} sx={{ ml: "1em" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                    >
                      {" "}
                      Change{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{ float: "right" }}>
                    <Typography
                      fontSize={{
                        lg: 17,
                        md: 15,
                        sm: 10,
                        xs: 8,
                      }}
                      sx={{ float: "right" }}
                    >
                      {resultHistoryHeader.length === 0
                        ? "-"
                        : "Rp" +
                          String(resultHistoryHeader.sale_tranchange).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
          <Box fullwidth sx={{ mt: 2 }}>
            {/* <Paper> */}

            <Grid item flex={1}>
              <Button
                hidden={resultHistoryHeader.length === 0}
                variant="contained"
                size="normal"
                onClick={(e) => printHistoryStruk(e)}
              >
                {language === "ID" ? "CETAK" : "PRINT"}
              </Button>
            </Grid>
          </Box>
        </Stack>
      )}
      <Modal closeOnBackdrop={false} open={modalBatch}>
        <ModalWrapper sx={{ height: "auto" }}>
          <Grid>
            <Typography
              sx={{ mb: 2 }}
              align="center"
              variant="h5"
              fontWeight="600"
            >
              LIST BATCH NUMBER
            </Typography>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box
            mb={1}
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.12)",
            }}
            display={"flex"}
          >
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "12em" }}
            >
              <Typography
                fullWidth
                variant="body1"
                sx={{ p: 1, fontWeight: 600 }}
              >
                {language === "ID" ? "Nama Produk" : "Product Name"}
              </Typography>
            </ModalInputWrapper>
            <TextField
              size="small"
              fullWidth
              disabled
              value={resultBatchHeader.pro_name}
            ></TextField>
          </Box>
          <Box
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.12)",
            }}
            display={"flex"}
          >
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "12em" }}
            >
              <Typography
                fullWidth
                variant="body1"
                sx={{ p: 1, fontWeight: 600 }}
              >
                Sale Pack
              </Typography>
            </ModalInputWrapper>
            <TextField
              size="small"
              fullWidth
              disabled
              value={resultBatchHeader.pro_sellpackname}
            ></TextField>
          </Box>

          <Box>
            <Table size="small" sx={{ mt: 2, textAlign: "center" }}>
              <TableHead>
                <TableRow>
                  {fieldsbatch &&
                    fieldsbatch.map((head, index) => (
                      <TableCell
                        sx={{
                          textAlign: "center",
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
                {resultBatch &&
                  resultBatch.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.batch === "" || item.batch === null
                          ? "-"
                          : item.batch}{" "}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        {item.expired_date === "" || item.expired_date === null
                          ? "-"
                          : item.expired_date.substring(0, 10)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        {item.qty === "" || item.qty === null ? "-" : item.qty}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        <TextField
                          size="small"
                          type="number"
                          onChange={(evt) => handleChangeQty(item, index, evt)}
                          onKeyPress={(evt) =>
                            keyPresshandleChangeQty(item, index, evt)
                          }
                          value={numberQty[index]}
                        ></TextField>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          disabled={
                            numberQty[index] > item.qty ||
                            numberQty[index] === 0 ||
                            numberQty.length === 0 ||
                            numberQty[index] < 0
                          }
                          id={`btnOke${item.batch}`}
                          color="primary"
                          onClick={() => doneChangeQty(item, index)}
                        >
                          OK
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              sx={{ ml: 1 }}
              variant="contained"
              color="error"
              onClick={() => toggleBatchClosed()}
            >
              {language === "ID" ? "TUTUP" : "CLOSE"}
            </Button>
          </Box>
        </ModalWrapper>
      </Modal>
      {/* modalbatch */}
      {/* response */}
      <Modal open={responseModalIsOpen}>
        <Box sx={style}>
          <Grid textAlign="center">
            <Typography variant="h5" fontWeight="600">
              {responseHeader}
            </Typography>
          </Grid>
          <Grid mt={2} mb={2}>
            <Divider />
          </Grid>
          <Grid textAlign="center">
            <Typography fontWeight="400">{responseBody}</Typography>
          </Grid>
          <Grid textAlign="center" mt={2}>
            <Button
              onClick={toggleCloseSaveModal.bind(this)}
              variant="contained"
              color="error"
            >
              {language === "ID" ? "Tutup" : "Close"}
            </Button>
          </Grid>
        </Box>
      </Modal>
      {/* response */}

      {/* nametag */}
      <Modal closeOnBackdrop={false} open={ScanNameTagModal}>
        {/* <ModalWrapper sx={{ height: "50%", width: "50%" }}> */}
        <Box sx={style}>
          <Grid>
            <Typography
              sx={{ mb: 2 }}
              align="center"
              variant="h5"
              fontWeight="600"
            >
              Sales Person
            </Typography>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
            {language === "ID"
              ? "PINDAI BARCODE PADA NAMETAG ANDA"
              : "SCAN BARCODE ON YOUR NAMETAG"}
          </Typography>
          <Box
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.12)",
            }}
            display={"flex"}
          >
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "8em" }}
            >
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                NIP
              </Typography>
            </ModalInputWrapper>
            <TextField
              fullWidth
              disabled={scannedNameTag}
              onChange={onChangeNameTag}
              onKeyDown={onChangeNameTag}
              onBlur={onChangeNameTag}
              value={nipUser}
              type="text"
              placeholder={language ? "PINDAI" : "SCAN"}
              autoComplete="off"
            ></TextField>
          </Box>
          <Grid>
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                sx={{ ml: 1 }}
                variant="contained"
                color="error"
                onClick={closedtoggleScanNameTag.bind(this)}
              >
                {language === "ID" ? "BATAL" : "CANCEL"}
              </Button>
            </Box>

            <Collapse in={hideNOMemberModal}>
              <Box
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                }}
                display={"flex"}
              >
                <ModalInputWrapper
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    width: "8em",
                  }}
                >
                  <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                    Member ID
                  </Typography>
                </ModalInputWrapper>
                <TextField
                  fullWidth
                  disabled={scanned}
                  onChange={onChangeBarcode}
                  onKeyDown={onChangeBarcode}
                  onBlur={onChangeBarcode}
                  value={noMember}
                  type="text"
                  placeholder="SCAN MEMBER ID"
                  autoComplete="off"
                ></TextField>
              </Box>
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                  sx={{ ml: 1 }}
                  variant="contained"
                  color="error"
                  disabled // todo member
                  onClick={toggleOKMembershipModal.bind(this)}
                >
                  OK
                </Button>
              </Box>
            </Collapse>
          </Grid>
          {/* </ModalWrapper> */}
        </Box>
      </Modal>
      {/* nametag */}

      {/* membership */}
      <Modal closeOnBackdrop={false} open={MembershipModalIsOpen}>
        {/* <ModalWrapper sx={{ height: "30%", width: "50%" }}> */}
        <Box sx={style} style={{ textAlign: "center" }}>
          <Grid>
            <Typography
              sx={{ mb: 2 }}
              align="center"
              variant="h5"
              fontWeight="600"
            >
              {language === "ID" ? "KEANGGOTAAN" : "MEMBERSHIP"}
            </Typography>
          </Grid>
          <Divider sx={{ my: 2 }} />

          <Collapse in={konfirmasiMember}>
            <Grid container sx={{ justifyContent: "center" }}>
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                THIS IS MEMBER TRANSACTIONS?
              </Typography>
            </Grid>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                sx={{ ml: 1 }}
                variant="contained"
                color="success"
                onClick={toggleOpenMembershipModalTESTING.bind(this)}
              >
                YES
              </Button>
              <Button
                sx={{ ml: 1 }}
                variant="contained"
                color="error"
                onClick={toggleNotMembershipModal.bind(this)}
              >
                NO
              </Button>
            </Box>
          </Collapse>

          <Collapse in={hideNOMemberModal}>
            <Box
              sx={{
                border: "1px solid rgba(0, 0, 0, 0.12)",
              }}
              display={"flex"}
            >
              <ModalInputWrapper
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "8em" }}
              >
                <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                  Member ID
                </Typography>
              </ModalInputWrapper>
              <TextField
                fullWidth
                disabled={scanned}
                onChange={onChangeBarcode}
                onKeyDown={onChangeBarcode}
                onBlur={onChangeBarcode}
                // onKeyDown={(e) => onkeydownMemberID(e)}
                value={noMember}
                type="text"
                placeholder="SCAN MEMBER ID"
                autoComplete="off"
              ></TextField>
            </Box>
            <Grid>
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                  sx={{ ml: 1 }}
                  variant="contained"
                  color="error"
                  onClick={toggleOKMembershipModal.bind(this)}
                >
                  OK
                </Button>
              </Box>
            </Grid>
          </Collapse>
        </Box>
        {/* </ModalWrapper> */}
      </Modal>
      {/* membership */}

      {/* payment */}
      <Modal closeOnBackdrop={false} open={modalTransfer}>
        <Box sx={style}>
          {/* <ModalWrapper sx={{ height: "100%", width: "50%" }}> */}
          <Grid>
            <Typography sx={{ mb: 2 }} align="center" variant="h5">
              TYPE OF PAYMENT
            </Typography>
          </Grid>
          <Divider sx={{ my: 2 }} />

          <Grid container textAlign="center">
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "10em" }}
            >
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                METHOD
              </Typography>
            </ModalInputWrapper>
            <Select
              fullWidth
              sx={{ width: "50%" }}
              defaultValue="Choose"
              value={paymentType}
              onChange={(e) => onChangePaymentOption(e)}
            >
              {paymentOption &&
                paymentOption.map((todo, i) => {
                  return (
                    <option key={i} value={todo.pay_code}>
                      {todo.pay_name}
                    </option>
                  );
                })}
            </Select>
          </Grid>

          <Grid container>
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "10em" }}
            >
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                AMOUNT
              </Typography>
            </ModalInputWrapper>
            <TextField
              fullWidth
              sx={{ width: "50%" }}
              type="number"
              placeholder={"INPUT AMOUNT"}
              autoComplete="off"
              onChange={(e) => setCashValue(Number(e.target.value))}
              value={cashValue}
              onKeyDown={(e) => keydownjumlah(e)}
            ></TextField>
          </Grid>

          <Grid hidden={showVoucherMethod} container>
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "10em" }}
            >
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                VOUCHER
              </Typography>
            </ModalInputWrapper>
            <TextField
              sx={{ width: "50%" }}
              type="text"
              fullWidth
              placeholder={"INPUT VOUCHER CODE"}
              autoComplete="off"
            ></TextField>
          </Grid>

          <Grid hidden={showCreditMethod} container>
            <ModalInputWrapper
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "10em" }}
            >
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                CARD NUMBER
              </Typography>
            </ModalInputWrapper>
            <TextField
              sx={{ width: "50%" }}
              type="text"
              fullWidth
              value={ccNumber}
              onChange={formatAndSetCcNumber}
              placeholder={"INPUT CARD NUMBER"}
              autoComplete="off"
            ></TextField>
          </Grid>

          <Grid>
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                disabled={grandTotalTransaction > cashValue || cashValue === 0}
                onClick={() => toggleTransferClosed()}
                variant="contained"
              >
                DONE
              </Button>
            </Box>
          </Grid>
          {/* </ModalWrapper> */}
        </Box>
      </Modal>
      {/* payment */}

      {/* save */}
      <Modal closeOnBackdrop={false} open={modalSave}>
        <ModalWrapper sx={{ height: "20%", width: "40%" }}>
          <Grid
            container
            sx={{ justifyContent: "center", textAlign: "center" }}
          >
            <Typography
              sx={{ mb: 2 }}
              align="center"
              textAlign="center"
              variant="h6"
            >
              ARE YOU SURE WANT TO SAVE THIS TRANSACTION?
            </Typography>
          </Grid>
          <Divider sx={{ my: 2 }} />

          <Grid textAlign="center">
            {/* <Box sx={{ mt: 1, textAlign: "center" }}> */}

            {/* </Box> */}

            <Button
              sx={{ ml: 2 }}
              variant="contained"
              disabled={btnInsertTransaction}
              color="success"
              onClick={() => insertTransaction()}
            >
              YES
            </Button>
            <Button
              sx={{ ml: 2 }}
              variant="contained"
              color="error"
              onClick={toggleModalSaveClosed.bind(this)}
            >
              NO
            </Button>
            {/* </Box> */}
          </Grid>
        </ModalWrapper>
      </Modal>
      {/* save */}

      <Modal open={isLoading}>
        <Box sx={style} style={{ textAlign: "center" }}>
          <CircularProgress>PLEASE WAIT...</CircularProgress>
        </Box>
      </Modal>

      <Modal open={modalUploadFilesIsOpen}>
        <Box sx={style}>
          <Typography>Upload</Typography>
          <Grid mt={2} mb={2}>
            <Divider fullWidth></Divider>
          </Grid>
          <div>
            <input type="file" name="file" onChange={changeHandler}></input>
            {isSelected ? (
              <div>
                <img
                  src={selectedFile}
                  style={{ widht: "30px", height: "30px" }}
                  alt="description"
                />
              </div>
            ) : (
              <p>Select a file to show details</p>
            )}
          </div>

          <Button onClick={handleSubmission}>SUBMIT</Button>
          <Button onClick={toggleModalUploadClose.bind(this)}>OK</Button>
        </Box>
      </Modal>
    </Box>
  );
};
export default Posv2;
