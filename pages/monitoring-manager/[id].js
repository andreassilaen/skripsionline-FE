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

  const [unitBox1EditVar, setUnitBox1EditVar] = useState("");
  const [unitBox2EditVar, setUnitBox2EditVar] = useState("");
  const [unitBox3EditVar, setUnitBox3EditVar] = useState("");
  const [unitBox4EditVar, setUnitBox4EditVar] = useState("");
  const [unitBox5EditVar, setUnitBox5EditVar] = useState("");
  const [unitBox6EditVar, setUnitBox6EditVar] = useState("");
  const [unitBox7EditVar, setUnitBox7EditVar] = useState("");
  const [unitBox8EditVar, setUnitBox8EditVar] = useState("");
  const [unitBox9EditVar, setUnitBox9EditVar] = useState("");
  const [unitBox10EditVar, setUnitBox10EditVar] = useState("");

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
  const [arrProduct, setArrProduct] = useState([]);
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

  const [collapseButtonFinishPackaging, setCollapseButtonFinishPackaging] =
    useState(false);

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

  const [listSample, setListSample] = useState(false);

  const router = useRouter();

  const [noID, setNoID] = useState("");

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["QR_BPOM_MONITORING_MANAGER"].includes(
          "QR_BPOM_MONITORING_MANAGER_CREATE"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  async function start(item) {
    if (selectBatchNumber === "" || selectBatchNumber === undefined) {
      setModalScanBatch(true);
    }
    if (selectBatchNumber !== "") {
      setModalStartScanNewBatch(true);
    }

    console.log("selectBatchNumber", selectBatchNumber);
    console.log("getproduct", listProduct);
  }

  async function start2() {
    debounceMountCreateHeaderNewBatch();
    setFlag("D");
  }

  async function hideDetailScanNewBatch() {
    console.log("listHeader", listHeader);
    setCollapseDetailScanNewBatch(false);
    setCollapseDetailScanNewBatchButtonUp(false);
    setCollapseDetailScanNewBatchButtonDown(true);
  }

  async function showDetailScanNewBatch() {
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
    console.log("boolApproval-ScanNewBatch", detailApprovalBool);
  }, [detailApprovalBool]);

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
      console.log("testmasooooooooook");
      saveAndContinueFinish();
    }
  }

  async function saveAndContinueFinish() {
    debounceMountGetListMasterBox(listHeader.scan_id);

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
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("scanningPackaging", listScanningPackaging);
  }, [listScanningPackaging, listSample, checkedSample]);

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
    } catch (error) {
      console.log(error);
    }
  }
  const [product, setProduct] = useState([]);
  const [productEdit, setProductEdit] = useState([]);

  useEffect(() => {
    const tempArrEdit = [];

    if (unitBox1 !== "") {
      setDisableUnitBox1(false);
      tempArrEdit.push(unitBox1);
    }
    if (unitBox2 !== "") {
      setDisableUnitBox2(false);
      tempArrEdit.push(unitBox2);
    }
    if (unitBox3 !== "") {
      setDisableUnitBox3(false);
      tempArrEdit.push(unitBox3);
    }
    if (unitBox4 !== "") {
      setDisableUnitBox4(false);
      tempArrEdit.push(unitBox4);
    }
    if (unitBox5 !== "") {
      setDisableUnitBox5(false);
      tempArrEdit.push(unitBox5);
    }
    if (unitBox6 !== "") {
      setDisableUnitBox6(false);
      tempArrEdit.push(unitBox6);
    }
    if (unitBox7 !== "") {
      setDisableUnitBox7(false);
      tempArrEdit.push(unitBox7);
    }
    if (unitBox8 !== "") {
      setDisableUnitBox8(false);
      tempArrEdit.push(unitBox8);
    }
    if (unitBox9 !== "") {
      setDisableUnitBox9(false);
      tempArrEdit.push(unitBox9);
    }
    if (unitBox10 !== "") {
      setDisableUnitBox10(false);
      tempArrEdit.push(unitBox10);
    }
    setProductEdit(tempArrEdit);

    if (listHeader.scan_status !== "D") {
      if (unitBox1 !== "" && disableUnitBox1 !== false) {
        setCollapseEditUnitBox1(true);
      }

      if (unitBox2 !== "" && disableUnitBox2 !== false) {
        setCollapseEditUnitBox2(true);
      }

      if (unitBox3 !== "" && disableUnitBox3 !== false) {
        setCollapseEditUnitBox3(true);
      }

      if (unitBox4 !== "" && disableUnitBox4 !== false) {
        setCollapseEditUnitBox4(true);
      }

      if (unitBox5 !== "" && disableUnitBox5 !== false) {
        setCollapseEditUnitBox5(true);
      }

      if (unitBox6 !== "" && disableUnitBox6 !== false) {
        setCollapseEditUnitBox6(true);
      }

      if (unitBox7 !== "" && disableUnitBox7 !== false) {
        setCollapseEditUnitBox7(true);
      }

      if (unitBox8 !== "" && disableUnitBox8 !== false) {
        setCollapseEditUnitBox8(true);
      }

      if (unitBox9 !== "" && disableUnitBox9 !== false) {
        setCollapseEditUnitBox9(true);
      }

      if (unitBox10 !== "" && disableUnitBox10 !== false) {
        setCollapseEditUnitBox10(true);
      }
    }

    if (listHeader.scan_status === "O" || listHeader.scan_status === "R") {
      setCollapsePackagingSelesaiButton(true);
    }
    if (listHeader.scan_status === "O" || listHeader.scan_status === "R") {
      setCollapseButtonFinishPackaging(true);
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

    listHeader,
    collapseButtonFinishPackaging,
    collapsePackagingSelesaiButton,
    ,
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

  async function mountCreateDetailNewBatch() {
    try {
      var k;
      var y;
      y = 0;
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
          },
        };
        k = k + 1;

        console.log("payload", payload);
        const createDetailNewBatch = await qr.createDetailNewBatch(payload);
        const { data } = createDetailNewBatch.data;
        console.log("data", data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function mountUpdateUBID(item) {
    try {
      var y;
      y = 0;
      console.log("unitBox1FinishEdit", unitBox1);
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
      console.log("y", y);
      var x;
      var j;
      j = 10 - y;
      console.log("unitBox1FinishEdit2", unitBox1);
      console.log("mbSizeDetail.cnt", mbSizeDetail.cnt);

      console.log("j", j);
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
            scan_sampleyn: checkedSample === false ? false : true,
          },
        };

        console.log("finishMasukUpdate");
        console.log("listHeaderFinish", listHeader);

        console.log("payloadUpdate", payload);
        const updateUBID = await qr.updateDetailUBID(payload);
        const { data } = updateUBID.data;
        console.log("data", data);
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
    if (checkedSample === false) {
      setCheckedSample(true);
      console.log("testSample", checkedSample);
    }
    if (checkedSample === true) {
      setCheckedSample(false);
      console.log("testSample", checkedSample);
    }
    console.log("listSampleFInsihCheck", listSample);
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

  async function finishPackaging() {
    try {
      const mountUpdateUBID = await qr.updatePackingSelesai(listHeader.scan_id);
      const { data } = mountUpdateUBID.data;
      setModalPackingSelesai2(true);
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
  }, [router.isReady]);

  async function mountGetHeader() {
    try {
      const mountGetHeader = await qr.getHeader(noID);
      const { data } = mountGetHeader.data;
      setListHeader(data);
      console.log("noID", noID);
      console.log("listScanningPackagingSeeMBList", listScanningPackaging);
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetHeader = useCallback(debounce(mountGetHeader, 400));

  useEffect(() => {
    console.log("listheaderstatus", listHeader.scan_status);

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
    debounceMountGetScanningPackagingData(noID, item.scan_mbid);
    setMbsizeDetail(item);
  }

  async function back() {
    setFlag("D");
    setProductEdit([]);
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

  return (
    <>
      {flag === "D" ? (
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Grid
            container
            justifyContent={"space-between"}
            sx={{ margin: "1%" }}
          >
            <Grid container item xs={10} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => router.push(`/monitoring-process-scan`)}
              >
                <KeyboardBackspaceIcon />
              </Button>
            </Grid>
            <Grid container item xs={10}>
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
                  sx={{
                    fontWeight: 600,
                    textAlign: "left",
                    ml: 2,
                  }}
                >
                  Product
                </Typography>
              </Grid>

              <Grid item>
                <Typography
                  sx={{
                    fontWeight: 600,
                    textAlign: "left",
                    ml: 11,
                  }}
                >
                  :
                </Typography>
              </Grid>

              <Grid>
                <Typography
                  sx={{
                    fontWeight: 600,
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
                  sx={{
                    fontWeight: 600,
                    textAlign: "left",
                    ml: 2,
                  }}
                >
                  Batch Number
                </Typography>
              </Grid>

              <Grid item>
                <Typography
                  sx={{
                    fontWeight: 600,
                    textAlign: "left",
                    ml: 5,
                  }}
                >
                  :
                </Typography>
              </Grid>

              <Grid>
                <Typography
                  sx={{
                    fontWeight: 600,
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
                    sx={{
                      fontWeight: 600,
                      textAlign: "left",
                      ml: 2,
                    }}
                  >
                    MB Size
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "left",
                      ml: 11,
                    }}
                  >
                    :
                  </Typography>
                </Grid>

                <Grid>
                  <Typography
                    sx={{
                      fontWeight: 600,
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
                    sx={{
                      fontWeight: 600,
                      textAlign: "left",
                      ml: 2,
                    }}
                  >
                    NIE
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "left",
                      ml: 15,
                    }}
                  >
                    :
                  </Typography>
                </Grid>

                <Grid>
                  <Typography
                    sx={{
                      fontWeight: 600,
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
                    sx={{
                      fontWeight: 600,
                      textAlign: "left",
                      ml: 2,
                    }}
                  >
                    Production Date
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "left",
                      ml: 3.3,
                    }}
                  >
                    :
                  </Typography>
                </Grid>

                <Grid>
                  <Typography
                    sx={{
                      fontWeight: 600,
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
                    sx={{
                      fontWeight: 600,
                      textAlign: "left",
                      ml: 2,
                    }}
                  >
                    Expired Date
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "left",
                      ml: 6.5,
                    }}
                  >
                    :
                  </Typography>
                </Grid>

                <Grid>
                  <Typography
                    sx={{
                      fontWeight: 600,
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
          <Grid sx={{ backgroundColor: "white" }}>
            <Collapse in={collapseDetailScanNewBatchButtonUp}>
              <Grid sx={{ textAlign: "right", mr: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => hideDetailScanNewBatch()}
                  // fullWidth
                  startIcon={<ArrowDropUpIcon />}
                  sx={{ backgroundColor: "#f0f0f0", textAlign: "center" }}
                  size="small"
                ></Button>
              </Grid>
            </Collapse>
            <Collapse in={collapseDetailScanNewBatchButtonDown}>
              <Grid sx={{ textAlign: "right", mr: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => showDetailScanNewBatch()}
                  startIcon={<ArrowDropDownIcon />}
                  sx={{ backgroundColor: "#f0f0f0", textAlign: "center" }}
                ></Button>
              </Grid>
            </Collapse>
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
                {listMasterBox &&
                  listMasterBox.map((item, index) => (
                    <TableRow key={item}>
                      <TableCell>
                        {item.scan_mbid} - {item.cnt} {"UB"}
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
                          }}
                          onClick={() => detailScanningPackaging(item)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Grid container>
              <Grid container></Grid>
            </Grid>
          </Grid>
          <Modal open={modalPackingSelesai}>
            <Box sx={style}>
              <Grid>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Watch out!
                </Typography>
                <Typography>Are you sure to finish packing process?</Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
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
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Congrats!
                </Typography>
                <Typography>
                  Data QR Batch {""}
                  {listHeader.scan_batch}
                  {""} successfully saved.
                </Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
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
              <Button variant="contained" onClick={() => back()}>
                <KeyboardBackspaceIcon />
              </Button>
            </Grid>
            <Grid container item xs={10}>
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
            <Grid item flex={1}>
              <Typography
                sx={{
                  fontWeight: 600,
                  textAlign: "left",
                  ml: 2,
                }}
              >
                Master Code Box
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
            <Grid item flex={5}>
              <TextField
                sx={{ float: "left" }}
                fullWidth
                size="small"
                value={masterCodeBox}
                disabled
              ></TextField>
            </Grid>
            <Grid item flex={2}>
              <Button
                variant="outlined"
                onClick={() => debounceMountGetSeeMBList()}
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
                  <Typography
                    sx={{
                      fontWeight: 600,
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
                    sx={{ float: "left", width: "100%" }}
                    size="small"
                    disabled
                  ></TextField>
                </Grid>
                <Grid item flex={1.57}></Grid>
              </Grid>
            ))}
          </Grid>

          <Modal open={modalScanningPackagingNotFull}>
            <Box sx={style}>
              <Grid>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Heads Up!
                </Typography>
                <Typography>
                  Data of unit box code is incomplete. Are you sure to proceed?
                </Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
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

          <Modal open={modalSeeMbList}>
            <Box sx={style}>
              <Grid>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {/* Heads Up! */}
                  Master Box Code ={" "}
                  {listSeeMB.scan_id !== ""
                    ? ("", listSeeMB.scan_mbid)
                    : "Empty"}
                </Typography>
                <Typography>
                  This Master Box is{" "}
                  {listSeeMB.scan_sampleyn === "Y"
                    ? "retained sample"
                    : listSeeMB.scan_sampleyn === "N"
                    ? "not retained sample"
                    : "Empty"}
                </Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "primary.main",
                      marginLeft: "33em",
                    }}
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
      )}
    </>
  );
};

export default ScanNewBatch;
