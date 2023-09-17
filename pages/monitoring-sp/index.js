import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import logistic from "../../services/logistic";
import { getStorage } from "../../utils/storage";
import { debounce, isNull, isUndefined } from "lodash";
import dayjs from "dayjs";

const MonitoringSP = () => {
  const router = useRouter();
  const debounceMountListSPMonitor = useCallback(
    debounce(mountListSPMonitor, 400),
    []
  );
  const [listSPMonitor, setListSPMonitor] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_MONITORING_SP")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (!router.isReady) return;
    debounceMountListSPMonitor();
  }, [router.isReady]);

  async function mountListSPMonitor() {
    setIsLoading(true);
    try {
      const getListSP = await logistic.getListSPToMonitor();
      const { data } = getListSP.data;
      if (data.length !== 0) {
        setListSPMonitor(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleStatus = (status) => {
    switch (status) {
      case "N":
        return (
          <Typography
            sx={{
              color: "white",
              background: "green",
              borderRadius: "10px",
              textAlign: "center",
              width: "50%",
              p: 0.5,
            }}
            variant="subtitle2"
          >
            Belum Dilayani
          </Typography>
        );
      case "X":
        return (
          <Typography
            sx={{
              color: "white",
              background: "red",
              borderRadius: "10px",
              textAlign: "center",
              width: "50%",
              p: 0.5,
            }}
            variant="subtitle2"
          >
            Sedang Dilayani
          </Typography>
        );
    }
  };

  const handleLayanan = (layanan) => {
    switch (layanan) {
      case "M":
        return (
          <Typography
            sx={{
              color: "white",
              background: "Blue",
              borderRadius: "10px",
              textAlign: "center",
              width: "50%",
              p: 0.5,
            }}
            variant="subtitle2"
          >
            Manual
          </Typography>
        );
      case "R":
        return (
          <Typography
            sx={{
              color: "white",
              background: "Yellow",
              borderRadius: "10px",
              textAlign: "center",
              width: "50%",
              p: 0.5,
            }}
            variant="subtitle2"
          >
            Ronaldo
          </Typography>
        );
    }
  };

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
      <Card variant="outlined">
        <Typography
          sx={{ textAlign: "center", p: 2, fontWeight: 600 }}
          variant="h5"
        >
          Monitoring SP
        </Typography>
        <Divider />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    OUTCODE
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    TUJUAN
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    SP ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    NO REF
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    TANGGAL DELIVERY
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listSPMonitor &&
                listSPMonitor.map((item, index) => (
                  <TableRow key={index} sx={{ cursor: "pointer" }}>
                    <TableCell>{item.outcode}</TableCell>
                    <TableCell>{item.tujuan}</TableCell>
                    <TableCell>{item.sp_id}</TableCell>
                    <TableCell>{item.noref}</TableCell>
                    <TableCell>
                      {dayjs(new Date(item.delivery_date)).format(
                        "DD MMM YYYY HH:mm:ss A"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={isLoading}>
        <Box sx={style} style={{ textAlign: "center" }}>
          <Typography>Mohon Tunggu Permintaan Anda Sedang Di Proses</Typography>
          <CircularProgress></CircularProgress>
        </Box>
      </Modal>
    </Box>
  );
};
export default MonitoringSP;
