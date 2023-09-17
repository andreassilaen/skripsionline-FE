import { Add, AdfScanner, ArrowBack, Delete, Download, Edit } from '@mui/icons-material'
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    Fade,
    Grid,
    IconButton,
    Link,
    Modal,
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
import axios from 'axios'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs'
import idLocale from "dayjs/locale/id";
dayjs.locale("id");
import API from "../../../../services/transferGudang";
import { DatePicker } from '@mui/x-date-pickers'

const Details = () => {

    var [dataHeader, setDataHeader] = useState([]);
    var [dataTable, setDataTable] = useState([]);
    var [lengthData, setLengthData] = useState([]);
    var [tempData, setTempData] = useState([]);

    var [batchNumber, setBatchNumber] = useState("");
    var [qtyScan, setQtyScan] = useState("");
    var [labelAlert, setLabelAlert] = useState("")
    var [expDate, setExpDate] = useState(dayjs());

    var [labelAlertIsVisible, setLabelAlertIsVisible] = useState(true);
    var [disableEditButtonConfirmation, setDisableEditButtonConfirmation] = useState(false);
    var [disableAddButtonConfirmation, setDisableAddButtonConfirmation] = useState(false);
    var [disablePrintButtonConfirmation, setDisablePrintButtonConfirmation] = useState(false);
    var [disableDeleteButtonConfirmation, setDisableDeleteButtonConfirmation] = useState(false);

    const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
    const [modalTambahIsOpen, setModalTambahIsOpen] = useState(false);
    const [modalPrintConfirmationIsOpen, setModalPrintConfirmationIsOpen] = useState(false);
    const [modalDeleteConfirmationIsOpen, setModalDeleteConfirmationIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const ptID = JSON.parse(window.localStorage.getItem("pt")).pt_id;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const router = useRouter()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMountDataDetail = useCallback(
        debounce(mountDataDetail, 400),
    );

    async function mountDataDetail() {
        try {
            const getDataDetail = await API.getDataDetail({
                find: "all",
                noRecv: router.query.noRecv,
                ptID: ptID
            });

            const { data, error } = getDataDetail.data
            setDataHeader(data.Header);
            setDataTable(data.Detail);
            setLengthData(data.Detail.length);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }

    async function mountEditBatch(params) {
        var payload = {
            TranrcD_Procod: tempData.TranrcD_Procod,
            TranrcD_BatchNumber: batchNumber,
            TranrcD_QuantityScan: parseInt(qtyScan),
            TranrcD_QtyBatch: tempData.TranrcD_QtyBatch,
            StckD_Expdate: expDate
        }
        setDisableEditButtonConfirmation(true);
        try {
            setDisableEditButtonConfirmation(true);
            await API.editBatch(payload, params)
            toast.success("Berhasil Mengubah Batch!");
            window.location.reload();
        } catch (error) {
            toast.error("Terjadi Kesalahan, Silahkan coba kembali!")
        }
    }

    async function mountNewBatch(params) {
        var payload = {
            TranrcD_BatchNumber: batchNumber,
            TranrcD_QuantityScan: parseInt(qtyScan),
            TranrcD_QtyBatch: parseInt(qtyScan),
            StckD_Expdate: expDate,
        }
        setDisableAddButtonConfirmation(true);
        try {
            setDisableAddButtonConfirmation(true);
            await API.createNewBatch(payload, params);
            toast.success("Berhasil Menambahkan Batch!")
            window.location.reload();
        } catch (error) {
            toast.error("Terjadi Kesalahan, Silahkan coba kembali!")
        }
    }

    useEffect(() => {
        if (!router.isReady) return;
        debounceMountDataDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady])

    const [params, setParams] = useState(
        {
            page: 0,
            length: 10
        }
    )

    const handleEditBatch = () => {
        const newParams = {
            NoTranrc: tempData.TranrcD_NoTranrc,
            TranrcDID: tempData.TranrcD_ID
        }
        setParams(newParams);
        mountEditBatch(newParams);
    }

    const handleAddBatch = () => {
        const newParams = {
            NoTranrc: tempData.TranrcD_NoTranrc,
            TranrcDID: tempData.TranrcD_ID
        }
        setParams(newParams);
        mountNewBatch(newParams);
    }

    async function mountDeleteBatch() {
        setDisableDeleteButtonConfirmation(true);
        try {
            await API.deleteBatch({
                noRecv: router.query.noRecv,
                ptID: ptID
            })
            setDisableDeleteButtonConfirmation(true);
            router.push(`/transferGudang`);
        } catch (error) {
            console.log(error);
        }
    }

    async function printNoReceive() {
        var result = dataTable.map((product) => product.TranrcD_QtyValidYN);

        if (result.includes("N")) {
            toast.error("Anda tidak bisa print, Qty Rcv. Melebihi Qty DO. / belum terpenuhi !", { autoClose: 4800 })
        } else {
            try {
                await API.printNoReceive({
                    PrintReceive: router.query.noRecv,
                    ptID: ptID
                })
                downloadPDF();
                setDisablePrintButtonConfirmation(true);
                toast.success("Data Berhasil Di Print!")
                window.location.reload();
            } catch (error) {
                console.log("[printNoReceive] [ERROR]", error);
                setDisablePrintButtonConfirmation(false);
            }
        }
    }

    async function downloadPDF() {
        try {
            const downloadPDF = await API.downloadPDF({
                printNoRecv: router.query.noRecv,
                ptID: ptID
            })
            const { data } = downloadPDF.data;
            const urlBlob = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", router.query.noRecv, + ".pdf");
            document.body.appendChild(link);
            link.click();
            toast.success("Data Berhasil Di Download!");
            console.log("URL", downloadPDF);
        } catch (error) {
            console.log("Download PDF Gagal. Silahkan Coba Lagi!");
        }
    }

    function modalEdit(type, item) {
        if (type === "Edit") {
            setTempData(item);
            setBatchNumber(item.TranrcD_BatchNumber);
            setQtyScan(item.TranrcD_QuantityScan);
            setExpDate(item.StckD_Expdate);
            setLabelAlertIsVisible(true);
        } else if (type == "Batal") {
            setModalEditIsOpen(!modalEditIsOpen);
            setBatchNumber("");
            setQtyScan("");
        }
        setModalEditIsOpen(!modalEditIsOpen);
    }

    function modalTambah(type, item) {
        if (type === "Tambah") {
            setTempData(item);
            setBatchNumber("");
            setQtyScan("");
            setExpDate(item.StckD_Expdate);
            setLabelAlertIsVisible(true);
        } else if (type === "Batal") {
            setModalTambahIsOpen(!modalTambahIsOpen);
            setBatchNumber("");
            setQtyScan("");
        }
        setModalTambahIsOpen(!modalTambahIsOpen);
    }

    function modalPrintConfirm(type) {
        if (type === "Print") {
        } else if (type === "Batal") {
            setModalPrintConfirmationIsOpen(!modalPrintConfirmationIsOpen);
        }
        setModalPrintConfirmationIsOpen(!modalPrintConfirmationIsOpen);
    }

    function modalDeleteConfirm(type) {
        if (type === "Hapus") {
        } else if (type === "Batal") {
            setModalDeleteConfirmationIsOpen(!modalDeleteConfirmationIsOpen)
        }
        setModalDeleteConfirmationIsOpen(!modalDeleteConfirmationIsOpen)
    }

    // Validasi edit/tambah Batch
    function saveTambahEdit(type) {
        if (type === "Edit") {
            if (qtyScan > tempData.TranrcD_QtyBatch) {
                setLabelAlert("Quantity Scan Melebihi Kapasitas!");
                setLabelAlertIsVisible(false);
            } else if (qtyScan < 0) {
                setLabelAlert("Quantity Scan Tidak Boleh Kurang dari 0!");
                setLabelAlertIsVisible(false);
            } else if (tempData.TranrcD_BatchNumber === "") {
                setLabelAlert("Batch Number Tidak Dapat Kosong !")
                setLabelAlertIsVisible(false);
            } else if (batchNumber === "") {
                setLabelAlert("Batch Number Tidak Dapat Kosong !")
                setLabelAlertIsVisible(false);
            } else {
                handleEditBatch();
            }
        } else if (type === "Tambah") {
            if (qtyScan > tempData.TranrcD_QtyBatch) {
                setLabelAlert("Quantity Scan Melebihi Kapasitas!");
                setLabelAlertIsVisible(false);
            } else if (qtyScan <= 0) {
                setLabelAlert("Quantity Scan Tidak Boleh Kurang dari 0!");
                setLabelAlertIsVisible(false);
            } else if (tempData.TranrcD_BatchNumber === "") {
                setLabelAlert("Batch Number Tidak Dapat Kosong")
                setLabelAlertIsVisible(false);
            } else if (batchNumber === "") {
                setLabelAlert("Batch Number Tidak Dapat Kosong !")
                setLabelAlertIsVisible(false);
            } else {
                handleAddBatch();
            }
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
                        <b>{`Transfer Gudang Detail ${router.query.noRecv}`}</b>
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid sx={{ marginBottom: "1%" }} container>
                <Grid container spacing={5} columns={24}>
                    <Grid item xs={3}>
                        <Typography><b>No. Rcv. (TnIn)</b></Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>{dataHeader.TranrcH_NoTranrc}</Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography align="right"><b>Tgl. Receive</b></Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>{dayjs(dataHeader.TranrcH_TglTranrc).subtract(7, 'h').format("dddd, DD-MM-YYYY (HH:mm:ss)")}</Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography align="right"><b>Hapus</b></Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>No</Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid sx={{ marginBottom: "1%" }} container>
                <Grid container spacing={5} columns={24}>
                    <Grid item xs={3}>
                        <Typography><b>No. Trf. (DO)</b></Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>{dataHeader.TranrcH_NoTransf}</Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography align="right"><b>Tgl. Print Rcv</b></Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>{dataHeader.TranrcH_Flag === "N"
                            ? "-"
                            : dayjs(dataHeader.TranrcH_lastUpdate).subtract(7, 'h').format("dddd, DD-MM-YYYY (HH:mm:ss)")}
                        </Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography align="right"><b>Status Print</b></Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>{dataHeader.TranrcH_Flag === "N"
                            ? "No"
                            : "Yes"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid sx={{ marginBottom: "1%" }} container>
                <Grid container spacing={5} columns={24}>
                    <Grid item xs={3}>
                        <Typography><b>Pengirim</b></Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>{`${dataHeader.TranrcH_Pengirim} (${dataHeader.TranrcH_OutCodeTransf})`}</Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography align="right"><b>Penerima</b></Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>{`${dataHeader.TranrcH_Penerima} (${dataHeader.TranrcH_OutCodeTranrc})`}</Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography align="right"><b>Kategori</b></Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography>{dataHeader.TranrcH_Group === 2
                            ? "2 - Floor"
                            : "1 - Apotek"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container justifyContent={"flex-end"}>
                {dataHeader.TranrcH_Flag === "N" && (
                    <>
                        <Button
                            variant="contained"
                            startIcon={<AdfScanner />}
                            size="medium"
                            sx={{ marginRight: "1%" }}
                            onClick={() => modalPrintConfirm("Confirm")}
                        >
                            Print
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Delete />}
                            size="medium"
                            color="error"
                            onClick={() => modalDeleteConfirm("Hapus")}
                        >
                            Hapus
                        </Button>
                    </>
                )}
                {dataHeader.TranrcH_Flag === "P" && (
                    <>
                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            size="medium"
                            color="error"
                            // sx={{ marginRight: "1%" }}
                            onClick={() => downloadPDF()}
                        >
                            Download PDF
                        </Button>
                    </>
                )}
            </Grid>

            <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                <Grid container xs={4}>
                    <Typography
                        style={{ fontStyle: "italic", color: "#f55142" }}>
                        <b>Produk ditemukan: {lengthData}</b>
                    </Typography>
                </Grid>
                <Grid container item xs={4} justifyContent={"flex-end"}>
                    <Typography
                        style={{ fontStyle: "italic", color: "#f55142" }}>
                        *No.Rcv TNIN hanya dapat Dihapus sebelum PRINT
                    </Typography>
                </Grid>
            </Grid>

            {/* <Grid container>
                <Grid item xs={8}>
                    <Typography>xs=8</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography>xs=8</Typography>
                </Grid>
            </Grid> */}

            <Grid sx={{ marginTop: "1%" }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><b>Procod</b></TableCell>
                                <TableCell align="center"><b>ProDes</b></TableCell>
                                <TableCell align="center"><b>Qty Received</b></TableCell>
                                <TableCell align="center"><b>Sell Pack</b></TableCell>
                                <TableCell align="center"><b>Qty Batch</b></TableCell>
                                <TableCell align="center"><b>Qty DO</b></TableCell>
                                <TableCell align="left"><b>Exp. Date</b></TableCell>
                                <TableCell align="center"><b>Batch</b></TableCell>
                                <TableCell align="center"><b>Valid</b></TableCell>
                                <TableCell align="center"><b>{dataHeader.TranrcH_Flag === "N" ? "Action" : ""}</b></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataTable && dataTable.map((item) => (
                                <TableRow
                                    key={item}>
                                    <TableCell align="center">{item.TranrcD_Procod}</TableCell>
                                    <TableCell align="left">{item.TranrcD_Prodes}</TableCell>
                                    <TableCell align="center">{item.TranrcD_QuantityScan}</TableCell>
                                    <TableCell align="center">{item.TranrcD_SellPack}</TableCell>
                                    <TableCell align="center">{item.TranrcD_QtyBatch}</TableCell>
                                    <TableCell align="center">{item.TranrcD_QuantityRecv}</TableCell>
                                    <TableCell align="left">{dayjs(item.StckD_Expdate).format("dddd, DD-MM-YYYY")}</TableCell>
                                    <TableCell align="center">{item.TranrcD_BatchNumber}</TableCell>
                                    <TableCell align="center">
                                        {item.TranrcD_QtyValidYN === "N" ? (
                                            <Typography sx={{ color: "#f55142" }}>No</Typography>
                                        ) : (
                                            <Typography sx={{ color: "#1fff00" }}>Yes</Typography>)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {dataHeader.TranrcH_Flag === "N" && (
                                            <IconButton title='Edit Batch' onClick={() => modalEdit("Edit", item)}>
                                                <Edit fontSize="small" sx={{ marginRight: "10%" }} />
                                            </IconButton>
                                        )}
                                        {dataHeader.TranrcH_Flag === "N" && (
                                            <IconButton title='Tambah Batch' onClick={() => modalTambah("Tambah", item)}>
                                                <Add fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            {/* MODAL EDIT BATCH */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalEditIsOpen}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}>
                <Fade in={modalEditIsOpen}>
                    <Box sx={style}>
                        <Grid container justifyContent={"space-between"}>
                            <Grid container xs={2}>
                                <Typography>
                                    <b>Procod</b>
                                </Typography>
                            </Grid>
                            <Grid container item xs={6}>
                                <Typography>
                                    <b>ProDes</b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={6}>
                                <TextField
                                    sx={{ width: "90%" }}
                                    variant="outlined"
                                    value={tempData.TranrcD_Procod}
                                    size="small"
                                    disabled
                                />
                            </Grid>
                            <Grid container item xs={6}>
                                <TextField
                                    sx={{ width: "90%" }}
                                    variant="outlined"
                                    value={tempData.TranrcD_Prodes}
                                    size="small"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={4}>
                                <Typography>
                                    <b>Qty Scan (Received)</b>
                                </Typography>
                            </Grid>
                            <Grid container item xs={6}>
                                <Typography>
                                    <b>Edit Batch Number</b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={6}>
                                <TextField
                                    type="number"
                                    sx={{ width: "90%" }}
                                    variant="outlined"
                                    value={qtyScan}
                                    size="small"
                                    // defaultValue={tempData.TranrcD_QuantityScan}
                                    onChange={(e) => setQtyScan(e.target.value)}
                                />
                            </Grid>
                            <Grid container item xs={6}>
                                <TextField
                                    sx={{ width: "90%" }}
                                    variant="outlined"
                                    size="small"
                                    defaultValue={tempData.TranrcD_BatchNumber}
                                    onChange={(e) => setBatchNumber(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={4}>
                                <Typography
                                    hidden={labelAlertIsVisible}
                                    sx={{
                                        fontSize: "12px",
                                        marginRight: "5px",
                                        color: "red",
                                        fontStyle: "italic",
                                    }}>
                                    {labelAlert}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={4}>
                                <Typography>
                                    <b>Exp. Date (DD/MM/YYYY)</b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container xs={5.4}>
                            <DatePicker
                                disablePast
                                value={expDate}
                                onChange={(newVal) => setExpDate(newVal)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        size="small"
                                        sx={{ backgroundColor: "white" }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={6}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        marginRight: "5px",
                                        color: "red",
                                        fontStyle: "italic",
                                    }}>
                                    Pastikan Exp. Date Produk Yang Diinput Sesuai dan Benar !
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"flex-end"} sx={{ marginTop: "2%" }}>
                            <Button
                                sx={{ marginRight: "2%" }}
                                variant="contained"
                                disabled={disableEditButtonConfirmation}
                                onClick={() => saveTambahEdit("Edit") || setLabelAlertIsVisible(false)}>
                                <b>Simpan</b>
                            </Button>
                            <Button
                                color='error'
                                variant="contained"
                                disabled={"qtyScan" === "" ? true : false}
                                onClick={() => modalEdit("Batal")}>
                                <b>Batal</b>
                            </Button>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>
            {/* MODAL EDIT BATCH */}

            {/* MODAL ADD BATCH */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalTambahIsOpen}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalTambahIsOpen}>
                    <Box sx={style}>
                        <Grid container justifyContent={"space-between"}>
                            <Grid container xs={2}>
                                <Typography>
                                    <b>Procod</b>
                                </Typography>
                            </Grid>
                            <Grid container item xs={6}>
                                <Typography>
                                    <b>ProDes</b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={6}>
                                <TextField
                                    sx={{ width: "90%" }}
                                    variant="outlined"
                                    value={tempData.TranrcD_Procod}
                                    size="small"
                                    disabled
                                />
                            </Grid>
                            <Grid container item xs={6}>
                                <TextField
                                    sx={{ width: "90%" }}
                                    variant="outlined"
                                    value={tempData.TranrcD_Prodes}
                                    size="small"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={4}>
                                <Typography>
                                    <b>Qty Scan (Received)</b>
                                </Typography>
                            </Grid>
                            <Grid container item xs={6}>
                                <Typography>
                                    <b>Batch Number</b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={6}>
                                <TextField
                                    type="number"
                                    sx={{ width: "90%" }}
                                    variant="outlined"
                                    value={qtyScan}
                                    size="small"
                                    onChange={(e) => setQtyScan(e.target.value)}
                                />
                            </Grid>
                            <Grid container item xs={6}>
                                <TextField
                                    sx={{ width: "90%" }}
                                    variant="outlined"
                                    value={batchNumber}
                                    size="small"
                                    onChange={(e) => setBatchNumber(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={4}>
                                <Typography
                                    hidden={labelAlertIsVisible}
                                    sx={{
                                        fontSize: "12px",
                                        marginRight: "5px",
                                        color: "red",
                                        fontStyle: "italic",
                                    }}>
                                    {labelAlert}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={4}>
                                <Typography>
                                    <b>Exp. Date (DD/MM/YYYY)</b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={5.4}>
                                <DatePicker
                                    disablePast
                                    value={expDate}
                                    onChange={(newVal) => setExpDate(newVal)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            size="small"
                                            sx={{ backgroundColor: "white" }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                            <Grid container xs={6}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        marginRight: "5px",
                                        color: "red",
                                        fontStyle: "italic",
                                    }}>
                                    Pastikan Exp. Date Produk Yang Diinput Sesuai dan Benar !
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={"flex-end"} sx={{ marginTop: "2%" }}>
                            <Button
                                sx={{ marginRight: "2%" }}
                                variant="contained"
                                disabled={disableAddButtonConfirmation}
                                onClick={() => saveTambahEdit("Tambah") || setLabelAlertIsVisible(false)}>
                                <b>Simpan</b>
                            </Button>
                            <Button
                                color='error'
                                variant="contained"
                                disabled={"qtyScan" === "" ? true : false}
                                onClick={() => modalTambah("Batal")}>
                                <b>Batal</b>
                            </Button>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>
            {/* MODAL ADD BATCH */}

            {/* MODAL PRINT CONFIRMATION */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalPrintConfirmationIsOpen}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}>
                <Fade in={modalPrintConfirmationIsOpen}>
                    <Box sx={style}>

                        <Grid>
                            <Typography>
                                <b>Konfirmasi Print</b>
                            </Typography>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid>
                            <Typography>
                                {`Apakah Anda Yakin Ingin Melakukan Print?`}
                            </Typography>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container justifyContent={"flex-end"} sx={{ marginTop: "2%" }}>
                            <Button
                                sx={{ marginRight: "2%" }}
                                variant="contained"
                                disabled={disablePrintButtonConfirmation}
                                onClick={() => printNoReceive()}>
                                <b>Print</b>
                            </Button>
                            <Button
                                color='error'
                                variant="contained"
                                onClick={() => modalPrintConfirm("Batal")}>
                                <b>Batal</b>
                            </Button>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>
            {/* MODAL PRINT CONFIRMATION */}

            {/* MODAL DELETE CONFIRMATION */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalDeleteConfirmationIsOpen}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}>
                <Fade in={modalDeleteConfirmationIsOpen}>
                    <Box sx={style}>

                        <Grid>
                            <Typography>
                                <b>Konfirmasi Hapus</b>
                            </Typography>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid>
                            <Typography>
                                {`Apakah Anda Yakin Ingin Menghapus No. Receive ini?`}
                            </Typography>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container justifyContent={"flex-end"} sx={{ marginTop: "2%" }}>
                            <Button
                                sx={{ marginRight: "2%" }}
                                variant="contained"
                                disabled={disableDeleteButtonConfirmation}
                                onClick={() => mountDeleteBatch()}>
                                <b>Hapus</b>
                            </Button>
                            <Button
                                color='error'
                                variant="contained"
                                onClick={() => modalDeleteConfirm("Batal")}>
                                <b>Batal</b>
                            </Button>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>
            {/* MODAL DELETE CONFIRMATION */}

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

export default Details;