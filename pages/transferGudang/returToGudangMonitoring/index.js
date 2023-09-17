import { Add, ArrowBack } from '@mui/icons-material'
import {
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    Link,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
    Box,
    Button,
    InputLabel,
    TableContainer,
    Paper,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs'
import idLocale from "dayjs/locale/id";
dayjs.locale("id");
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import API from '../../../services/transferGudang';
import { formatDate } from '../../../utils/text';

const Index = () => {

    const ptID = JSON.parse(window.localStorage.getItem("pt")).pt_id;
    const outcode = JSON.parse(window.localStorage.getItem("outlet")).out_code;

    const [listData, setListData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [searchData, setSearchData] = useState([]);

    const [selectedType, setSelectedType] = useState("0");;
    const [selectedPeriod, setSelectedPeriod] = useState("Print");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [searchInput, setSearchInput] = useState("");

    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    const router = useRouter();

    const FILTER_TYPE = {
        "No. Rcv. (TnIn)": "header",
        "No. Transfer (DO)": "headersbytransf",
    }
    const [searchType, setSearchType] = useState(FILTER_TYPE["No. Rcv. (TnIn)"]);

    const FILTER_PRINT = {
        "ALL": "All",
        "YES": "Yes",
        "NO": "No"
    }

    function getNoReceiveList() {

        var payload = {
            start_date: `${dayjs(startDate).format("YYYY-MM-DD") + " 00:00:00"}`,
            end_date: `${dayjs(endDate).format("YYYY-MM-DD") + " 23:59:59"}`
        }

        const dataByFlag = "";
        if (selectedStatus === "All") {
            dataByFlag = "A";
        } else if (selectedStatus === "Yes") {
            dataByFlag = "P";
        } else if (selectedStatus === "No") {
            dataByFlag = "N";
        }

        var url_getdata;

        if (selectedPeriod === "Print") {
            url_getdata = `https://staging-api.pharmalink.id/transfer/tnin?find=all&outcode=${outcode}&group=${selectedType}&flag=${dataByFlag}&ptID=${ptID}`;
        } else if (selectedPeriod === "Transfer (DO)") {
            url_getdata = `https://staging-api.pharmalink.id/transfer/tnin?find=bydo&outcode=${outcode}&group=${selectedType}&flag=${dataByFlag}&ptID=${ptID}`;
        } else if (selectedPeriod === "Receive") {
            url_getdata = `https://staging-api.pharmalink.id/transfer/tnin?find=byrcv&outcode=${outcode}&group=${selectedType}&flag=${dataByFlag}&ptID=${ptID}`
        }

        axios.post(url_getdata, payload)
            .then((response) => {
                if (response === null) {
                    toast.error("Data tidak ditemukan!")
                    setListData([]);
                } else {
                    setListData(response.data.data.Data);
                    setStatusData(response.data.data);
                }
            })
    }

    function downloadExcel() {
        var url_downloadExcel = `https://staging-api.pharmalink.id/transfer/tnin/download?&outcode=${outcode}&group=${selectedType}&flag=${selectedStatus}&ptID=1`

        var payload = {
            start_date: `${dayjs(startDate).format("YYYY-MM-DD") + " 00:00:00"}`,
            end_date: `${dayjs(endDate).format("YYYY-MM-DD") + " 23:59:59"}`
        }

        axios.post(url_downloadExcel, payload, {
            responseType: "blob",
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        }).then((response) => {
            const urlblob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = urlblob;
            link.setAttribute("download", `DataMonitoringTn-In.xlsx`);
            document.body.appendChild(link);
            link.click();
        }, (error) => {
            console.log("ERROR", error);
        })
    }

    async function mountSearchListNoReceive(params) {
        try {
            const searchListNoReceive = await API.searchListNoReceive(params);
            const { data } = searchListNoReceive.data;
            router.push(`/transferGudang/returToGudangDetail/${data.TranrcH_NoTranrc}/${data.TranrcH_NoTransf}`);
        } catch (error) {
            toast.error("No Receive Tidak Ditemukan!", { autoClose: 4800 })
        }
    }

    async function mountSearchListNoTransfer(params) {
        try {
            const searchListNoTransfer = await API.searchListNoTransfer(params);
            const { data } = searchListNoTransfer.data;

            if (data.length === 1) {
                router.push(`/transferGudang/returToGudangDetail/${data[0].TranrcH_NoTranrc}/${data[0].TranrcH_NoTransf}`);
            } else if (data.length > 1) {
                setSearchData(data);
            }
        } catch (error) {
            toast.error("No. Transfer (DO) Tidak Ditemukan!", { autoClose: 4800 })
        }
    }

    useEffect(() => {
        console.log("SEARCH TABLE", searchData);
    }, [searchData])

    const [params, setParams] = useState(
        {
            page: 0,
            length: 10
        }
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMountSearchListNoReceive = useCallback(
        debounce(mountSearchListNoReceive, 400),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMountSearchListNoTransfer = useCallback(
        debounce(mountSearchListNoTransfer, 400),
    );

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
        setListData([]);
        if (searchType === "header") {
            handleSearchListNoReceive();
        } else if (searchType === "headersbytransf") {
            handleSearchListNoTransfer();
        } else {
            return
        }
    }

    useEffect(() => {
        var url_noReceive = `https://staging-api.pharmalink.id/transfer/tnin?find=all&outcode=${outcode}&group=${selectedType}&ptID=${ptID}&flag=${selectedStatus}`

        var payload = {
            start_date: `${dayjs(startDate).format("YYYY-MM-DD") + " 00:00:00"}`,
            end_date: `${dayjs(endDate).format("YYYY-MM-DD") + " 23:59:59"}`
        }

        axios.post(url_noReceive, payload)
            .then((response) => {
                if (response === null) {
                    setListData([]);
                } else {
                    setStatusData(response.data.data);
                }
            })
    }, [selectedType, selectedStatus, startDate, endDate, outcode, ptID])

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
                        <b>{`Transfer Gudang Monitoring`}</b>
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid sx={{ marginBottom: "1%" }} container>
                <Typography variant="h6" sx={{ marginTop: "0.35%" }}><b>Kategori :</b></Typography>
                <RadioGroup
                    sx={{ marginLeft: "1%" }}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}>
                    <FormControlLabel value="0" control={<Radio />} label="All" />
                    <FormControlLabel value="2" control={<Radio />} label="Floor" />
                    <FormControlLabel value="1" control={<Radio />} label="Apotek" />
                </RadioGroup>
                <TextField
                    sx={{ width: "9%" }}
                    size='small'
                    label={`Status Print`}
                    disabled
                >
                </TextField>
                <FormControl>
                    {/* <InputLabel sx={{ textAlign: "center" }}>Status Print</InputLabel> */}
                    <Select
                        size="small"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}>
                        <MenuItem value={FILTER_PRINT['ALL']}>All</MenuItem>
                        <MenuItem value={FILTER_PRINT['YES']}>Yes</MenuItem>
                        <MenuItem value={FILTER_PRINT['NO']}>No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid sx={{ marginBottom: "1.5%" }} container>
                <Typography variant="h6" sx={{ marginTop: "0.35%" }}><b>Periode :</b></Typography>
                <RadioGroup
                    sx={{ marginLeft: "1%", }}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}>
                    <FormControlLabel value="Print" control={<Radio />} label="Print" />
                    <FormControlLabel value="Receive" control={<Radio />} label="Receive" />
                    <FormControlLabel value="Transfer (DO)" control={<Radio />} label="Transfer(DO)" />
                </RadioGroup>
            </Grid>

            <Grid container>
                <Typography variant="h6" sx={{ marginTop: "0.5" }}><b>Periode {selectedPeriod}</b></Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={startDate}
                        onChange={(newVal) => setStartDate(newVal)}
                        renderInput={(params) => (
                            <TextField
                                sx={{ marginLeft: "1%" }}
                                {...params}
                                size="small"
                            />
                        )}
                    />
                    <Typography
                        sx={{ marginLeft: "1%", marginRight: "1%", marginTop: "0.5%" }}>
                        -
                    </Typography>
                    <DatePicker
                        value={endDate}
                        onChange={(newVal) => setEndDate(newVal)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                            />
                        )}
                    />
                </LocalizationProvider>
            </Grid>

            <Grid container justifyContent={"space-between"}>
                <Grid container sx={{ marginTop: "2%" }}>
                    <Button
                        sx={{ marginRight: "2%" }}
                        variant="contained"
                        size="large"
                        color='error'
                        onClick={() => getNoReceiveList()}>
                        <b>Tampilkan Data</b>
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        color='success'
                        onClick={() => downloadExcel()}>
                        <b>Download to Excel</b>
                    </Button>
                </Grid>
            </Grid>

            <Grid container justifyContent={"space-between"} sx={{ marginTop: "2%" }}>
                <Grid container>
                    <Typography sx={{ marginRight: "10%" }}>
                        Sudah Print Rcv. (TN-IN) : {statusData.flag_p_count}
                    </Typography>
                    <Typography>
                        Belum Print Rcv. (TN-IN) : {statusData.flag_total_count}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                <Grid>
                    <Typography>
                        <b>Total No.Receive : {statusData.flag_n_count}</b>
                    </Typography>
                </Grid>
            </Grid>

            <Grid container justifyContent={"flex-end"}>
                <FormControl sx={{ width: "14%" }}>
                    <InputLabel id="search-type-label" sx={{ textAlign: "center" }}>Pencarian Berdasarkan</InputLabel>
                    <Select
                        id="search-type"
                        value={searchType}
                        size='small'
                        label="Pencarian Berdasarkan"
                        onChange={(e) => setSearchType(e.target.value)}>
                        <MenuItem value={FILTER_TYPE['No. Rcv. (TnIn)']}>No. Rcv. (TnIn)</MenuItem>
                        <MenuItem value={FILTER_TYPE['No. Transfer (DO)']}>No. Transfer (DO)</MenuItem>
                    </Select>
                </FormControl>
                {searchType === "header" && (
                    <TextField
                        sx={{ marginLeft: "1%", marginRight: "1%", width: "25%" }}
                        size='small'
                        label={`Cari No. Rcv. (TnIn)`}
                        value={searchInput}
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
                <Grid sx={{ marginTop: "1px" }}>
                    <Button
                        variant='contained'
                        size='medium'
                        onClick={() => searchButton()}>
                        Cari
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><b>No. Receive (TNIN)</b></TableCell>
                                <TableCell align="center"><b>Tgl. Rcv (TNIN)</b></TableCell>
                                <TableCell align="center"><b>Tgl. Transfer (DO)</b></TableCell>
                                <TableCell align="center"><b>Comco Pengirim</b></TableCell>
                                <TableCell align="center"><b>Outlet Pengirim</b></TableCell>
                                <TableCell align="center"><b>No. Transfer (DO)</b></TableCell>
                                <TableCell align="center"><b>Print</b></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {listData && listData.map((item) => (
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
                                    <TableCell align="center">{formatDate(item.Header.TranrcH_TglTranrc, "dddd, DD-MM-YYYY")}</TableCell>
                                    <TableCell align="center">{formatDate(item.Header.TranrcH_TglTransf, "dddd, DD-MM-YYYY")}</TableCell>
                                    <TableCell align="center">{item.Header.TranrcH_OutCodeTransf}</TableCell>
                                    <TableCell align="center">{item.Header.TranrcH_Pengirim}</TableCell>
                                    <TableCell align="center">{item.Header.TranrcH_NoTransf}</TableCell>
                                    <TableCell align="center">{item.Header.TranrcH_Flag === "P" ? "Yes" : "No"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>


                        <TableBody>
                            {searchData && searchData.map((item) => (
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
                                    <TableCell align="center">{formatDate(item.TranrcH_TglTranrc, "dddd, DD-MM-YYYY")}</TableCell>
                                    <TableCell align="center">{formatDate(item.TranrcH_TglTransf, "dddd, DD-MM-YYYY")}</TableCell>
                                    <TableCell align="center">{item.TranrcH_OutCodeTransf}</TableCell>
                                    <TableCell align="center">{item.TranrcH_Pengirim}</TableCell>
                                    <TableCell align="center">{item.TranrcH_NoTransf}</TableCell>
                                    <TableCell align="center">{item.TranrcH_Flag === "P" ? "Yes" : "No"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

        </Box>
    )
}

export default Index