import { Edit, Search } from "@mui/icons-material";
import {
  Box,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableBody,
  IconButton,
  Button,
  Paper,
  Divider,
  TableFooter,
  TablePagination,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import api from "../../../services/api";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/router";
import { debounce,isUndefined } from "lodash";
import Link from "../../../utils/link";
import { formatDate } from "../../../utils/text";
import { getStorage } from "../../../utils/storage";

const Ekspedisi = () => {
  const router = useRouter();
  const debounceMountListEkspedisi = useCallback(
    debounce(mountListEkspedisi, 400),
    []
  );

  const debounceSearchEkspedisi = useCallback(
    debounce(mountSearchEkspedisi, 400),
    []
  );

  const [inputSearch, setInputSearch] = useState("");
  const [listEkspedisi, setListEkspedisi] = useState([]);
  const [totalData, setTotalData] = useState(0);
  // const [params, setParams] = useState({
  //   page: 0,
  //   length: 10,
  // });
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_MASTER_EKSPEDISI")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  useEffect(() => {
    if (!router.isReady) return;
    debounceMountListEkspedisi();
  }, [router.isReady]);

  async function mountListEkspedisi() {
    try {
      const getListEkspedisi = await api.getListEkspedisi();
      const { data } = getListEkspedisi.data;
      setListEkspedisi(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function mountSearchEkspedisi(inputSearch) {
    try {
      const searchEkspedisi = await api.searchEkspedisi(inputSearch);
      const { data } = searchEkspedisi.data;
      setListEkspedisi(data);
      setTotalData(data.length);
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

    debounceMountListEkspedisi(newParams);
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

    debounceMountListEkspedisi(newParams);
  };

  const tableHeader = [
    {
      name: "Kode Ekspedisi",
    },
    {
      name: "Nama Ekspedisi",
    },
    {
      name: "Actions",
      align: "right",
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container item xs={4}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Master Ekspedisi
          </Typography>
        </Grid>
        <Grid container item xs={4} justifyContent={"flex-end"}>
          <Link
            href={`/master/ekspedisi/create`}
            sx={{ textDecoration: "none" }}
          >
            <Button variant="contained" startIcon={<Add />} size="large">
              Tambah Ekspedisi
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid item flex={12}>
        <Grid container spacing={2}>
          <Grid item flex={8}>
            <TextField
              label="Input (Kode Ekspedisi / Nama Ekspedisi)"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              size="small"
              sx={{ backgroundColor: "white" }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item flex={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Search />}
              onClick={() => debounceSearchEkspedisi(inputSearch)}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Paper sx={{ width: "100%", my: 2 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {tableHeader &&
                  tableHeader.map((head, index) => (
                    <TableCell
                      sx={{ fontWeight: "bold", textAlign: `${head.align}` }}
                      key={index}
                    >
                      {head.name}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listEkspedisi &&
                listEkspedisi.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.ex_kode}</TableCell>
                    <TableCell>{item.ex_nama}</TableCell>
                    <TableCell align={"right"}>
                      <Link
                        href={`/master/ekspedisi/${item.ex_kode}/price`}
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
            {/* <TableFooter>
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
            </TableFooter> */}
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
export default Ekspedisi;
