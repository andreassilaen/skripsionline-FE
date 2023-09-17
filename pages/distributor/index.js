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
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { debounce, isUndefined } from "lodash";

import api from "../../services/api";
import Link from "../../utils/link";

import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { getStorage } from "../../utils/storage";

const MasterDistributor = () => {
  const router = useRouter();
  const [distCode, setDistCode] = useState("");

  const debounceMountListDistributor = useCallback(
    debounce(mountListDistributor, 400),
    []
  );

  useEffect(() => {
    if (!router.isReady) return;

    debounceMountListDistributor(params);
  }, [router.isReady]);

  const [listDistributor, setListDistributor] = useState([]);

  const [inputDist, setInputDist] = useState("");
  const [totalData, setTotalData] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    length: 10,
  });
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_MASTER_DISTRIBUTOR")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  async function mountListDistributor(params, distCode) {
    try {
      const getListDistributor = await api.getListDistributor(params, distCode);
      const { data } = getListDistributor;
      setListDistributor(data.data);
      console.log(data, "data");
    } catch (error) {
      console.log(error);
    }
  }

  async function searchDistByID(inputSearch) {
    try {
      const getDistributorByNameOrDistCode =
        await api.getDistributorByNameOrDistCode(inputSearch);
      const { data } = getDistributorByNameOrDistCode.data;
      if (data !== undefined) {
        setListDistributor(data);
        setTotalData(1);
      }
    } catch (error) {
      console.log(error);
    }
  }

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

    debounceMountListDistributor(newParams, distCode);
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

    debounceMountListDistributor(newParams, distCode);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container item xs={4}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Master Distributor
          </Typography>
        </Grid>
        <Grid container item xs={3} justifyContent={"flex-end"}>
          <Link href={`/distributor/create`} sx={{ textDecoration: "none" }}>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              Add Distributor
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <TextField
            size="small"
            label="Search"
            sx={{ background: "white" }}
            margin={"none"}
            fullWidth
            value={inputDist}
            onChange={(e) => setInputDist(e.target.value)}
          />
        </Grid>
        <Grid item xs={2} justifyContent={"flex-end"}>
          <Button
            variant="contained"
            startIcon={<SearchOutlinedIcon />}
            sx={{ height: "100%" }}
            fullWidth
            onClick={() => searchDistByID(inputDist)}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Paper sx={{ width: "100%", my: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Kode Distributor
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Nama Distributor
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Nama Pajak
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Alamat Pajak
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    PKP
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    PPH
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    NPWP
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listDistributor.map((distributor) => (
                <TableRow key={distributor.distributor_code}>
                  <TableCell sx={{ width: "15%" }}>
                    {distributor.distributor_code}
                  </TableCell>
                  <TableCell>{distributor.nama_distributor}</TableCell>
                  <TableCell>{distributor.nama_pajak}</TableCell>
                  <TableCell>{distributor.alamat_pajak}</TableCell>
                  <TableCell>
                    <Chip
                      label={distributor.pkpyn === "Y" ? "Yes" : "No"}
                      color={distributor.pkpyn === "Y" ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={distributor.pphyn === "Y" ? "Yes" : "No"}
                      color={distributor.pphyn === "Y" ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>{distributor.npwp}</TableCell>
                  <TableCell align={"right"}>
                    <Link
                      href={`/distributor/${distributor.distributor_code}/cabang`}
                      sx={{ textDecoration: "none" }}
                    >
                      <Button size="small" variant="outlined" color="primary">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  count={totalData}
                  rowsPerPage={params.length}
                  page={params.page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default MasterDistributor;
