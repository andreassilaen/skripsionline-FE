import {
  Box,
  Divider,
  Skeleton,
  TextField,
  Typography,
  Grid,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  Collapse,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  TableRow,
  Modal,
  Tabs,
  Tab,
} from "@mui/material";
import { getStorage } from "../../utils/storage";
import React, { useCallback, useEffect, useState } from "react";
import { debounce,isUndefined } from "lodash";
import api from "../../services/logistic";
import { useRouter } from "next/router";
import ModalInputWrapper from "../../components/ModalInputWrapper";
import { Block, Circle, Search } from "@mui/icons-material";
import * as dayjs from "dayjs";
import PropTypes from "prop-types";
import { formatRupiah } from "../../utils/text";

const SummarySale = () => {
  const PTID = JSON.parse(getStorage("pt")).pt_id;
  const gudangID = JSON.parse(getStorage("outlet")).out_code;
  const nipUser = JSON.parse(getStorage("outlet")).nip;
  const router = useRouter();

  const [tabValue, setTabValue] = useState(0);

  const [searchListSales, setSearchListSales] = useState([]);
  const [listSales, setListSales] = useState([]);

  const [inputtedDate, setInputtedDate] = useState("");
  const [trantotal, setTrantotal] = useState(0);
  const [tranpayment, setTranpayment] = useState(0);
  const [projectID, setProjectID] = useState("");
  const [statusSummary, setStatusSummary] = useState("");
  const [dataNotFound, setDataNotFound] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const debounceMountFindSalesByDate = useCallback(
    debounce(findSalesByDate, 400)
  );
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_SUMMARY_SALES")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  async function findSalesByDate() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      trandate: dayjs(inputtedDate).format("YYYYMMDD"),
    };
    console.log("newpar", newParams);
    const findsales = await api.findSalesByDate(newParams);
    const { data } = findsales.data;
    if (data !== null) {
      setDataNotFound(false);
      // setSearchListSales(data);
      setTrantotal(data[0].sale_trantotal);
      setTranpayment(data[0].sale_tranpayment);
      setProjectID(data[0].sale_projectid);

      setStatusSummary(data[0].sale_summaryyn);
    } else {
      console.log("tidak temu");
      // setSearchListSales([]);
      setDataNotFound(true);
    }
    console.log("data", data);
  }

  const debounceMountGetDetailByDate = useCallback(
    debounce(getDetailByDate, 400)
  );

  async function getDetailByDate() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      trandate: dayjs(inputtedDate).format("YYYYMMDD"),
    };
    const getDetailByDate = await api.getDetailByDate(newParams);
    const { data } = getDetailByDate.data;
    if (data !== null) {
      setSearchListSales(data);
      setDataNotFound(false);
    } else {
      setDataNotFound(true);
      setSearchListSales([]);
    }
    console.log("data", data);
  }

  const debounceMountGetListSales = useCallback(debounce(getListSales, 400));

  async function getListSales() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
    };
    const getListSales = await api.getListSales(newParams);
    const { data } = getListSales.data;
    if (data !== null) {
      setListSales(data);
    } else {
      setListSales([]);
    }
    console.log("data", data);
  }

  const debounceMountProcessSummary = useCallback(
    debounce(processSummary, 400)
  );

  async function processSummary() {
    var newDate = new Date();
    var formattedDate = dayjs(newDate).format("YYYYMMDD");

    console.log("newda", newDate, "ea", formattedDate);

    var payload = {
      sum_summaryid: formattedDate,
      sum_ptid: PTID,
      sum_outcode: gudangID,
      sum_salesday: inputtedDate,
      sum_user: nipUser,
    };
    console.log("payload", payload);
    // try {
    //   const process = await api.processSummarySales(payload);
    //   console.log("process", process);
    //   if (process.status === 200) {
    //     console.log("berhasil");
    //   } else {
    //     console.log("gagal");
    //   }
    // } catch (error) {
    //   console.log("[ProcessSummary]", error);
    // }
  }

  useEffect(() => {
    debounceMountGetListSales();
  }, []);

  function findSales() {
    debounceMountFindSalesByDate();
    debounceMountGetDetailByDate();
  }

  const tableHeader = [
    { name: "Sales Date" },
    { name: "Payment Method" },
    { name: "Transaction" },
    { name: "Payment" },
    { name: "SummaryYN" },
    // { name: "Action" },
  ];

  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    p: 4,
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function allyProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, textAlign: "center" }}>
        Summary Sale
      </Typography>
      <Divider sx={{ marginTop: 2, marginBottom: 2 }}></Divider>
      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab label="Find" {...allyProps(0)}></Tab>
        <Tab label="List" {...allyProps(1)}></Tab>
      </Tabs>
      <Paper>
        {tabValue === 0 ? (
          <>
            <Grid container p={1}>
              <Grid>
                {" "}
                <ModalInputWrapper
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", width: "9em" }}
                >
                  <Typography sx={{ p: 1, fontWeight: 400 }}>Search</Typography>{" "}
                </ModalInputWrapper>{" "}
              </Grid>
              <Grid sx={{ width: "40%" }}>
                <TextField
                  size="small"
                  type="date"
                  sx={{ width: "100%" }}
                  onChange={(e) => setInputtedDate(e.target.value)}
                ></TextField>{" "}
              </Grid>
              <Grid ml={2}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={inputtedDate === ""}
                  onClick={() => findSales()}
                  startIcon={<Search />}
                ></Button>
              </Grid>
            </Grid>

            <Collapse in={searchListSales.length !== 0}>
              <Grid container>
                <Grid item xs={6}>
                  <Grid container sx={{ m: 1 }}>
                    <ModalInputWrapper
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        width: "9em",
                      }}
                    >
                      <Typography sx={{ p: 1, fontWeight: 400 }}>
                        PT ID
                      </Typography>{" "}
                    </ModalInputWrapper>{" "}
                    <TextField
                      value={PTID}
                      disabled
                      size="small"
                      sx={{ width: "60%" }}
                    ></TextField>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container sx={{ m: 1 }}>
                    <ModalInputWrapper
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        width: "9em",
                      }}
                    >
                      <Typography sx={{ p: 1, fontWeight: 400 }}>
                        Outcode
                      </Typography>{" "}
                    </ModalInputWrapper>{" "}
                    <TextField
                      value={gudangID}
                      disabled
                      size="small"
                      sx={{ width: "60%" }}
                    ></TextField>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container sx={{ m: 1 }}>
                    <ModalInputWrapper
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        width: "9em",
                      }}
                    >
                      <Typography sx={{ p: 1, fontWeight: 400 }}>
                        Total
                      </Typography>{" "}
                    </ModalInputWrapper>{" "}
                    <TextField
                      value={formatRupiah(trantotal)}
                      disabled
                      size="small"
                      sx={{ width: "60%" }}
                    ></TextField>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container sx={{ m: 1 }}>
                    <ModalInputWrapper
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        width: "9em",
                      }}
                    >
                      <Typography sx={{ p: 1, fontWeight: 400 }}>
                        Total Payment
                      </Typography>{" "}
                    </ModalInputWrapper>{" "}
                    <TextField
                      value={formatRupiah(tranpayment)}
                      disabled
                      size="small"
                      sx={{ width: "60%" }}
                    ></TextField>
                  </Grid>
                </Grid>

                {/* <Grid item xs={6}>
                  <Grid container sx={{ m: 1 }}>
                    <ModalInputWrapper
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        width: "9em",
                      }}
                    >
                      <Typography sx={{ p: 1, fontWeight: 400 }}>
                        Status Summary
                      </Typography>{" "}
                    </ModalInputWrapper>{" "}
                    <TextField
                      value={statusSummary}
                      disabled
                      size="small"
                      sx={{ width: "20%" }}
                    ></TextField>
                  </Grid>
                </Grid> */}
                {/* <Grid item xs={6}>
                  <Grid container sx={{ m: 1 }}>
                    <ModalInputWrapper
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        width: "9em",
                      }}
                    >
                      <Typography sx={{ p: 1, fontWeight: 400 }}>
                        Status Ao YN
                      </Typography>{" "}
                    </ModalInputWrapper>{" "}
                    <TextField
                      value={statusSummary}
                      disabled
                      size="small"
                      sx={{ width: "20%" }}
                    ></TextField>
                  </Grid>
                </Grid> */}

                <Table>
                  <TableHead>
                    {tableHeader &&
                      tableHeader.map((head, index) => (
                        <TableCell
                          sx={{
                            fontWeight: "600",
                          }}
                          key={index}
                        >
                          <Typography
                            fontWeight={600}
                            fontSize={{
                              lg: 14,
                              md: 12,
                              sm: 10,
                              xs: 8,
                            }}
                          >
                            {head.name}
                          </Typography>
                        </TableCell>
                      ))}
                  </TableHead>
                  <TableBody>
                    {searchListSales &&
                      searchListSales.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {dayjs(item.sale_trandate).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell>{item.sale_paymentmethod}</TableCell>
                          <TableCell>
                            {formatRupiah(item.sale_trantotal)}
                          </TableCell>
                          <TableCell>
                            {formatRupiah(item.sale_tranpayment)}
                          </TableCell>
                          <TableCell>{item.sale_summaryyn}</TableCell>
                          {/* <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => router.push(`/summarysale/testing`)}
                        >
                          Detail
                        </Button>
                      </TableCell> */}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid textAlign="center" p={2}>
                <Button
                  variant="contained"
                  disabled={statusSummary === "Y"}
                  onClick={() => setConfirmationModal(true)}
                >
                  Confirm
                </Button>
              </Grid>
            </Collapse>
            <Grid textAlign="center">
              <Collapse in={dataNotFound}>
                <Box
                  sx={{
                    height: 300,
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h4" sx={{ color: "red" }}>
                    No Item <Block sx={{ width: 30, height: 30 }} />
                  </Typography>
                </Box>
              </Collapse>
            </Grid>
          </>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction Date</TableCell>
                    <TableCell>Transaction</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Summary Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listSales &&
                    listSales.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {dayjs(item.sale_trandate).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell>
                          {formatRupiah(Math.floor(item.sale_trantotal))}
                          {/* -{item.sale_trantotal} */}
                        </TableCell>
                        <TableCell>
                          {formatRupiah(item.sale_tranpayment)}
                        </TableCell>
                        <TableCell>
                          {item.sale_summaryyn}
                          {item.sale_summaryyn === "Y" ? (
                            <Circle
                              fontSize="small"
                              sx={{ float: "right", color: "green" }}
                            ></Circle>
                          ) : (
                            <Circle
                              fontSize="small"
                              sx={{ float: "right", color: "red" }}
                            ></Circle>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
      <Modal open={confirmationModal}>
        <Box sx={styleModal}>
          <Grid sx={{ mb: 2 }}>
            <Typography textAlign="center">Are you sure ?</Typography>
          </Grid>
          <Grid mt={2} mb={2}>
            <Divider></Divider>
          </Grid>
          <Grid>
            <Typography> Do you want to proceed ? </Typography>
          </Grid>
          <Grid textAlign="center">
            <Button
              variant="contained"
              margin="normal"
              color="success"
              sx={{ mr: 1 }}
              onClick={() => debounceMountProcessSummary()}
            >
              YES
            </Button>
            <Button
              variant="contained"
              margin="normal"
              color="error"
              onClick={() => setConfirmationModal(false)}
              sx={{ mr: 1 }}
            >
              NO
            </Button>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default SummarySale;
