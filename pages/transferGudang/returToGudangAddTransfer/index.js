import { ArrowBack, TryOutlined } from '@mui/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import dayjs from 'dayjs'
import idLocale from "dayjs/locale/id";
dayjs.locale("id");
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { formatDate } from '../../../utils/text';
import API from "../../../services/transferGudang";

const Create = () => {

    const ptID = JSON.parse(window.localStorage.getItem("pt")).pt_id;
    const outcode = JSON.parse(window.localStorage.getItem("outlet")).out_code;

    var [searchData, setSearchData] = useState("");
    const [dataTable, setDataTable] = useState([]);
    var [params, setParams] = useState("");

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMountSearchNoReceive = useCallback(
        debounce(mountSearchNoReceive, 400),
    );

    async function mountSearchNoReceive(params) {
        setIsLoading(true)
        try {
            const searchNoReceive = await API.searchListNoReceive(params)
            const { data } = searchNoReceive.data;
            setDataTable(data.Header);
            setIsLoading(false);
            console.log(searchNoReceive);

        } catch (error) {
            setIsLoading(false)
            toast.error("No. Transfer/No. DO sudah diproses !", { autoClose: 4800 })
        }
    }

    const handleSearchNoReceive = () => {
        const newParams = {
            notransf: searchData,
            outcode: outcode,
            ptID: ptID
        }
        setParams(newParams);
        debounceMountSearchNoReceive(newParams);
        setSearchData("");
    }

    function handleSpacePress(e) {
        var code = e.charCode || e.which;
        if (code === 32) {
            e.preventDefault();
            toast.error("Harap Data Yang Di Input Tidak Mengandung Spasi");
        }
    }

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            <ToastContainer pauseOnFocusLoss={false} />
            <Grid container justifyContent={"space-between"} sx={{ marginBottom: "1%", display: 'flex' }}>
                <Grid container flex={1}>
                    <Link href="/transferGudang" sx={{ mr: 2 }}>
                        <IconButton aria-label="back">
                            <ArrowBack />
                        </IconButton>
                    </Link>
                    <Typography variant="h5" sx={{ color: "#f55142" }}>
                        <b>{`Generate No Receive`}</b>
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container>
                <TextField
                    sx={{ marginLeft: "1%", marginRight: "1%", width: "30%" }}
                    size='small'
                    label="Masukkan No. Transfer (DO)"
                    value={searchData}
                    onKeyPress={(e) => handleSpacePress(e)}
                    onChange={(e) => setSearchData(e.target.value)}
                >
                </TextField>

                <Grid sx={{ marginTop: "1px" }}>
                    <Button
                        variant='contained'
                        size='medium'
                        disabled={searchData === ""
                            ? true
                            : false}
                        onClick={() => handleSearchNoReceive()}>
                        Cari
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />


            <Grid sx={{ marginTop: "1%" }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><b>No. Transfer</b></TableCell>
                                <TableCell align="center"><b>Tanggal Transfer</b></TableCell>
                                <TableCell align="center"><b>Comco Pengirim</b></TableCell>
                                <TableCell align="center"><b>Outlet Pengirim</b></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody >
                            <TableRow >
                                <TableCell align="center">
                                    <Link
                                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                                        href={`returToGudangProductList/${dataTable.transfH_NoTransf}`}
                                    >
                                        {dataTable.transfH_NoTransf}
                                    </Link>
                                </TableCell>
                                <TableCell align="center">{formatDate(dataTable.transfH_TglTransf)}</TableCell>
                                <TableCell align="center">{dataTable.transfH_OutCodeTransf}</TableCell>
                                <TableCell align="center">{dataTable.OutletPengirim}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            {/* MODAL LOADING */}
            <Dialog
                fullWidth
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                open={isLoading}>
                <DialogContent>
                    <Grid
                        container
                        spacing={3}>
                        <Grid item xs>
                        </Grid>
                        <Grid item xs={8} sx={{ textAlign: "center" }}>
                            <CircularProgress size={20} />
                            <Typography sx={{ marginBottom: "1%" }}>
                                Mohon Menunggu
                            </Typography>
                        </Grid>
                        <Grid item xs>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* MODAL LOADING */}
        </Box>
    )
}

export default Create;