import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import logistic from "../../../services/logistic";
import { styled } from "@mui/material";
import { getStorage } from "../../../utils/storage";
import { debounce, isNull, isUndefined } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { formatDate } from "../../../utils/text";
import CloseIcon from "@mui/icons-material/Close";
import useToast from "../../../utils/toast";
import core from "../../../services/core";

const ModalWrapper = styled(Box)((props) => ({
  overflowY: props.scroll ? "scroll" : "unset",
  maxHeight: "80%",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "40px",
  background: "#ffffff",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
  borderRadius: "4px",
}));

const ModalInputWrapper = styled("div")((props) => ({
  background: props.backgroundColor,
  width: "330px",
  display: "flex",
  alignItems: props.alignItems ? props.alignItems : "center",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  p: 4,
};

const DetailSPDO = () => {
  const router = useRouter();
  const [displayToast, closeToast] = useToast();
  const debounceMountListDetailSPDilayani = useCallback(
    debounce(mountListDetailSPDilayani, 400),
    []
  );
  const debounceMountListAvailableBatch = useCallback(
    debounce(mountListAvailableBatch, 400),
    []
  );
  const debounceMountListTujuanGabungBatch = useCallback(
    debounce(mountListTujuanGabungBatch, 400),
    []
  );
  const debouncePutQtyScan = useCallback(debounce(requestEditQtyScan, 400), []);
  const debouncePutGabungBatch = useCallback(
    debounce(requestGabungBatch, 400),
    []
  );
  const debouncePutGantiBatch = useCallback(
    debounce(requestGantiBatch, 400),
    []
  );
  const debouncePutBelahBatch = useCallback(
    debounce(requestBelahBatch, 400),
    []
  );
  const debouncePostConfirmSP = useCallback(
    debounce(requestConfirmSP, 400),
    []
  );
  const debounceMountListProject = useCallback(
    debounce(mountListProject, 400),
    []
  );
  const userPT = JSON.parse(getStorage("pt"));
  const userOutlet = JSON.parse(getStorage("outlet"));
  const userNIP = getStorage("userNIP");
  const [listProject, setListProject] = useState(null);
  const [headerSP, setHeaderSP] = useState(null);
  const [detailSP, setDetailSP] = useState([]);
  const [produkToEdit, setProdukToEdit] = useState([]);
  const [modalEditQtyScanIsOpen, setModalEditQtyScanIsOpen] = useState(false);
  const [modalEditBatchIsOpen, setModalEditBatchIsOpen] = useState(false);
  const [editBatchMode, setEditBatchMode] = useState("");
  const [inputQtyScan, setInputQtyScan] = useState(0);
  const [inputPackScan, setInputPackScan] = useState(0);
  const [invalidQtyScan, setInvalidQtyScan] = useState(true);
  const [inputTujuanBatch, setInputTujuanBatch] = useState("null");
  const [listBatch, setListBatch] = useState([]);
  const [btnSimpanBatchIsDisabled, setBtnSimpanBatchIsDisabled] =
    useState(true);
  const [dialogConfirmSPIsOpen, setDialogConfirmSPIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!parsedAccess["LOGISTIC_SPDO"].includes("LOGISTIC_SPDO_VIEW")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  // SIDE EFFECT UNTUK MENGECEK ROUTER DAN MENGAMBIL LIST SP UNTUK DILAYANI
  useEffect(() => {
    if (!router.isReady) return;
    debounceMountListProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    if (!isNull(listProject)) {
      debounceMountListDetailSPDilayani(router.query.id, router.query.project);
    }
  }, [listProject]);

  // VALIDASI UNTUK MENUTUP MODAL EDIT QTY SCAN atau MODAL EDIT BATCH
  useEffect(() => {
    if (produkToEdit.length === 0) {
      setModalEditQtyScanIsOpen(false);
      setModalEditBatchIsOpen(false);
    }

    setInputQtyScan(0);
    setInputPackScan(0);
    setInvalidQtyScan(true);
    setEditBatchMode("");
    setListBatch([]);
  }, [produkToEdit]);

  useEffect(() => {
    console.log("header SP", headerSP);
    console.log("list batch", listBatch);
  }, [headerSP]);

  //VALIDASI UNTUK MEMBERSIHKAN FIELD INPUT SAAT GANTI MODE EDIT BATCH
  useEffect(() => {
    setInputQtyScan(0);
    setInputPackScan(0);
    setInvalidQtyScan(true);
    setInputTujuanBatch("null");
    setListBatch([]);
  }, [editBatchMode]);

  //VALIDASI UNTUK MEMASTIKAN QTY SCAN SUDAH SESUAI SATUAN
  useEffect(() => {
    if (!isNull(headerSP) && headerSP.tipebisnis !== "B2C") {
      if (isNaN(parseInt(inputQtyScan)) || isNaN(parseInt(inputPackScan))) {
        setInvalidQtyScan(true);
      } else if (editBatchMode === "") {
        if (
          (parseInt(inputQtyScan) %
            (produkToEdit[0] && produkToEdit[0].sell_unit) ===
            0 &&
            parseInt(inputQtyScan) <=
              (produkToEdit[0] && produkToEdit[0].qty_order) &&
            parseInt(inputPackScan) <=
              (produkToEdit[0] && produkToEdit[0].qty_order) /
                (produkToEdit[0] && produkToEdit[0].sell_unit)) ||
          (parseInt(inputQtyScan) === 0 && parseInt(inputPackScan) === 0)
        ) {
          setInvalidQtyScan(false);
        } else {
          setInvalidQtyScan(true);
        }
      } else if (editBatchMode === "BELAH") {
        var targetBatch = JSON.parse(inputTujuanBatch);
        if (
          parseInt(inputQtyScan) %
            (produkToEdit[0] && produkToEdit[0].sell_unit) ===
            0 &&
          parseInt(inputQtyScan) <
            (produkToEdit[0] && produkToEdit[0].qty_order) &&
          parseInt(inputPackScan) <
            (produkToEdit[0] && produkToEdit[0].qty_order) /
              (produkToEdit[0] && produkToEdit[0].sell_unit) &&
          parseInt(inputQtyScan) !== 0 &&
          parseInt(inputPackScan) !== 0 &&
          parseInt(inputQtyScan) <=
            (targetBatch !== null && targetBatch.qty_available)
        ) {
          setInvalidQtyScan(false);
        } else {
          setInvalidQtyScan(true);
        }
      } else {
        setInvalidQtyScan(true);
      }
    } else if (!isNull(headerSP) && headerSP.tipebisnis === "B2C") {
      if (isNaN(parseInt(inputQtyScan)) || isNaN(parseInt(inputPackScan))) {
        setInvalidQtyScan(true);
      } else {
        if (
          parseInt(inputQtyScan) <=
          (produkToEdit[0] && produkToEdit[0].qty_order)
        ) {
          setInvalidQtyScan(false);
        } else {
          setInvalidQtyScan(true);
        }
      }
    }
  }, [inputQtyScan, inputPackScan, produkToEdit, inputTujuanBatch, headerSP]);

  //SIDE EFFECT UNTUK MENGISI LIST BATCH SESUAI TIPE EDIT BATCH
  useEffect(() => {
    if (editBatchMode === "GANTI" || editBatchMode === "BELAH") {
      setIsLoading(true);
      debounceMountListAvailableBatch(router.query.id, headerSP, produkToEdit);
    } else if (editBatchMode === "GABUNG") {
      setIsLoading(true);
      debounceMountListTujuanGabungBatch(
        router.query.id,
        headerSP,
        produkToEdit
      );
    }
  }, [editBatchMode]);

  //SIDE EFFECT UNTUK ENABLE DAN DISABLE BTN SIMPAN EDIT BATCH
  useEffect(() => {
    if (editBatchMode === "GABUNG" || editBatchMode === "GANTI") {
      if (inputTujuanBatch === "null") {
        setBtnSimpanBatchIsDisabled(true);
      } else {
        setBtnSimpanBatchIsDisabled(false);
      }
    }

    if (editBatchMode === "BELAH") {
      if (inputTujuanBatch === "null" || invalidQtyScan) {
        setBtnSimpanBatchIsDisabled(true);
      } else {
        setBtnSimpanBatchIsDisabled(false);
      }
    }
  }, [inputTujuanBatch, invalidQtyScan, editBatchMode]);

  async function mountListDetailSPDilayani(noSP, project) {
    const newParams = {
      pt: userPT.pt_id,
      outcode: userOutlet.out_code,
      project: project,
      updated_by: userNIP,
    };
    try {
      const getDetailSP = await logistic.getDetailSPDilayani(noSP, newParams);
      const { data } = getDetailSP.data;
      setHeaderSP(data);
      setDetailSP(data.details);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      displayToast("error", "Gagal Mengambil Detail SP");
    }
  }

  async function mountListProject() {
    setIsLoading(true);
    try {
      const getProject = await core.getListProject();
      const { data, error } = getProject.data;
      if (error.status === false) {
        setListProject(data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function mountListAvailableBatch(noSp, header, produk) {
    const newParams = {
      pt: header.pt_id,
      outcode: header.outcode,
      procode: produk[0] && produk[0].procode,
    };
    try {
      const getListAvailableBatch = await logistic.getAvailableBatch(
        noSp,
        newParams
      );
      const { data } = getListAvailableBatch.data;
      if (data.length > 0) {
        setListBatch(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      displayToast("error", "Gagal Mengambil List Batch");
      setIsLoading(false);
    }
  }

  async function mountListTujuanGabungBatch(noSP, header, produk) {
    const newParams = {
      pt: header.pt_id,
      project: header.project_id,
      outcode: header.outcode,
      procode: produk[0] && produk[0].procode,
      batch: produk[0] && produk[0].batch,
    };
    try {
      const getListTujuanGabungBatch = await logistic.getTujuanGabungBatch(
        noSP,
        newParams
      );
      const { data } = getListTujuanGabungBatch.data;
      if (data.length > 0) {
        setListBatch(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      displayToast("error", "Gagal Mengambil List Batch");
      setIsLoading(false);
    }
  }

  async function requestEditQtyScan(noSP, header, produk, qtyToEdit) {
    setIsLoading(true);
    var payload = {
      pt_id: header.pt_id,
      project_id: header.project_id,
      outcode: header.outcode,
      sp_id: noSP,
      procode: produk[0] && produk[0].procode,
      batch: produk[0] && produk[0].batch,
      exp_date: produk[0] && produk[0].exp_date,
      qty: !isNaN(parseInt(qtyToEdit)) && parseInt(qtyToEdit),
      updated_by: userNIP,
    };
    try {
      const editQtyScan = await logistic.putEditQtyScan(noSP, payload);
      const { data } = editQtyScan;
      if (data.error.status === false) {
        window.location.reload();
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function requestGabungBatch(noSP, header, produk, newBatch) {
    setIsLoading(true);
    var batchInfo = JSON.parse(newBatch);
    var payload = {
      pt_id: header.pt_id,
      project_id: header.project_id,
      outcode: header.outcode,
      sp_id: noSP,
      procode: produk[0] && produk[0].procode,
      batch: produk[0] && produk[0].batch,
      exp_date: produk[0] && produk[0].exp_date,
      new_batch: batchInfo.batch,
      new_exp_date: batchInfo.exp_date,
      qty: produk[0] && produk[0].qty_order,
      updated_by: userNIP,
    };
    try {
      const editGabungBatch = await logistic.putGabungBatch(noSP, payload);
      const { data } = editGabungBatch;
      if (data.error.status === false) {
        window.location.reload();
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function requestGantiBatch(noSP, header, produk, newBatch) {
    setIsLoading(true);
    var batchInfo = JSON.parse(newBatch);
    var payload = {
      pt_id: header.pt_id,
      project_id: header.project_id,
      outcode: header.outcode,
      sp_id: noSP,
      procode: produk[0] && produk[0].procode,
      batch: produk[0] && produk[0].batch,
      exp_date: produk[0] && produk[0].exp_date,
      new_batch: batchInfo.batch,
      new_exp_date: batchInfo.exp_date,
      qty: produk[0] && produk[0].qty_order,
      updated_by: userNIP,
    };
    try {
      const editGantiBatch = await logistic.putGantiBatch(noSP, payload);
      const { data } = editGantiBatch;
      if (data.error.status === false) {
        window.location.reload();
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function requestBelahBatch(noSP, header, produk, newQty, newBatch) {
    setIsLoading(true);
    var batchInfo = JSON.parse(newBatch);
    var payload = {
      pt_id: header.pt_id,
      project_id: header.project_id,
      outcode: header.outcode,
      sp_id: noSP,
      procode: produk[0] && produk[0].procode,
      batch: produk[0] && produk[0].batch,
      exp_date: produk[0] && produk[0].exp_date,
      new_batch: batchInfo.batch,
      new_exp_date: batchInfo.exp_date,
      qty: newQty,
      updated_by: userNIP,
    };
    try {
      const editBelahBatch = await logistic.putBelahBatch(noSP, payload);
      const { data } = editBelahBatch;
      if (data.error.status === false) {
        window.location.reload();
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function requestConfirmSP(noSP, header) {
    setIsLoading(true);
    var payload = {
      pt_id: header.pt_id,
      project_id: header.project_id,
      outcode: header.outcode,
      sp_id: noSP,
      updated_by: userNIP,
    };
    try {
      const confirmSP = await logistic.postConfirmSP(noSP, payload);
      const { data } = confirmSP;

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Dokumen_${header.outcode}_${header.noref}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      router.push("/spdo");
    } catch (error) {
      console.log("error", error);
    }
  }

  function openModalEditProduk(type, item) {
    var tempArr = [];
    tempArr.push(item);
    if (type === "SCAN") {
      setModalEditQtyScanIsOpen(true);
    }

    if (type === "BATCH") {
      setModalEditBatchIsOpen(true);
    }
    setProdukToEdit(tempArr);
  }

  function handleInputScan(value, type) {
    if (type === "SCAN" && headerSP.tipebisnis !== "B2C") {
      setInputQtyScan(value);
      setInputPackScan(
        Math.floor(value / (produkToEdit[0] && produkToEdit[0].sell_unit))
      );
    }
    if (type === "PACK" && headerSP.tipebisnis !== "B2C") {
      setInputPackScan(value);
      setInputQtyScan(
        Math.floor(value * (produkToEdit[0] && produkToEdit[0].sell_unit))
      );
    }

    if (type === "SCAN" && headerSP.tipebisnis === "B2C") {
      setInputQtyScan(value);
      setInputPackScan(Math.floor(value));
    }
    if (type === "PACK" && headerSP.tipebisnis === "B2C") {
      setInputPackScan(value);
      setInputQtyScan(Math.floor(value));
    }
  }

  function handleEditBatchProduk() {
    if (editBatchMode === "GABUNG") {
      debouncePutGabungBatch(
        router.query.id,
        headerSP,
        produkToEdit,
        inputTujuanBatch
      );
    }

    if (editBatchMode === "GANTI") {
      debouncePutGantiBatch(
        router.query.id,
        headerSP,
        produkToEdit,
        inputTujuanBatch
      );
    }

    if (editBatchMode === "BELAH") {
      debouncePutBelahBatch(
        router.query.id,
        headerSP,
        produkToEdit,
        parseInt(inputQtyScan),
        inputTujuanBatch
      );
    }
  }

  const returnTipeSP = (tipe) => {
    if (tipe === "S") {
      return "SALES";
    } else if (tipe == "T") {
      return "TRANSFER";
    }
  };

  const returnQtyOrder = (item) => {
    if (item.sell_pack === item.med_pack) {
      return `${item.qty_order} ${item.sell_pack_name}`;
    } else {
      return `${item.qty_order} ${item.sell_pack_name} (${
        item.qty_order / item.sell_unit
      } ${item.med_pack_name})`;
    }
  };

  const returnQtyScan = (item) => {
    let qtyColor = "red";

    if (item.qty_scan === item.qty_order) {
      qtyColor = "green";
    } else if (item.qty_scan === 0) {
      qtyColor = "red";
    } else if (item.qty_scan > 0) {
      qtyColor = "darkorange";
    }

    if (!isNull(headerSP) && headerSP.tipebisnis !== "B2C") {
      return (
        <Typography
          variant="subtitle2"
          sx={{ color: qtyColor, fontWeight: 400 }}
        >{`${item.qty_scan} ${item.sell_pack_name} (${Math.floor(
          item.qty_scan / item.sell_unit
        )} ${item.med_pack_name})`}</Typography>
      );
    }

    if (!isNull(headerSP) && headerSP.tipebisnis === "B2C") {
      return (
        <Typography
          variant="subtitle2"
          sx={{ color: qtyColor, fontWeight: 400 }}
        >{`${item.qty_scan} ${item.sell_pack_name}`}</Typography>
      );
    }
  };

  const returnProjectName = (item) => {
    var tempArr = [...listProject];
    var foundProject = tempArr.find((tp) => tp.prj_id === item.project_id);
    if (!isUndefined(foundProject)) {
      return foundProject.prj_name;
    } else {
      return "NOT FOUND";
    }
  };

  const returnEditBatchType = () => {
    if (editBatchMode === "BELAH") {
      return (
        <>
          <Grid container>
            <Grid item sx={{ alignItems: "center", justifyContent: "center" }}>
              <Typography variant="subtitle1">PILIH TUJUAN BATCH</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              flex={12}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Select
                value={inputTujuanBatch}
                fullWidth
                size="small"
                sx={{
                  backgroundColor: "white",
                }}
                onChange={(e) => setInputTujuanBatch(e.target.value)}
              >
                <MenuItem value={"null"} disabled>
                  ==PILIH TUJUAN BELAH BATCH==
                </MenuItem>
                {listBatch &&
                  listBatch.map((item, index) => (
                    <MenuItem key={index} value={JSON.stringify(item)}>
                      {`${item.batch} (Qty Available:${item.qty_available} ${
                        produkToEdit[0] && produkToEdit[0].sell_pack_name
                      })`}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 2 }}>
            <Grid item sx={{ alignItems: "center", justifyContent: "center" }}>
              <Typography variant="subtitle1">
                MASUKAN QTY PRODUK UNTUK DIBELAH
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item>
              <FormControl variant="outlined">
                <OutlinedInput
                  value={inputQtyScan}
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: "white",
                  }}
                  onChange={(e) => handleInputScan(e.target.value, "SCAN")}
                  endAdornment={
                    <InputAdornment position="end">
                      {produkToEdit[0] && produkToEdit[0].sell_pack_name}
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item flex={1} sx={{ textAlign: "center" }}>
              <Typography variant="h5" sx={{ mt: 0.5 }}>
                =
              </Typography>
            </Grid>
            <Grid item>
              <FormControl variant="outlined" sx>
                <OutlinedInput
                  value={inputPackScan}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: "white" }}
                  onChange={(e) => handleInputScan(e.target.value, "PACK")}
                  endAdornment={
                    <InputAdornment position="end">
                      {produkToEdit[0] && produkToEdit[0].med_pack_name}
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
          {!isNull(headerSP) &&
            headerSP.tipebisnis === "B2B" &&
            editBatchMode !== "BELAH" && (
              <FormHelperText>
                *Qty Scan harus merupakan kelipatan UNIT BOX (
                {produkToEdit[0] && produkToEdit[0].sell_unit}) atau 0 dan tidak
                boleh melebihi QTY ORDER (
                {produkToEdit[0] && produkToEdit[0].qty_order})
              </FormHelperText>
            )}

          {!isNull(headerSP) &&
            headerSP.tipebisnis === "B2B" &&
            editBatchMode === "BELAH" && (
              <FormHelperText>
                *Qty Belah harus merupakan kelipatan UNIT BOX (
                {produkToEdit[0] && produkToEdit[0].sell_unit}) atau 0 dan tidak
                boleh melebihi QTY ORDER (
                {produkToEdit[0] && produkToEdit[0].qty_order}) dan QTY
                AVAILABLE dari batch tujuan
              </FormHelperText>
            )}

          {/* {!isNull(headerSP) &&
            headerSP.tipebisnis === "B2C" &&
            editBatchMode !== "BELAH" && (
              <FormHelperText>
                *Qty Scan harus merupakan kelipatan UNIT ECER (
                {produkToEdit[0] && produkToEdit[0].sell_unit}) atau 0 dan tidak
                boleh melebihi Qty Order (
                {produkToEdit[0] && produkToEdit[0].qty_order})
              </FormHelperText>
            )} */}

          {/* {!isNull(headerSP) &&
            headerSP.tipebisnis === "B2C" &&
            editBatchMode === "BELAH" && (
              <FormHelperText>
                *Qty Belah harus merupakan kelipatan UNIT ECER (
                {produkToEdit[0] && produkToEdit[0].sell_unit}) atau 0 dan tidak
                boleh melebihi QTY ORDER (
                {produkToEdit[0] && produkToEdit[0].qty_order}) dan QTY
                AVAILABLE dari batch tujuan
              </FormHelperText>
            )} */}
        </>
      );
    }

    if (editBatchMode === "GANTI") {
      return (
        <>
          <Grid container>
            <Grid item sx={{ alignItems: "center", justifyContent: "center" }}>
              <Typography variant="subtitle1">
                PILIH TUJUAN GANTI BATCH
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              flex={12}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Select
                value={inputTujuanBatch}
                fullWidth
                size="small"
                sx={{
                  backgroundColor: "white",
                }}
                onChange={(e) => setInputTujuanBatch(e.target.value)}
              >
                <MenuItem value={"null"} disabled>
                  ==PILIH TUJUAN GANTI BATCH==
                </MenuItem>
                {listBatch &&
                  listBatch
                    .filter(
                      (item) =>
                        item.qty_available >=
                        (produkToEdit[0] && produkToEdit[0].qty_order)
                    )
                    .map((item, index) => (
                      <MenuItem key={index} value={JSON.stringify(item)}>
                        {item.batch}
                      </MenuItem>
                    ))}
              </Select>
            </Grid>
          </Grid>
        </>
      );
    }

    if (editBatchMode === "GABUNG") {
      return (
        <>
          <Grid container>
            <Grid item sx={{ alignItems: "center", justifyContent: "center" }}>
              <Typography variant="subtitle1">
                PILIH TUJUAN GABUNG BATCH
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              flex={12}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Select
                value={inputTujuanBatch}
                fullWidth
                size="small"
                sx={{
                  backgroundColor: "white",
                }}
                onChange={(e) => setInputTujuanBatch(e.target.value)}
              >
                <MenuItem value={"null"} disabled>
                  ==PILIH TUJUAN GABUNG BATCH==
                </MenuItem>
                {listBatch &&
                  listBatch.map((item, index) => (
                    <MenuItem value={JSON.stringify(item)} key={index}>
                      {item.batch}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
        </>
      );
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container sx={{ textAlign: "center" }}>
        <Grid item>
          <Button variant="contained" onClick={() => router.push("/spdo")}>
            LIST SP
          </Button>
        </Grid>
        <Grid item flex={9}>
          <Typography variant="h5">SPDO</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => setDialogConfirmSPIsOpen(true)}
          >
            CONFIRM SP
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item flex={3}>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              PROJECT
            </Typography>
            <TextField
              value={
                !isNull(headerSP) && !isNull(listProject)
                  ? returnProjectName(headerSP)
                  : ""
              }
              name="no_sp"
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "white" }}
              fullWidth
            />
          </Grid>
          <Grid item flex={3}>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              NO SP
            </Typography>
            <TextField
              value={!isNull(headerSP) && headerSP.sp_id}
              name="no_sp"
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "white" }}
              fullWidth
            />
          </Grid>
          <Grid item flex={3}>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              TGL SP
            </Typography>
            <TextField
              value={!isNull(headerSP) && formatDate(headerSP.tglsp)}
              name="tgl_do"
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "white" }}
              fullWidth
            />
          </Grid>
          <Grid item flex={3}>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              TIPE
            </Typography>
            <TextField
              value={returnTipeSP(!isNull(headerSP) && headerSP.tipe)}
              name="outlet"
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "white" }}
              fullWidth
            />
          </Grid>
          <Grid item flex={3}>
            <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
              OUTLET
            </Typography>
            <TextField
              value={!isNull(headerSP) && headerSP.tujuan}
              name="outlet"
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "white" }}
              fullWidth
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ my: 1 }} />
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    PROCODE
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    PRONAME
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    BATCH
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    ED BATCH
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    QTY ORDER
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    QTY SCAN
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    EDIT
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailSP &&
                detailSP.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                        {item.procode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                        {item.pro_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                        {item.batch}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                        {formatDate(item.exp_date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                        {returnQtyOrder(item)}
                      </Typography>
                    </TableCell>
                    <TableCell>{returnQtyScan(item)}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="warning"
                        sx={{ mr: 1 }}
                        onClick={() => openModalEditProduk("SCAN", item)}
                      >
                        QTY
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => openModalEditProduk("BATCH", item)}
                      >
                        BATCH
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL EDIT QTY SCAN START */}
      <Modal open={modalEditQtyScanIsOpen} disableAutoFocus={false}>
        <ModalWrapper>
          <Box sx={{ width: "100%" }}>
            <Grid container>
              <Grid item flex={9}>
                <Typography variant="h5">INFORMASI PRODUK</Typography>
              </Grid>
              <Grid item flex={3}>
                <IconButton
                  sx={{
                    position: "absolute",
                    right: "40px",
                    top: "20px",
                    color: "rgba(0, 0, 0, 0.4)",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    borderRadius: "8px",
                  }}
                  onClick={() => setProdukToEdit([])}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Divider sx={{ my: 3 }} />
            </Grid>
            <Card>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {" "}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          PROCODE
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          PRONAME
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          BATCH
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          QTY ORDER
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {produkToEdit &&
                      produkToEdit.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {item.procode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {item.pro_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {item.batch}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {returnQtyOrder(item)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Divider sx={{ my: 3 }} />
            <Grid container>
              <Grid
                item
                sx={{ alignItems: "center", justifyContent: "center" }}
              >
                <Typography variant="h5">MASUKAN QTY SCAN</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ my: 1 }}>
              <Grid item>
                <FormControl variant="outlined">
                  <OutlinedInput
                    value={inputQtyScan}
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: "white",
                    }}
                    onChange={(e) => handleInputScan(e.target.value, "SCAN")}
                    endAdornment={
                      <InputAdornment position="end">
                        {produkToEdit[0] && produkToEdit[0].sell_pack_name}
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item flex={1} sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 0.5 }}>
                  =
                </Typography>
              </Grid>
              <Grid item>
                <FormControl variant="outlined" sx>
                  <OutlinedInput
                    value={inputPackScan}
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "white" }}
                    onChange={(e) => handleInputScan(e.target.value, "PACK")}
                    endAdornment={
                      <InputAdornment position="end">
                        {produkToEdit[0] && produkToEdit[0].med_pack_name}
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
            {!isNull(headerSP) && headerSP.tipebisnis === "B2B" && (
              <FormHelperText>
                *Qty Scan harus merupakan kelipatan UNIT BOX (
                {produkToEdit[0] && produkToEdit[0].sell_unit}) atau 0 dan tidak
                boleh melebihi QTY ORDER (
                {produkToEdit[0] && produkToEdit[0].qty_order})
              </FormHelperText>
            )}

            {!isNull(headerSP) && headerSP.tipebisnis === "B2C" && (
              <FormHelperText>
                *Qty Scan harus merupakan kelipatan UNIT ECER (
                {produkToEdit[0] && produkToEdit[0].sell_unit}) atau 0 dan tidak
                boleh melebihi Qty Order (
                {produkToEdit[0] && produkToEdit[0].qty_order})
              </FormHelperText>
            )}
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={1}>
              <Grid item flex={6}>
                <Button
                  sx={{ float: "right" }}
                  variant="contained"
                  color="success"
                  disabled={invalidQtyScan}
                  onClick={() =>
                    debouncePutQtyScan(
                      router.query.id,
                      headerSP,
                      produkToEdit,
                      inputQtyScan
                    )
                  }
                >
                  Simpan
                </Button>
              </Grid>
              <Grid item flex={6}>
                <Button
                  sx={{ float: "left" }}
                  variant="contained"
                  color="warning"
                  onClick={() => setProdukToEdit([])}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </ModalWrapper>
      </Modal>
      {/* MODAL EDIT QTY SCAN END */}

      {/* MODAL EDIT BATCH START */}
      <Modal open={modalEditBatchIsOpen} disableAutoFocus={false}>
        <ModalWrapper>
          <Box sx={{ width: "100%" }}>
            <Grid container>
              <Grid item flex={9}>
                <Typography variant="h5">INFORMASI PRODUK</Typography>
              </Grid>
              <Grid item flex={3}>
                <IconButton
                  sx={{
                    position: "absolute",
                    right: "40px",
                    top: "20px",
                    color: "rgba(0, 0, 0, 0.4)",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    borderRadius: "8px",
                  }}
                  onClick={() => setProdukToEdit([])}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Divider sx={{ my: 3 }} />
            </Grid>
            <Card>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {" "}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          PROCODE
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          PRONAME
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          BATCH
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          QTY ORDER
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {produkToEdit &&
                      produkToEdit.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {item.procode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {item.pro_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {item.batch}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {`${item.qty_order} ${item.sell_pack_name} (${
                                item.qty_order / item.sell_unit
                              } ${item.med_pack_name})`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={2}>
              <Grid item flex={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  sx={{ mr: 1 }}
                  onClick={() => setEditBatchMode("BELAH")}
                >
                  BELAH
                </Button>
              </Grid>
              <Grid item flex={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{ mr: 1 }}
                  onClick={() => setEditBatchMode("GANTI")}
                >
                  GANTI
                </Button>
              </Grid>
              <Grid item flex={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => setEditBatchMode("GABUNG")}
                >
                  GABUNG
                </Button>
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid item flex={12}>
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", fontWeight: 400 }}
                >
                  {editBatchMode} BATCH
                </Typography>
              </Grid>
              <Grid container sx={{ mt: 2 }}>
                <Grid item flex={12}>
                  {returnEditBatchType()}
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={1}>
              <Grid item flex={6}>
                <Button
                  sx={{ float: "right" }}
                  variant="contained"
                  color="success"
                  disabled={btnSimpanBatchIsDisabled}
                  onClick={() => handleEditBatchProduk()}
                >
                  Simpan
                </Button>
              </Grid>
              <Grid item flex={6}>
                <Button
                  sx={{ float: "left" }}
                  variant="contained"
                  color="warning"
                  onClick={() => setProdukToEdit([])}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </ModalWrapper>
      </Modal>
      {/* MODAL EDIT BATCH END */}

      {/* DIALOG CONFIRM SP START */}
      <Dialog
        open={dialogConfirmSPIsOpen}
        onClose={() => setDialogConfirmSPIsOpen(false)}
      >
        <DialogTitle>Confirm SP</DialogTitle>
        <DialogContent>
          Apakah anda yakin ingin meng-confirm SP ini ?
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            color="warning"
            sx={{ mr: 2 }}
            onClick={() => setDialogConfirmSPIsOpen(false)}
          >
            Kembali
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => debouncePostConfirmSP(router.query.id, headerSP)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* DIALOG CONFIRM SP END */}

      {/* MODAL LOADING */}
      <Modal open={isLoading}>
        <Box sx={style} style={{ textAlign: "center" }}>
          <Typography>Mohon Tunggu Permintaan Anda Sedang Di Proses</Typography>
          <CircularProgress></CircularProgress>
        </Box>
      </Modal>
      {/* MODAL LOADING */}
    </Box>
  );
};
export default DetailSPDO;
