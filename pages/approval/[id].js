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
import qr from "../../services/qr";
import { debounce, set, isUndefined } from "lodash";
import { formatDate } from "../../utils/text";
import { detailApprovalBool, setDetailApprovalBool } from "./index";
import { useRouter } from "next/router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { getStorage } from "../../utils/storage";

const ScanNewBatch = () => {
  const [listMasterBox, setListMasterBox] = useState([]);
  const [selectProduct, setSelectProduct] = useState("");
  const [selectBatchNumber, setSelectBatchNumber] = useState("");
  const [modalScanBatch, setModalScanBatch] = useState(false);
  const [flag, setFlag] = useState("D");
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

  const [masterBoxDisable, setMasterBoxDisable] = useState(true);
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
  const [
    modalScanningPackagingNotFullFinish,
    setModalScanningPackagingNotFullFinish,
  ] = useState(false);
  const [modalPackingSelesai, setModalPackingSelesai] = useState(false);
  const [modalPackingSelesai2, setModalPackingSelesai2] = useState(false);
  const [modalValidationSaveAndFinish, setModalValidationSaveAndFinish] =
    useState(false);
  const [modalValidatonUnitBox10, setModalValidatonUnitBox10] = useState(false);
  const [modalSeeMbList, setModalSeeMbList] = useState(false);

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

  const [collapseEditUnitBox1, setCollapseEditUnitBox1] = useState(false);
  const [collapseEditUnitBox2, setCollapseEditUnitBox2] = useState(false);
  const [collapseEditUnitBox3, setCollapseEditUnitBox3] = useState(false);
  const [collapseEditUnitBox4, setCollapseEditUnitBox4] = useState(false);
  const [collapseEditUnitBox5, setCollapseEditUnitBox5] = useState(false);
  const [collapseEditUnitBox6, setCollapseEditUnitBox6] = useState(false);
  const [collapseEditUnitBox7, setCollapseEditUnitBox7] = useState(false);
  const [collapseEditUnitBox8, setCollapseEditUnitBox8] = useState(false);
  const [collapseEditUnitBox9, setCollapseEditUnitBox9] = useState(false);
  const [collapseEditUnitBox10, setCollapseEditUnitBox10] = useState(false);

  const [collapseSaveUnitBox1, setCollapseSaveUnitBox1] = useState(false);
  const [collapseSaveUnitBox2, setCollapseSaveUnitBox2] = useState(false);
  const [collapseSaveUnitBox3, setCollapseSaveUnitBox3] = useState(false);
  const [collapseSaveUnitBox4, setCollapseSaveUnitBox4] = useState(false);
  const [collapseSaveUnitBox5, setCollapseSaveUnitBox5] = useState(false);
  const [collapseSaveUnitBox6, setCollapseSaveUnitBox6] = useState(false);
  const [collapseSaveUnitBox7, setCollapseSaveUnitBox7] = useState(false);
  const [collapseSaveUnitBox8, setCollapseSaveUnitBox8] = useState(false);
  const [collapseSaveUnitBox9, setCollapseSaveUnitBox9] = useState(false);
  const [collapseSaveUnitBox10, setCollapseSaveUnitBox10] = useState(false);

  // const tempArrEdit = [];

  const [collapsePackagingSelesaiButton, setCollapsePackagingSelesaiButton] =
    useState(false);
  const [
    collapseDetailScanNewBatchButtonUp,
    setCollapseDetailScanNewBatchButtonUp,
  ] = useState(true);
  const [
    collapseDetailScanNewBatchButtonDown,
    setCollapseDetailScanNewBatchButtonDown,
  ] = useState(false);

  const unitBox1Ref = useRef();
  const unitBox2Ref = useRef();
  const unitBox3Ref = useRef();
  const unitBox4Ref = useRef();
  const unitBox5Ref = useRef();
  const unitBox6Ref = useRef();
  const unitBox7Ref = useRef();
  const unitBox8Ref = useRef();
  const unitBox9Ref = useRef();
  const unitBox10Ref = useRef();
  // const unitBox11Ref = useRef();

  const [listProduct, setListProduct] = useState([]);
  const [listHeader, setListHeader] = useState("");
  const [listSeeMB, setListSeeMB] = useState([]);
  const [listScanningPackaging, setListScanningPackaging] = useState([]);

  const [payloadHeader, setPayloadHeader] = useState([]);

  const [selectedProdDate, setSelectedProdDate] = useState("");
  const [selectedExpDate, setSelectedExpDate] = useState("");

  const [checkedSample, setCheckedSample] = useState(false);

  const [detailBool, setDetailBool] = useState(false);

  const [disableUnitBox1, setDisableUnitBox1] = useState(true);
  const [disableUnitBox2, setDisableUnitBox2] = useState(true);
  const [disableUnitBox3, setDisableUnitBox3] = useState(true);
  const [disableUnitBox4, setDisableUnitBox4] = useState(true);
  const [disableUnitBox5, setDisableUnitBox5] = useState(true);
  const [disableUnitBox6, setDisableUnitBox6] = useState(true);
  const [disableUnitBox7, setDisableUnitBox7] = useState(true);
  const [disableUnitBox8, setDisableUnitBox8] = useState(true);
  const [disableUnitBox9, setDisableUnitBox9] = useState(true);
  const [disableUnitBox10, setDisableUnitBox10] = useState(true);

  const router = useRouter();

  const [noID, setNoID] = useState("");

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

  // useEffect(() => {
  //   console.log("GetListMasterBoxUseEffect", listMasterBox)
  // },[listMasterBox])

  // useEffect(() => {
  //   if (flag === "D"){
  //   // if (listMasterBox === 0 || listMasterBox === "") {
  //   //   setFlag("D");
  //   //   setCollapsePackagingSelesaiButton(false);

  //   //   console.log("listHeaderStart2MasterBoxNull", listHeader);
  //   //   console.log("setCollapsePackagingSelesaiButtonTrue", collapsePackagingSelesaiButton);

  //   // }

  //   if (listMasterBox !== 0 || listMasterBox !== "") {
  //     setFlag("D");
  //     setCollapsePackagingSelesaiButton(false);
  //     console.log("testPayload", payloadHeader);
  //     console.log("listHeaderStart2MasterBoxNotNull", listHeader);

  //   }
  // }
  // },[flag,listMasterBox,collapsePackagingSelesaiButton])

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  async function start(item) {
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
    console.log("getproduct", listProduct);
  }

  async function start2() {
    debounceMountCreateHeaderNewBatch();
    setFlag("D");
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
    // console.log("pro_code", payloadHeader.pro_code);
    // console.log("pro_name", payloadHeader.pro_name);
    // console.log("selectBatchNumber", selectBatchNumber);
    console.log("listHeader", listHeader);
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
    setFlag("P");
    setCollapseSaveUnitBox1(false);
    setCollapseSaveUnitBox2(false);
    setCollapseSaveUnitBox3(false);
    setCollapseSaveUnitBox4(false);
    setCollapseSaveUnitBox5(false);
    setCollapseSaveUnitBox6(false);
    setCollapseSaveUnitBox7(false);
    setCollapseSaveUnitBox8(false);
    setCollapseSaveUnitBox9(false);
    setCollapseSaveUnitBox10(false);
  }

  useEffect(() => {
    console.log("detailBool", detailBool);
    // console.log("detailmbsize", mbSizeDetail);
    if (masterCodeBox !== 0 && masterCodeBox !== "" && detailBool !== true) {
      setUnitBox1Disabled(false);
      // unitBox1Ref.focus();
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox1 !== 0 && unitBox1 !== "" && detailBool !== true) {
      setUnitBox2Disabled(false);
      // unitBox2Ref.focus();
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox1(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox1(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox2 !== 0 && unitBox2 !== "" && detailBool !== true) {
      setUnitBox3Disabled(false);
      // unitBox3Ref.focus();
      // setCollapseDeleteUnitBox2(true);
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox2(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox2(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox3 !== 0 && unitBox3 !== "") {
      setUnitBox4Disabled(false);
      // unitBox4Ref.focus();
      // setCollapseDeleteUnitBox3(true);
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox3(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox3(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox4 !== 0 && unitBox4 !== "") {
      setUnitBox5Disabled(false);
      // unitBox5Ref.focus();
      // setCollapseDeleteUnitBox4(true);
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox4(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox4(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox5 !== 0 && unitBox5 !== "") {
      setUnitBox6Disabled(false);
      // unitBox6Ref.focus();
      // setCollapseDeleteUnitBox5(true);
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox5(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox5(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox6 !== 0 && unitBox6 !== "") {
      setUnitBox7Disabled(false);
      // unitBox7Ref.focus();
      // setCollapseDeleteUnitBox6(true);
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox6(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox6(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox7 !== 0 && unitBox7 !== "") {
      setUnitBox8Disabled(false);
      // unitBox8Ref.focus();
      // setCollapseDeleteUnitBox7(true);
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox7(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox7(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox8 !== 0 && unitBox8 !== "") {
      setUnitBox9Disabled(false);
      // unitBox9Ref.focus();
      // setCollapseDeleteUnitBox8(true);
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox8(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox8(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox9 !== 0 && unitBox9 !== "") {
      setUnitBox10Disabled(false);
      // unitBox10Ref.focus();
      // setCollapseDeleteUnitBox9(true);
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox9(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox9(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    if (unitBox10 !== 0 && unitBox10 !== "") {
      // setUnitBox10Disabled(false)
      // unitBox11Ref.focus();
      // setCollapseDeleteUnitBox10(true);
      // if (detailBool !== true) {
      setCollapseDeleteUnitBox10(true);
      // }
      // if (detailBool === true) {
      //   setCollapseEditUnitBox10(true);
      // }
      // console.log("unitbox1",masterCodeBox)
    }
    // console.log("testget", debounceMountGetListAllProduct());
    if (detailBool === true) {
      // setCollapseEditUnitBox1(true);
      // setCollapseEditUnitBox2(true);
      // setCollapseEditUnitBox3(true);
      // setCollapseEditUnitBox4(true);
      // setCollapseEditUnitBox5(true);
      // setCollapseEditUnitBox6(true);
      // setCollapseEditUnitBox7(true);
      // setCollapseEditUnitBox8(true);
      // setCollapseEditUnitBox9(true);
      // setCollapseEditUnitBox10(true);

      // if (unitBox1Edit !== "" || unitBox1Edit !== 0) {
      //   setCollapseEditUnitBox1(true);
      // }
      // if (unitBox2Edit !== "" || unitBox2Edit !== 0) {
      //   setCollapseEditUnitBox2(true);
      // }
      // if (unitBox3Edit !== "" || unitBox3Edit !== 0) {
      //   setCollapseEditUnitBox3(true);
      // }
      // if (unitBox4Edit !== "" || unitBox4Edit !== 0) {
      //   setCollapseEditUnitBox4(true);
      // }
      // if (unitBox5Edit !== "" || unitBox5Edit !== 0) {
      //   console.log("data5", unitBox5Edit);
      //   setCollapseEditUnitBox5(true);
      // }
      // if (unitBox6Edit !== "" || unitBox6Edit !== 0) {
      //   console.log("data6", unitBox6Edit);
      //   setCollapseEditUnitBox6(true);
      // }
      // if (unitBox7Edit !== "" || unitBox7Edit !== 0) {
      //   setCollapseEditUnitBox7(true);
      // }
      // if (unitBox8Edit !== "" || unitBox8Edit !== 0) {
      //   setCollapseEditUnitBox8(true);
      // }
      // if (unitBox9Edit !== "" || unitBox9Edit !== 0) {
      //   setCollapseEditUnitBox9(true);
      // }
      // if (unitBox10Edit !== "" || unitBox10Edit !== 0) {
      //   setCollapseEditUnitBox10(true);
      // }

      setMasterBoxDisable(true);
    }
    if (flag === "Y") {
      debounceMountGetListAllProduct();
      console.log("getlistallproduct");
    }

    // ---------- validasi button edit di menu scanning packaging ----------
    // if (detailBool === true) {
    //   if (unitBox1Edit === "" || unitBox1Edit === 0) {
    //     setCollapseEditUnitBox1(false);
    //   }
    //   if (unitBox2Edit === "" || unitBox2Edit === 0) {
    //     setCollapseEditUnitBox2(false);
    //   }
    //   if (unitBox3Edit === "" || unitBox3Edit === 0) {
    //     setCollapseEditUnitBox3(false);
    //   }
    //   if (unitBox4Edit === "" || unitBox4Edit === 0) {
    //     setCollapseEditUnitBox4(false);
    //   }
    //   if (unitBox5Edit === "" || unitBox5Edit === 0) {
    //     setCollapseEditUnitBox5(false);
    //   }
    //   if (unitBox6Edit === "" || unitBox6Edit === 0) {
    //     setCollapseEditUnitBox6(false);
    //   }
    //   if (unitBox7Edit === "" || unitBox7Edit === 0) {
    //     setCollapseEditUnitBox7(false);
    //   }
    //   if (unitBox8Edit === "" || unitBox8Edit === 0) {
    //     setCollapseEditUnitBox8(false);
    //   }
    //   if (unitBox9Edit === "" || unitBox9Edit === 0) {
    //     setCollapseEditUnitBox9(false);
    //   }
    //   if (unitBox10Edit === "" || unitBox10Edit === 0) {
    //     setCollapseEditUnitBox10(false);
    //   }
    // }

    if (detailBool === false) {
      setCollapseEditUnitBox1(false);
      setCollapseEditUnitBox2(false);
      setCollapseEditUnitBox3(false);
      setCollapseEditUnitBox4(false);
      setCollapseEditUnitBox5(false);
      setCollapseEditUnitBox6(false);
      setCollapseEditUnitBox7(false);
      setCollapseEditUnitBox8(false);
      setCollapseEditUnitBox9(false);
      setCollapseEditUnitBox10(false);

      setProductEdit([]);
    }
    // ---------------------------------------------------------------------
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
    detailBool,

    unitBox1Edit,
    unitBox2Edit,
    unitBox3Edit,
    unitBox4Edit,
    unitBox5Edit,
    unitBox6Edit,
    unitBox7Edit,
    unitBox8Edit,
    unitBox9Edit,
    unitBox10Edit,
  ]);

  useEffect(() => {
    // if (detailApprovalBool === true) {
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
    //   console.log("boolApproval-ScanNewBatch", detailApprovalBool);
    //   // setDetailApprovalBool(false);
    // }
    console.log("boolApproval-ScanNewBatch", detailApprovalBool);
  }, [
    detailApprovalBool,
    // flag,
    // detailBool,
    // listHeader,
    // mbSizeDetail,
    // collapseSaveUnitBox1,
    // collapseSaveUnitBox2,
    // collapseSaveUnitBox3,
    // collapseSaveUnitBox4,
    // collapseSaveUnitBox5,
    // collapseSaveUnitBox6,
    // collapseSaveUnitBox7,
    // collapseSaveUnitBox8,
    // collapseSaveUnitBox9,
    // collapseSaveUnitBox10,
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
      // mountCreateDetailNewBatch();
      console.log("testmasooooooooook");
      saveAndContinueFinish();
    }
  }

  async function saveAndContinueFinish() {
    debounceMountGetListMasterBox(listHeader.scan_id);
    // if (listMasterBox === null || listMasterBox === "") {
    //   // setFlag("D");
    //   setCollapsePackagingSelesaiButton(true);

    //   // console.log("listHeaderStart2MasterBoxNull", listHeader);
    // }

    // if (listMasterBox !== 0 || listMasterBox !== "") {
    // setFlag("D");
    // setCollapsePackagingSelesaiButton(false);
    // console.log("testPayload", payloadHeader);
    // console.log("listHeaderStart2MasterBoxNotNull", listHeader);
    // }

    setCollapsePackagingSelesaiButton(true);
    console.log(
      "setCollapsePackagingSelesaiButton",
      collapsePackagingSelesaiButton
    );
    mountCreateDetailNewBatch();

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

    setUnitBox1Disabled(true);
    setUnitBox2Disabled(true);
    setUnitBox3Disabled(true);
    setUnitBox4Disabled(true);
    setUnitBox5Disabled(true);
    setUnitBox6Disabled(true);
    setUnitBox7Disabled(true);
    setUnitBox8Disabled(true);
    setUnitBox9Disabled(true);
    setUnitBox10Disabled(true);

    setModalScanningPackagingNotFull(false);
    setModalScanningPackagingNotFullFinish(false);

    setDetailBool(false);
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
    // setUnitBox2Disabled(true)
    // setUnitBox3Disabled(true)
    // setUnitBox4Disabled(true)
    // setUnitBox5Disabled(true)
    // setUnitBox6Disabled(true)
    // setUnitBox7Disabled(true)
    // setUnitBox8Disabled(true)
    // setUnitBox9Disabled(true)
    // setUnitBox10Disabled(true)
  }

  async function deleteUnitBox2() {
    setUnitBox2("");
    setCollapseDeleteUnitBox2(false);
    // setUnitBox3Disabled(true)
    // setUnitBox4Disabled(true)
    // setUnitBox5Disabled(true)
    // setUnitBox6Disabled(true)
    // setUnitBox7Disabled(true)
    // setUnitBox8Disabled(true)
    // setUnitBox9Disabled(true)
    // setUnitBox10Disabled(true)
  }

  async function deleteUnitBox3() {
    setUnitBox3("");
    setCollapseDeleteUnitBox3(false);
    // setUnitBox4Disabled(true)
    // setUnitBox5Disabled(true)
    // setUnitBox6Disabled(true)
    // setUnitBox7Disabled(true)
    // setUnitBox8Disabled(true)
    // setUnitBox9Disabled(true)
    // setUnitBox10Disabled(true)
  }

  async function deleteUnitBox4() {
    setUnitBox4("");
    setCollapseDeleteUnitBox4(false);
    // setUnitBox5Disabled(true)
    // setUnitBox6Disabled(true)
    // setUnitBox7Disabled(true)
    // setUnitBox8Disabled(true)
    // setUnitBox9Disabled(true)
    // setUnitBox10Disabled(true)
  }

  async function deleteUnitBox5() {
    setUnitBox5("");
    setCollapseDeleteUnitBox5(false);
    // setUnitBox6Disabled(true)
    // setUnitBox7Disabled(true)
    // setUnitBox8Disabled(true)
    // setUnitBox9Disabled(true)
    // setUnitBox10Disabled(true)
  }

  async function deleteUnitBox6() {
    setUnitBox6("");
    setCollapseDeleteUnitBox6(false);
    // setUnitBox7Disabled(true)
    // setUnitBox8Disabled(true)
    // setUnitBox9Disabled(true)
    // setUnitBox10Disabled(true)
  }

  async function deleteUnitBox7() {
    setUnitBox7("");
    setCollapseDeleteUnitBox7(false);
    // setUnitBox8Disabled(true)
    // setUnitBox9Disabled(true)
    // setUnitBox10Disabled(true)
    // unitBox7Ref.focus();
  }

  async function deleteUnitBox8() {
    setUnitBox8("");
    setCollapseDeleteUnitBox8(false);
    // setUnitBox9Disabled(true)
    // setUnitBox10Disabled(true)
  }

  async function deleteUnitBox9() {
    setUnitBox9("");
    setCollapseDeleteUnitBox9(false);
    // setUnitBox10Disabled(true)
  }

  async function deleteUnitBox10() {
    setUnitBox10("");
    setCollapseDeleteUnitBox10(false);
  }

  // ------- Edit Unit Box Function -------

  async function editUnitBox1() {
    setUnitBox1Disabled(false);
    setCollapseEditUnitBox1(false);
    setCollapseSaveUnitBox1(true);
    // if (collapseEditUnitBox1 === false) {
    setUnitBox1Edit("");
    // }
    console.log("product", product);
    console.log("savebutton(click edit)", collapseSaveUnitBox1);
  }
  async function editUnitBox2() {
    setUnitBox2Disabled(false);
    setCollapseEditUnitBox2(false);
    setCollapseSaveUnitBox2(true);
    setUnitBox2Edit("");
  }
  async function editUnitBox3() {
    setUnitBox3Disabled(false);
    setCollapseEditUnitBox3(false);
    setCollapseSaveUnitBox3(true);
    setUnitBox3Edit("");
  }
  async function editUnitBox4() {
    setUnitBox4Disabled(false);
    setCollapseEditUnitBox4(false);
    setCollapseSaveUnitBox4(true);
    setUnitBox4Edit("");
  }
  async function editUnitBox5() {
    setUnitBox5Disabled(false);
    setCollapseEditUnitBox5(false);
    setCollapseSaveUnitBox5(true);
    setUnitBox5Edit("");
  }
  async function editUnitBox6() {
    setUnitBox1Disabled(false);
    setCollapseEditUnitBox6(false);
    setCollapseSaveUnitBox6(true);
    setUnitBox6Edit("");
  }
  async function editUnitBox7() {
    setUnitBox7Disabled(false);
    setCollapseEditUnitBox7(false);
    setCollapseSaveUnitBox7(true);
    setUnitBox7Edit("");
  }
  async function editUnitBox8() {
    setUnitBox8Disabled(false);
    setCollapseEditUnitBox8(false);
    setCollapseSaveUnitBox8(true);
    setUnitBox8Edit("");
  }
  async function editUnitBox9() {
    setUnitBox9Disabled(false);
    setCollapseEditUnitBox9(false);
    setCollapseSaveUnitBox9(true);
    setUnitBox9Edit("");
  }
  async function editUnitBox10() {
    setUnitBox10Disabled(false);
    setCollapseEditUnitBox10(false);
    setCollapseSaveUnitBox10(true);
    setUnitBox10Edit("");
  }
  // --------------------------------------

  // -------- Save Unit Box Button Function --------
  // const tempArrEdit = [];
  async function saveUnitBox1() {
    setUnitBox1Disabled(true);
    setCollapseEditUnitBox1(true);
    setCollapseSaveUnitBox1(false);
    // if (unitBox1Edit === "") {
    //   setProductEdit(listScanningPackaging[0].scan_ubid);
    //   setUnitBox1(listScanningPackaging[0].scan_ubid);
    //   // tempArrEdit.push(unitBox1Edit);
    //   tempArrEdit.push(unitBox1Edit);
    // }
    // setUnitBox1Edit(listScanningPackaging[0].scan_ubid);
    console.log("productEdit", productEdit);
    console.log("saveButton", collapseSaveUnitBox1);
    console.log("unitBox1Edit(click save)", unitBox1Edit);
    // if (unitBox1Edit !== "") {
    //   tempArrEdit.push(unitBox1Edit);
    // }
    // if (unitBox1Edit === "") {
    //   setUnitBox1Edit(product[0]);
    //   tempArrEdit.push(product[0]);
    // }
    // setProductEdit(tempArrEdit);
  }
  async function saveUnitBox2() {
    setUnitBox2Disabled(true);
    setCollapseEditUnitBox2(true);
    setCollapseSaveUnitBox2(false);
    console.log("productEdit", productEdit);
    console.log("saveButton", collapseSaveUnitBox1);
    console.log("unitBox1Edit(click save)", unitBox1Edit);
    // if (unitBox2Edit !== "") {
    //   tempArrEdit.push(unitBox2Edit);
    // }
    // if (unitBox2Edit === "") {
    //   setUnitBox2Edit(product[1]);
    //   tempArrEdit.push(product[1]);
    // }
    // setProductEdit(tempArrEdit);
  }
  async function saveUnitBox3() {
    setUnitBox3Disabled(true);
    setCollapseEditUnitBox3(true);
    setCollapseSaveUnitBox3(false);
    console.log("productEdit", productEdit);
    console.log("saveButton", collapseSaveUnitBox1);
    console.log("unitBox1Edit(click save)", unitBox1Edit);
    // if (unitBox3Edit !== "") {
    //   tempArrEdit.push(unitBox3Edit);
    // }
    // if (unitBox3Edit === "") {
    //   setUnitBox3Edit(product[2]);
    //   tempArrEdit.push(product[2]);
    // }
    // setProductEdit(tempArrEdit);
  }
  async function saveUnitBox4() {
    setUnitBox4Disabled(true);
    setCollapseEditUnitBox4(true);
    setCollapseSaveUnitBox4(false);
    console.log("productEdit", productEdit);
    console.log("saveButton", collapseSaveUnitBox1);
    console.log("unitBox1Edit(click save)", unitBox1Edit);
    // if (unitBox4Edit !== "") {
    //   tempArrEdit.push(unitBox4Edit);
    // }
    // if (unitBox4Edit === "") {
    //   setUnitBox4Edit(product[3]);
    //   tempArrEdit.push(product[3]);
    // }
    // setProductEdit(tempArrEdit);
  }
  async function saveUnitBox5() {
    setUnitBox5Disabled(true);
    setCollapseEditUnitBox5(true);
    setCollapseSaveUnitBox5(false);
    console.log("productEdit", productEdit);
    console.log("saveButton", collapseSaveUnitBox1);
    console.log("unitBox1Edit(click save)", unitBox1Edit);
    // if (unitBox5Edit !== "") {
    //   tempArrEdit.push(unitBox5Edit);
    // }
    // if (unitBox5Edit === "") {
    //   setUnitBox5Edit(product[4]);
    //   tempArrEdit.push(product[4]);
    // }
    // setProductEdit(tempArrEdit);
  }
  async function saveUnitBox6() {
    setUnitBox6Disabled(true);
    setCollapseEditUnitBox6(true);
    setCollapseSaveUnitBox6(false);
    // if (unitBox6Edit !== "") {
    //   tempArrEdit.push(unitBox6Edit);
    // }
    // if (unitBox6Edit === "") {
    //   setUnitBox6Edit(product[5]);
    //   tempArrEdit.push(product[5]);
    // }
    // setProductEdit(tempArrEdit);
  }
  async function saveUnitBox7() {
    setUnitBox7Disabled(true);
    setCollapseEditUnitBox7(true);
    setCollapseSaveUnitBox7(false);
    // if (unitBox7Edit !== "") {
    //   tempArrEdit.push(unitBox7Edit);
    // }
    // if (unitBox7Edit === "") {
    //   setUnitBox7Edit(product[6]);
    //   tempArrEdit.push(product[6]);
    // }
    // setProductEdit(tempArrEdit);
  }
  async function saveUnitBox8() {
    setUnitBox8Disabled(true);
    setCollapseEditUnitBox8(true);
    setCollapseSaveUnitBox8(false);
    // if (unitBox8Edit !== "") {
    //   tempArrEdit.push(unitBox8Edit);
    // }
    // if (unitBox8Edit === "") {
    //   setUnitBox8Edit(product[7]);
    //   tempArrEdit.push(product[7]);
    // }
    // setProductEdit(tempArrEdit);
  }
  async function saveUnitBox9() {
    setUnitBox9Disabled(true);
    setCollapseEditUnitBox9(true);
    setCollapseSaveUnitBox9(false);
    // if (unitBox9Edit !== "") {
    //   tempArrEdit.push(unitBox9Edit);
    // }
    // if (unitBox9Edit === "") {
    //   setUnitBox9Edit(product[8]);
    //   tempArrEdit.push(product[8]);
    // }
    // setProductEdit(tempArrEdit);
  }
  async function saveUnitBox10() {
    setUnitBox10Disabled(true);
    setCollapseEditUnitBox10(true);
    setCollapseSaveUnitBox10(false);
    // if (unitBox10Edit !== "") {
    //   tempArrEdit.push(unitBox10Edit);
    // }
    // if (unitBox10Edit === "") {
    //   setUnitBox10Edit(product[9]);
    //   tempArrEdit.push(product[9]);
    // }
    // setProductEdit(tempArrEdit);
  }
  // --------------------------------------------------

  async function packingFinish() {
    setModalPackingSelesai(true);
  }

  async function packingFinishModal() {
    setModalPackingSelesai2(false);
    setModalPackingSelesai(false);
    setFlag("Y");
    setModalStartScanNewBatch(false);
  }

  async function finishScanningPackaging() {
    if (detailBool !== true) {
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
        setModalScanningPackagingNotFullFinish(true);
        // setFlag("D");
      }
      if (masterCodeBox === "") {
        setModalValidationSaveAndFinish(true);
      }
      if (unitBox10 !== 0 && unitBox10 !== "") {
        // if (masterCodeBox !== "") {
        setFlag("D");
        console.log("product", product);
        saveAndContinueFinish();
      }
      // if (detailBool === true) {

      // }
    }

    if (detailBool === true) {
      setFlag("D");
      mountUpdateUBID();
      setDetailBool(false);
      setProduct([]);
      // setProductEdit([]);
      setCollapseSaveUnitBox1(true);
      setCollapseSaveUnitBox2(true);
      setCollapseSaveUnitBox3(true);
      setCollapseSaveUnitBox4(true);
      setCollapseSaveUnitBox5(true);
      setCollapseSaveUnitBox6(true);
      setCollapseSaveUnitBox7(true);
      setCollapseSaveUnitBox8(true);
      setCollapseSaveUnitBox9(true);
      setCollapseSaveUnitBox10(true);
    }
  }

  // const listMasterBox = [
  //   {
  //     scan_mbid: "MBCODE001",
  //     scan_ubid: "10",
  //   },
  //   {
  //     scan_mbid: "MBCODE002",
  //     scan_ubid: "10",
  //   },
  //   {
  //     scan_mbid: "MBCODE003",
  //     scan_ubid: "10",
  //   },
  //   {
  //     scan_mbid: "MBCODE004",
  //     scan_ubid: "10",
  //   },
  //   {
  //     scan_mbid: "MBCODE005",
  //     scan_ubid: "10",
  //   },
  // ];

  // const handleKeyDownUnitBox1 = (event) => {
  //   if (event.key === "Enter") {
  //     unitBox1Ref.focus();
  //   }
  // };

  const debounceMountGetScanningPackagingData = useCallback(
    debounce(mountGetScanningPackagingData, 400)
  );

  const [MBBox, setMBBox] = useState("");
  const [unitBox1Edit, setUnitBox1Edit] = useState("");
  const [unitBox2Edit, setUnitBox2Edit] = useState("");
  const [unitBox3Edit, setUnitBox3Edit] = useState("");
  const [unitBox4Edit, setUnitBox4Edit] = useState("");
  const [unitBox5Edit, setUnitBox5Edit] = useState("");
  const [unitBox6Edit, setUnitBox6Edit] = useState("");
  const [unitBox7Edit, setUnitBox7Edit] = useState("");
  const [unitBox8Edit, setUnitBox8Edit] = useState("");
  const [unitBox9Edit, setUnitBox9Edit] = useState("");
  const [unitBox10Edit, setUnitBox10Edit] = useState("");
  const scanData = [];
  const [mbSizeDetail, setMbsizeDetail] = useState([]);

  async function mountGetScanningPackagingData(scanid, mbid) {
    try {
      const getScanningPackaging = await qr.getScanningPackagingData(
        scanid,
        mbid
      );
      const { data } = getScanningPackaging.data;
      setListScanningPackaging(data);
      setMasterCodeBox(data[0].scan_mbid);
      setUnitBox1(data[0].scan_ubid !== "" ? data[0].scan_ubid : "-");
      setUnitBox2(data[1].scan_ubid !== "" ? data[1].scan_ubid : "-");
      setUnitBox3(data[2].scan_ubid !== "" ? data[2].scan_ubid : "-");
      setUnitBox4(data[3].scan_ubid !== "" ? data[3].scan_ubid : "-");
      setUnitBox5(data[4].scan_ubid !== "" ? data[4].scan_ubid : "-");
      setUnitBox6(data[5].scan_ubid !== "" ? data[5].scan_ubid : "-");
      setUnitBox7(data[6].scan_ubid !== "" ? data[6].scan_ubid : "-");
      setUnitBox8(data[7].scan_ubid !== "" ? data[7].scan_ubid : "-");
      setUnitBox9(data[8].scan_ubid !== "" ? data[8].scan_ubid : "-");
      setUnitBox10(data[9].scan_ubid !== "" ? data[9].scan_ubid : "-");
      // if (data !== null) {
      //   setListScanningPackaging(data);
      //   scanData = data;
      //   console.log("dataScanningPackaging", data);
      //   console.log("scandata", scanData);
      //   setMBBox(scanData[0].scan_mbid);
      //   setUnitBox1Edit(scanData[0].scan_ubid);
      //   if (scanData[0].scan_ubid !== "" && scanData[0].scan_ubid !== 0) {
      //     setCollapseEditUnitBox1(true);
      //   }
      //   setUnitBox2Edit(scanData[1].scan_ubid);
      //   if (scanData[1].scan_ubid !== "" && scanData[1].scan_ubid !== 0) {
      //     setCollapseEditUnitBox2(true);
      //   }
      //   setUnitBox3Edit(scanData[2].scan_ubid);
      //   if (scanData[2].scan_ubid !== "" && scanData[2].scan_ubid !== 0) {
      //     setCollapseEditUnitBox3(true);
      //   }
      //   setUnitBox4Edit(scanData[3].scan_ubid);
      //   if (scanData[3].scan_ubid !== "" && scanData[3].scan_ubid !== 0) {
      //     setCollapseEditUnitBox4(true);
      //   }
      //   setUnitBox5Edit(scanData[4].scan_ubid);
      //   if (scanData[4].scan_ubid !== "" && scanData[4].scan_ubid !== 0) {
      //     setCollapseEditUnitBox5(true);
      //   }
      //   setUnitBox6Edit(scanData[5].scan_ubid);
      //   if (scanData[5].scan_ubid !== "" && scanData[5].scan_ubid !== 0) {
      //     setCollapseEditUnitBox6(true);
      //   }
      //   setUnitBox7Edit(scanData[6].scan_ubid);
      //   if (scanData[6].scan_ubid !== "" && scanData[6].scan_ubid !== 0) {
      //     setCollapseEditUnitBox7(true);
      //   }
      //   setUnitBox8Edit(scanData[7].scan_ubid);
      //   if (scanData[7].scan_ubid !== "" && scanData[7].scan_ubid !== 0) {
      //     setCollapseEditUnitBox8(true);
      //   }
      //   setUnitBox9Edit(scanData[8].scan_ubid);
      //   if (scanData[8].scan_ubid !== "" && scanData[8].scan_ubid !== 0) {
      //     setCollapseEditUnitBox9(true);
      //   }
      //   setUnitBox10Edit(scanData[9].scan_ubid);
      //   if (scanData[9].scan_ubid !== "" && scanData[9].scan_ubid !== 0) {
      //     setCollapseEditUnitBox10(true);
      //   }
      // }

      // if (data !== null) {
      //   setListScanningPackaging(data);
      //   scanData = data;
      //   console.log("dataScanningPackaging", data);
      //   console.log("scandata", scanData);
      //   setMBBox(scanData[0].scan_mbid);
      //   setUnitBox1Edit(scanData[0].scan_ubid);
      //   if (scanData[0].scan_ubid !== "" || scanData[0].scan_ubid !== 0) {
      //     setCollapseEditUnitBox1(true);
      //     // setUnitBox1Edit(scanData[0].scan_ubid);
      //   }
      //   setUnitBox2Edit(scanData[1].scan_ubid);
      //   if (scanData[1].scan_ubid !== "" || scanData[1].scan_ubid !== 0) {
      //     setCollapseEditUnitBox2(true);
      //     // setUnitBox2Edit(scanData[1].scan_ubid);
      //   }
      //   setUnitBox3Edit(scanData[2].scan_ubid);
      //   if (scanData[2].scan_ubid !== "" || scanData[2].scan_ubid !== 0) {
      //     setCollapseEditUnitBox3(true);
      //     // setUnitBox3Edit(scanData[2].scan_ubid);
      //   }
      //   setUnitBox4Edit(scanData[3].scan_ubid);
      //   if (scanData[3].scan_ubid !== "" || scanData[3].scan_ubid !== 0) {
      //     setCollapseEditUnitBox4(true);
      //     // setUnitBox4Edit(scanData[3].scan_ubid);
      //   }
      //   setUnitBox5Edit(scanData[4].scan_ubid);
      //   if (scanData[4].scan_ubid !== "" || scanData[4].scan_ubid !== 0) {
      //     setCollapseEditUnitBox5(true);
      //     // setUnitBox5Edit(scanData[4].scan_ubid);
      //   }
      //   setUnitBox6Edit(scanData[5].scan_ubid);
      //   if (scanData[5].scan_ubid !== "" || scanData[5].scan_ubid !== 0) {
      //     setCollapseEditUnitBox6(true);
      //     // setUnitBox6Edit(scanData[5].scan_ubid);
      //   }
      //   setUnitBox7Edit(scanData[6].scan_ubid);
      //   if (scanData[6].scan_ubid !== "" || scanData[6].scan_ubid !== 0) {
      //     setCollapseEditUnitBox7(true);
      //     // setUnitBox7Edit(scanData[6].scan_ubid);
      //   }
      //   setUnitBox8Edit(scanData[7].scan_ubid);
      //   if (scanData[7].scan_ubid !== "" || scanData[7].scan_ubid !== 0) {
      //     setCollapseEditUnitBox8(true);
      //     // setUnitBox8Edit(scanData[7].scan_ubid);
      //   }
      //   setUnitBox9Edit(scanData[8].scan_ubid);
      //   if (scanData[8].scan_ubid !== "" || scanData[8].scan_ubid !== 0) {
      //     setCollapseEditUnitBox9(true);
      //     // setUnitBox9Edit(scanData[8].scan_ubid);
      //   }
      //   setUnitBox10Edit(scanData[9].scan_ubid);
      //   if (scanData[9].scan_ubid !== "" || scanData[9].scan_ubid !== 0) {
      //     setCollapseEditUnitBox10(true);
      //     // setUnitBox10Edit(scanData[9].scan_ubid);
      //   }
      // }
    } catch (error) {
      console.log(error);
    }

    // console.log(
    //   "listScanningPackagingFunc2",
    //   listScanningPackaging && listScanningPackaging
    // );
  }

  useEffect(() => {
    console.log("scanningPackaging", listScanningPackaging);
  }, [listScanningPackaging]);

  // const debounceMountGetListMasterBox = useCallback(
  //   debounce(mountGetListMasterBox, 400)
  // );

  // async function mountGetListMasterBox(scanid) {
  //   try {
  //     const getListMasterBox = await qr.getListMasterBox(scanid);
  //     const { data } = getListMasterBox.data;
  //     setListMasterBox(data);
  //     console.log("dataMasterBox", data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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

  const debounceMountCreateHeaderNewBatch = useCallback(
    debounce(mountCreateHeaderNewBatch, 400)
  );

  async function mountCreateHeaderNewBatch() {
    try {
      var payload = {
        data: {
          scan_procode: payloadHeader.pro_code,
          scan_proname: payloadHeader.pro_name,
          scan_batch: selectBatchNumber,
          scan_proddate: formatDate(selectedProdDate, "YYMMDD"),
          scan_expdate: formatDate(selectedExpDate, "YYMMDD"),
        },
      };

      try {
        console.log("payload", payload);
        const createHeaderNewBatch = await qr.createHeaderNewBatch(payload);
        const { data } = createHeaderNewBatch.data;
        console.log("data", data);
        setListHeader(data);
        console.log("datascanid", data.scan_id);
        debounceMountGetListMasterBox(data.scan_id);
      } catch (error) {
        console.log(error);
      }

      console.log("pro_code", payloadHeader.pro_code);
      console.log("pro_name", payloadHeader.pro_name);
      console.log("selectBatchNumber", selectBatchNumber);
      // setModalAdd(false);
      // setModalAddSave(false);
      // debounceMountListExpired(pilihOption);
    } catch (error) {
      console.log(error);
    }
  }
  const [product, setProduct] = useState([]);
  const [productEdit, setProductEdit] = useState([]);

  useEffect(() => {
    // if (detailBool !== true) {
    if (detailBool !== true) {
      const tempArr = [];
      if (unitBox1 !== "") {
        tempArr.push(unitBox1);
      }
      if (unitBox2 !== "") {
        tempArr.push(unitBox2);
      }
      if (unitBox3 !== "") {
        tempArr.push(unitBox3);
      }
      if (unitBox4 !== "") {
        tempArr.push(unitBox4);
      }
      if (unitBox5 !== "") {
        tempArr.push(unitBox5);
      }
      if (unitBox6 !== "") {
        tempArr.push(unitBox6);
      }
      if (unitBox7 !== "") {
        tempArr.push(unitBox7);
      }
      if (unitBox8 !== "") {
        tempArr.push(unitBox8);
      }
      if (unitBox9 !== "") {
        tempArr.push(unitBox9);
      }
      if (unitBox10 !== "") {
        tempArr.push(unitBox10);
      }
      console.log("tempArr", tempArr);
      if (detailBool !== true && flag === "P") {
        setProduct(tempArr);
      }
    }

    if (detailBool === true) {
      const tempArrEdit = [];

      if (unitBox1Edit !== "") {
        setDisableUnitBox1(false);
        tempArrEdit.push(unitBox1Edit);
      }
      if (unitBox2Edit !== "" || unitBox2Edit !== 0) {
        setDisableUnitBox2(false);
        tempArrEdit.push(unitBox2Edit);
      }
      if (unitBox3Edit !== "") {
        setDisableUnitBox3(false);
        tempArrEdit.push(unitBox3Edit);
      }
      // tempArrEdit.push(product[2]);
      if (unitBox4Edit !== "") {
        setDisableUnitBox4(false);
        tempArrEdit.push(unitBox4Edit);
      }
      if (unitBox5Edit !== "") {
        setDisableUnitBox5(false);
        tempArrEdit.push(unitBox5Edit);
      }
      if (unitBox6Edit !== "") {
        setDisableUnitBox6(false);
        tempArrEdit.push(unitBox6Edit);
      }
      if (unitBox7Edit !== "") {
        setDisableUnitBox7(false);
        tempArrEdit.push(unitBox7Edit);
      }
      if (unitBox8Edit !== "") {
        setDisableUnitBox8(false);
        tempArrEdit.push(unitBox8Edit);
      }
      if (unitBox9Edit !== "") {
        setDisableUnitBox9(false);
        tempArrEdit.push(unitBox9Edit);
      }
      if (unitBox10Edit !== "") {
        setDisableUnitBox10(false);
        tempArrEdit.push(unitBox10Edit);
      }
      setProductEdit(tempArrEdit);

      if (unitBox1Edit === "") {
        setDisableUnitBox1(true);
      }
      if (unitBox2Edit === "") {
        setDisableUnitBox2(true);
      }
      if (unitBox3Edit === "") {
        setDisableUnitBox3(true);
      }
      if (unitBox4Edit === "") {
        setDisableUnitBox4(true);
      }
      if (unitBox5Edit === "") {
        setDisableUnitBox5(true);
      }
      if (unitBox6Edit === "") {
        setDisableUnitBox6(true);
      }
      if (unitBox7Edit === "") {
        setDisableUnitBox7(true);
      }
      if (unitBox8Edit === "") {
        setDisableUnitBox8(true);
      }
      if (unitBox9Edit === "") {
        setDisableUnitBox9(true);
      }
      if (unitBox10Edit === "") {
        setDisableUnitBox10(true);
      }
    }
  }, [
    unitBox1,
    unitBox2,
    unitBox3,
    unitBox4,
    unitBox5,
    unitBox6,
    unitBox7,
    unitBox8,
    unitBox9,
    unitBox10,

    unitBox1Edit,
    unitBox2Edit,
    unitBox3Edit,
    unitBox4Edit,
    unitBox5Edit,
    unitBox6Edit,
    unitBox7Edit,
    unitBox8Edit,
    unitBox9Edit,
    unitBox10Edit,

    disableUnitBox1,
    disableUnitBox2,
    disableUnitBox3,
    disableUnitBox4,
    disableUnitBox5,
    disableUnitBox6,
    disableUnitBox7,
    disableUnitBox8,
    disableUnitBox9,
    disableUnitBox10,
    // detailBool,
    // product,
    // productEdit,
  ]);

  useEffect(() => {
    console.log("product", product);
    console.log("productEdit", productEdit);
  }, [
    unitBox1,
    unitBox2,
    unitBox3,
    unitBox4,
    unitBox5,
    unitBox6,
    unitBox7,
    unitBox8,
    unitBox9,
    unitBox10,

    unitBox1Edit,
    unitBox2Edit,
    unitBox3Edit,
    unitBox4Edit,
    unitBox5Edit,
    unitBox6Edit,
    unitBox7Edit,
    unitBox8Edit,
    unitBox9Edit,
    unitBox10Edit,
  ]);

  // useEffect(() => {
  //   if (!router.isReady) return;
  //   if (router.query.id !== "undefined") {
  //     var props = router.query;
  //     setNoID(props.id);
  //   } else {
  //     router.push({
  //       pathname: "/approval",
  //     });
  //   }
  // }, [router.isReady]);

  async function mountCreateDetailNewBatch() {
    try {
      var k;
      var y;
      y = 0;
      // for (k = 1; k <= 10; k++) {
      if (unitBox1 !== "") {
        y = y + 1;
      }
      if (unitBox2 !== "") {
        y = y + 1;
      }
      if (unitBox3 !== "") {
        y = y + 1;
      }
      if (unitBox4 !== "") {
        y = y + 1;
      }
      if (unitBox5 !== "") {
        y = y + 1;
      }
      if (unitBox6 !== "") {
        y = y + 1;
      }
      if (unitBox7 !== "") {
        y = y + 1;
      }
      if (unitBox8 !== "") {
        y = y + 1;
      }
      if (unitBox9 !== "") {
        y = y + 1;
      }
      if (unitBox10 !== "") {
        y = y + 1;
      }
      // }
      console.log("y", y);
      var x;
      var j;
      j = 10 - y;
      var k;
      k = 1;
      console.log("j", j);
      for (x = 1; x <= listHeader.scan_mbsize - j; x++) {
        var test;
        test = listHeader.scan_id;
        // var payload = {
        //   data: {
        //     scan_id: test,
        //     scan_mbid: masterCodeBox,
        //     scan_ubid:
        //       // unitBox1,
        //       x === 1
        //         ? unitBox1
        //         : x === 2
        //         ? unitBox2
        //         : x === 3
        //         ? unitBox3
        //         : x === 4
        //         ? unitBox4
        //         : x === 5
        //         ? unitBox5
        //         : x === 6
        //         ? unitBox6
        //         : x === 7
        //         ? unitBox7
        //         : x === 8
        //         ? unitBox8
        //         : x === 9
        //         ? unitBox9
        //         : unitBox10,
        //     scan_sampleyn: "Y",

        //     // scan_id: listHeader[0].scan_id,
        //     // scan_mbid:
        //   },
        // };

        var payload = {
          data: {
            scan_id: test,
            scan_mbid: masterCodeBox,
            scan_uburut:
              x === 1
                ? k
                : x === 2
                ? k
                : x === 3
                ? k
                : x === 4
                ? k
                : x === 5
                ? k
                : x === 6
                ? k
                : x === 7
                ? k
                : x === 8
                ? k
                : x === 9
                ? k
                : k,
            scan_ubid:
              // unitBox1,
              x === 1
                ? product[0]
                : x === 2
                ? product[1]
                : x === 3
                ? product[2]
                : x === 4
                ? product[3]
                : x === 5
                ? product[4]
                : x === 6
                ? product[5]
                : x === 7
                ? product[6]
                : x === 8
                ? product[7]
                : x === 9
                ? product[8]
                : product[9],
            scan_sampleyn: "Y",

            // scan_id: listHeader[0].scan_id,
            // scan_mbid:
          },
        };
        k = k + 1;

        // }

        console.log("payload", payload);
        const createDetailNewBatch = await qr.createDetailNewBatch(payload);
        const { data } = createDetailNewBatch.data;
        console.log("data", data);
        // setListHeader(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function mountUpdateUBID() {
    try {
      // var k;
      var y;
      y = 0;
      // for (k = 1; k <= 10; k++) {
      if (unitBox1Edit !== "") {
        y = y + 1;
      }
      if (unitBox2Edit !== "") {
        y = y + 1;
      }
      if (unitBox3Edit !== "") {
        y = y + 1;
      }
      if (unitBox4Edit !== "") {
        y = y + 1;
      }
      if (unitBox5Edit !== "") {
        y = y + 1;
      }
      if (unitBox6Edit !== "") {
        y = y + 1;
      }
      if (unitBox7Edit !== "") {
        y = y + 1;
      }
      if (unitBox8Edit !== "") {
        y = y + 1;
      }
      if (unitBox9Edit !== "") {
        y = y + 1;
      }
      if (unitBox10Edit !== "") {
        y = y + 1;
      }
      // }
      console.log("y", y);
      var x;
      var j;
      j = 10 - y;
      // var k;
      // k = 1;
      console.log("j", j);
      // for (x = 1; x <= listHeader.scan_mbsize - j; x++) {
      for (x = 1; x <= mbSizeDetail.cnt; x++) {
        var test;
        test = listHeader.scan_id;
        var payload = {
          data: {
            scan_id: test,
            scan_mbid: listScanningPackaging[0].scan_mbid,
            scan_uburut:
              x === 1
                ? 1
                : x === 2
                ? 2
                : x === 3
                ? 3
                : x === 4
                ? 4
                : x === 5
                ? 5
                : x === 6
                ? 6
                : x === 7
                ? 7
                : x === 8
                ? 8
                : x === 9
                ? 9
                : 10,
            scan_ubid:
              // unitBox1,
              x === 1
                ? productEdit[0]
                : x === 2
                ? productEdit[1]
                : x === 3
                ? productEdit[2]
                : x === 4
                ? productEdit[3]
                : x === 5
                ? productEdit[4]
                : x === 6
                ? productEdit[5]
                : x === 7
                ? productEdit[6]
                : x === 8
                ? productEdit[7]
                : x === 9
                ? productEdit[8]
                : productEdit[9],
            scan_sampleyn: "Y",

            // scan_id: listHeader[0].scan_id,
            // scan_mbid:
          },
        };
        // k = k + 1;

        // }

        console.log("payloadUpdate", payload);
        const updateUBID = await qr.updateDetailUBID(payload);
        const { data } = updateUBID.data;
        console.log("data", data);
        // setListHeader(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function savePayloadHeader(e) {
    setSelectProduct(e.target.value);
    setPayloadHeader(item);
  }

  async function checkSample() {
    console.log("checkSample", checkedSample);
    setCheckedSample(true);
  }

  const debounceMountGetSeeMBList = useCallback(
    debounce(mountGetSeeMBList, 400)
  );

  async function mountGetSeeMBList() {
    try {
      const mountGetSeeMBList = await qr.getSeeMBList(listHeader.scan_id);
      const { data } = mountGetSeeMBList.data;
      setListSeeMB(data);
      setModalSeeMbList(true);
      console.log("listScanningPackagingSeeMBList", listScanningPackaging);
    } catch (error) {
      console.log(error);
    }
  }

  async function testLog() {
    console.log("seeMBList", listSeeMB);
    setModalSeeMbList(false);
  }

  // async function detailScanningPackaging(item) {
  //   setFlag("P");
  //   // setDetailBool(true);
  //   // debounceMountGetScanningPackagingData(listHeader.scan_id, item.scan_mbid);
  //   // setMbsizeDetail(item);
  //   // console.log("scanid", listHeader.scan_id);
  //   // console.log("itemMBID", item);
  //   // console.log("listScanningPackaging", listScanningPackaging);
  //   // console.log("product", product);
  //   // console.log("productEdit", productEdit);
  //   // setCollapseSaveUnitBox1(false);
  //   // setCollapseSaveUnitBox2(false);
  //   // setCollapseSaveUnitBox3(false);
  //   // setCollapseSaveUnitBox4(false);
  //   // setCollapseSaveUnitBox5(false);
  //   // setCollapseSaveUnitBox6(false);
  //   // setCollapseSaveUnitBox7(false);
  //   // setCollapseSaveUnitBox8(false);
  //   // setCollapseSaveUnitBox9(false);
  //   // setCollapseSaveUnitBox10(false);
  // }

  async function finishPackaging() {
    try {
      const mountUpdateUBID = await qr.updatePackingSelesai(listHeader.scan_id);
      const { data } = mountUpdateUBID.data;
      setModalPackingSelesai2(true);
      // console.log("listScanningPackagingSeeMBList", listScanningPackaging);
    } catch (error) {
      console.log(error);
    }
  }

  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id !== "undefined") {
      var props = router.query;
      setNoID(props.id);
    } else {
      router.push({
        pathname: "/approval",
      });
    }
    // debounceMountGetHeader(noID);
    // console.log("listHeader", listHeader);
  }, [router.isReady]);

  async function mountGetHeader() {
    try {
      const mountGetHeader = await qr.getHeader(noID);
      const { data } = mountGetHeader.data;
      setListHeader(data);
      console.log("noID", noID);
      // setListSeeMB(data);
      // setModalSeeMbList(true);
      console.log("listScanningPackagingSeeMBList", listScanningPackaging);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetHeader = useCallback(debounce(mountGetHeader, 400));

  useEffect(() => {
    if (flag === "D" && noID !== "") {
      debounceMountGetHeader();
      debounceMountGetListMasterBox(noID);
      console.log("listHeader", listHeader);
    }
  }, [noID]);

  const debounceMountGetListMasterBox = useCallback(
    debounce(mountGetListMasterBox, 400)
  );

  async function mountGetListMasterBox(scanid) {
    try {
      const getListMasterBox = await qr.getListMasterBox(scanid);
      const { data } = getListMasterBox.data;
      setListMasterBox(data);
      console.log("dataMasterBox", data);
    } catch (error) {
      console.log(error);
    }
  }

  async function detailScanningPackaging(item) {
    setFlag("P");
    // setDetailBool(true);
    debounceMountGetScanningPackagingData(noID, item.scan_mbid);
    // setMbsizeDetail(item);
    // console.log("scanid", listHeader.scan_id);
    // console.log("itemMBID", item);
    // console.log("listScanningPackaging", listScanningPackaging);
    // console.log("product", product);
    // console.log("productEdit", productEdit);
    // setCollapseSaveUnitBox1(false);
    // setCollapseSaveUnitBox2(false);
    // setCollapseSaveUnitBox3(false);
    // setCollapseSaveUnitBox4(false);
    // setCollapseSaveUnitBox5(false);
    // setCollapseSaveUnitBox6(false);
    // setCollapseSaveUnitBox7(false);
    // setCollapseSaveUnitBox8(false);
    // setCollapseSaveUnitBox9(false);
    // setCollapseSaveUnitBox10(false);
  }

  async function backDetail() {
    setFlag("D");
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
  }

  // useEffect(()=>)

  return (
    <>
      {
        //   flag === "Y" ? (
        //     <Box sx={{ width: "100%", textAlign: "center" }}>
        //       <Grid
        //         container
        //         justifyContent={"space-between"}
        //         sx={{ margin: "1%" }}
        //       >
        //         <Grid container item xs={10}>
        //           <Typography
        //             variant="h5"
        //             sx={{ fontWeight: 600, mt: 0.5, textAlign: "left", ml: 2 }}
        //           >
        //             SCAN NEW BATCH
        //           </Typography>
        //         </Grid>
        //       </Grid>

        //       <Grid
        //         container
        //         spacing={0}
        //         direction="column"
        //         alignItems="center"
        //         justifyContent="center"
        //         style={{ minHeight: "85vh", textAlign: "center" }}
        //       >
        //         <Paper>
        //           <Grid sx={{ ml: 2, mr: 2 }}>
        //             {/* <Paper sx={{ marginRight: "35px", marginLeft: "35px" }}> */}
        //             <Grid
        //             // sx={{ margin: "1%" }}
        //             >
        //               <FormControl
        //                 sx={{ backgroundColor: "white", width: "50vh", mt: 3 }}
        //               >
        //                 <InputLabel>Select Product</InputLabel>
        //                 <Select
        //                   variant="outlined"
        //                   size="small"
        //                   label="Select Product"
        //                   // value={selectProduct}
        //                   onChange={(e) => setSelectProduct(e.target.value)}
        //                 >
        //                   {listProduct &&
        //                     listProduct.map((item) => (
        //                       <MenuItem
        //                         onClick={() => setPayloadHeader(item)}
        //                         key={item}
        //                         value={item}
        //                       >
        //                         {/* {item.comco} -  */}
        //                         {item.pro_name}
        //                       </MenuItem>
        //                     ))}
        //                 </Select>
        //               </FormControl>
        //             </Grid>
        //             <Grid
        //               // sx={{ margin: "1%" }}
        //               sx={{ mt: 1 }}
        //             >
        //               <FormControl
        //                 sx={{
        //                   backgroundColor: "white",
        //                   width: "50vh",
        //                   marginTop: 1,
        //                 }}
        //               >
        //                 <TextField
        //                   size="small"
        //                   variant="outlined"
        //                   placeholder={"Input Batch Number"}
        //                   onChange={(e) => setSelectBatchNumber(e.target.value)}
        //                 ></TextField>
        //               </FormControl>
        //             </Grid>
        //             <Grid sx={{ mt: 2 }}>
        //               <DesktopDatePicker
        //                 label="Production Date"
        //                 value={selectedProdDate}
        //                 onChange={(newValue) => setSelectedProdDate(newValue)}
        //                 renderInput={(params) => (
        //                   <TextField
        //                     size="small"
        //                     {...params}
        //                     sx={{ background: "white", width: "100%" }}
        //                   />
        //                 )}
        //               />
        //             </Grid>
        //             <Grid sx={{ mt: 2 }}>
        //               <DesktopDatePicker
        //                 label="Expired Date"
        //                 value={selectedExpDate}
        //                 onChange={(newValue) => setSelectedExpDate(newValue)}
        //                 renderInput={(params) => (
        //                   <TextField
        //                     size="small"
        //                     {...params}
        //                     sx={{ background: "white", width: "100%" }}
        //                   />
        //                 )}
        //               />
        //             </Grid>
        //             <Grid sx={{ textAlign: "right", marginTop: 2 }}>
        //               <Button
        //                 variant="contained"
        //                 sx={{ marginBottom: 2 }}
        //                 onClick={() => start()}
        //               >
        //                 Start
        //               </Button>
        //             </Grid>
        //             {/* </Grid> */}
        //           </Grid>
        //         </Paper>
        //       </Grid>
        //       <Modal open={modalScanBatch}>
        //         <Box sx={style}>
        //           <Grid>
        //             <Typography sx={{ fontWeight: 600 }}>Watch out!</Typography>
        //             <Typography>
        //               Information of product and batch is still incomplete!
        //             </Typography>
        //             <Button
        //               sx={{
        //                 marginTop: 1,
        //                 float: "right",
        //               }}
        //               variant="outlined"
        //               onClick={() => setModalScanBatch(false)}
        //             >
        //               OK
        //             </Button>
        //           </Grid>
        //         </Box>
        //       </Modal>

        //       <Modal open={modalStartScanNewBatch}>
        //         <Box sx={style}>
        //           <Grid>
        //             <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        //               Hello!
        //             </Typography>
        //             <Typography>
        //               Are you sure to start the scanning process of new batch?
        //             </Typography>
        //             <Divider sx={{ my: 2 }}></Divider>
        //             <Grid>
        //               <Button
        //                 variant="contained"
        //                 sx={{ backgroundColor: "primary.main", marginLeft: "27em" }}
        //                 onClick={() => start2()}
        //               >
        //                 YES
        //               </Button>

        //               <Button
        //                 variant="contained"
        //                 sx={{ backgroundColor: "error.main", marginLeft: "1em" }}
        //                 onClick={() => setModalStartScanNewBatch(false)}
        //               >
        //                 NO
        //               </Button>
        //             </Grid>
        //           </Grid>
        //         </Box>
        //       </Modal>
        //       {/* </Paper> */}
        //     </Box>
        //   ) :
        flag === "D" ? (
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Grid
              container
              justifyContent={"space-between"}
              sx={{ margin: "1%" }}
            >
              <Grid container item xs={10} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  // sx={{ float: "left", ml: 2, backgroundColor: "error.main" }}
                  onClick={() => router.push(`/approval`)}
                >
                  <KeyboardBackspaceIcon />
                </Button>
              </Grid>
              <Grid container item xs={10}>
                {/* <Button
                  variant="contained"
                  // sx={{ float: "left", ml: 2, backgroundColor: "error.main" }}
                  onClick={() => router.push(`/approval`)}
                >
                  <KeyboardBackspaceIcon />
                </Button> */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mt: 0.5,
                    textAlign: "left",
                    ml: 2,
                    mb: 3,
                  }}
                >
                  SCAN NEW BATCH
                </Typography>
              </Grid>
            </Grid>
            {/* ------------------------------------------------------------ */}

            <Grid container sx={{ ml: 6 }}>
              <Grid container>
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
                    Product
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
                    {listHeader.scan_proname}
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
                      ml: 2,
                    }}
                  >
                    Batch Number
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    // variant="h5"
                    sx={{
                      fontWeight: 600,
                      // mt: 3,
                      textAlign: "left",
                      ml: 5,
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
                    {listHeader.scan_batch}
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
                        ml: 2,
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
                      {listHeader.scan_mbsize} {"UB"}
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
                        ml: 15,
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
                        ml: 5.3,
                      }}
                    >
                      {listHeader.scan_nie}
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
                    >
                      {formatDate(listHeader.scan_proddate, "DD MMM YYYY")}
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
                    >
                      {formatDate(listHeader.scan_expdate, "DD MMM YYYY")}
                    </Typography>
                  </Grid>
                </Grid>
              </Collapse>
              <Divider width="93%" objectFit="contain" sx={{ mt: 4 }} />
              <Divider width="93%" objectFit="contain" />
            </Grid>

            {/* ------------------------------------------------------------ */}
            {/* <Paper fullWidth fullHeight> */}
            <Grid sx={{ backgroundColor: "white" }}>
              {/* <Paper
              // width="100%" height="100%" objectFit="contain"
              > */}
              <Collapse in={collapseDetailScanNewBatchButtonUp}>
                <Grid sx={{ textAlign: "right", mr: 3 }}>
                  {/* <Typography>adasfagdsv</Typography> */}
                  <Button
                    // color="error"
                    variant="outlined"
                    onClick={() => hideDetailScanNewBatch()}
                    // fullWidth
                    startIcon={<ArrowDropUpIcon />}
                    sx={{ backgroundColor: "#f0f0f0", textAlign: "center" }}
                    size="small"
                  >
                    {/* Keluar */}
                  </Button>
                </Grid>
              </Collapse>
              <Collapse in={collapseDetailScanNewBatchButtonDown}>
                <Grid sx={{ textAlign: "right", mr: 3 }}>
                  {/* <Typography>adasfagdsv</Typography> */}
                  <Button
                    // color="error"
                    variant="outlined"
                    onClick={() => showDetailScanNewBatch()}
                    // fullWidth
                    startIcon={<ArrowDropDownIcon />}
                    sx={{ backgroundColor: "#f0f0f0", textAlign: "center" }}
                  >
                    {/* Keluar */}
                  </Button>
                </Grid>
              </Collapse>
              {/* </Paper> */}
              {/* </Grid> */}
              <Grid>
                <Typography
                  sx={{ fontWeight: 600, textAlign: "left", ml: 5, mt: 1 }}
                >
                  List Of Master Box
                  <Divider sx={{ width: "95%" }} />
                  <Divider sx={{ width: "95%" }} />
                </Typography>
              </Grid>
              <Table sx={{ ml: 5 }}>
                <TableBody>
                  {/* {listMasterBox &&
                    listMasterBox.map((item, index) => ( */}
                  {listMasterBox &&
                    listMasterBox.map((item, index) => (
                      <TableRow key={item}>
                        <TableCell>
                          {/* <Link
                        href={`/general-ledger/${item.tahun}/${item.bulan}/${item.coa_id}`}
                      > */}
                          {/* {item.scan_mbid} - {item.scan_ubid} {"UB"} */}
                          {item.scan_mbid} - {item.cnt} {"UB"}
                          {/* </Link> */}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            sx={{
                              float: "right",
                              marginBottom: 2,
                              mr: 13,
                              mt: 2,
                              color: "black",
                              backgroundColor: "white",
                              // bo
                            }}
                            // onClick={() => packingFinish()}
                            onClick={() => detailScanningPackaging(item)}
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {/* <Grid
                container
                // sx={{ float: "right", width: "15%" }}
                // sx={{ width: "100%" }}
              >
                <Grid container>
                  <Grid item sx={{ float: "right", width: "100%" }}>
                    <Button
                      // color="error"
                      // variant="outlined"

                      // fullWidth
                      // startIcon={<AddCircle />}
                      // sx={{ backgroundColor: "#f0f0f0" }}
                      // sx={{}}
                      onClick={() => packaging()}
                      sx={{ float: "right", width: "15%" }}
                    >
                      <AddCircle sx={{ fontSize: 35, color: "teal" }} />
                    </Button>
                  </Grid>

                  <Grid item sx={{ float: "right", width: "100%" }}>
                    <Collapse in={collapsePackagingSelesaiButton}>
                      <Button
                        variant="contained"
                        sx={{ float: "right", marginBottom: 2, mr: 13, mt: 2 }}
                        onClick={() => packingFinish()}
                      >
                        Packaging Selesai
                      </Button>
                    </Collapse>
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
            {/* </Paper> */}
            <Modal open={modalPackingSelesai}>
              <Box sx={style}>
                <Grid>
                  <Typography
                    // sx={{ textAlign: "center", fontWeight: "bold" }}
                    variant="h5"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Watch out!
                  </Typography>
                  <Typography
                  // sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    Are you sure to finish packing process?
                  </Typography>
                  <Divider sx={{ my: 2 }}></Divider>
                  <Grid>
                    {/* <Divider sx={{ my: 2 }}></Divider> */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "primary.main",
                        marginLeft: "27em",
                      }}
                      onClick={() => finishPackaging()}
                    >
                      YES
                    </Button>

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "error.main", marginLeft: "1em" }}
                      onClick={() => setModalPackingSelesai(false)}
                    >
                      NO
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
            <Modal open={modalPackingSelesai2}>
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
                    {/* Data QR Batch AAAA-123456-01 successfully saved. */}
                    Data QR Batch {""}
                    {listHeader.scan_batch}
                    {""} successfully saved.
                  </Typography>
                  <Divider sx={{ my: 2 }}></Divider>
                  <Grid>
                    {/* <Divider sx={{ my: 2 }}></Divider> */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "primary.main",
                        marginLeft: "33em",
                      }}
                      onClick={() => packingFinishModal()}
                    >
                      OK
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Box>
        ) : flag === "P" ? (
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Grid
              container
              justifyContent={"space-between"}
              sx={{ margin: "1%", mb: 2 }}
            >
              <Grid container item xs={10} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  // sx={{ float: "left", ml: 2, backgroundColor: "error.main" }}
                  onClick={() => backDetail()}
                >
                  <KeyboardBackspaceIcon />
                </Button>
                {/* <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mt: 0.5, textAlign: "left", ml: 2 }}
                >
                  SCANNING PACKAGING
                </Typography> */}
              </Grid>
              <Grid container item xs={10}>
                {/* <Button
                  variant="contained"
                  // sx={{ float: "left", ml: 2, backgroundColor: "error.main" }}
                  onClick={() => deleteUnitBox1()}
                >
                  
                </Button> */}
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mt: 0.5, textAlign: "left", ml: 2 }}
                >
                  SCANNING PACKAGING
                </Typography>
              </Grid>
            </Grid>

            <Divider
              width="91%"
              objectFit="contain"
              sx={{ mt: 4, float: "center", ml: 8 }}
            />
            <Divider
              width="91%"
              objectFit="contain"
              sx={{ float: "center", ml: 8 }}
            />

            <Grid sx={{ ml: 6, mt: 5 }} container>
              {/* <Paper> */}
              <Grid item flex={1}>
                <Typography
                  // variant="h5"
                  sx={{
                    fontWeight: 600,
                    // mt: 3,
                    textAlign: "left",
                    ml: 2,
                  }}
                >
                  Master Code Box
                </Typography>
              </Grid>
              <Grid item flex={0.2}>
                <Typography
                  // variant="h5"
                  sx={{
                    fontWeight: 600,
                    // mt: 3,
                    textAlign: "left",
                    ml: 2,
                    mt: 1,
                  }}
                >
                  :
                </Typography>
              </Grid>
              <Grid item flex={5}>
                <TextField
                  sx={{ float: "left" }}
                  fullWidth
                  size="small"
                  // onChange={(e) => setMasterCodeBox(e.target.value)}
                  value={masterCodeBox}
                  disabled

                  // onKeyDown={handleKeyDownUnitBox1}
                  // disabled
                ></TextField>
              </Grid>
              <Grid item flex={2}>
                <Button
                  // color="error"
                  variant="outlined"
                  onClick={() => debounceMountGetSeeMBList()}
                  // fullWidth
                  // startIcon={<LogoutIcon />}
                  sx={{ float: "center" }}
                  size="medium"
                >
                  See MB List
                </Button>
              </Grid>
            </Grid>
            <Divider
              width="91%"
              objectFit="contain"
              sx={{ mt: 4, float: "center", ml: 8 }}
            />
            <Divider
              width="91%"
              objectFit="contain"
              sx={{ float: "center", ml: 8 }}
            />
            <Grid sx={{ ml: 8, mt: 2 }} container>
              {listScanningPackaging.map((item, index) => (
                <Grid key={index} sx={{ mt: 2 }} container>
                  <Grid item flex={1}>
                    {/* <Typography>{item.name}</Typography> */}
                    <Typography
                      sx={{
                        fontWeight: 600,
                        // mt: 3,
                        textAlign: "left",
                        ml: 2,
                        mt: 1,
                      }}
                    >
                      Unit Box Code {index + 1}
                    </Typography>
                  </Grid>
                  <Grid item flex={0.2}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        textAlign: "left",
                        ml: 2,
                        mt: 1,
                      }}
                    >
                      :
                    </Typography>
                  </Grid>
                  <Grid item flex={3.5}>
                    <TextField
                      id={`item${index}`}
                      value={item.scan_ubid}
                      // onChange={(e) => testings(e, index)}
                      // inputRef={(el) => (unitBox1Ref = el)}
                      // inputRef={(el) => (unitBox1Ref[`item${index}`] = el)}
                      // disabled={(index) => disableTestBox1[`item${index}`]}
                      // disabled={!disableTestBox1.some(({}))}
                      // disabled
                      // disabled={disableTestBox1}
                      // sx={{ ml: 2 }}
                      sx={{ float: "left", width: "100%" }}
                      size="small"
                      // disabled={index > 0 && inputValue[`item${index - 1}`].trim() === ""}
                      // disabled={
                      //   inputValue[`item${index - 1}`] == "" &&
                      //   masterCodeBox !== ""
                      // }
                      disabled
                    ></TextField>
                  </Grid>
                  <Grid item flex={1.57}></Grid>
                  {/* {changeButton(item, index)} */}
                </Grid>
                // </Grid>
              ))}
            </Grid>

            {/* <Grid sx={{ mt: 2 }}></Grid> */}

            {/* <G */}
            <Modal open={modalScanningPackagingNotFull}>
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
                    Data of unit box code is incomplete. Are you sure to
                    proceed?
                  </Typography>
                  <Divider sx={{ my: 2 }}></Divider>
                  <Grid>
                    {/* <Divider sx={{ my: 2 }}></Divider> */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "primary.main",
                        marginLeft: "27em",
                      }}
                      onClick={() => saveAndContinueFinish()}
                    >
                      YES
                    </Button>

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "error.main", marginLeft: "1em" }}
                      onClick={() => setModalScanningPackagingNotFull(false)}
                    >
                      NO
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>

            <Modal open={modalScanningPackagingNotFullFinish}>
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
                    Data of unit box code is incomplete. Are you sure to
                    proceed?
                  </Typography>
                  <Divider sx={{ my: 2 }}></Divider>
                  <Grid>
                    {/* <Divider sx={{ my: 2 }}></Divider> */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "primary.main",
                        marginLeft: "27em",
                      }}
                      onClick={() => saveAndContinueFinish() && setFlag("D")}
                    >
                      YES
                    </Button>

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "error.main", marginLeft: "1em" }}
                      onClick={() =>
                        setModalScanningPackagingNotFullFinish(false)
                      }
                    >
                      NO
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>

            <Modal open={modalValidationSaveAndFinish}>
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
                    Scan QR on master box ﬁrst!
                  </Typography>
                  <Divider sx={{ my: 2 }}></Divider>
                  <Grid>
                    {/* <Divider sx={{ my: 2 }}></Divider> */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "primary.main",
                        marginLeft: "33em",
                      }}
                      onClick={() => setModalValidationSaveAndFinish(false)}
                    >
                      OK
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>

            <Modal
              open={modalValidatonUnitBox10}
              inputRef={(el) => (unitBox11Ref = el)}
            >
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
                    Error
                  </Typography>
                  <Divider sx={{ my: 2 }}></Divider>
                  <Grid>
                    {/* <Divider sx={{ my: 2 }}></Divider> */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "primary.main",
                        marginLeft: "33em",
                      }}
                      onClick={() => setModalValidatonUnitBox10(false)}
                    >
                      OK
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>

            <Modal open={modalSeeMbList}>
              <Box sx={style}>
                <Grid>
                  <Typography
                    // sx={{ textAlign: "center", fontWeight: "bold" }}
                    variant="h5"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {/* Heads Up! */}
                    Master Box Code ={" "}
                    {listSeeMB.scan_id !== ""
                      ? ("", listSeeMB.scan_mbid)
                      : "Empty"}
                  </Typography>
                  <Typography
                  // sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {/* Error */}
                    This Master Box is{" "}
                    {listSeeMB.scan_sampleyn === "Y"
                      ? "retained sample"
                      : listSeeMB.scan_sampleyn === "N"
                      ? "not retained sample"
                      : "Empty"}
                  </Typography>
                  <Divider sx={{ my: 2 }}></Divider>
                  <Grid>
                    {/* <Divider sx={{ my: 2 }}></Divider> */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "primary.main",
                        marginLeft: "33em",
                      }}
                      // onClick={() => setModalSeeMbList(false)}
                      onClick={() => testLog(false)}
                    >
                      OK
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Box>
        ) : (
          <Box sx={{ width: "50%", textAlign: "center" }}>
            <Grid
              container
              justifyContent={"space-between"}
              sx={{ margin: "1%" }}
            >
              <Grid container item xs={10}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mt: 0.5, textAlign: "left", ml: 2 }}
                >
                  SCAN NEW BATCH
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )
      }
    </>
  );
};

export default ScanNewBatch;
