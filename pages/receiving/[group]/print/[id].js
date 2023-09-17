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

import api from "../../../../services/receiving";
// import Link from "../../utils/link";
import { formatDate } from "../../../../utils/text";
import useToast from "../../../../utils/toast";
import useResponsive from "../../../../utils/responsive";
import { getStorage } from "../../../../utils/storage";

import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { ArrowBack } from "@mui/icons-material";

const ReceivingPrint = (props) => {
  const router = useRouter();
  const [displayToast] = useToast();

  const pt = getStorage("pt");
  const pt_id = JSON.parse(pt).pt_id;
  const outcodeData = getStorage("outlet");
  const outcode = JSON.parse(outcodeData).out_code;
  var group = router.query.group;
  var norecv = router.query.id;
  // var language = 'EN';
  var language = props.language;

  const isMobile = useResponsive().isMobile;

  const debounceMountListReceivingDetail = useCallback(
    debounce(mountListReceiveDetail, 400),
    []
  );

  const debounceMountPrintReceiving = useCallback(
    debounce(mountPrintReceiving, 400),
    []
  );
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_RECEIVING"].includes("LOGISTIC_RECEIVING_PRINT")
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (!router.isReady) return;

    debounceMountListReceivingDetail(norecv, pt_id, outcode, group);
  }, [router.isReady]);

  useEffect(() => {
    if (buttonPrint === "none" && tooltiPrint === "none") {
      window.print();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonPrint][tooltiPrint]);

  const [listReceivingDetail, setListReceivingDetail] = useState([]);
  var [headerPO, setHeaderPO] = useState([]);
  var [namaKaryawan, setNamaKaryawan] = useState("");
  var [firstLoad, setFirstLoad] = useState(true);
  var [dataAvailable, setDataAvailable] = useState(false);

  const [totalData, setTotalData] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    length: 5,
  });

  var [inputSearch, setInputSearch] = useState("");
  var [searchGroup, setSearchGroup] = useState(1);

  var [disabledPrint, setDisabledPrint] = useState(true);
  var [buttonPrint, setButtonPrint] = useState("");
  var [tooltiPrint, setTooltiPrint] = useState("");

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#e0e0e0",
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: "start",
    color: theme.palette.text.secondary,
  }));

  async function mountListReceiveDetail(norecv, pt, outcode, group) {
    try {
      setDataAvailable((dataAvailable = true));
      const getReceivingDetail = await api.getReceivingDetail(
        norecv,
        pt,
        outcode,
        group
      );
      const { data, metadata, error } = getReceivingDetail.data;
      // console.log("data receiving detail", getReceivingDetail);

      if (error.status === false) {
        if (metadata.Status === "TRUE") {
          // window.localStorage.setItem('listPO', JSON.stringify(data1));
          // window.localStorage.setItem('confirmPO', JSON.stringify(data1));
          if (data.header.rcvh_niprecv !== "") {
            setNamaKaryawan((namaKaryawan = data.header.rcvh_empname));
            if (namaKaryawan !== "") {
              setDisabledPrint((disabledPrint = false));
            }
          }

          setHeaderPO((headerPO = data.header));
          setFirstLoad((firstLoad = false));
          var testDetail = !firstLoad && formatTabel1(data.detail);
          setListReceivingDetail(testDetail);
          setDataAvailable(false);
        } else if (metadata.Status === "FALSE") {
          if (metadata.Message.toLowerCase().includes("expired")) {
            displayToast(
              "error",
              language === "EN"
                ? "Token is expired, please login again!"
                : "Token kadaluarsa, harap login ulang."
            );
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("accessList");
          }
          setDataAvailable(false);
        }
      } else {
        setDataAvailable(false);
        displayToast("error", error.msg);
      }
    } catch (error) {
      setDataAvailable(false);
      console.log(error);
      displayToast("error", error.code);
    }
  }

  async function mountPrintReceiving(pt, group, outcode, norecv) {
    try {
      // console.log('hit ke be print receive', pt, group, outcode, norecv)
      const printReceive = await api.getReceivingPrint(
        pt,
        group,
        outcode,
        norecv
      );
      // console.log('get receive print', printReceive)

      //kalau error generate PDF
      if (printReceive.headers["content-type"] === "application/json") {
        let arrayBufferConverted = JSON.parse(
          String.fromCharCode.apply(null, new Uint8Array(printReceive.data))
        );
        // console.log('ERROR BE PRINT', arrayBufferConverted)
        // setIsLoading(false);
        displayToast(
          "error",
          language === "EN"
            ? arrayBufferConverted.metadata.message.Id
            : arrayBufferConverted.metadata.message.Eng
        );
      } else {
        const urlblob = window.URL.createObjectURL(
          new Blob([printReceive.data], { type: "application/pdf" })
        );
        window.open(urlblob);
        // const link = document.createElement("a");
        // link.href = urlblob;
        // link.setAttribute(
        //   "download",
        //   `PRINT_RECEIVING.pdf`
        // );
        // document.body.appendChild(link);
        // link.click();
      }
      mountPrintReceiving;
    } catch (error) {
      // setDataAvailable(false)
      console.log(error);
      displayToast("error", error.code);
    }
  }

  function printReceiving() {
    debounceMountPrintReceiving(pt_id, group, outcode, norecv);
  }

  const showSupplier = (no = "", name = "") => {
    return no + " - " + name;
  };

  function formatTabel1(details) {
    // console.log('FORMAT TABEL : ',detail)
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
        } else {
          detail["rcvd_nobatch"] = detail.batch[0]["rcvd_nobatch"];
          detail["rcvd_quantityrecv"] = detail.batch[0]["rcvd_quantityrecv"];
        }
      } else {
        detail["rcvd_nobatch"] = "";
        detail["rcvd_quantityrecv"] = 0;
      }
    }
    return details;
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Link
            href={`/receiving/${router.query.group}`}
            sx={{ displayPrint: "none" }}
          >
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

      <Paper elevation={2} sx={{ width: "100%", mb: 2, mt: 4 }}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ mt: 2, pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              NO RECV
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
            <Item>
              &nbsp;
              {headerPO && headerPO.rcvh_norecv ? headerPO.rcvh_norecv : ""}
            </Item>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={!isMobile ? { mt: 2 } : { mt: 1, pl: 2, pr: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "RECEIVE DATE" : "TGL RECEIVE"}
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
            <Item>
              &nbsp;
              {formatDate(
                headerPO && headerPO.rcvh_tglrecv,
                "ddd MMMM DD YYYY"
              )}
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
            md={3}
            lg={3}
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
        <Grid
          container
          alignItems="center"
          sx={!isMobile ? { mt: 2 } : { mt: 1 }}
        >
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ pl: 2, pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "SUPPLIER INVOICE" : "FAKTUR SUPPLIER"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ pl: 2, pr: 2 }}>
            <Item>&nbsp;{headerPO && headerPO.rcvh_nofaktur}</Item>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} sx={{ pl: 2, pr: 2 }}></Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={1}
            lg={1}
            sx={isMobile && { pl: 2, pr: 2, mt: 1 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {language === "EN" ? "INVOICE DATE" : "TGL FAKTUR"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} sx={{ pl: 2, pr: 2 }}>
            <Item>
              &nbsp;
              {formatDate(
                headerPO && headerPO.rcvh_tglfaktur,
                "ddd MMMM DD YYYY"
              )}
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
              {language === "EN" ? "DELIVERY NOTE" : "SURAT JALAN"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} sx={{ pl: 2, pr: 2 }}>
            <Item>&nbsp;{headerPO && headerPO.rcvh_nodo}</Item>
          </Grid>
          <Grid item xs={4} sx={{ pl: 2, pr: 2 }}></Grid>
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
          <Grid item xs={12} sm={12} md={3} lg={3} sx={{ pl: 2, pr: 2 }}>
            <Item>
              &nbsp;
              {formatDate(headerPO && headerPO.rcvh_tgldo, "ddd MMMM DD YYYY")}
            </Item>
          </Grid>
        </Grid>
        <Grid container alignItems="center" sx={{ mt: 2 }}>
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
            <Item>&nbsp;{headerPO && headerPO.rcvh_niprecv}</Item>
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
            <Item>&nbsp;{namaKaryawan === "" ? "-" : namaKaryawan}</Item>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ width: "100%", mb: 2, mt: 4 }}>
        <TableContainer>
          <Table sx={{ mb: 5 }}>
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
                    Sell Unit
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
              ) : listReceivingDetail ? (
                listReceivingDetail.map((item) => (
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
                    <TableCell align="center">{item.rcvd_sellunit}</TableCell>
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
            {/* <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    count={totalData}
                    rowsPerPage={params.length}
                    page={params.page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                </TableRow>
              </TableFooter> */}
          </Table>
        </TableContainer>
        <Grid
          container
          justifyContent={"flex-end"}
          sx={{ pl: 2, pr: 2, displayPrint: "none" }}
        >
          <Typography
            variant="body2"
            color={"red"}
            style={{ display: tooltiPrint }}
          >
            {language === "EN"
              ? "*The Print Button will be active when the PIC name has been loaded"
              : "*Button print akan menyala ketika Nama Karyawan sudah ter-load"}
          </Typography>
        </Grid>
        <Grid container justifyContent={"flex-end"} sx={{ p: 2 }}>
          <Button
            size="large"
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => printReceiving()}
            // style={{
            //     display: buttonPrint,
            // }}
            sx={{ displayPrint: "none" }}
          >
            Print
          </Button>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ReceivingPrint;
