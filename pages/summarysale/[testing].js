import {
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { getStorage } from "../../utils/storage";
import { debounce,isUndefined } from "lodash";
import api from "../../services/logistic";

const Testing = () => {
  const language = getStorage("language");
  const router = useRouter();

  const [listSummarySales, setListSummarySales] = useState([]);

  const tableHeader = [
    { name: "No" },
    { name: "Description" },
    { name: "Tran Total" },
    { name: "Tran Payment" },

    // { name: "Sum Cash" },
    // { name: "Penjualan Credit Card" },
    // { name: "Penjualan Credit Card" },
    // { name: "Piutang Usaha" },
    // { name: "Amex" },
    // { name: "BCA" },
  ];

  const debounceMountGetDetailByDate = useCallback(
    debounce(getDetailByDate, 400)
  );
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (
        !parsedAccess["LOGISTIC_SUMMARY_SALES"].includes(
          "LOGISTIC_SUMMARY_SALES_VIEW"
        )
      ) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  async function getDetailByDate() {
    const newParams = {
      // ptid: PTID,
      // outcode: gudangID,
      ptid: 32,
      outcode: "B14",
      trandate: "20220124",
    };
    const getDetailByDate = await api.getDetailByDate(newParams);
    const { data } = getDetailByDate.data;
    if (data !== null) {
      setListSummarySales(data);
    }
    console.log("data", data);
  }

  useEffect(() => {
    debounceMountGetDetailByDate();
  }, []);

  return (
    <Box sx={{ width: "100%", p: { lg: 4, md: 4, sm: 4, xs: 0 } }}>
      <Grid container alignItems="center">
        <Button onClick={() => router.push("/summarysale")} variant="contained">
          {" "}
          BACK
        </Button>
        <Typography
          ml={40}
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
          {language === "ID" ? "Detail" : "Detail"} - {"2022 / 01 / 03"}
        </Typography>{" "}
      </Grid>
      <Divider sx={{ marginBottom: 2, marginTop: 2 }}></Divider>
      <Paper>
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
            {listSummarySales &&
              listSummarySales.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.sale_paymentmethod}</TableCell>
                  <TableCell>{item.sale_tranpayment}</TableCell>
                  <TableCell>{item.sale_trantotal}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Testing;
