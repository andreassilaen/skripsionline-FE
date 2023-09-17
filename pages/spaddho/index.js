import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Modal,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material";
import logistic from "../../services/logistic";
import { getStorage } from "../../utils/storage";
import { debounce,isUndefined } from "lodash";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import useToast from "../../utils/toast";

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

const SPAddHO = () => {
  const router = useRouter();
  const [displayToast, closeToast] = useToast();
  const debounceMountListOutletTujuan = useCallback(
    debounce(mountListOutletTujuan, 400),
    []
  );
  const debounceMountListProdukSearched = useCallback(
    debounce(mountListProductSearched, 400),
    []
  );
  const debounceMountListBatch = useCallback(debounce(mountListBatch, 400), []);
  const debouncePostCreateSPAddHO = useCallback(
    debounce(requestCreateSPAddHO, 400),
    []
  );
  const [listProdukSearched, setListProdukSearched] = useState([]);
  const [produkToEdit, setProdukToEdit] = useState([]);
  const [listProdukToAdd, setListProdukToAdd] = useState([]);
  const [inputSearchProduk, setInputSearchProduk] = useState("");
  const [listOutletTujuan, setListOutletTujuan] = useState([]);
  const [selectOutletTujuan, setSelectOutletTujuan] = useState("null");
  const [modalAddProdukIsOpen, setModalAddProdukIsOpen] = useState(false);
  const [inputBatch, setInputBatch] = useState("null");
  const [inputQtyScan, setInputQtyScan] = useState(0);
  const [inputPackScan, setInputPackScan] = useState(0);
  const [invalidQtyScan, setInvalidQtyScan] = useState(true);
  const [listBatch, setListBatch] = useState([]);
  const [btnAddProdukIsDisabled, setBtnProdukIsDisabled] = useState(true);
  const [btnCreateSPAddHOIsDisabled, setBtnCreateSPAddHOIsDisabled] =
    useState(true);
  const [listUsedBatch, setListUsedBatch] = useState([]);
  const userPT = JSON.parse(getStorage("pt"));
  const userOutlet = JSON.parse(getStorage("outlet"));
  const userNIP = getStorage("userNIP");

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_SPADDHO")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (!router.isReady) return;
    debounceMountListOutletTujuan();
  }, [router.isReady]);

  //SIDE EFFECT UNTUK MENUTUP MODAL ADD PRODUK TO TRANSFER TABLE
  useEffect(() => {
    if (produkToEdit.length === 0) {
      setModalAddProdukIsOpen(false);
      setListBatch([]);
      setInputBatch("null");
      setInputQtyScan(0);
      setInputPackScan(0);
      setBtnProdukIsDisabled(true);
    } else if (produkToEdit.length === 1) {
      debounceMountListBatch(produkToEdit[0] && produkToEdit[0].pro_code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produkToEdit]);

  //SIDE EFFECT UNTUK VALIDASI SATUAN TRANSFER SESUAI DENGAN BATCH
  useEffect(() => {
    var targetBatch = JSON.parse(inputBatch);
    if (
      parseInt(inputQtyScan) %
        (produkToEdit[0] && produkToEdit[0].pro_sellunit) ===
        0 &&
      parseInt(inputPackScan) %
        (produkToEdit[0] && produkToEdit[0].pro_medunit) ===
        0 &&
      parseInt(inputQtyScan) !== 0 &&
      parseInt(inputPackScan) !== 0 &&
      parseInt(inputQtyScan) <=
        (targetBatch !== null && targetBatch.stck_qtyavailable)
    ) {
      setInvalidQtyScan(false);
    } else {
      setInvalidQtyScan(true);
    }
  }, [inputQtyScan, inputPackScan, produkToEdit, inputBatch]);

  //SIDE EFFECT UNTUK ENABLE / DISABLE BTN ADDD PRODUK TO TRANSFER TABLE
  useEffect(() => {
    if (inputBatch === "null" || invalidQtyScan) {
      setBtnProdukIsDisabled(true);
    } else {
      setBtnProdukIsDisabled(false);
    }
  }, [inputBatch, invalidQtyScan]);

  //SIDE EFFECT UNTUK ENABLE DAN DISABLE TOMBOL CREATE SP ADD HO
  useEffect(() => {
    if (listProdukToAdd.length > 0 && selectOutletTujuan !== "null") {
      setBtnCreateSPAddHOIsDisabled(false);
    } else {
      setBtnCreateSPAddHOIsDisabled(true);
    }
  }, [listProdukToAdd, selectOutletTujuan]);

  async function mountListOutletTujuan() {
    try {
      const newParams = {
        source: userOutlet.out_code,
      };
      const getListOutletTujuan = await logistic.getOutletTujuanByPTID(
        newParams
      );
      const { data, error } = getListOutletTujuan.data;
      if (error.status === false) {
        setListOutletTujuan(data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function mountListProductSearched(keyword) {
    try {
      const newParams = {
        key: keyword,
        pt: userPT.pt_id,
      };
      const getListProdukSearched = await logistic.getProductByKeyword(
        newParams
      );
      const { data, error } = getListProdukSearched.data;
      if (error.status === false && data.length > 0) {
        setListProdukSearched(data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function mountListBatch(procode) {
    try {
      const newParams = {
        pt: userPT.pt_id,
        outcode: userOutlet.out_code,
      };
      const getListBatch = await logistic.getBatchByProcode(procode, newParams);
      const { data, error } = getListBatch.data;
      if (error.status === false && data.length > 0) {
        setListBatch(data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function requestCreateSPAddHO(tujuan, listproduk) {
    var itemizedTujuan = JSON.parse(tujuan);
    var currDate = new Date();
    const unixDate = Math.floor(currDate.getTime() / 1000);
    try {
      var payload = {
        pt_id: userPT.pt_id,
        project_id: 0,
        outcode: userOutlet.out_code,
        tujuan: itemizedTujuan.outcode,
        noref: `${userOutlet.out_code}${unixDate}`,
        tipe: "T",
        updated_by: userNIP,
        details: listproduk,
      };
      console.log("payload", payload);
      const createSPAddHO = await logistic.postCreateSPAddHO(payload);
      const { data, error } = createSPAddHO;
      console.log("data", data);
      if (error.status === false) {
        displayToast("success", "Berhasil Create SP Add HO");
      } else {
        displayToast("error", "Gagal Create SP Add HO");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  function addProdukToTransferTable(produk) {
    var newProduk = {
      ...produk,
      batch: "",
      exp_date: "",
      qty: 0,
    };
    setProdukToEdit([newProduk]);
    setModalAddProdukIsOpen(true);
  }

  function removeProductFromTransferTable(produk) {
    var tempArr = [...listProdukToAdd];
    var filteredArr = tempArr.filter((item) => item.procode !== produk.procode);
    setListProdukToAdd(filteredArr);
  }

  function finalizeAddProdukToTransferTable() {
    var tempArr = [...listProdukToAdd];
    var tempBatchArr = [...listUsedBatch];
    var batchToTransfer = JSON.parse(inputBatch);
    var produkToTransfer = {
      procode: produkToEdit[0] && produkToEdit[0].pro_code,
      proname: produkToEdit[0] && produkToEdit[0].pro_name2,
      batch: batchToTransfer.stck_batchnumber,
      exp_date: batchToTransfer.stck_expdate,
      qty: parseInt(inputQtyScan),
      pro_sellpackname: produkToEdit[0] && produkToEdit[0].pro_sellpackname,
      pro_medpackname: produkToEdit[0] && produkToEdit[0].pro_medpackname,
      pack: parseInt(inputPackScan),
      pro_medunit: produkToEdit[0] && produkToEdit[0].pro_medunit,
      pro_sellunit: produkToEdit[0] && produkToEdit[0].pro_sellunit,
    };
    tempArr.push(produkToTransfer);
    tempBatchArr.push(batchToTransfer.stck_batchnumber);
    setListProdukToAdd(tempArr);
    setListUsedBatch(tempBatchArr);
    setProdukToEdit([]);
  }

  function handleSearchByEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      debounceMountListProdukSearched(inputSearchProduk);
    }
  }

  function handleInputSatuanTransfer(type, value) {
    if (type === "QTY") {
      setInputQtyScan(value);
      setInputPackScan(
        Math.floor(value / (produkToEdit[0] && produkToEdit[0].pro_sellunit))
      );
    }
    if (type === "PACK") {
      setInputPackScan(value);
      setInputQtyScan(
        Math.floor(value * (produkToEdit[0] && produkToEdit[0].pro_sellunit))
      );
    }
  }

  const returnProdukBatchAndQtyField = () => {
    return (
      <>
        <Grid container>
          <Grid item sx={{ alignItems: "center", justifyContent: "center" }}>
            <Typography variant="subtitle1">PILIH BATCH</Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            flex={12}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            <Select
              fullWidth
              size="small"
              sx={{
                backgroundColor: "white",
              }}
              value={inputBatch}
              onChange={(e) => setInputBatch(e.target.value)}
            >
              <MenuItem value={"null"} disabled>
                ==PILIH BATCH==
              </MenuItem>
              {listBatch &&
                listBatch
                  .filter(
                    (item) =>
                      item.stck_qtyavailable >
                        (produkToEdit[0] && produkToEdit[0].pro_sellunit) &&
                      !listUsedBatch.includes(item.stck_batchnumber)
                  )
                  .map((item, index) => (
                    <MenuItem key={index} value={JSON.stringify(item)}>
                      {`${item.stck_batchnumber} (Qty Available:${item.stck_qtyavailable})`}
                    </MenuItem>
                  ))}
            </Select>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <Grid item sx={{ alignItems: "center", justifyContent: "center" }}>
            <Typography variant="subtitle1">MASUKAN QTY TRANSFER</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item>
            <FormControl variant="outlined">
              <OutlinedInput
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "white",
                }}
                endAdornment={
                  <InputAdornment position="end">
                    {produkToEdit[0] && produkToEdit[0].pro_sellpackname}
                  </InputAdornment>
                }
                value={inputQtyScan}
                onChange={(e) =>
                  handleInputSatuanTransfer("QTY", e.target.value)
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
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "white" }}
                endAdornment={
                  <InputAdornment position="end">
                    {produkToEdit[0] && produkToEdit[0].pro_medpackname}
                  </InputAdornment>
                }
                value={inputPackScan}
                onChange={(e) =>
                  handleInputSatuanTransfer("PACK", e.target.value)
                }
              />
            </FormControl>
          </Grid>
        </Grid>
        <FormHelperText>
          *Qty Transfer harus merupakan kelipatan SATUAN (
          {produkToEdit[0] && produkToEdit[0].pro_sellunit}{" "}
          {produkToEdit[0] && produkToEdit[0].pro_sellpackname}) dan tidak boleh
          melebihi QTY AVAILABLE BATCH atau 0
        </FormHelperText>
      </>
    );
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography
        sx={{ textAlign: "center", p: 2, fontWeight: 600 }}
        variant="h5"
      >
        SP ADD HO
      </Typography>
      <Card variant="outlined">
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item flex={6}>
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                SEARCH PRODUK
              </Typography>
              <TextField
                placeholder="Masukan Procode atau Proname dan tekan enter untuk mencari"
                value={inputSearchProduk}
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "white" }}
                fullWidth
                onChange={(e) => setInputSearchProduk(e.target.value)}
                onKeyDown={(e) => handleSearchByEnter(e)}
              />
            </Grid>
            <Grid item flex={6}>
              <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                PILIH OUTLET TUJUAN
              </Typography>
              <Select
                value={selectOutletTujuan}
                fullWidth
                size="small"
                sx={{
                  backgroundColor: "white",
                }}
                onChange={(e) => setSelectOutletTujuan(e.target.value)}
              >
                <MenuItem value={"null"} disabled>
                  ==PILIH OUTLET TUJUAN==
                </MenuItem>
                {listOutletTujuan &&
                  listOutletTujuan.map((item, index) => (
                    <MenuItem
                      key={index}
                      value={JSON.stringify(item)}
                    >{`${item.outcode}-${item.name}`}</MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid item flex={12}>
              <Typography
                sx={{ textAlign: "center", p: 1, fontWeight: 600 }}
                variant="subtitle"
              >
                PRODUK DICARI
              </Typography>
              <Divider />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item flex={12}>
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
                        SATUAN
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        ACTION
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listProdukSearched &&
                    listProdukSearched.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 400 }}
                          >
                            {item.pro_code}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 400 }}
                          >
                            {item.pro_name2}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 400 }}
                          >
                            {`${item.pro_sellunit} ${item.pro_sellpackname} (${item.pro_medunit} ${item.pro_medpackname})`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => addProdukToTransferTable(item)}
                          >
                            <AddIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ my: 2 }}>
        <CardContent>
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid item flex={12}>
              <Typography
                sx={{ textAlign: "center", p: 1, fontWeight: 600 }}
                variant="subtitle"
              >
                PRODUK YANG AKAN DITAMBAHKAN
              </Typography>
              <Divider />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item flex={12}>
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
                        QTY TRANSFER
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        ACTION
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listProdukToAdd &&
                    listProdukToAdd.map((item, index) => (
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
                            {item.proname}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.batch}</TableCell>
                        <TableCell>
                          {`${item.qty} ${item.pro_sellpackname} (${item.pack} ${item.pro_medpackname})`}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() => removeProductFromTransferTable(item)}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="success"
            disabled={btnCreateSPAddHOIsDisabled}
            onClick={() =>
              debouncePostCreateSPAddHO(selectOutletTujuan, listProdukToAdd)
            }
          >
            Create SP Add HO
          </Button>
        </CardActions>
      </Card>

      {/* MODAL ADD PRODUK START */}
      <Modal open={modalAddProdukIsOpen} disableAutoFocus={false}>
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
                          SATUAN
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
                              {item.pro_code}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {item.pro_name2}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 400 }}
                            >
                              {`${item.pro_sellunit} ${item.pro_sellpackname} (${item.pro_medunit} ${item.pro_medpackname})`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Divider sx={{ mt: 3 }} />
            <Grid container sx={{ mt: 1 }}>
              <Grid item flex={12}>
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", fontWeight: 400 }}
                >
                  BATCH dan QTY TRANSFER
                </Typography>
              </Grid>
              <Grid container sx={{ mt: 2 }}>
                <Grid item flex={12}>
                  {returnProdukBatchAndQtyField()}
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
                  disabled={btnAddProdukIsDisabled}
                  onClick={() => finalizeAddProdukToTransferTable()}
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
      {/* MODAL ADD PRODUK END */}
    </Box>
  );
};
export default SPAddHO;
