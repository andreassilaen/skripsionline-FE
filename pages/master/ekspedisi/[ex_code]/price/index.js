import {
  Box,
  Grid,
  Divider,
  FormControl,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableBody,
  TableFooter,
  TablePagination,
  Input,
  Paper,
  Link,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { debounce,isUndefined } from "lodash";
import api from "../../../../../services/api";
import { Add } from "@mui/icons-material";

const DetailEkspedisi = () => {
  const router = useRouter();
  const [listEkspedisiPrice, setListEkspedisiPrice] = useState([]);
  const [dataEkspedisi, setDataEkspedisi] = useState("");
  const debounceMountListEkspedisiPrice = useCallback(
    debounce(mountListEkspedisiPrice, 400),
    []
  );

  const debounceMountDataEkspedisi = useCallback(
    debounce(mountDataEkspedisi, 400),
    []
  );

  const [params, setParams] = useState({
    code: "",
  });

  useEffect(() => {
    if (!router.isReady) return;
    const { ex_code } = router.query;

    setParams({ code: ex_code });
  }, [router.isReady]);

  useEffect(() => {
    debounceMountListEkspedisiPrice(params);
    debounceMountDataEkspedisi(params);
  }, [params]);

  async function mountListEkspedisiPrice(params) {
    try {
      const getListEkspedisiPrice = await api.getListEkspedisiPrice(params);
      const { data } = getListEkspedisiPrice.data;
      setListEkspedisiPrice(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function mountDataEkspedisi(params) {
    try {
      const getDataEkspedisi = await api.getDataEkspedisi(params);
      const { data } = getDataEkspedisi.data;
      setDataEkspedisi(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box sx={{ width: "100%", backgroundColor: "white", p: 3 }}>
      <Grid container justifyContent={"space-between"}>
        <Grid container item xs={12}>
          <Grid container item xs={1}>
            <Link href={`/master/ekspedisi`} sx={{ mr: 2 }}>
              <IconButton aria-label="back">
                <ArrowBackIcon />
              </IconButton>
            </Link>
          </Grid>
          <Grid container item xs={7}>
            <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
              EKSPEDISI {params && params.code} -{" "}
              {dataEkspedisi && dataEkspedisi.ex_nama}
            </Typography>
          </Grid>
          <Grid justifyContent="flex-end" xs={4}>
            <Link
              href={`/master/ekspedisi/${params.code}/price/create`}
              sx={{ textDecoration: "none" }}
            >
              <Button
                size="large"
                variant="contained"
                startIcon={<Add />}
                sx={{ float: "right" }}
              >
                Tambah Layanan Ekspedisi
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Paper sx={{ width: "100%", my: 2 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "20%" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Tipe Layanan
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "15%" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Kode Area
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "15%" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Tarif
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Minimum(kg)
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "right" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listEkspedisiPrice.map((price) => (
                <TableRow key={price.kode_area}>
                  <TableCell sx={{ width: "20%" }}>
                    {price.tipe_layanan}
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>{price.kode_area}</TableCell>
                  <TableCell sx={{ width: "15%" }}>{price.fee}</TableCell>
                  <TableCell>{price.min_kirim}</TableCell>
                  <TableCell sx={{ width: "15%", textAlign: "right" }}>
                    {/* <Link
                      href={`/master/ekspedisi/${params.code}/price/${price.kode_area}/view`}
                      sx={{ textDecoration: "none" }}
                    >
                      <Button size="small" variant="outlined" color="primary">
                        View
                      </Button>
                    </Link> */}
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

export default DetailEkspedisi;
