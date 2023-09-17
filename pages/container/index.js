import {
  Box,
  Button,
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
  IconButton,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { debounce, isUndefined } from "lodash";
import { getStorage } from "../../utils/storage";

import api from "../../services/api";
import Link from "../../utils/link";

import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const MasterContainer = () => {
  const router = useRouter();
  const [conID, setConID] = useState("");

  const debounceMountListContainer = useCallback(
    debounce(mountListContainer, 400),
    []
  );
  const accessList = getStorage("access_list");

  useEffect(() => {
    if (!isUndefined(accessList)) {
      var parsedAccess = JSON.parse(accessList);
      if (!Object.keys(parsedAccess).includes("LOGISTIC_MASTER_CONTAINER")) {
        router.push("/403");
      }
    } else {
      router.push("/403");
    }
  }, [accessList]);

  // const debounceRemoveContainer = useCallback(
  //   debounce(removeContainer, 400),
  //   []
  // );

  useEffect(() => {
    if (!router.isReady) return;

    debounceMountListContainer(params);
  }, [router.isReady]);

  const [listContainer, setListContainer] = useState([]);
  const [inputCon, setInputCon] = useState("");

  const [deleteModalContainer, setDeleteModalContainer] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    length: 10,
  });

  async function mountListContainer(params) {
    try {
      const getListContainer = await api.getListContainer(params);
      const { data } = getListContainer;
      setListContainer(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function searchConByIDorDesc(inputSearch) {
    try {
      const getContainerByDescOrID = await api.getContainerByDescOrID(
        inputSearch
      );
      const { data } = getContainerByDescOrID.data;

      if (data !== undefined) {
        setListContainer(data);
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

    debounceMountListContainer(newParams, conID);
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

    debounceMountListContainer(newParams, conID);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container item xs={4}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Master Container
          </Typography>
        </Grid>
        <Grid container item xs={3} justifyContent={"flex-end"}>
          <Link href={`/container/create`} sx={{ textDecoration: "none" }}>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              Add Container
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
            value={inputCon}
            onChange={(e) => setInputCon(e.target.value)}
          />
        </Grid>
        <Grid item xs={2} justifyContent={"flex-end"}>
          <Button
            variant="contained"
            startIcon={<SearchOutlinedIcon />}
            sx={{ height: "100%" }}
            fullWidth
            onClick={() => searchConByIDorDesc(inputCon)}
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
                    Kode Container
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Keterangan
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Panjang (cm)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Lebar (cm)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Tinggi (cm)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Berat (g)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listContainer.map((container) => (
                <TableRow key={container.con_id}>
                  <TableCell sx={{ width: "15%" }}>
                    {container.con_id}
                  </TableCell>
                  <TableCell>{container.deskripsi}</TableCell>
                  <TableCell>{container.panjang}</TableCell>
                  <TableCell>{container.lebar}</TableCell>
                  <TableCell>{container.tinggi}</TableCell>
                  <TableCell>{container.berat}</TableCell>
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

export default MasterContainer;
