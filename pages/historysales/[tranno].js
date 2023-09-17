import {
  Box,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Typography,
  TableBody,
  Button,
  Paper,
  Divider,
  Stack,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

import ModalWrapper from "../../components/ModalWrapper";
import ModalInputWrapper from "../../components/ModalInputWrapper";
import api from "../../services/pos";
import { formatDate, formatRupiah } from "../../utils/text";
import { useRouter } from "next/router";
import { getStorage } from "../../utils/storage";
import { isUndefined } from "lodash";
import dayjs from "dayjs";
import "dayjs/locale/id";

const HistorySalesDetail = () => {
  const router = useRouter();
  const [tranno, setTranno] = useState("");
  const language = getStorage("language");
  const [isLoading, setIsLoading] = useState(false);
  const userID = getStorage("userNIP");
  const PTID = JSON.parse(getStorage("pt")).pt_id;
  const gudangID = JSON.parse(getStorage("outlet")).out_code;

  const [nipUser] = useState("");

  const [strookNumber, setStrookNumber] = useState("");
  const [namaMember, setNamaMember] = useState("");

  const [tipeMember, setTipeMember] = useState("NonMember");
  const [responseHeader, setResponseHeader] = useState("");
  const [responseBody, setResponseBody] = useState("");

  const [hideNOMember, setHideNOMember] = useState(true);
  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const [locale, setLocale] = useState("ID");
  const [dateTrandHistory, setDateTrandHistory] = useState("");

  const [resultHistory, setResultHistory] = useState([]);

  dayjs.locale(language);

  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_HISTORY_SALES"].includes(
          "LOGISTIC_HISTORY_SALES_VIEW"
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

    const { tranno } = router.query;
    setTranno(tranno);

    if (userID === "" || gudangID === null) {
      // history.push("/login");
    } else if (tranno && tranno !== "") {
      setStrookNumber(tranno);
    } else {
      router.push("/historysales");
    }
  }, [router.isReady]);

  useEffect(() => {
    if (tranno !== "") {
      findHistoryTransactions();
    }
  }, [tranno]);

  // klo ganti bahasa, ganti date time
  useEffect(() => {
    if (language === "ID") {
      setLocale("ID");
    } else {
      // setLocale('vi')
      setLocale("en");
    }
  }, [language]);

  //set datetime
  const [today, setDate] = useState(new Date());
  const day = today.toLocaleDateString(locale, { weekday: "long" });
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
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [locale]);

  const fieldsHistory = [
    { name: "Procode" },
    { name: "ProName" },
    { name: "Batch" },
    { name: "QTY" },

    { name: "Unit" },
    { name: "Harga" },
    { name: "Disc Mmbr" },
    { name: "Disc Val" },

    { name: "Disc Supl" },
    { name: "Disc Supl Val" },
    { name: "SubTotal" },
  ];

  function toggleCloseSaveModal() {
    setResponseModalIsOpen(false);
    router.push("/historysales");
  }

  function backToHeader() {
    router.push("/historysales");
  }

  async function findHistoryTransactions() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      notranno: tranno,
    };
    try {
      const findHistory = await api.findHistoryTransactions(newParams);
      const { data } = findHistory.data;
      if (data !== null) {
        if (data) {
          setResultHistory(data);
          setStrookNumber(data[0].sale_trannum);
          setDateTrandHistory(data[0].sale_trandate);
          setIsLoading(false);

          if (data[0].sale_mbrcard !== "") {
            setTipeMember("Member");
            setNamaMember(data[0].sale_mbrname);
            setHideNOMember(false);
          }
        }
      } else {
        setStrookNumber("-");
        setResponseHeader("HISTORY NOT FOUND !!!");
        setResponseBody("");
        setResponseModalIsOpen(true);
        setResultHistory([]);
        setIsLoading(false);
      }
    } catch (error) {
      alert(error.message);
      setIsLoading(false);
    }
  }

  async function printHistoryStruk() {
    setIsLoading(true);
    const printHistoryStruk = await api.printHistoryStruk(
      PTID,
      gudangID,
      strookNumber
    );
    var urlStrookNumber =
      printHistoryStruk.config.baseURL + printHistoryStruk.config.url;
    fetch(urlStrookNumber, null)
      .then((response) => {
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
      }, 900)
      .catch((error) => {
        alert(error.message);
        setIsLoading(false);
      });
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    p: 4,
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container alignItems="center">
        <Button
          sx={{ mb: 2 }}
          size="normal"
          variant="contained"
          onClick={backToHeader.bind(this)}
        >
          <Typography
            fontSize={{
              lg: 20,
              md: 15,
              sm: 15,
              xs: 15,
            }}
          >
            {language === "ID" ? "BACK" : "BACK"}
          </Typography>
        </Button>
        <Typography
          align="center"
          variant="h5"
          ml="30%"
          sx={{ fontWeight: 600 }}
          fontSize={{
            lg: 30,
            md: 20,
            sm: 20,
            xs: 18,
          }}
        >
          {language === "ID" ? "HISTORY DETAIL" : "HISTORY DETAIL"} - {tranno}
        </Typography>
      </Grid>
      <Divider sx={{ borderBottomWidth: 3, mb: 2 }} />
      <Grid
        item
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item={true} xs={6}>
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

          {resultHistory.length !== 0 ? (
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
                  resultHistory[0].sale_trandate,
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

        <Grid item={true} xs={6}>
          {resultHistory.length !== 0 ? (
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
                resultHistory.length !== 0
                  ? resultHistory[0].sale_salesperson
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

      <Paper sx={{ mt: 2 }} elevation={6}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ m: 1, fontWeight: 700 }}>
            {language === "ID" ? "Rincian Transaksi" : "Detail Transaction"}
          </Typography>
        </Box>
        <Divider sx={{ borderBottomWidth: 3 }} />
        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              {fieldsHistory &&
                fieldsHistory.map((head, index) => (
                  <TableCell
                    sx={{
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
            {resultHistory &&
              resultHistory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {" "}
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
                      : item.sale_batch}{" "}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_sellqty === "" || item.sale_sellqty === null
                      ? "-"
                      : item.sale_sellqty}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_sellpack === "" || item.sale_sellpack === null
                      ? "-"
                      : item.sale_sellpack}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_saleprice === "" || item.sale_saleprice === null
                      ? "-"
                      : formatRupiah(Math.round(item.sale_saleprice))}
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
                      : formatRupiah(
                          Math.round(
                            (item.sale_sellqty *
                              item.sale_disccenpct *
                              item.sale_saleprice) /
                              100
                          )
                        )}
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
                      : formatRupiah(
                          item.sale_discmbrsup * item.sale_saleprice
                        )}
                  </TableCell>
                  <TableCell>
                    {item.sale_amount === "" || item.sale_amount === null
                      ? "-"
                      : formatRupiah(Math.round(item.sale_amount))}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>

      <Stack alignItems={"flex-end"} sx={{ pt: 2 }}>
        <Box sx={{ width: "35%" }}>
          <Paper sx={{ ml: "1em" }} elevation={12} borderradius={25}>
            <Grid container alignItems="center" justifyContent="center">
              <Typography>DETAIL PEMBAYARAN</Typography>
            </Grid>
            <Divider sx={{ borderBottomWidth: 3, ml: 2, mr: 2 }} />

            <Grid container>
              <Grid item={true} xs={6} sx={{ ml: "1em" }}>
                <Typography> Total </Typography>
              </Grid>
              <Grid item={true} xs={5} sx={{ float: "right" }}>
                <Typography sx={{ float: "right" }}>
                  {resultHistory.length === 0
                    ? "-"
                    : formatRupiah(resultHistory[0].sale_trantotal)}
                </Typography>
              </Grid>

              <Grid container>
                <Grid item={true} xs={6} sx={{ ml: "1em" }}>
                  <Typography> Voucher </Typography>
                </Grid>
                <Grid item={true} xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {resultHistory.length === 0
                      ? "-"
                      : formatRupiah(
                          Math.round(resultHistory[0].sale_totvouchcen)
                        )}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item={true} xs={6} sx={{ ml: "1em" }}>
                  <Typography> VoucherSupplier </Typography>
                </Grid>
                <Grid item={true} xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {resultHistory.length === 0
                      ? "-"
                      : formatRupiah(
                          Math.round(resultHistory[0].sale_totvouchsup)
                        )}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item={true} xs={6} sx={{ ml: "1em" }}>
                  <Typography> PrevRounding </Typography>
                </Grid>
                <Grid item={true} xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {resultHistory.length === 0
                      ? "-"
                      : formatRupiah(
                          Math.round(resultHistory[0].sale_prevrounding)
                        )}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item={true} xs={6} sx={{ ml: "1em" }}>
                  <Typography> Rounding </Typography>
                </Grid>
                <Grid item={true} xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {resultHistory.length === 0
                      ? "-"
                      : formatRupiah(resultHistory[0].sale_rounding)}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item={true} xs={6} sx={{ ml: "1em" }}>
                  <Typography> GrandTotal </Typography>
                </Grid>
                <Grid item={true} xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {resultHistory.length === 0
                      ? "-"
                      : formatRupiah(resultHistory[0].sale_trantotal)}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item={true} xs={6} sx={{ ml: "1em" }}>
                  <Typography> Payment </Typography>
                </Grid>
                <Grid item={true} xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {resultHistory.length === 0
                      ? "-"
                      : formatRupiah(resultHistory[0].sale_tranpayment)}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item={true} xs={6} sx={{ ml: "1em" }}>
                  <Typography> Change </Typography>
                </Grid>
                <Grid item={true} xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {resultHistory.length === 0
                      ? "-"
                      : formatRupiah(resultHistory[0].sale_tranchange)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Box sx={{ mt: 2, width: "100%" }}>
          {/* <Paper> */}

          <Grid item flex={1} sx={{ float: "right" }}>
            <Button
              hidden={resultHistory.length === 0}
              variant="contained"
              size="large"
              onClick={(e) => printHistoryStruk(e)}
            >
              {language === "ID" ? "CETAK" : "PRINT"}
            </Button>
          </Grid>
        </Box>
      </Stack>
      {/* response */}
      <Modal closeOnBackdrop={false} open={responseModalIsOpen}>
        <ModalWrapper sx={{ height: "30%", width: "50%" }}>
          <Grid>
            <Typography sx={{ mb: 2 }} align="center" variant="h5">
              RESPONSE
            </Typography>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container sx={{ justifyContent: "center" }}>
            <Typography>{responseHeader}</Typography>
            {responseBody !== "" && (
              <Box>
                <Typography>{responseBody}</Typography>
              </Box>
            )}
          </Grid>
          <Grid>
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                sx={{ ml: 1 }}
                variant="contained"
                color="error"
                onClick={toggleCloseSaveModal.bind(this)}
              >
                CLOSE
              </Button>
            </Box>
          </Grid>
        </ModalWrapper>
      </Modal>
      {/* response */}
      <Modal open={isLoading}>
        <Box sx={style} style={{ textAlign: "center" }}>
          <CircularProgress></CircularProgress>
        </Box>
      </Modal>
    </Box>
  );
};
export default HistorySalesDetail;
