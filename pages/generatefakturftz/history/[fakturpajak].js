/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { getStorage } from "../../../utils/storage";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { KeyboardBackspace } from "@mui/icons-material/";
import { Stack } from "@mui/system";
import { debounce, isUndefined } from "lodash";
import api from "../../../services/logistic";
import * as dayjs from "dayjs";
import { formatRupiah } from "../../../utils/text";
import { blueGrey, grey } from "@mui/material/colors";
const History = () => {
  const router = useRouter();

  const PTID = JSON.parse(getStorage("pt")).pt_id;
  const gudangID = JSON.parse(getStorage("outlet")).out_code;

  const [resultDetail, setResultDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const [responseHeader, setResponseHeader] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [fakturpajak, setFakturpajak] = useState("");
  const [subTotal, setSubtotal] = useState();
  const [discOutletValue, setDiscOutletValue] = useState();
  const [discExtraValue, setDiscExtraValue] = useState();
  const [vatValue, setVatValue] = useState();
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_GENERATE_FAKTUR_FTZ"].includes(
          "LOGISTIC_GENERATE_FAKTUR_FTZ_VIEW"
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
    if (router.query.fakturpajak !== "undefined") {
      var props = router.query;
      setFakturpajak(props.fakturpajak);
    } else {
      router.push({
        pathname: "/generatefakturftz",
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    if (fakturpajak !== "") {
      debounceMountGetHistoryFakturFTZDetail();
    }
  }, [fakturpajak]);

  const debounceMountGetHistoryFakturFTZDetail = useCallback(
    debounce(mountGetHistoryFakturFTZDetail, 400)
  );

  const total = subTotal - discOutletValue - discExtraValue;
  const grandtotal = total + vatValue;

  async function mountGetHistoryFakturFTZDetail() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      fakturpajak: fakturpajak,
    };
    setIsLoading(true);
    try {
      const getHistory = await api.getHistoryFakturFTZDetail(newParams);
      const { data, metadata } = getHistory.data;
      if (data != null) {
        setResultDetail(data);
        let subtotal = data.reduce(function (prev, current) {
          return prev + current.subamount;
        }, 0);

        setSubtotal(subtotal);

        let discoutletvalue = data.reduce(function (prev, current) {
          return prev + current.discoutletvalue;
        }, 0);

        setDiscOutletValue(discoutletvalue);

        let discextravalue = data.reduce(function (prev, current) {
          return prev + current.discextravalue;
        }, 0);
        setDiscExtraValue(discextravalue);

        let vatvalue = data.reduce(function (prev, current) {
          return prev + current.vatvalue;
        }, 0);
        setVatValue(vatvalue);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setResponseBody("No data available");
        setResponseHeader("There is no data");
        setResponseModalIsOpen(true);
        router.push({
          pathname: "/generatefakturftz",
        });
      }
    } catch (error) {
      console.log(error);
      setResponseBody(error.message);
      setResponseHeader("Failed To Load");
      setResponseModalIsOpen(true);
      setIsLoading(false);
      router.push({
        pathname: "/generatefakturftz",
      });
    }
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    p: 4,
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper container sx={{ border: 1, borderColor: "white" }}>
        <Grid
          container
          alignItems="center"
          sx={{ textAlign: "center", ml: 2, mt: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => router.push({ pathname: "/generatefakturftz" })}
            mt={4}
          >
            <KeyboardBackspace />
          </Button>
          <Typography
            align="center"
            variant="h5"
            sx={{ fontWeight: 600 }}
            ml="30%"
          >
            DETAIL - {fakturpajak}
          </Typography>
        </Grid>
        <Grid mt={3} mb={3}>
          <Divider variant="fullWidth"></Divider>
        </Grid>
        <Grid>
          <Typography ml={7} sx={{ fontWeight: 600 }}>
            Informasi Faktur
          </Typography>
        </Grid>
        <Grid
          container
          mt={2}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item ml={7} xs={5}>
            Faktur Pajak
          </Grid>
          <Grid item xs={5} ml={7}>
            Tanggal Faktur
          </Grid>
          <Grid item ml={7} xs={5}>
            <TextField
              disabled
              sx={{ width: "80%" }}
              size="small"
              value={
                resultDetail.length !== 0 ? resultDetail[0].fakturpajak : "-"
              }
            ></TextField>
          </Grid>
          <Grid item ml={7} xs={5}>
            <TextField
              disabled
              ml={4}
              sx={{ width: "80%" }}
              size="small"
              value={
                resultDetail.length !== 0 ? resultDetail[0].tglfaktur : "-"
              }
            ></TextField>
          </Grid>

          <Grid item ml={7} xs={5}>
            NO DO
          </Grid>
          <Grid item ml={7} xs={5}>
            Jatuh Tempo
          </Grid>
          <Grid item ml={7} xs={5}>
            <TextField
              disabled
              sx={{ width: "80%" }}
              size="small"
              value={resultDetail.length !== 0 ? resultDetail[0].nodo : "-"}
            ></TextField>
          </Grid>

          <Grid item ml={7} xs={5}>
            <TextField
              disabled
              sx={{ width: "80%" }}
              size="small"
              value={
                resultDetail.length !== 0
                  ? dayjs(resultDetail[0].duedate).format("YYYY-MM-DD")
                  : "-"
              }
            ></TextField>
          </Grid>
        </Grid>

        <Grid
          container
          mt={5}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={5} ml={7}>
            <Typography sx={{ fontWeight: 600 }}>Informasi Penjual</Typography>{" "}
          </Grid>
          <Grid item xs={5} ml={7}>
            <Typography sx={{ fontWeight: 600 }}>Informasi Pembeli</Typography>
          </Grid>
          <Grid item xs={5} ml={7}>
            Penjual
          </Grid>
          <Grid item xs={5} ml={7}>
            Pembeli
          </Grid>
          <Grid item xs={5} ml={7}>
            <TextField
              disabled
              sx={{ width: "80%" }}
              size="small"
              value={resultDetail.length !== 0 ? resultDetail[0].seller : "-"}
            ></TextField>
          </Grid>
          <Grid item xs={5} ml={7}>
            <TextField
              disabled
              sx={{ width: "80%" }}
              size="small"
              value={resultDetail.length !== 0 ? resultDetail[0].buyer : "-"}
            ></TextField>
          </Grid>
          <Grid item xs={5} ml={7}>
            Alamat Penjual
          </Grid>
          <Grid item xs={5} ml={7}>
            Alamat Pembeli
          </Grid>
          <Grid item xs={5} ml={7}>
            <TextField
              disabled
              sx={{ width: "80%" }}
              size="small"
              value={
                resultDetail.length !== 0 ? resultDetail[0].addressseller : "-"
              }
            ></TextField>
          </Grid>
          <Grid item xs={5} ml={7}>
            {/* <TextField
              disabled
              sx={{ width: "80%" }}
              size="small"
              value={
                resultDetail.length !== 0 ? resultDetail[0].addressbuyer : "-"
              }
            ></TextField> */}
            <Box
              sx={{
                p: 1,
                border: 1,
                borderRadius: 1,
                borderColor: blueGrey["200"],
                width: "80%",
                height: "auto",
              }}
            >
              <Typography color={grey["500"]}>
                {resultDetail.length !== 0 ? resultDetail[0].addressbuyer : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={5} ml={7}>
            NPWP Penjual
          </Grid>
          <Grid item xs={5} ml={7}>
            NPWP Pembeli
          </Grid>
          <Grid item xs={5} ml={7}>
            <TextField
              disabled
              sx={{ width: "80%" }}
              size="small"
              value={
                resultDetail.length !== 0 ? resultDetail[0].npwpseller : "-"
              }
            ></TextField>
          </Grid>
          <Grid item xs={5} ml={7}>
            <TextField
              disabled
              sx={{ width: "80%" }}
              size="small"
              value={
                resultDetail.length !== 0 ? resultDetail[0].npwpbuyer : "-"
              }
            ></TextField>
          </Grid>
          <Grid item xs={12} mt={5} ml={2}>
            <Typography sx={{ fontWeight: 600 }}>Detail Produk</Typography>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>No</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Procode</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Proname</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Batch Number</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Expired Date</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Satuan</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Quantity</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Quantity Bonus</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Harga</TableCell>

              <TableCell sx={{ textAlign: "center" }}>
                DiscOutletValues
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>DiscExtraValue</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Subtotal</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Vatvalue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultDetail &&
              resultDetail.map((item, index) => (
                <TableRow key={item}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {(index = index + 1)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.procod}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.proname}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.batch}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {dayjs(item.expddate).format("YYYY-MM-DD")}
                    {/* {item.expddate} */}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.packname}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.qty}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.qtybns}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {"Rp" +
                      String(Math.round(item.price)).replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        "."
                      )}
                  </TableCell>
                  {/* <TableCell sx={{ textAlign: "center" }}>
                    {item.discoutlet}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.discextra}
                  </TableCell> */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {formatRupiah(item.discoutletvalue)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {formatRupiah(item.discextravalue)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {formatRupiah(Math.round(item.subamount))}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {formatRupiah(Math.round(item.vatvalue))}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Stack alignItems={"flex-end"} sx={{ pt: 2 }} mt={4} mr={4}>
          <Box sx={{ width: "35%" }}>
            <Paper sx={{ ml: "1em" }} elevation={12} borderradius={25}>
              <Grid container alignItems="center" justifyContent="center">
                <Typography>DETAIL PEMBAYARAN</Typography>
              </Grid>
              <Grid container>
                <Grid item xs={6} sx={{ ml: "1em" }}>
                  <Typography>Subtotal</Typography>
                </Grid>
                <Grid item xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {subTotal === 0 ? "-" : formatRupiah(Math.round(subTotal))}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={6} sx={{ ml: "1em" }}>
                  <Typography>Total Diskon Outlet</Typography>
                </Grid>
                <Grid item xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {" "}
                    {discOutletValue === 0
                      ? "-"
                      : formatRupiah(Math.round(discOutletValue))}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={6} sx={{ ml: "1em" }}>
                  <Typography>Total Diskon Extra</Typography>
                </Grid>
                <Grid item xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {" "}
                    {discExtraValue === 0
                      ? "-"
                      : formatRupiah(Math.round(discExtraValue))}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={6} sx={{ ml: "1em" }}>
                  <Typography>Total</Typography>
                </Grid>
                <Grid item xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {" "}
                    {total === 0 ? "-" : formatRupiah(Math.round(total))}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={6} sx={{ ml: "1em" }}>
                  <Typography>PPN</Typography>
                </Grid>
                <Grid item xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {" "}
                    {vatValue === 0 ? "-" : formatRupiah(Math.round(vatValue))}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container mb={4} mr={2}>
                <Grid item xs={6} sx={{ ml: "1em" }}>
                  <Typography>Grand Total</Typography>
                </Grid>
                <Grid item xs={5} sx={{ float: "right" }}>
                  <Typography sx={{ float: "right" }}>
                    {" "}
                    {grandtotal === 0
                      ? "-"
                      : formatRupiah(Math.round(grandtotal))}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Stack>
      </Paper>

      <Modal open={isLoading}>
        <Box sx={style} style={{ textAlign: "center" }}>
          <CircularProgress>PLEASE WAIT...</CircularProgress>
        </Box>
      </Modal>

      <Modal open={responseModalIsOpen}>
        <Box sx={style}>
          <Grid textAlign="center">
            <Typography>{responseHeader}</Typography>
          </Grid>
          <Grid>
            <Divider fullWidth />
          </Grid>
          <Grid textAlign="center">
            <Typography>{responseBody}</Typography>
          </Grid>
          <Grid textAlign="center">
            <Button onClick={() => setResponseModalIsOpen(false)}>OK</Button>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default History;
