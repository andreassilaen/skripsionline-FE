import {
  Box,
  Grid,
  Chip,
  Button,
  IconButton,
  TextField,
  Typography,
  Divider,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { debounce,isUndefined } from "lodash";

import api from "../../../../services/api";
import Link from "../../../../utils/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

const CabangDistributor = () => {
  const router = useRouter();
  const [distCode, setDistCode] = useState("");
  const [params, setParams] = useState({
    page: 0,
    length: 10,
    kodeDist: "",
  });

  const debounceMountListCabangDist = useCallback(
    debounce(mountListCabangDist, 400),
    []
  );

  const debounceMountDataDistributor = useCallback(
    debounce(mountDataDistributor, 400),
    []
  );

  useEffect(() => {
    if (!router.isReady) return;
    const { dist_code } = router.query;
    setDistCode(dist_code);

    debounceMountDataDistributor(dist_code);
    debounceMountListCabangDist(params, dist_code);
  }, [router.isReady]);

  const [listCabangDist, setListCabangDist] = useState([]);
  const [dataDist, setDataDist] = useState({});
  const [totalData, setTotalData] = useState(0);

  async function mountListCabangDist(params, distCode) {
    try {
      const getCabangDistributor = await api.getCabangDistributor(
        params,
        distCode
      );
      const { data } = getCabangDistributor.data;

      setListCabangDist(data);
      setTotalData(data.length);
      console.log(data, "data");
    } catch (error) {
      console.log(error);
    }
  }

  //url untuk header detail cbng distributor
  async function mountDataDistributor(dist_code) {
    const newParams = {
      distcode: dist_code,
    };
    const getDistributorByDistCode = await api.getDistributorByDistCode(
      newParams
    );
    const { data } = getDistributorByDistCode.data;
    setDataDist(data);
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

    debounceMountListCabangDist(newParams, distCode);
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

    debounceMountListCabangDist(newParams, distCode);
  };

  const tableHeader = [
    {
      name: "Kode Distributor",
    },
    {
      name: "Kode Cabang",
    },
    {
      name: "Kode Area",
    },
    {
      name: "Nama Cabang",
    },
    {
      name: "Alamat Cabang",
    },
    {
      name: "Kota",
    },
    {
      name: "Kode Pos",
    },
    {
      name: "Tanggal Pengukuhan",
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container xs={6}>
          <Link href="/distributor" sx={{ mr: 2 }}>
            {/* <Link href= sx={{ mr: 2 }}> */}
            <IconButton aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Detail Cabang Distributor
          </Typography>
        </Grid>
        <Link
          href={`/distributor/${distCode}/cabang/create`}
          sx={{ textDecoration: "none" }}
        >
          <Button variant="contained" startIcon={<AddIcon />} size="large">
            Add Cabang
          </Button>
        </Link>
      </Grid>

      <Box sx={{ width: "100%", p: 3 }}>
        <Grid container>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            {dataDist && dataDist.distributor_code} -{" "}
            {dataDist && dataDist.nama_distributor}
          </Typography>
        </Grid>
        <Grid container justifyContent={"space-between"}>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 0.5 }}>
                Nama Pajak : {dataDist && dataDist.nama_pajak}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 0.5 }}>
                Alamat Pajak : {dataDist && dataDist.alamat_pajak}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 0.5 }}>
                NPWP : {dataDist && dataDist.npwp}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 0.5 }}>
                PKP :
                <Chip
                  label={dataDist && dataDist.pkpyn === "Y" ? "Yes" : "No"}
                  color={
                    dataDist && dataDist.pkpyn === "Y" ? "success" : "error"
                  }
                />
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 0.5 }}>
                PPH :
                <Chip
                  label={dataDist && dataDist.pphyn === "Y" ? "Yes" : "No"}
                  color={
                    dataDist && dataDist.pphyn === "Y" ? "success" : "error"
                  }
                />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Paper sx={{ width: "100%", my: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeader &&
                  tableHeader.map((head, index) => (
                    <TableCell sx={{ fontWeight: "bold" }} key={index}>
                      {head.name}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listCabangDist.map((cabangDist) => (
                <TableRow key={cabangDist.distributor_code}>
                  <TableCell sx={{ width: "15%" }}>
                    {cabangDist.distributor_code}
                  </TableCell>
                  <TableCell>{cabangDist.cabang_distributor_code}</TableCell>
                  <TableCell>{cabangDist.area_code}</TableCell>
                  <TableCell>{cabangDist.nama_cbng}</TableCell>
                  <TableCell>{cabangDist.alamat_cbng}</TableCell>
                  <TableCell>{cabangDist.kota}</TableCell>
                  <TableCell>{cabangDist.kode_pos}</TableCell>
                  <TableCell>{cabangDist.tgl_pengukuhan}</TableCell>
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

export default CabangDistributor;
