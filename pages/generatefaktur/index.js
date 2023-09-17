import {
  Typography,
  Paper,
  Button,
  Select,
  Grid,
  FormControl,
  TableHead,
  TableBody,
  Table,
  TableRow,
  TableCell,
  InputLabel,
  Divider,
  TextField,
  MenuItem,
  Checkbox,
  Modal,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect, useCallback } from "react";
import PrintIcon from "@mui/icons-material/Print";
import { debounce, filter, isUndefined } from "lodash";
import api from "../../services/logistic";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { getStorage } from "../../utils/storage";

const GenerateFaktur = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);

  const [resultListFaktur, setResultListFaktur] = useState([]);
  const [disableInput, setDisableInput] = useState(true);
  const [disableButtonSearch, setDisableButtonSearch] = useState(true);
  const [inputtedSearch, setInputtedSearch] = useState("");
  const [messageError, setMessageError] = useState("");

  const router = useRouter();
  const [inputtedNoDO, setInputtedNoDO] = useState("");
  const [limit, setLimit] = useState(5);
  const [maxPage, setMaxPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [editCurrentPage, setEditCurrentPage] = useState(1);

  const [paginationShow, setPaginationShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [arrProduct, setArrProduct] = useState([]);
  const [disablePrintAll, setDisablePrintAll] = useState(true);

  const [responseHeader, setResponseHeader] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const PTID = JSON.parse(getStorage("pt")).pt_id;
  const gudangID = JSON.parse(getStorage("outlet")).out_code;
  const language = getStorage("language");

  const debounceMountPrintFaktur = useCallback(debounce(mountPrintFaktur, 400));
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_GENERATE_FAKTUR")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  async function mountPrintFaktur(item) {
    setIsLoading(true);
    try {
      const printFaktur = await api.printFaktur(
        PTID,
        gudangID,
        item.fakturpajak
      );
      var urlPrint = printFaktur.config.baseURL + printFaktur.config.url;
      fetch(urlPrint).then((response) => {
        if (response.status === 200) {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = item.nofaktur + ".pdf";
            a.click();
            setIsLoading(false);
          });
        }
      });
      setIsLoading(false);
    } catch (error) {
      setResponseHeader("RESPONSE");
      setResponseBody(error.message);
      setResponseModalIsOpen(true);
      setIsLoading(false);
    }
  }

  const debounceMountPrintAllFaktur = useCallback(
    debounce(mountPrintAllFaktur, 400)
  );

  async function mountPrintAllFaktur() {
    setIsLoading(true);
    try {
      let pushedArrSave = [];
      var listChecked = resultListFaktur.filter((item) =>
        arrProduct.includes(item.nofaktur)
      );

      for (var item of listChecked) {
        pushedArrSave.push({
          ptid: PTID,
          outcode: gudangID,
          fakturpajak: item.fakturpajak,
        });
      }

      var payload = {
        data: pushedArrSave,
      };
      const option = {
        method: "POST",
        json: true,
        body: JSON.stringify(payload),
      };
      console.log("payload", payload);
      console.log("nofaktur", item.nofaktur);

      const printAllFaktur = await api.printAllFaktur(payload);
      const urlPrint =
        printAllFaktur.config.baseURL + printAllFaktur.config.url;

      console.log("printallfaktur", printAllFaktur);
      console.log("url", urlPrint);
      fetch(urlPrint, option).then((response) => {
        console.log("res", response);
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;

          if (arrProduct.length <= 1) {
            a.download = arrProduct[0] + ".pdf";
          } else {
            a.download = arrProduct[0] + " - " + item.nofaktur + ".pdf";
          }

          a.click();
        });
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setResponseHeader("RESPONSE");
      setResponseBody(error.message);
      setResponseModalIsOpen(true);
      setIsLoading(false);
    }
  }

  const debounceMountGenerateFaktur = useCallback(
    debounce(mountGenerateFaktur, 400)
  );

  async function mountGenerateFaktur() {
    setIsLoading(true);
    setOpenModal(false);
    try {
      const generatefaktur = await api.generateFakturByNoDo(
        PTID,
        gudangID,
        inputtedNoDO
      );
      const urlGenerate =
        generatefaktur.config.baseURL + generatefaktur.config.url;
      if (generatefaktur.status === 200) {
        fetch(urlGenerate).then((response) => {
          if (response.status === 200) {
            response.blob().then((blob) => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement("a");
              a.href = url;
              a.download = inputtedNoDO + ".pdf";
              a.click();
              setOpenModal(false);
              setInputtedNoDO("");
            });
          } else {
            setResponseHeader("RESPONSE");
            setResponseBody(error.message);
            setResponseModalIsOpen(true);
          }
          setIsLoading(false);
        });
      }
    } catch (error) {
      setIsLoading(false);
      setResponseHeader("RESPONSE");
      setResponseBody(error.message);
      setResponseModalIsOpen(true);
    }
  }

  const debounceMountSearchFakturPajak = useCallback(
    debounce(mountSearchFakturPajak, 400)
  );

  async function mountSearchFakturPajak() {
    setIsLoading(true);
    try {
      const searchFakturPajak = await api.searchFakturPajak(
        PTID,
        gudangID,
        type,
        inputtedSearch
      );
      const { data } = searchFakturPajak.data;
      if (data.nofaktur !== "") {
        setResultListFaktur([data]);
        setOpenCollapse(true);
        setPaginationShow(false);
        setIsLoading(false);
      } else {
        setResponseHeader("RESPONSE");
        setResponseBody("DATA NOT FOUND !");
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setResponseHeader("RESPONSE");
      setResponseBody(error.message);
      setResponseModalIsOpen(true);
      setIsLoading(false);
    }
  }

  const debounceMountGetListFaktur = useCallback(
    debounce(mountGetListFaktur, 400)
  );

  async function mountGetListFaktur() {
    setIsLoading(true);
    const offset = limit * currentPage - limit;
    try {
      setInputtedSearch("");

      const getListFaktur = await api.getListFaktur(
        PTID,
        gudangID,
        offset,
        limit
      );
      const { data } = getListFaktur.data;
      if (data !== null) {
        setOpenCollapse(false);
        setResultListFaktur(data);
        setPaginationShow(true);
        setIsLoading(false);
      } else {
        setOpenCollapse(true);
        setResponseHeader("RESPONSE");
        setResponseBody("DATA NOT FOUND !");
        setResponseModalIsOpen(true);
        setResultListFaktur([]);
        setIsLoading(false);
      }
    } catch (error) {
      setResponseHeader("RESPONSE");
      setResponseBody(error.message);
      setResponseModalIsOpen(true);
      setIsLoading(false);
    }
  }

  const debounceMountGetTotalFaktur = useCallback(
    debounce(mountGetTotalFaktur, 400)
  );

  async function mountGetTotalFaktur() {
    try {
      const getTotalFaktur = await api.getTotalFaktur(PTID, gudangID);
      const { data, metadata } = getTotalFaktur.data;
      setMaxPage(parseInt(Math.ceil(metadata / limit)));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    debounceMountGetListFaktur();
    debounceMountGetTotalFaktur();
  }, [limit, currentPage]);

  function handleNextPage() {
    var next = 0;
    next = parseInt(editCurrentPage) + 1;
    setEditCurrentPage(next);
    setCurrentPage(next);
    if (editCurrentPage > maxPage) {
      setEditCurrentPage(maxPage);
      setCurrentPage(maxPage);
    } else if (editCurrentPage < 1) {
      setEditCurrentPage(1);
      setCurrentPage(1);
    }
  }

  function handlePrevPage() {
    var prev = 0;
    prev = parseInt(editCurrentPage) - 1;
    setEditCurrentPage(prev);
    setCurrentPage(prev);
    if (editCurrentPage > maxPage) {
      setEditCurrentPage(maxPage);
      setCurrentPage(maxPage);
    } else if (editCurrentPage < 1) {
      setEditCurrentPage(1);
      setCurrentPage(1);
    }
  }

  function handleLastPage() {
    setEditCurrentPage(maxPage);
    setCurrentPage(maxPage);
    if (editCurrentPage > maxPage) {
      setEditCurrentPage(maxPage);
      setCurrentPage(maxPage);
    } else if (editCurrentPage < 1) {
      setEditCurrentPage(1);
      setCurrentPage(1);
    }
  }

  function handleFirstPage() {
    setEditCurrentPage(1);
    setCurrentPage(1);
    if (editCurrentPage > maxPage) {
      setEditCurrentPage(maxPage);
      setCurrentPage(maxPage);
    } else if (editCurrentPage < 1) {
      setEditCurrentPage(1);
      setCurrentPage(1);
    }
  }

  function enterPressDone(e) {
    switch (e.key) {
      case "Enter":
        debounceMountGenerateFaktur();
        break;
      default:
    }
  }

  useEffect(() => {
    setEditCurrentPage(1);
    setCurrentPage(1);
  }, [limit]);

  useEffect(() => {
    if (inputtedSearch === "") {
      setDisableButtonSearch(true);
    } else {
      setDisableButtonSearch(false);
    }
  }, [inputtedSearch]);

  useEffect(() => {
    setInputtedSearch("");
    if (type === "" || type === null) {
      setDisableInput(true);
    } else {
      setDisableInput(false);
    }
  }, [type]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    p: 4,
  };

  function handleEnterPress(e) {
    var code = e.charCode || e.which;
    if (code === 13) {
      e.preventDefault();
      debounceMountSearchFakturPajak();
    }
  }

  function closeScanDo() {
    setOpenModal(false);
    setInputtedNoDO("");
  }

  const pindahKeDetail = (item) => {
    router.push(`/generatefaktur/${item.fakturpajak}`);
  };

  function handleAllChecked(e) {
    var checked = e.target.checked;
    var datas = resultListFaktur;
    var tempArr = [...arrProduct];

    const id = e.target.getAttribute("id");
    if (checked === true) {
      tempArr = datas.map((product) => {
        return product.nofaktur;
      });

      // datas.map((product) => {
      //   tempArr.push(product.nofaktur);
      //   return product.nofaktur;
      // });
      setArrProduct(tempArr);
      setDisablePrintAll(false);
      // console.log("temptrue", tempArr);
      console.log("temptrue");
    }
    if (checked === false) {
      datas.map((product) => console.log("prod", product.nofaktur));
      datas.map(
        (product) =>
          (tempArr = tempArr.filter((item) => !item.includes(product.nofaktur)))
      );
      console.log("tempfalse", tempArr);
      setArrProduct(tempArr);
    }
  }
  // tempArr.filter((item) => !item.includes(value));
  useEffect(() => {
    console.log("arrpro", arrProduct);

    if (arrProduct.length === 0) {
      setDisablePrintAll(true);
    } else {
      setDisablePrintAll(false);
    }
  }, [arrProduct]);

  function handleCheck(e) {
    const target = e.target;
    const value = target.value;
    var tempArr = [...arrProduct];

    if (
      target.checked === true &&
      tempArr.filter((item) => !item.includes(value))
    ) {
      tempArr.push(value);
      setArrProduct(tempArr);
    }
    if (target.checked === false) {
      tempArr = tempArr.filter((item) => !item.includes(value));
      setArrProduct(tempArr);
    }
  }

  function handleEnterPressPage(e) {
    var code = e.charCode || e.which;
    if (code === 13 && editCurrentPage !== "") {
      e.preventDefault();
      if (parseInt(editCurrentPage) > maxPage) {
        setEditCurrentPage(maxPage);
        setCurrentPage(maxPage);
      } else if (
        parseInt(editCurrentPage) < 0 ||
        parseInt(editCurrentPage) == 0
      ) {
        setEditCurrentPage(1);
        setCurrentPage(1);
      } else {
        setEditCurrentPage(e.target.value);
        setCurrentPage(e.target.value);
      }
    }
  }

  const handleChange = (e) => {
    var regexNumber = /^-?\d*\.?\d*$/;
    if (maxPage !== "") {
      if (!regexNumber.test(e.target.value)) {
      } else {
        setEditCurrentPage(e.target.value);
      }
    }
  };

  function onChangeLimit(e) {
    setLimit(e.target.value);
    setCurrentPage(1);
    setEditCurrentPage(1);
  }

  return (
    <Box alignItems="flex-start" sx={{ width: "100%", p: 3 }}>
      <Paper sx={{ mt: "5%", ml: "2%", mr: "2%" }}>
        <Grid spacing={2} container justifyContent="space-between" ml={2}>
          <Grid item flex={2}>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "primary" }}
              onClick={() => setOpenModal(true)}
            >
              {" "}
              SCAN TRANNO
            </Button>
          </Grid>
          <Grid item flex={2}>
            <FormControl
              sx={{
                backgroundColor: "white",
              }}
              fullWidth
            >
              <InputLabel size="small">
                {language === "ID" ? "Tampilkan Semua" : "Display All"}
              </InputLabel>
              <Select
                size={"small"}
                fullWidth
                label={language === "ID" ? "Tampilkan Semua" : "Display All"}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value={"OrderID"}>ORDER ID</MenuItem>
                <MenuItem value={"NoTranno"}>NO TRANNO</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item flex={7}>
            <TextField
              size="small"
              disabled={disableInput}
              variant="outlined"
              sx={{ width: "100%" }}
              label={language === "ID" ? "Cari..." : "Search..."}
              value={inputtedSearch}
              onChange={(e) => setInputtedSearch(e.target.value)}
              onKeyDown={(e) => handleEnterPress(e)}
            ></TextField>
          </Grid>
          <Grid item>
            <Button
              size="normal"
              variant="contained"
              disabled={disableButtonSearch}
              onClick={() => debounceMountSearchFakturPajak()}
            >
              {<SearchIcon />}
            </Button>
          </Grid>
          <Grid item flex={1}>
            <Collapse in={openCollapse}>
              <Button
                onClick={() => debounceMountGetListFaktur()}
                size="normal"
                variant="contained"
              >
                {<RefreshIcon />}
              </Button>
            </Collapse>
          </Grid>
        </Grid>
        <Grid sx={{ textAlign: "center" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>
                  {" "}
                  <Checkbox
                    id={currentPage}
                    indeterminate={
                      arrProduct.length !== 0 &&
                      arrProduct.length !== resultListFaktur.length
                    }
                    checked={
                      resultListFaktur.length === 0
                        ? false
                        : arrProduct.length === resultListFaktur.length
                    }
                    disabled={resultListFaktur.length === 0}
                    onChange={(e) => handleAllChecked(e)}
                  ></Checkbox>{" "}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  {language === "ID" ? "No Faktur" : "Invoice Number"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  {language === "ID" ? "Tanggal Faktur" : "Invoice Date"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  {language === "ID" ? "Faktur Pajak" : "Tax Invoice"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  {language === "ID" ? "ID Pemesanan" : "Order ID"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  {language === "ID" ? "Aksi" : "Action"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultListFaktur &&
                resultListFaktur.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {" "}
                      <Checkbox
                        name={item.nofaktur}
                        checked={arrProduct.includes(item.nofaktur)}
                        value={item.nofaktur}
                        onChange={(e) => handleCheck(e)}
                      ></Checkbox>{" "}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.nofaktur === "" || item.nofaktur === null
                        ? "-"
                        : item.nofaktur}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.tglfaktur === "" || item.tglfaktur === null
                        ? "-"
                        : item.tglfaktur}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.fakturpajak === "" || item.fakturpajak === null
                        ? "-"
                        : item.fakturpajak}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.orderid === "" || item.orderid === null
                        ? "-"
                        : item.orderid}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        size="normal"
                        onClick={() => pindahKeDetail(item)}
                      >
                        {<RemoveRedEyeIcon />}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => debounceMountPrintFaktur(item)}
                        size="normal"
                        sx={{ ml: "1%" }}
                        disabled={!arrProduct.includes(item.nofaktur)}
                      >
                        {<PrintIcon />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Collapse in={paginationShow} sx={{ marginRight: 10 }}>
            <Grid
              container
              direction="row"
              spacing={2}
              sx={{ justifyContent: "center" }}
              mt={2}
            >
              <Grid item>
                <Select
                  size="small"
                  value={limit}
                  onChange={(e) => onChangeLimit(e)}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <Button
                  sx={{ m: 0 }}
                  // fullWidth
                  variant="contained"
                  onClick={() => handleFirstPage()}
                  disabled={parseInt(editCurrentPage) === 1}
                >
                  <FirstPageIcon />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  sx={{ m: 0 }}
                  variant="contained"
                  disabled={parseInt(editCurrentPage) === 1}
                  onClick={() => handlePrevPage()}
                >
                  <ArrowBackIosIcon />{" "}
                </Button>
              </Grid>
              <Grid item>
                <TextField
                  size="small"
                  sx={{ width: "5em" }}
                  value={editCurrentPage}
                  onChange={(e) => handleChange(e)}
                  onKeyDown={(e) => handleEnterPressPage(e)}
                ></TextField>
              </Grid>
              <Grid item>
                <Typography variant="h4">/</Typography>
              </Grid>
              <Grid item>
                <TextField
                  sx={{ width: "5em" }}
                  size="small"
                  value={maxPage}
                  disabled
                ></TextField>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  size="normal"
                  disabled={parseInt(editCurrentPage) === parseInt(maxPage)}
                  onClick={() => handleNextPage()}
                >
                  <ArrowForwardIosIcon />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => handleLastPage()}
                  disabled={parseInt(editCurrentPage) === parseInt(maxPage)}
                >
                  <LastPageIcon />
                </Button>
              </Grid>
            </Grid>
          </Collapse>
          <Button
            variant="contained"
            sx={{ marginBottom: "1%", marginTop: "1%" }}
            startIcon={<PrintIcon />}
            disabled={disablePrintAll}
            onClick={() => debounceMountPrintAllFaktur()}
          >
            {language === "ID" ? "Cetak Semua" : "Print all"}
          </Button>
        </Grid>
      </Paper>

      <Modal open={openModal}>
        <Box sx={style}>
          <Grid item flex={4} mb="3%">
            <Typography>SCAN TRANNO</Typography>
          </Grid>

          <Grid mb="2%">
            <TextField
              label={
                language === "ID" ? "Masukkan No Tranno" : "Insert No Tranno"
              }
              size="small"
              value={inputtedNoDO}
              onChange={(e) => setInputtedNoDO(e.target.value)}
              onKeyDown={(e) => enterPressDone(e)}
              fullWidth
            ></TextField>
          </Grid>

          <Grid textAlign={"center"}>
            <Button
              size="normal"
              variant="contained"
              onClick={() => debounceMountGenerateFaktur()}
              disabled={inputtedNoDO === ""}
            >
              {language === "ID" ? "CETAK" : "DONE"}
            </Button>
            <Button
              size="normal"
              variant="contained"
              sx={{ ml: "5%" }}
              color="error"
              onClick={() => closeScanDo()}
            >
              {language === "ID" ? "TUTUP" : "CLOSE"}
            </Button>
          </Grid>
        </Box>
      </Modal>

      <Modal open={responseModalIsOpen}>
        <Box sx={style} style={{ textAlign: "center" }}>
          <Grid item flex={2}>
            <Typography>{responseHeader}</Typography>
          </Grid>
          <Grid mt={2} mb={2}>
            <Divider fullWidth></Divider>
          </Grid>
          <Grid item flex={2} mb={2}>
            <Typography>{responseBody}</Typography>
          </Grid>

          <Button
            color="error"
            variant="contained"
            onClick={() => setResponseModalIsOpen(false)}
          >
            CLOSE
          </Button>
        </Box>
      </Modal>

      <Modal open={isLoading}>
        <Box sx={style} style={{ textAlign: "center" }}>
          <CircularProgress>PLEASE WAIT...</CircularProgress>
        </Box>
      </Modal>
    </Box>
  );
};
export default GenerateFaktur;
