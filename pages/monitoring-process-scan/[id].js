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
  // const [selectProduct, setSelectProduct] = useState("");
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

  const [listSample, setListSample] = useState(false);

  const router = useRouter();

  const [noID, setNoID] = useState("");

  const [collapseAddButton, setCollapseAddButton] = useState(false);

  const [collapseUnitBox11, setCollapseUnitBox11] = useState(false);
  const [unitBox11Disabled, setUnitBox11Disabled] = useState(false);
  const [unitBox11, setUnitBox11] = useState("");
  const [modalValidationFullUB, setModalValidationFullUB] = useState(false);

  const [modalValidationMBCode, setModalValidationMBCode] = useState(false);
  const [modalValidationUBCode, setModalValidationUBCode] = useState(false);
  const [modalValidationUBBoxFull, setModalValidationUBBoxFull] =
    useState(false);

  const [testing, setTesting] = useState([]);

  const [disableTestBox1, setDisableTestBox1] = useState(true);
  const [isOpen, setIsOpen] = useState([]);
  // const tempArrUnitBox = testing;
  const [testingArr, setTestingArr] = useState([]);
  const [testingArr2, setTestingArr2] = useState([]);
  const [productTest, setProductTest] = useState([]);
  // -------------------------------------------------------

  const [called, isCalled] = useState(false);

  const [ubBox, setUbBox] = useState();

  const [selectProduct, setSelectProduct] = useState({
    pro_name: "",
    pro_code: "",
  });

  const [totalArr, setTotalArr] = useState([]);

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["QR_BPOM_MONITORING_OPERATOR"].includes(
          "QR_BPOM_MONITORING_OPERATOR_CREATE"
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

  // ------- Edit Unit Box Function -------

  async function packingFinish() {
    setModalPackingSelesai(true);
  }

  async function packingFinishModal() {
    setModalPackingSelesai2(false);
    setModalPackingSelesai(false);
    // setFlag("Y");
    router.push(`/monitoring-process-scan`);
    setModalStartScanNewBatch(false);
  }

  async function finishScanningPackaging() {
    setFlag("D");
    mountUpdateUBID();
    console.log("finishMasuk");
    setProduct([]);
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

  useEffect(() => {
    console.log("scanningPackaging", listScanningPackaging);
  }, [listScanningPackaging, listSample, checkedSample]);

  async function mountGetListAllProduct() {
    try {
      const getListProduct = await qr.getListAllProduct();
      const { data } = getListProduct.data;
      setListProduct(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setCollapseButtonFinishPackaging(true);
    if (listHeader.scan_status === "O" || listHeader.scan_status === "R") {
      setCollapseButtonFinishPackaging(true);
      setCollapsePackagingSelesaiButton(true);
      console.log("collapseAddButton", collapseAddButton);
      console.log("listHeader", listHeader);
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
    collapseAddButton,
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
      // }
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

  async function start(item) {
    if (
      selectBatchNumber === "" ||
      selectBatchNumber === undefined ||
      selectProduct === "" ||
      selectProduct === undefined ||
      selectedProdDate === "" ||
      selectedProdDate === undefined ||
      selectedExpDate === "" ||
      selectedExpDate === undefined
    ) {
      setModalScanBatch(true);
    }
    if (
      selectBatchNumber !== "" &&
      selectProduct !== "" &&
      selectedProdDate !== "" &&
      selectedExpDate !== ""
    ) {
      setModalStartScanNewBatch(true);
    }
    console.log("selectBatchNumber", selectBatchNumber);
    console.log("getproduct", listProduct);
  }

  async function start2() {
    var z;
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
    if (listHeader.scan_mbsize !== "") {
      var z;
      for (z = 1; z <= listHeader.scan_mbsize; z++) {
        tempArrMbSize.push("");
      }
      setTesting(tempArrMbSize);
      console.log("testinggggggggz", testing);
    }
  }

  useEffect(() => {
    console.log("detailBool", detailBool);
    if (masterCodeBox === "") {
      setMasterBoxDisable(false);
    }
    if (detailBool !== true) {
      setUnitBox1Disabled(false);
      if (masterCodeBox.length >= 58) {
        unitBox1Ref[`item${0}`].focus();
        setMasterBoxDisable(true);
        setDisableTestBox1(false);
        console.log("testRef", unitBox1Ref[`item${0}`]);
      }
      console.log("MasterBoxDisable", masterBoxDisable);
    }
    if (flag === "Y") {
      debounceMountGetListAllProduct();
      console.log("getlistallproduct");
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

  async function saveAndContinueButton() {
    if (
      (unitBox1 !== 0 && unitBox1 !== []) ||
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
    console.log("testArray", inputValue);
    var x;
    console.log("inputValue[1]", inputValue[1]);
    console.log("inputValue", inputValue);
    var y;
    y = 0;
    for (x = 1; x <= listHeader.scan_mbsize; x++) {
      if (testingArr[x] !== "") {
        testingArr2.push(testingArr[y]);
        y++;
      }
    }
    setProductTest(testingArr2);

    console.log("testingFinish", testingArr);
    console.log("testingFinish2", testingArr[0]);
    debounceMountGetListMasterBox(listHeader.scan_id);
    console.log("sampleyn", checkedSample);
    setCheckedSample(false);

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
    for (y = 0; y < scanData.length; y++) {
      unitBox1EditKeep.push(scanData[y].scan_ubid);
      unitBox1EditKeepStr.push("");
      console.log("testLoopBoxEdit", scanData[y].scan_ubid);
    }
    setTesting(unitBox1EditKeep);

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
    setProductTest([]);
    setTestingArr2([]);
  }

  async function deleteUnitBox1(index) {
    console.log("arr penampung", testing);
    console.log("index", index);
    var tempArr = [...testing];
    tempArr[index] = "";
    console.log("temparr final", tempArr);
    setTesting(tempArr);
    unitBox1Ref[`item${index}`].focus();
  }

  // --------------------------------------------------

  async function packingFinish() {
    setModalPackingSelesai(true);
  }

  async function finishScanningPackaging() {
    var i;
    if (detailBool !== true) {
      for (i = 0; i < totalArr.length; i++) {
        if (totalArr[i] === "") {
          setModalScanningPackagingNotFullFinish(true);
          console.log("masuk1", i);
          break;
        }
        if (totalArr[totalArr.length - 1] !== "") {
          setFlag("D");
          console.log("product", product);
          saveAndContinueFinish();
          console.log("masuk2", i);
          console.log("totalArr.length-masuk2", totalArr.length);

          break;
        }
        console.log("masuk0", i);
        console.log("totalArr.length", totalArr.length);
      }
      if (masterCodeBox === "") {
        setModalValidationSaveAndFinish(true);
      }

      console.log("totalArr", totalArr);
      console.log("masokDetail");
    }

    if (detailBool === true) {
      setFlag("D");
      mountUpdateUBID();
      setUnitBox1Edit([]);
      setDetailBool(false);
      setProduct([]);
      setTesting(unitBox1EditKeep);
      setCollapseSaveUnitBox1(true);

      setUnitBox1Edit("");
      console.log("detailBoolDetailBoolTrue", detailBool);
      console.log("masokDetailTrue");
    }
  }

  const debounceMountGetScanningPackagingData = useCallback(
    debounce(mountGetScanningPackagingData, 400)
  );
  const unitBox1EditKeep = [];
  const unitBox1EditKeepStr = [];
  async function mountGetScanningPackagingData(scanid, mbid) {
    try {
      const getScanningPackaging = await qr.getScanningPackagingData(
        noID,
        mbid
      );
      const { data } = getScanningPackaging.data;

      if (data !== null) {
        setListScanningPackaging(data);
        scanData = data;
        console.log("dataScanningPackaging", data);
        console.log("scandata", scanData);
        console.log("scandataLength", scanData.length);
        setMBBox(scanData[0].scan_mbid);
        var y;
        const unitBox1EditKeep = [];
        for (y = 0; y < scanData.length; y++) {
          unitBox1EditKeep.push(scanData[y].scan_ubid);
          unitBox1EditKeepStr.push("");
          console.log("testLoopBoxEdit", scanData[y].scan_ubid);
        }

        // --------------------------------------------------------

        let arrayOfData = [];
        for (let i = 0; i <= data.length - 1; i++) {
          arrayOfData.push(true);
        }
        setIsOpen(arrayOfData);

        // --------------------------------------------------------
        setTesting(unitBox1EditKeep);
        // }
        console.log("testUnitBoxEdit", unitBox1Edit);
        console.log("testUnitBoxEditKeep", unitBox1EditKeep);
        console.log("testUnitBox1EditKeepStr", unitBox1EditKeepStr);
        console.log("testingFunction", testing);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const debounceMountGetListMasterBox = useCallback(
    debounce(mountGetListMasterBox, 400)
  );

  async function mountGetListMasterBox(scanid) {
    try {
      const getListMasterBox = await qr.getListMasterBox(scanid);
      const { data } = getListMasterBox.data;
      setListMasterBox(data);
      console.log("dataMasterBox", data);
      console.log("testing", testing);
      console.log("listHeader", listHeader);
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
          scan_procode: selectProduct.pro_code,
          scan_proname: selectProduct.pro_name,
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
        console.log("datambsize", data.scan_mbsize);
        debounceMountGetListMasterBox(data.scan_id);
        console.log("testing", testing);
      } catch (error) {
        console.log(error);
      }

      console.log("selectBatchNumber", selectBatchNumber);
    } catch (error) {
      console.log(error);
    }
  }
  const [product, setProduct] = useState([]);
  const [productEdit, setProductEdit] = useState([]);

  const tempArrMbSize = [];
  useEffect(() => {
    if (detailBool !== true) {
      if (listHeader !== []) {
        setCollapseAddButton(true);
      }
    }

    if (detailBool === true) {
      console.log("testOpen", isOpen);
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

    listHeader,
    detailBool,
  ]);

  async function mountCreateDetailNewBatch() {
    try {
      var test;
      const noEmptyStrings = testing.filter((str) => str !== "");
      test = listHeader.scan_id;
      var payload = {
        data: {
          scan_id: test,
          scan_mbid: masterCodeBox,
          scan_ubid: noEmptyStrings,
          scan_sampleyn: checkedSample === false ? "N" : "Y",
        },
      };

      console.log("testArrnoEmptyStrings", noEmptyStrings);
      console.log("payload", payload);
      const createDetailNewBatch = await qr.createDetailNewBatch2(payload);
      const { data } = createDetailNewBatch.data;
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  }

  async function mountUpdateUBID() {
    try {
      var y;
      y = 0;
      var x;
      console.log("testCnt", testing.length);
      for (x = 1; x <= testing.length; x++) {
        var test;
        test = listHeader.scan_id;
        var payload = {
          data: {
            scan_id: test,
            scan_mbid: listScanningPackaging[0].scan_mbid,
            scan_uburut: x,
            scan_ubid: testing[y],
            scan_sampleyn: checkedSample === false ? false : true,
          },
        };

        console.log("payloadUpdate", payload);
        const updateUBID = await qr.updateDetailUBID(payload);
        const { data } = updateUBID.data;
        console.log("data", data);
        console.log("updateUBID", updateUBID);
        console.log("testing[y]", testing[y]);
        y++;
      }
    } catch (error) {
      console.log(error);
    }
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

  async function detailScanningPackaging(item) {
    setFlag("P");
    setDetailBool(true);
    debounceMountGetScanningPackagingData(listHeader.scan_id, item.scan_mbid);
    setMbsizeDetail(item);
    console.log("scanid", listHeader.scan_id);
    console.log("itemMBID", item);
    console.log("listScanningPackaging", listScanningPackaging);
    console.log("product", product);
    console.log("productEdit", productEdit);
    console.log("Testing", testing);
    console.log("DetailBool-Detail", detailBool);
    console.log("detailBool", detailBool);
    console.log("listHeader.scan_mbsize", listHeader.scan_mbsize);
    setDisableTestBox1(true);
    console.log("detailBool", detailBool);
  }

  async function finishPackaging() {
    try {
      const mountUpdateUBID = await qr.updatePackingSelesai(listHeader.scan_id);
      const { data } = mountUpdateUBID.data;
      setModalPackingSelesai2(true);
      setSelectedProdDate("");
      setSelectedExpDate("");
    } catch (error) {
      console.log(error);
    }
  }

  // ---------------------------------------------
  const [inputValue] = useState([]);
  const tempArrUnitBox = testing;

  function handleInputUB(value, item, index) {
    var tempArr = [...testing];
    tempArr[index] = value.value;
    setTesting(tempArr);
    setTotalArr(tempArr);

    const id = value.getAttribute("id");

    console.log("testIndex", index);
    console.log("id", id);
    console.log("detail", detailBool);
    console.log("testValue", value.value);
    console.log("testtempArr", tempArr[index]);

    if (id === `item${index}` && detailBool !== true) {
      var input = tempArr[index];
      var input2 = testing[index];
      console.log("input", input);
      if (tempArr[19].length >= 50) {
        setModalValidationUBBoxFull(true);
        console.log("masukFull");
      }
      if (input.length >= 56 && testing[totalArr.length - 2] == "") {
        console.log("totalArr.length-1", totalArr.length - 1);
        console.log("totalArr19", totalArr[19]);
        console.log("masukFocus");
        unitBox1Ref[`item${index + 1}`].focus();
      }
      console.log("input.length", input.length);
    }
    console.log("testing", testing);
    console.log("testingTempArr", tempArr[index]);
    console.log("testItem", item);
  }

  useEffect(() => {
    if (flag === "D") {
      console.log("testingFinishArrNew", productTest);
    }
    console.log("testingArr2", testingArr2);
  }, [flag, productTest, testingArr2]);

  console.log(inputValue[0] !== "" ? "Disabled" : "Bisa Bawah");
  console.log(inputValue);

  function changeButton(item, index) {
    if (detailBool === true) {
      return (
        // <Box>
        <Grid item flex={1.5}>
          {isOpen[index] === false ? (
            <Button
              variant="contained"
              sx={{ float: "left", ml: 2, backgroundColor: "blue" }}
              onClick={(e) => debounceMountEditUB(e, item, index)}
            >
              SAVE
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ float: "left", ml: 2, backgroundColor: "blue" }}
              onClick={(e) => saveUB(e, item, index)}
            >
              Edit
            </Button>
          )}
        </Grid>
      );
    } else {
      return (
        <Grid item flex={1.5}>
          <Collapse in={testing[index] !== "" ? true : false}>
            <Button
              id={`item${index}`}
              variant="contained"
              sx={{
                float: "left",
                ml: 2,
                backgroundColor: "error.main",
              }}
              onClick={(e) => deleteUnitBox1(index)}
            >
              Delete
            </Button>
          </Collapse>
        </Grid>
        // </Collapse>
      );
    }
  }

  function saveUB(e, item, index) {
    let newIsOpen = [...isOpen];
    newIsOpen.splice(index, 1, !newIsOpen[index]);
    setIsOpen(newIsOpen);
    console.log("testOpenSave", isOpen);
    console.log("testDisable", disableTestBox1[`item${index}`]);
  }

  const debounceMountEditUB = useCallback(debounce(mountEditUB, 400));

  async function mountEditUB(e, item, index) {
    let newIsOpen = [...isOpen];
    newIsOpen.splice(index, 1, !newIsOpen[index]);
    setIsOpen(newIsOpen);

    console.log("testOpenEdit", isOpen);
    console.log("disableBoolSave", detailBool);
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
                  // fullWidth
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
              <Grid container>
                <Grid item sx={{ float: "right", width: "100%" }}>
                  <Collapse
                    in={collapsePackagingSelesaiButton}
                    sx={{ float: "right", width: "100%" }}
                  >
                    <Button
                      onClick={() => packaging()}
                      sx={{ float: "right", width: "15%" }}
                    >
                      <AddCircle sx={{ fontSize: 35, color: "teal" }} />
                    </Button>
                  </Collapse>
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
                onChange={(e) => setMasterCodeBox(e.target.value)}
                value={
                  detailBool !== true
                    ? masterCodeBox
                    : // 0
                      MBBox
                }
                disabled={detailBool === true ? true : masterBoxDisable}
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
            {testing.map((item, index) => (
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
                    value={testing[index]}
                    onChange={(e) => handleInputUB(e.target, item, index)}
                    inputRef={(el) => (unitBox1Ref[`item${index}`] = el)}
                    sx={{ float: "left", width: "100%" }}
                    size="small"
                    disabled={
                      detailBool !== true &&
                      masterCodeBox === "" &&
                      masterCodeBox.length != 58
                        ? true
                        : detailBool === true && isOpen[index] == false
                        ? false
                        : detailBool === true && isOpen[index] == true
                        ? true
                        : false
                    }
                  ></TextField>
                </Grid>

                {changeButton(item, index)}
              </Grid>
            ))}
          </Grid>

          <Grid sx={{ marginTop: 2, mr: 7 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedSample}
                  onClick={() => checkSample()}
                />
              }
              label="Retained Sample"
              sx={{ float: "left", ml: 8 }}
            />
            <Button
              variant="contained"
              sx={{ float: "right", marginBottom: 2, ml: 2 }}
              onClick={() => finishScanningPackaging()}
            >
              Finish
            </Button>
            <Button
              variant="contained"
              sx={{ float: "right", marginBottom: 2 }}
              onClick={() => saveAndContinueButton()}
              disabled={detailBool === true ? true : false}
            >
              Save & Continue
            </Button>
          </Grid>

          {/* <G */}
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
                    sx={{ backgroundColor: "primary.main", marginLeft: "27em" }}
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
                    sx={{ backgroundColor: "primary.main", marginLeft: "27em" }}
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
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Heads Up!
                </Typography>
                <Typography>Scan QR on master box ﬁrst!</Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
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
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Heads Up!
                </Typography>
                <Typography>Error</Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
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
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Master Box Code ={" "}
                  {listSeeMB.scan_id !== ""
                    ? ("", listSeeMB.scan_mbid)
                    : "Empty"}
                </Typography>
                <Typography>
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

          <Modal open={modalValidationFullUB}>
            <Box sx={style}>
              <Grid>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Heads Up!
                </Typography>
                <Typography>UB Box Full!</Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "primary.main",
                      marginLeft: "33em",
                    }}
                    onClick={() => setModalValidationFullUB(false)}
                  >
                    OK
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          <Modal open={modalValidationMBCode}>
            <Box sx={style}>
              <Grid>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Heads Up!
                </Typography>
                <Typography>
                  Master Box Code must be 58 characters, please try again!
                </Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "primary.main",
                      marginLeft: "33em",
                    }}
                    onClick={() => setModalValidationMBCode(false)}
                  >
                    OK
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          <Modal open={modalValidationUBCode}>
            <Box sx={style}>
              <Grid>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Heads Up!
                </Typography>
                <Typography>
                  Unit Box Code must be 57 characters, please try again!
                </Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "primary.main",
                      marginLeft: "33em",
                    }}
                    onClick={() => setModalValidationUBCode(false)}
                  >
                    OK
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
          <Modal open={modalValidationUBBoxFull}>
            <Box sx={style}>
              <Grid>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Heads Up!
                </Typography>
                <Typography>Unit Box Code has reached full!</Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "primary.main",
                      marginLeft: "33em",
                    }}
                    onClick={() => setModalValidationUBBoxFull(false)}
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
