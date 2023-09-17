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
import { detailApprovalBool, setDetailApprovalBool } from "../approval/index";

import { styled } from "@mui/material/styles";
import { getStorage } from "../../utils/storage";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ScanNewBatch = () => {
  const [listMasterBox, setListMasterBox] = useState([]);
  const [selectBatchNumber, setSelectBatchNumber] = useState("");
  const [selectJumlahUB, setSelectJumlahUB] = useState("");
  const [modalScanBatch, setModalScanBatch] = useState(false);
  const [flag, setFlag] = useState("Y");
  const [saveAndCons, setSaveAndCons] = useState(false);
  const [collapseDetailScanNewBatch, setCollapseDetailScanNewBatch] =
    useState(true);

  const [masterCodeBox, setMasterCodeBox] = useState("");
  const [unitBox1, setUnitBox1] = useState([]);
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
  const [collapseAddButton, setCollapseAddButton] = useState(false);

  const unitBox1Ref = useRef();
  const unitBox11Ref = useRef();

  const [listProduct, setListProduct] = useState([]);
  const [listHeader, setListHeader] = useState("");
  const [listSeeMB, setListSeeMB] = useState([]);
  const [listScanningPackaging, setListScanningPackaging] = useState([]);

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
  const [MBBox, setMBBox] = useState("");
  const [unitBox1Edit, setUnitBox1Edit] = useState([]);
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

  const [called, isCalled] = useState(false);

  const [ubBox, setUbBox] = useState();

  const [selectProduct, setSelectProduct] = useState({
    pro_name: "",
    pro_code: "",
  });

  const [selectProducts, setSelectProducts] = useState("");

  const [listBatch, setListBatch] = useState([]);

  const [listOneDataBatch, setListOneDataBatch] = useState("");

  const [selectBatch, setSelectBatch] = useState({ mtr_batch: "" });

  const [totalArr, setTotalArr] = useState([]);

  const accessList = getStorage("access_list");

  const [disabledBatch, setDisabledBatch] = useState(true);
  const [disabledJumlahUB, setDisabledJumlahUB] = useState(true);
  const [disabledStart, setDisabledStart] = useState(true);
  const [disableBox, setDisableBox] = useState(false);
  const [disableFinishEdit, setDisableFinishEdit] = useState(false);

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["QR_BPOM_SCAN_NEW_BATCH"].includes(
          "QR_BPOM_SCAN_NEW_BATCH_CREATE"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  async function start(item) {
    if (
      selectBatchNumber === "" ||
      selectBatchNumber === undefined ||
      selectProduct.pro_code === "" ||
      selectProduct === undefined ||
      selectJumlahUB === "" ||
      selectJumlahUB === undefined
    ) {
      setModalScanBatch(true);
    }
    if (
      selectBatchNumber !== "" &&
      selectProduct.pro_code !== "" &&
      selectJumlahUB !== ""
    ) {
      setModalStartScanNewBatch(true);
    }
    console.log("listBatch", listBatch);
    console.log("listOneDataBatch", listOneDataBatch);
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
    // setTesting(tempArrMbSize);
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

  async function saveAndContinueButton() {
    // if (
    //   (unitBox1 !== 0 && unitBox1 !== []) ||
    //   (unitBox2 !== 0 && unitBox2 !== "") ||
    //   (unitBox3 !== 0 && unitBox3 !== "") ||
    //   (unitBox4 !== 0 && unitBox4 !== "") ||
    //   (unitBox5 !== 0 && unitBox5 !== "") ||
    //   (unitBox6 !== 0 && unitBox6 !== "") ||
    //   (unitBox7 !== 0 && unitBox7 !== "") ||
    //   (unitBox8 !== 0 && unitBox8 !== "") ||
    //   (unitBox9 !== 0 && unitBox9 !== "")
    // ) {
    //   setModalScanningPackagingNotFull(true);
    // }
    // if (masterCodeBox === "") {
    //   setModalValidationSaveAndFinish(true);
    // }
    // if (unitBox10 !== 0 && unitBox10 !== "") {
    //   console.log("testmasooooooooook");
    //   saveAndContinueFinish();
    // }
    // // setBoolDelete(false);
    var i;
    if (detailBool !== true) {
      for (i = 0; i < totalArr.length; i++) {
        if (totalArr[i] === "") {
          setSaveAndCons(true);
          setModalScanningPackagingNotFullFinish(true);
          console.log("masuk1", i);
          break;
        }
        if (totalArr[totalArr.length - 1] !== "") {
          setFlag("P");
          console.log("product", product);
          setSaveAndCons;
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

    // if (detailBool === true) {
    //   setFlag("D");
    //   mountUpdateUBID();
    //   setUnitBox1Edit([]);
    //   setDetailBool(false);
    //   setProduct([]);
    //   setTesting(unitBox1EditKeep);
    //   setCollapseSaveUnitBox1(true);

    //   setUnitBox1Edit("");
    //   console.log("detailBoolDetailBoolTrue", detailBool);
    //   console.log("masokDetailTrue");
    // }
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
    if (saveAndCons === true) {
      setFlag("P");
      setSaveAndCons(false);
      if (listHeader.scan_mbsize !== "") {
        var z;
        for (z = 1; z <= listHeader.scan_mbsize; z++) {
          tempArrMbSize.push("");
        }
        setTesting(tempArrMbSize);
        console.log("testinggggggggz", testing);
      }
    }

    if (saveAndCons === false) {
      setFlag("D");
    }
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

  async function deleteUnitBox1(index) {
    console.log("arr penampung", testing);
    console.log("index", index);
    var tempArr = [...testing];
    tempArr[index] = "";
    console.log("temparr final", tempArr);
    setTesting(tempArr);
    unitBox1Ref[`item${index}`].focus();
  }

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
        scanid,
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
        if (scanData[0].scan_status === "Y") {
          setCheckedSample(false);
        }

        if (scanData[0].scan_status === "N") {
          setCheckedSample(true);
        }

        // --------------------------------------------------------

        let arrayOfData = [];
        for (let i = 0; i <= data.length - 1; i++) {
          arrayOfData.push(true);
        }
        setIsOpen(arrayOfData);

        // --------------------------------------------------------
        setTesting(unitBox1EditKeep);
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
      //   var z;
      //   for (z = 0; z < listHeader.scan_mbid; z++) {
      //     console.log("testZ", z);
      //     setTesting(z);
      //   }
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
      setListBatch([]);
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
          scan_mbsize: parseInt(selectJumlahUB),
          scan_nie: listOneDataBatch[0].mtr_nie,
          scan_proddate: formatDate(listOneDataBatch[0].mtr_proddate, "YYMMDD"),
          scan_expdate: formatDate(listOneDataBatch[0].mtr_expdate, "YYMMDD"),
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

  const [productUrut, setProductUrut] = useState([]);
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
          scan_uburut: productUrut,
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
            scan_sampleyn: checkedSample === false ? "N" : "Y",
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

  const debounceMountGetDataByProcodeAndBatch = useCallback(
    debounce(mountGetDataByProcodeAndBatch, 400)
  );

  async function mountGetDataByProcodeAndBatch(procode, batch) {
    console.log("params", procode, batch);

    try {
      const mountGetDataByProcodeAndBatch = await qr.getDataByProcodeAndBatch(
        procode,
        batch
      );
      const { data } = mountGetDataByProcodeAndBatch.data;
      console.log("data");
      console.log("dataBatch", data);
      console.log("dataBatchArr", data[0]);
      console.log("batch", batch);
      if (batch !== "") {
        setListOneDataBatch(data);
      }
      if (data !== "") {
        setDisabledBatch(false);
      }
      if (batch === "") {
        setListBatch(data);
      }
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
      setSelectBatchNumber("");
      setSelectProduct({
        pro_name: "",
        pro_code: "",
      });

      setDisabledBatch(true);
      setDisabledJumlahUB(true);
      setDisabledStart(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function unitBox1Test(e, item) {
    let newIsOpen = [...isOpen];
    newIsOpen.splice(item, 1, !newIsOpen[item]);
    setIsOpen(newIsOpen);
    setUnitBox1(e.target.value);
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
    setTimeout(() => {
      if (id === `item${index}` && detailBool !== true) {
        var input = tempArr[index];
        console.log("input", input);
        if (tempArr[parseInt(selectJumlahUB) - 1].length >= 50) {
          setModalValidationUBBoxFull(true);
          console.log("masukFull");
        }
        if (input.length >= 56 && testing[tempArr.length - 2] == "") {
          console.log("totalArr.length-1", totalArr.length - 1);
          console.log("totalArr19", totalArr[19]);
          console.log("masukFocus");

          unitBox1Ref[`item${index + 1}`].focus();
        }

        console.log("input.length", input.length);
      }
    }, 250);
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
      );
    }
  }

  function saveUB(e, item, index) {
    let newIsOpen = [...isOpen];
    newIsOpen.splice(index, 1, !newIsOpen[index]);
    setIsOpen(newIsOpen);
    console.log("testOpenSave", isOpen);
    console.log("testDisable", disableTestBox1[`item${index}`]);
    setDisableFinishEdit(true);
  }

  const debounceMountEditUB = useCallback(debounce(mountEditUB, 400));

  async function mountEditUB(e, item, index) {
    let newIsOpen = [...isOpen];
    newIsOpen.splice(index, 1, !newIsOpen[index]);
    setIsOpen(newIsOpen);

    console.log("testOpenEdit", isOpen);
    console.log("disableBoolSave", detailBool);
    setDisableFinishEdit(false);

    // setDisableTestBox1(true);
  }

  async function jumlahUB(e) {
    setSelectJumlahUB(e.target.value);
    if (e.target.value !== "") {
      setDisabledStart(false);
    }
    if (e.target.value === "") {
      setDisabledStart(true);
    }
  }

  async function chooseProcode(newValue) {
    setSelectProduct({
      ...selectProduct,
      pro_code: newValue === null ? "" : newValue.pro_code,
      pro_name: newValue === null ? "" : newValue.pro_name,
    });

    console.log("newValue", newValue);

    if (newValue === null) {
      setDisabledBatch(true);
      setDisabledJumlahUB(true);
    }
  }

  // const handleKeyDownProduct = (event) => {
  //   if (event.key === "Enter") {
  //     // passwordRef.focus();
  //     console.log("selectProducts", selectProducts);
  //   }
  // };

  async function backScanningPackaging() {
    // var i;
    // if (detailBool !== true) {
    //   for (i = 0; i < totalArr.length; i++) {
    //     if (totalArr[i] === "") {
    //       setSaveAndCons(true);
    //       setModalScanningPackagingNotFullFinish(true);
    //       console.log("masuk1", i);
    //       break;
    //     }
    //     if (totalArr[totalArr.length - 1] !== "") {
    //       setFlag("P");
    //       console.log("product", product);
    //       setSaveAndCons;
    //       saveAndContinueFinish();
    //       console.log("masuk2", i);
    //       console.log("totalArr.length-masuk2", totalArr.length);

    //       break;
    //     }
    //     console.log("masuk0", i);
    //     console.log("totalArr.length", totalArr.length);
    //   }
    //   // if (masterCodeBox === "") {
    //   //   setModalValidationSaveAndFinish(true);
    //   // }

    //   console.log("totalArr", totalArr);
    //   console.log("masokDetail");
    // }
    setMasterCodeBox("");
    setSaveAndCons(false);
    if (listHeader.scan_mbsize !== "") {
      var z;
      for (z = 1; z <= listHeader.scan_mbsize; z++) {
        tempArrMbSize.push("");
      }
      setTesting(tempArrMbSize);
      console.log("testinggggggggz", testing);
    }
    setFlag("D");
  }

  // ---------------------------------------------

  return (
    <>
      {flag === "Y" ? (
        <Box sx={{ width: "100%", textAlign: "center" }}>
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

          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "85vh", textAlign: "center" }}
          >
            <Paper>
              <Grid sx={{ ml: 2, mr: 2 }}>
                <Grid>
                  <FormControl
                    sx={{ backgroundColor: "white", width: "50vh", mt: 3 }}
                  >
                    <Autocomplete
                      options={listProduct}
                      getOptionLabel={(option) =>
                        `${option.pro_name} - ${option.pro_code}`
                      }
                      isOptionEqualToValue={(option, value) => {
                        option.pro_code === value.pro_code;
                        option.pro_name === value.pro_name;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Select Product..."
                          defaultValue={""}
                        />
                      )}
                      onChange={(e, newValue) => {
                        chooseProcode(newValue),
                          debounceMountGetDataByProcodeAndBatch(
                            selectProduct.pro_code === ""
                              ? newValue.pro_code
                              : "",
                            ""
                          );
                        // ,
                        // setSelectProducts(e.target.value);
                      }}
                      // onKeyDown={handleKeyDownProduct}
                      value={
                        selectProduct.pro_code === "" ? null : selectProduct
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid sx={{ mt: 1 }}>
                  <FormControl
                    sx={{
                      backgroundColor: "white",
                      width: "50vh",
                      marginTop: 1,
                    }}
                  >
                    <InputLabel>Select Batch...</InputLabel>
                    <Select
                      size="small"
                      label="Select Batch..."
                      variant="outlined"
                      placeholder={"Input Batch Number"}
                      value={selectBatchNumber}
                      sx={{
                        backgroundColor:
                          disabledBatch === true ? "#E3E0DE" : "white",
                      }}
                      disabled={disabledBatch}
                    >
                      {listBatch &&
                        listBatch.map((item) => (
                          <MenuItem
                            onClick={() => {
                              setSelectBatchNumber(item.mtr_batch),
                                debounceMountGetDataByProcodeAndBatch(
                                  selectProduct.pro_code,
                                  item.mtr_batch
                                ),
                                setDisabledJumlahUB(false);
                            }}
                            key={item}
                            value={item.mtr_batch}
                          >
                            {item.mtr_batch}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid sx={{ mt: 2 }}>
                  <FormControl
                    sx={{
                      backgroundColor: "white",
                      width: "50vh",
                    }}
                  >
                    <TextField
                      size="small"
                      variant="outlined"
                      placeholder={"Input Jumlah UB"}
                      onChange={(e) => {
                        jumlahUB(e);
                      }}
                      sx={{
                        backgroundColor:
                          disabledJumlahUB === true ? "#E3E0DE" : "white",
                      }}
                      disabled={disabledJumlahUB}
                    ></TextField>
                  </FormControl>
                </Grid>
                <Grid sx={{ textAlign: "right", marginTop: 2 }}>
                  <Button
                    variant="contained"
                    sx={{ marginBottom: 2 }}
                    onClick={() => start()}
                    disabled={disabledStart}
                  >
                    Start
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Modal open={modalScanBatch}>
            <Box sx={style}>
              <Grid>
                <Typography sx={{ fontWeight: 600 }}>Watch out!</Typography>
                <Typography>
                  Information of Product, Batch and Jumlah UB is still
                  incomplete!
                </Typography>
                <Button
                  sx={{
                    marginTop: 1,
                    float: "right",
                  }}
                  variant="outlined"
                  onClick={() => setModalScanBatch(false)}
                >
                  OK
                </Button>
              </Grid>
            </Box>
          </Modal>

          <Modal open={modalStartScanNewBatch}>
            <Box sx={style}>
              <Grid>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Hello!
                </Typography>
                <Typography>
                  Are you sure to start the scanning process of new batch?
                </Typography>
                <Divider sx={{ my: 2 }}></Divider>
                <Grid>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "primary.main", marginLeft: "27em" }}
                    onClick={() => start2()}
                  >
                    YES
                  </Button>

                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "error.main", marginLeft: "1em" }}
                    onClick={() => setModalStartScanNewBatch(false)}
                  >
                    NO
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </Box>
      ) : flag === "D" ? (
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Grid
            container
            justifyContent={"space-between"}
            sx={{ margin: "1%" }}
          >
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
                        {item.scan_mbid} - {item && item.cnt} {"UB"}
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
                <Collapse
                  in={listHeader === "" ? false : true}
                  sx={{ float: "right", width: "100%" }}
                >
                  <Grid item>
                    <Button
                      onClick={() => packaging()}
                      sx={{ float: "right", width: "15%" }}
                    >
                      <AddCircle sx={{ fontSize: 35, color: "teal" }} />
                    </Button>
                  </Grid>
                </Collapse>

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
                    sx={{ backgroundColor: "primary.main", marginLeft: "27em" }}
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
                    sx={{ backgroundColor: "primary.main", marginLeft: "33em" }}
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
                sx={{
                  float: "left",
                  backgroundColor: masterCodeBox !== "" ? "#E3E0DE" : "white",
                }}
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedSample}
                    onClick={() => checkSample()}
                  />
                }
                label="Retained Sample"
                sx={{ float: "left", mt: 2 }}
              />
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
            sx={{ mt: 2, float: "center", ml: 8 }}
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
                    sx={{
                      float: "left",
                      width: "100%",
                      backgroundColor:
                        detailBool !== true
                          ? masterCodeBox === "" ||
                            (index >= 0 && testing[index - 1] === "") ||
                            testing[index] !== ""
                            ? "#E3E0DE"
                            : disableBox === true
                            ? "blue"
                            : "white"
                          : "white",
                    }}
                    size="small"
                    // disabled={
                    //   detailBool !== true &&
                    //   masterCodeBox === "" &&
                    //   masterCodeBox.length != 58
                    //     ? true
                    //     : detailBool === true && isOpen[index] == false
                    //     ? false
                    //     : detailBool === true && isOpen[index] == true
                    //     ? true
                    //     : false
                    // }

                    disabled={
                      // detailBool !== true &&
                      // masterCodeBox === "" &&
                      // masterCodeBox.length != 58
                      //   ? true
                      //   : detailBool === true && isOpen[index] == false
                      //   ? false
                      //   : detailBool === true && isOpen[index] == true
                      //   ? true
                      //   : false
                      // testing[0] !== '' && testing[1] === ''
                      detailBool !== true
                        ? masterCodeBox === "" ||
                          (index >= 0 && testing[index - 1] === "") ||
                          testing[index] !== ""
                          ? true
                          : false
                        : isOpen[index] === true
                      //  &&
                      // testing[index - 1].length !== 56
                      // &&
                      // testing[index] !== ""
                      // &&
                      // testing[index] === ""
                    }
                  ></TextField>
                </Grid>

                {changeButton(item, index)}
              </Grid>
            ))}
          </Grid>

          <Grid sx={{ marginTop: 2, mr: 7 }}>
            <Button
              variant="contained"
              sx={{ float: "right", marginBottom: 2, ml: 2 }}
              onClick={() => finishScanningPackaging()}
              disabled={
                detailBool !== true
                  ? masterCodeBox === "" && testing[0] === ""
                  : disableFinishEdit
              }
            >
              Finish
            </Button>
            <Button
              variant="contained"
              sx={{ float: "right", marginBottom: 2, ml: 2 }}
              onClick={() => saveAndContinueButton()}
              disabled={
                masterCodeBox === "" || testing[0] === "" ? true : false
              }
              // disabled={masterCodeBox === "" && testing[0] === ""}
            >
              Save & Continue
            </Button>
            <Button
              variant="contained"
              sx={{ float: "right", marginBottom: 2 }}
              onClick={() => backScanningPackaging()}
            >
              Back
            </Button>
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
                    onClick={() => saveAndContinueFinish()}
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
