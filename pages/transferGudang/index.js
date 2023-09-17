import { Add } from '@mui/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
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
    Typography
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import idLocale from "dayjs/locale/id";
dayjs.locale("id");
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useState, useCallback } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import API from '../../services/transferGudang'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { formatDate } from '../../utils/text';

const Index = () => {

    const ptID = JSON.parse(window.localStorage.getItem("pt")).pt_id;
    const outcode = JSON.parse(window.localStorage.getItem("outlet")).out_code;

    useEffect(() => {
        console.log("PT ID", ptID);
        console.log("OUTLET", outcode);
    }, [ptID, outcode])

    var [dataTable, setDataTable] = useState([]);
    var [dataPrint, setDataPrint] = useState([]);
    var [hideLink, setHideLink] = useState(false);

    const FILTER_TYPE = {
        "No. Rcv. (TnIn)": "header",
        "No. Transfer (DO)": "headersbytransf",
        "Status Print": "all"
    }

    const FILTER_PRINT = {
        "YES": "P",
        "NO": "N"
    }

    const [searchPrint, setSearchPrint] = useState(FILTER_PRINT["YES"]);
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    const router = useRouter();
    const [selectedType, setSelectedType] = useState("2");

    const [searchType, setSearchType] = useState(FILTER_TYPE["No. Rcv. (TnIn)"]);
    const [searchInput, setSearchInput] = useState("")

    const [isLoading, setIsLoading] = useState(true)

    const [totalData, setTotalData] = useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMountListDataGudang = useCallback(
        debounce(mountListDataGudang, 400),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMountSearchListNoReceive = useCallback(
        debounce(mountSearchListNoReceive, 400),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMountSearchListNoTransfer = useCallback(
        debounce(mountSearchListNoTransfer, 400),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMountSearchListByDate = useCallback(
        debounce(mountSearchListByDate, 400),
    );

    const [params, setParams] = useState(
        {
            page: 0,
            length: 10
        }
    )

    async function mountListDataGudang(params) {
        try {
            const getListDataGudang = await API.getListDataGudang({
                find: "header",
                group: selectedType,
                outcode: outcode,
                ptID: ptID,
                page: params.page,
                length: params.length
            });
            const { data, metadata } = getListDataGudang.data;
            setDataTable(data);
            setTotalData(metadata ? metadata.total_data : data.length);
            setIsLoading(false)
            console.log("data", getListDataGudang);
        } catch (error) {
            console.log("ERROR", error);
            setIsLoading(false)
            toast.error("Terjadi Kesalahan, silahkan coba kembali!")
        }
    }

    const handlePageChange = (event, newPage) => {
        if (params.page === newPage) {
            return;
        }

        const newParams = {
            ...params,
            page: newPage,
            length: params.length
        };
        setParams(newParams);

        debounceMountListDataGudang(newParams)
    }

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

        debounceMountListDataGudang(newParams);
    };

    async function mountSearchListNoReceive(params) {
        try {
            const searchListNoReceive = await API.searchListNoReceive(params);
            const { data } = searchListNoReceive.data;
            router.push(`/transferGudang/returToGudangDetail/${data.TranrcH_NoTranrc}/${data.TranrcH_NoTransf}`)
        } catch (error) {
            toast.error("No. Receive Tidak Ditemukan!", { autoClose: 4800 })
        }
    }

    async function mountSearchListNoTransfer(params) {
        try {
            const searchListNoTransfer = await API.searchListNoTransfer(params);
            const { data } = searchListNoTransfer.data;

            if (data.length === 1) {
                router.push(`/transferGudang/returToGudangDetail/${data[0].TranrcH_NoTranrc}/${data[0].TranrcH_NoTransf}`)
            } else if (data.length > 1) {
                setDataTable(data);
            }
        } catch (error) {
            toast.error("No. Transfer Tidak Ditemukan!", { autoClose: 4800 })
        }
    }

    async function mountSearchListByDate(params) {
        var payload = {
            start_date: `${dayjs(startDate).format("YYYY-MM-DD") + " 00:00:00"}`,
            end_date: `${dayjs(endDate).format("YYYY-MM-DD") + " 23:59:59"}`
        }
        try {
            const searchListByDate = await API.searchListByDate(payload, params);
            const { data } = searchListByDate.data

            setDataPrint(dataTable);

            if (data.Data === null) {
                setDataPrint([]);
            } else {
                setDataPrint(data.Data)
            }

        } catch (error) {
            toast.error("Terjadi Kesalahan, Silahkan coba kembali!")
        }
    }

    useEffect(() => {
        console.log("DATA TABLE", dataTable);
    }, [dataTable])

    const handleSearchListByDate = () => {
        const newParams = {
            group: selectedType,
            flag: searchPrint,
            ptID: ptID,
        }
        setParams(newParams);
        debounceMountSearchListByDate(newParams);
    }

    const handleSearchListNoReceive = () => {
        const newParams = {
            find: searchType,
            noRecv: searchInput,
            ptID: ptID
        }
        setParams(newParams);
        debounceMountSearchListNoReceive(newParams);
    }

    const handleSearchListNoTransfer = () => {
        const newParams = {
            find: searchType,
            notransf: searchInput,
            outcode: outcode,
            ptID: ptID
        }
        setParams(newParams);
        debounceMountSearchListNoTransfer(newParams);
    }

    function searchButton() {
        if (searchType === "header") {
            handleSearchListNoReceive();
        } else if (searchType === "headersbytransf") {
            handleSearchListNoTransfer();
        } else if (searchType === "all") {
            handleSearchListByDate();
        } else {
            return
        }
    }

    useEffect(() => {
        // if (!router.isReady) return;
        debounceMountListDataGudang(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedType]);

    function hoverTextTnin() {
        setHideLink(!hideLink);
    }

    var style;
    if (hideLink) {
        style = {
            color: "black",
            cursor: "pointer",
            textDecoration: "underline",
            fontStyle: "italic",
            fontSize: "8px",
        };
    } else {
        style = {
            color: "white",
            cursor: "pointer",
            textDecoration: "underline",
            fontStyle: "italic",
            fontSize: "8px",
        };
    }

    function handleSpacePress(e) {
        var code = e.charCode || e.which;
        if (code === 32) {
            e.preventDefault();
        }
    }

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            <ToastContainer pauseOnFocusLoss={false} />
            <Grid container justifyContent={"space-between"}>
                <Grid item xs={4}>
                    <Typography variant="h5" sx={{ color: "#f55142" }}><b>Transfer Gudang (TN-IN)</b></Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid sx={{ marginBottom: "1.5%" }} container>
                <Typography variant="h6" sx={{ marginTop: "0.35%" }}><b>Kategori:</b></Typography>
                <RadioGroup
                    sx={{ marginLeft: "1%", }}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}>
                    <FormControlLabel value="2" control={<Radio />} label="Floor" />
                    <FormControlLabel value="1" control={<Radio />} label="Apotek" />
                </RadioGroup>
            </Grid>

            <Grid container xs={12}>
                <FormControl sx={{ width: "14%" }}>
                    <InputLabel id="search-type-label" sx={{ textAlign: "center" }}>Pencarian Berdasarkan</InputLabel>
                    <Select
                        id="search-type"
                        value={searchType}
                        size='small'
                        label="Pencarian Berdasarkan"
                        onKeyPress={(e) => handleSpacePress(e)}
                        onChange={(e) => setSearchType(e.target.value)}>
                        <MenuItem value={FILTER_TYPE['No. Rcv. (TnIn)']}>No. Rcv. (TnIn)</MenuItem>
                        <MenuItem value={FILTER_TYPE['No. Transfer (DO)']}>No. Transfer (DO)</MenuItem>
                        <MenuItem value={FILTER_TYPE['Status Print']}>Status Print</MenuItem>
                    </Select>
                </FormControl>
                {searchType === "header" && (
                    <TextField
                        sx={{ marginLeft: "1%", marginRight: "1%", width: "25%" }}
                        size='small'
                        label={`Cari No. Rcv. (TnIn)`}
                        value={searchInput}
                        onKeyPress={(e) => handleSpacePress(e)}
                        onChange={(e) => setSearchInput(e.target.value)}
                    >
                    </TextField>
                )}
                {searchType === "headersbytransf" && (
                    <TextField
                        sx={{ marginLeft: "1%", marginRight: "1%", width: "25%" }}
                        size='small'
                        label={`Cari No. Transfer (DO)`}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    >
                    </TextField>
                )}
                {searchType === "all" && (
                    <>
                        <FormControl sx={{ marginLeft: "1%" }}>
                            <InputLabel id="search-type-label">Print</InputLabel>
                            <Select
                                id="search-print"
                                size='small'
                                label="Type"
                                value={searchPrint}
                                onChange={(e) => setSearchPrint(e.target.value)}>
                                <MenuItem value={FILTER_PRINT['YES']}>YES</MenuItem>
                                <MenuItem value={FILTER_PRINT['NO']}>NO</MenuItem>
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                inputFormat="MM/DD/YYYY"
                                size="small"
                                value={startDate}
                                onChange={(e) => setStartDate(e)}
                                renderInput={(params) => <TextField size='small' sx={{ marginLeft: "1%" }} {...params} />}
                            />
                            <Typography
                                sx={{ marginLeft: "1%", marginRight: "1%", marginTop: "0.5%" }}>
                                -
                            </Typography>
                            <DatePicker
                                inputFormat="MM/DD/YYYY"
                                size="small"
                                value={endDate}
                                onChange={(e) => setEndDate(e)}
                                renderInput={(params) => <TextField size='small' sx={{ marginRight: "1%" }} {...params} />}
                            />
                        </LocalizationProvider>
                    </>
                )}
                <Grid sx={{ marginTop: "1px" }}>
                    <Button
                        variant='contained'
                        size='medium'
                        onClick={() => searchButton()}>
                        Cari
                    </Button>
                </Grid>
            </Grid>

            <Grid container justifyContent={"space-between"}>
                <Grid sx={{ marginTop: "2%" }} container xs={4}>
                    <Typography style={{ fontStyle: "italic", color: "#f55142" }}><b>Data Receive Produk (TN-IN {selectedType === "2" ? "Floor" : "Apotek"})</b></Typography>
                </Grid>
                <Grid container item xs={4} justifyContent={"flex-end"}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        size="large"
                        onClick={() => router.push("/transferGudang/returToGudangAddTransfer")}>
                        New Transfer In
                    </Button>
                </Grid>
            </Grid>

            <Grid sx={{ marginTop: "1%" }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><b>No. Receive (TNIN)</b></TableCell>
                                <TableCell align="left"><b>Tgl. Rcv (TNIN)</b></TableCell>
                                <TableCell align="left"><b>Tgl. Print Rcv. (TNIN)</b></TableCell>
                                <TableCell align="left"><b>Tgl. Transfer (DO)</b></TableCell>
                                <TableCell align="center"><b>Outlet ID Pengirim</b></TableCell>
                                <TableCell align="center"><b>Outlet Pengirim</b></TableCell>
                                <TableCell align="center"><b>No. Transfer</b></TableCell>
                                <TableCell align="center"><b>Print</b></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {searchType === FILTER_TYPE['No. Rcv. (TnIn)'] && (
                                dataTable && dataTable.map((item) => (
                                    <TableRow
                                        key={item}>
                                        <TableCell align="center">
                                            <Link
                                                sx={{ cursor: "pointer", textDecoration: "underline" }}
                                                href={`transferGudang/returToGudangDetail/${item.TranrcH_NoTranrc}/${item.TranrcH_NoTransf}`}
                                            >
                                                {item.TranrcH_NoTranrc}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="left">{formatDate(item.TranrcH_TglTranrc, "dddd, DD-MM-YYYY")}</TableCell>
                                        <TableCell align="left">{formatDate(item.TranrcH_lastUpdate, "dddd, DD-MM-YYYY")}</TableCell>
                                        <TableCell align="left">{formatDate(item.TranrcH_TglTransf, "dddd, DD-MM-YYYY")}</TableCell>
                                        <TableCell align="center">{item.TranrcH_OutCodeTransf}</TableCell>
                                        <TableCell align="center">{item.TranrcH_Receiver}</TableCell>
                                        <TableCell align="center">{item.TranrcH_NoTransf}</TableCell>
                                        <TableCell align="center">{item.TranrcH_Flag === "P" ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                            {searchType === FILTER_TYPE['No. Transfer (DO)'] && (
                                dataTable && dataTable.map((item) => (
                                    <TableRow
                                        key={item}>
                                        <TableCell align="center">
                                            <Link
                                                sx={{ cursor: "pointer", textDecoration: "underline" }}
                                                href={`transferGudang/returToGudangDetail/${item.TranrcH_NoTranrc}/${item.TranrcH_NoTransf}`}
                                            >
                                                {item.TranrcH_NoTranrc}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="left">{formatDate(item.TranrcH_TglTranrc, "dddd, DD-MM-YYYY")}</TableCell>
                                        <TableCell align="left">{formatDate(item.TranrcH_lastUpdate, "dddd, DD-MM-YYYY")}</TableCell>
                                        <TableCell align="left">{formatDate(item.TranrcH_TglTransf, "dddd, DD-MM-YYYY")}</TableCell>
                                        <TableCell align="center">{item.TranrcH_OutCodeTransf}</TableCell>
                                        <TableCell align="center">{item.TranrcH_Receiver}</TableCell>
                                        <TableCell align="center">{item.TranrcH_NoTransf}</TableCell>
                                        <TableCell align="center">{item.TranrcH_Flag === "P" ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                            {searchType === FILTER_TYPE['Status Print'] && (
                                dataPrint && dataPrint.map((item) => (
                                    <TableRow
                                        key={item}>
                                        <TableCell align="center">
                                            <Link
                                                sx={{ cursor: "pointer", textDecoration: "underline" }}
                                                href={`transferGudang/returToGudangDetail/${item.Header.TranrcH_NoTranrc}/${item.Header.TranrcH_NoTransf}`}
                                            >
                                                {item.Header.TranrcH_NoTranrc}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="left">{formatDate(item.Header.TranrcH_TglTranrc, "dddd, DD-MM-YYYY")}</TableCell>
                                        <TableCell align="left">{formatDate(item.Header.TranrcH_lastUpdate, "dddd, DD-MM-YYYY")}</TableCell>
                                        <TableCell align="left">{formatDate(item.Header.TranrcH_TglTransf, "dddd, DD-MM-YYYY")}</TableCell>
                                        <TableCell align="center">{item.Header.TranrcH_OutCodeTransf}</TableCell>
                                        <TableCell align="center">{item.Header.TranrcH_Receiver}</TableCell>
                                        <TableCell align="center">{item.Header.TranrcH_NoTransf}</TableCell>
                                        <TableCell align="center">{item.Header.TranrcH_Flag === "P" ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50]}
                                    count={totalData === undefined ? 1 : totalData}
                                    rowsPerPage={params.length}
                                    page={params.page}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid container justifyContent={"space-between"}>
                <Grid>
                    <Link
                        onMouseEnter={() => hoverTextTnin()}
                        onMouseLeave={() => hoverTextTnin()}
                        sx={{ cursor: "pointer", textDecoration: "underline", fontSize: "5px" }}
                        href={`/transferGudang/returToGudangMonitoring`}
                        style={style}>
                        <Typography sx={{ fontSize: "5px" }}>
                            *tnin
                        </Typography>
                    </Link>
                </Grid>
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

export default Index;