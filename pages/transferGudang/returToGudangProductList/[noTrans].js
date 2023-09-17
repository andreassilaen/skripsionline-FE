import { Delete, Save } from '@mui/icons-material';
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
    Link,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import dayjs from 'dayjs'
import idLocale from "dayjs/locale/id";
dayjs.locale("id");
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import API from '../../../services/transferGudang'

const Details = () => {

    const ptID = JSON.parse(window.localStorage.getItem("pt")).pt_id;
    const outName = JSON.parse(window.localStorage.getItem("outlet")).out_name;
    const outcode = JSON.parse(window.localStorage.getItem("outlet")).out_code;

    const router = useRouter();
    var [dataTable, setDataTable] = useState([]);
    var [lengthData, setLengthData] = useState("");
    var [disableButtonConfirmation, setDisableButtonConfirmation] = useState(false);

    const [modalConfirmationIsOpen, setModalConfirmationIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    function modalConfirm(type) {
        if (type === "Confirm") {

        } else if (type === "Batal") {
            setModalConfirmationIsOpen(!modalConfirmationIsOpen);
        }
        setModalConfirmationIsOpen(!modalConfirmationIsOpen);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMountListProductTransfer = useCallback(
        debounce(mountListProductTransfer, 400),
    );

    async function mountListProductTransfer() {
        try {
            const getListProductTransfer = await API.getListProductTransfer({
                notransf: router.query.noTrans,
                outcode: outcode,
                ptID: ptID
            });
            console.log("DATA", getListProductTransfer);

            const { data } = getListProductTransfer.data;
            setDataTable(data.Detail);
            setLengthData(data.Detail.length)
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }S
    }

    async function mountCreateNoReceive() {
        var payload = {
            TranrcH_PTID: ptID,
            TranrcH_PTName: outName,
            TranrcH_OutCodeTranrc: outcode,
            TranrcH_NoTransf: router.query.noTrans
        }
        setDisableButtonConfirmation(true);
        try {
            const createNoReceive = await API.createNoReceive(payload);
            const { data } = createNoReceive.data;
            setDisableButtonConfirmation(true);
            router.push(`/transferGudang/returToGudangDetail/${data.Header.TranrcH_NoTranrc}/${router.query.noTrans}`);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log("DATA TABLE", dataTable);
    }, [dataTable])

    useEffect(() => {
        if (!router.isReady) return;
        debounceMountListProductTransfer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            <Grid container justifyContent={"space-between"} sx={{ marginBottom: "1%", display: 'flex' }}>
                <Grid container flex={1}>
                    <Typography variant="h5">
                        <b>{`Create No Receive for DO - ${router.query.noTrans}`}</b>
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                <Grid container xs={4}>
                    <Typography>
                        <b>Nomor Transfer: {router.query.noTrans}</b>
                    </Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent={"space-between"} sx={{ marginTop: "1%" }}>
                <Grid container xs={4}>
                    <Typography style={{ fontStyle: "italic", color: "#f55142" }}>
                        <b>Produk Ditemukan: {lengthData}</b>
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><b>Procod</b></TableCell>
                                <TableCell align="center"><b>Prodes</b></TableCell>
                                <TableCell align="center"><b>QTY Rcv</b></TableCell>
                                <TableCell align="center"><b>Sell Pack</b></TableCell>
                                <TableCell align="center"><b>QTY Batch</b></TableCell>
                                <TableCell align="center"><b>QTY DO</b></TableCell>
                                <TableCell align="center"><b>Exp. Date</b></TableCell>
                                <TableCell align="center"><b>Batch</b></TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {dataTable && dataTable.map((item) => (
                                <TableRow key={item}>
                                    <TableCell align="center">{item.transfDB_ProCod}</TableCell>
                                    <TableCell align="center">{item.transfD_Prodes}</TableCell>
                                    <TableCell align="center">{item.transfDB_Qty_Scan}</TableCell>
                                    <TableCell align="center">{item.transfD_SellPack}</TableCell>
                                    <TableCell align="center">{item.transfDB_Qty}</TableCell>
                                    <TableCell align="center">{item.transfDB_Qty_Scan}</TableCell>
                                    <TableCell align="center">{dayjs(item.transfD_ED).format("dddd, DD-MM-YYYY")}</TableCell>
                                    <TableCell align="center">{item.transfD_BatchNumber}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid container justifyContent={"flex-end"} sx={{ marginTop: "1%" }}>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    size="medium"
                    sx={{ marginRight: "1%" }}
                    onClick={() => modalConfirm("Tambah")}
                >
                    Simpan
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Delete />}
                    size="medium"
                    color="error"
                    href="/transferGudang/returToGudangAddTransfer">
                    Hapus
                </Button>
            </Grid>
            {/* MODAL CONFIRMATION */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalConfirmationIsOpen}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}>
                <Fade in={modalConfirmationIsOpen}>
                    <Box sx={style}>

                        <Grid>
                            <Typography>
                                <b>Konfirmasi Generate No. Receive</b>
                            </Typography>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid>
                            <Typography>
                                {`Apakah anda yakin ingin Generate No. Receive untuk nomor ${router.query.noTrans} tersebut?`}
                            </Typography>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container justifyContent={"flex-end"} sx={{ marginTop: "2%" }}>
                            <Button
                                sx={{ marginRight: "2%" }}
                                variant="contained"
                                disabled={disableButtonConfirmation}
                                onClick={() => mountCreateNoReceive()}>
                                <b>Simpan</b>
                            </Button>
                            <Button
                                color='error'
                                variant="contained"
                                onClick={() => modalConfirm("Batal")}>
                                <b>Batal</b>
                            </Button>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>
            {/* MODAL CONFIRMATION */}

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