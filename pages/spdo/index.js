import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Modal,
  CircularProgress,
} from "@mui/material";
import logistic from "../../services/logistic";
import core from "../../services/core";
import { getStorage } from "../../utils/storage";
import { debounce, isNull, isUndefined } from "lodash";
import { formatDate } from "../../utils/text";

const SPDO = () => {
  const router = useRouter();
  const debounceMountListSPBelumDilayani = useCallback(
    debounce(mountListSPBelumDilayani, 400),
    []
  );
  const debounceMountListProject = useCallback(
    debounce(mountListProject, 400),
    []
  );
  const [totalData, setTotalData] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    length: 500,
  });
  const [listSPBelumDilayani, setListSPBelumDilayani] = useState([]);
  const [listProject, setListProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const wsClient = useRef();
  const [waitingToReconnect, setWaitingToReconnect] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const userNIP = getStorage("userNIP");
  const userPT = JSON.parse(getStorage("pt"));
  const userOutlet = JSON.parse(getStorage("outlet"));
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_SPDO")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (!router.isReady) return;
    debounceMountListProject();
  }, [router.isReady]);

  useEffect(() => {
    if (!isNull(listProject)) {
      debounceMountListSPBelumDilayani(
        params,
        userPT.pt_id,
        userOutlet.out_code
      );
    }
  }, [listProject]);

  //SIDE EFFECTS UNTUK CONNECT KE WEBSOCKET
  useEffect(() => {
    if (waitingToReconnect) {
      return;
    }
    if (!wsClient.current && listSPBelumDilayani.length !== 0) {
      if (
        window.location.hostname.includes("staging") &&
        window.location.hostname.includes("chc")
      ) {
        var url_websocket = `wss:staging-api.chc.pharmalink.id/scm/v1/sp/pelayanan/ws`;
      } else if (window.location.hostname.includes("staging")) {
        var url_websocket = `wss:staging-api.pharmalink.id/scm/v1/sp/pelayanan/ws`;
      } else if (window.location.hostname.includes("chc")) {
        var url_websocket = `wss:api.chc.pharmalink.id/scm/v1/sp/pelayanan/ws`;
      } else {
        var url_websocket = `wss:api.pharmalink.id/scm/v1/sp/pelayanan/ws`;
      }
      const client = new WebSocket(url_websocket);
      wsClient.current = client;
      window.client = client;

      client.onerror = (e) => console.log(e);

      client.onopen = () => {
        setIsOpen(true);
        console.log("websocket online", isOpen);
      };

      client.onclose = () => {
        if (wsClient.current) {
          console.log("websocket closed", isOpen);
        } else {
          console.log("ws closed by app component unmount");
          return;
        }

        if (waitingToReconnect) {
          return;
        }

        // Parse event code and log
        setIsOpen(false);
        console.log("ws closed");

        // Setting this will trigger a re-run of the effect,
        // cleaning up the current websocket, but not setting
        // up a new one right away
        if (listSPBelumDilayani.length !== 0) {
          setWaitingToReconnect(null);
        }
      };

      client.onmessage = (response) => {
        var noSP = JSON.parse(response.data).spid;
        var userid = JSON.parse(response.data).updatedby;
        var tempArr = listSPBelumDilayani.filter((item) => item.sp_id !== noSP);
        if (userid !== userNIP) {
          setListSPBelumDilayani(tempArr);
        } else {
          client.close();
        }
      };

      return () => {
        wsClient.current = null;
        client.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSPBelumDilayani, userNIP, waitingToReconnect]);

  function handleLayaniSP(item, nip) {
    wsClient.current.send(JSON.stringify({ spid: item.sp_id, updatedby: nip }));
    router.push(`/spdo/${item.project_id}/${item.sp_id}`);
  }

  async function mountListSPBelumDilayani(params, pt, outcode) {
    setIsLoading(true);
    try {
      const newParams = {
        ...params,
        pt: pt,
        outcode: outcode,
        ronaldo: "M",
      };
      const getListSP = await logistic.getListSPBelumDilayani(newParams);
      const { data, metadata } = getListSP.data;
      if (data.length !== 0) {
        setListSPBelumDilayani(data);
        setTotalData(metadata.total_data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
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

  const handlePageChange = (event, newPage) => {
    if (params.page === newPage) {
      return;
    }

    const newParams = {
      ...params,
      page: newPage,
      length: params.length,
    };
    setParams(newParams);

    debounceMountListSPBelumDilayani(
      newParams,
      userPT.pt_id,
      userOutlet.out_code
    );
  };

  const handleRowsPerPageChange = async (event, newRows) => {
    if (params.length === newRows) {
      return;
    }

    const newParams = {
      ...params,
      page: 0,
      length: event.target.value,
    };
    setParams(newParams);

    debounceMountListSPBelumDilayani(
      newParams,
      userPT.pt_id,
      userOutlet.out_code
    );
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
          SPDO
        </Typography>
        <Divider />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    PROJECT
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    SP ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    TGL SP
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    STATUS
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    TIPE LAYANAN
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listSPBelumDilayani &&
                listSPBelumDilayani.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleLayaniSP(item, userNIP)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      {!isNull(listProject) && returnProjectName(item)}
                    </TableCell>
                    <TableCell>{item.sp_id}</TableCell>
                    <TableCell>{formatDate(item.tglsp)}</TableCell>
                    <TableCell>{handleStatus(item.flag)}</TableCell>
                    <TableCell>{handleLayanan(item.tipelayanan)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[500, 1000]}
                  count={totalData}
                  rowsPerPage={params.length}
                  page={params.page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </TableRow>
            </TableFooter>
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
export default SPDO;
