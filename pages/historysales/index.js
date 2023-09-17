import {
  Box,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Typography,
  TableBody,
  IconButton,
  Button,
  Paper,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  Modal,
  Divider,
  CircularProgress,
  TableContainer,
  Collapse,
  Fade,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { Search } from "@mui/icons-material";
import { debounce,isUndefined } from "lodash";
import api from "../../services/pos";
import { formatDate, formatRupiah } from "../../utils/text";
import { getStorage } from "../../utils/storage";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useMediaQuery } from "@mui/material";

const HistorySales = (props) => {
  const android = useMediaQuery("(max-width:600px)");
  const router = useRouter();
  var language = props.language;
  const [isLoading, setIsLoading] = useState(false);
  const PTID = JSON.parse(getStorage("pt")).pt_id;
  const gudangID = JSON.parse(getStorage("outlet")).out_code;

  const userID = JSON.parse(window.sessionStorage.getItem("profile"))
    ? JSON.parse(window.sessionStorage.getItem("profile")).mem_nip
    : "";

  dayjs.locale(language);

  const [resultHeader, setResultHeader] = useState([]);

  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const [responseHeader, setResponseHeader] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [keyword, setKeyword] = useState("");

  const fields = [
    { name: language === "ID" ? "Tranno" : "Tranno" },
    { name: language === "ID" ? "Tanggal Transaksi" : "Transaction Date" },
    { name: language === "ID" ? "Total" : "Total" },
    { name: language === "ID" ? "Aksi" : "Action" },
  ];
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_HISTORY_SALES")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (userID === "" || gudangID === null) {
      //   history.push("/login");
      debounceMountHistorySales();
    } else {
      debounceMountHistorySales();
    }
  }, []);

  const debounceMountHistorySales = useCallback(
    debounce(getLast200DataSales, 400)
  );

  async function getLast200DataSales() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
    };
    setIsLoading(true);
    try {
      const getLast200DataSales = await api.getLast200DataSales(newParams);

      const { data } = getLast200DataSales.data;
      if (data !== null) {
        setResultHeader(data);
        setIsLoading(false);
      } else {
        setResultHeader([]);
        setResponseHeader("DATA NOT FOUND !!!");
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setResponseBody(error.message);
      setResponseHeader("Failed To Load");
      setResponseModalIsOpen(true);
      setIsLoading(false);
    }
  }

  function enterPressDetail(e) {
    switch (e.key) {
      case "Enter":
        toDetail(keyword);
        break;
      default:
    }
  }

  function toDetail(item) {
    router.push(`/historysales/${item}`);
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
    <>
      <Box sx={{ width: "100%", p: { lg: 4, md: 4, sm: 4, xs: 0 } }}>
        <Grid sx={{ textAlign: "center" }}>
          <Typography
            fontSize={{
              lg: 30,
              md: 20,
              sm: 20,
              xs: 18,
            }}
            fontWeight={{
              xs: "600",
            }}
          >
            {language === "ID" ? "RIWAYAT PENJUALAN" : "HISTORY SALES"}
          </Typography>{" "}
        </Grid>
        <Divider sx={{ marginBottom: 2, marginTop: 2 }}></Divider>
        <Grid container>
          <Grid item flex={1} sx={{ width: "10px" }}>
            <FormControl
              variant="outlined"
              size={"small"}
              sx={{
                width: "100%",
              }}
            >
              {/* <InputLabel margin="dense">
                <Typography
                  fontSize={{
                    lg: 18,
                    md: 17,
                    sm: 15,
                    xs: 8,
                  }}
                >
                  {language === "ID" ? "Cari" : "Search"}
                </Typography>
              </InputLabel> */}
              <OutlinedInput
                sx={{
                  height: { xs: "30px", sm: "40px", md: "50px", lg: "50px" },
                }}
                inputProps={{
                  sx: {
                    fontSize: {
                      lg: 26,
                      md: 20,
                      sm: 20,
                      xs: 15,
                    },
                  },
                }}
                // label={language === "ID" ? "Cari" : "Search"}
                autoFocus
                placeholder={language === "ID" ? "Cari..." : "Search..."}
                onKeyDown={(e) => enterPressDetail(e)}
                onChange={(e) => setKeyword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => toDetail(keyword)}
                      edge="end"
                    >
                      <Search
                        sx={{
                          fontSize: {
                            xs: 15,
                            sm: 20,
                            md: 24,
                            lg: 26,
                          },
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>

        <Paper>
          <TableContainer size="small" sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* {fields &&
                    fields.map((head, index) => (
                      <TableCell
                        sx={{
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                        key={index}
                      >
                        <Typography
                          fontSize={{
                            lg: 20,
                            md: 20,
                            sm: 16,
                            xs: 12,
                          }}
                          sx={{ fontWeight: 600 }}
                        >
                          {head.name}
                        </Typography>
                      </TableCell>
                    ))} */}

                  <TableCell
                    sx={{
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      fontSize={{
                        lg: 20,
                        md: 20,
                        sm: 16,
                        xs: 12,
                      }}
                      sx={{ fontWeight: 600 }}
                    >
                      {language === "ID" ? "Tranno" : "Tranno"}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      fontSize={{
                        lg: 20,
                        md: 20,
                        sm: 16,
                        xs: 12,
                      }}
                      sx={{ fontWeight: 600 }}
                    >
                      {language === "ID"
                        ? "Tanggal Transaksi"
                        : "Transaction Date"}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      fontSize={{
                        lg: 20,
                        md: 20,
                        sm: 16,
                        xs: 12,
                      }}
                      sx={{ fontWeight: 600 }}
                    >
                      {language === "ID" ? "Total" : "Total"}
                    </Typography>
                  </TableCell>

                  {android === true ? (
                    <></>
                  ) : (
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        fontSize={{
                          lg: 20,
                          md: 20,
                          sm: 16,
                          xs: 12,
                        }}
                        sx={{ fontWeight: 600 }}
                      >
                        {language === "ID" ? "Aksi" : "Action"}
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {resultHeader &&
                  resultHeader.map((item, index) => (
                    <TableRow
                      key={index}
                      hover
                      onClick={() =>
                        android ? toDetail(item.sale_trannum) : ""
                      }
                    >
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 20,
                            md: 15,
                            sm: 17,
                            xs: 12,
                          }}
                        >
                          {item.sale_trannum === "" ||
                          item.sale_trannum === null
                            ? "-"
                            : item.sale_trannum}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          fontSize={{
                            lg: 20,
                            md: 15,
                            sm: 17,
                            xs: 12,
                          }}
                        >
                          {item.sale_trandate === "" ||
                          item.sale_trandate === null
                            ? "-"
                            : formatDate(
                                item.sale_trandate,
                                "dddd, DD MMMM YYYY HH:mm:ss"
                              )}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", borderColor: "warning" }}
                      >
                        <Typography
                          fontSize={{
                            lg: 20,
                            md: 15,
                            sm: 17,
                            xs: 12,
                          }}
                        >
                          {item.sale_trantotal === "" ||
                          item.sale_trantotal === null
                            ? "-"
                            : formatRupiah(item.sale_trantotal)}
                        </Typography>
                      </TableCell>

                      {android === true ? (
                        <></>
                      ) : (
                        <TableCell sx={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            size="medium"
                            onClick={() => toDetail(item.sale_trannum)}
                          >
                            <Typography
                              fontSize={{
                                lg: 18,
                                md: 15,
                                sm: 14,
                                xs: 12,
                              }}
                            >
                              {language === "ID" ? "RINCIAN" : "DETAIL"}
                            </Typography>
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Modal open={responseModalIsOpen}>
          <Box sx={style}>
            <Grid textAlign="center">
              <Typography fontWeight={700}>{responseHeader}</Typography>
            </Grid>
            <Grid mt={2} mb={2}>
              <Divider />
            </Grid>
            <Grid textAlign="center">
              <Typography>{responseBody}</Typography>
            </Grid>
            <Grid textAlign="center" mt={2}>
              <Button
                onClick={() => setResponseModalIsOpen(false)}
                variant="contained"
                color="error"
              >
                Close
              </Button>
            </Grid>
          </Box>
        </Modal>

        <Modal open={isLoading}>
          <Box sx={style} style={{ textAlign: "center" }}>
            <CircularProgress>PLEASE WAIT...</CircularProgress>
          </Box>
        </Modal>
      </Box>
    </>
  );
};
export default HistorySales;
