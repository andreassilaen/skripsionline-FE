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
    styled,
    IconButton,
    InputAdornment,
    OutlinedInput,
  } from "@mui/material";
  import React, { useEffect, useState, useCallback } from "react";
  import { useRouter } from "next/router";
  import { debounce,isUndefined } from "lodash";
  
  import api from "../../../../services/stock";
  import apiRecv from "../../../../services/receiving";
  import Link from "../../../../utils/link";
  import { formatDate, formatRupiah } from "../../../../utils/text";
  import useToast from "../../../../utils/toast";
  import useResponsive from "../../../../utils/responsive";
  import { getStorage } from "../../../../utils/storage";
  
  import SearchIcon from '@mui/icons-material/Search';
  import PrintIcon from '@mui/icons-material/Print';
  import { ArrowBack } from "@mui/icons-material";
  import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
  import CircularProgress from '@mui/material/CircularProgress'
import { ptBR } from "@mui/x-date-pickers";
  
  const initialResultMetadata = {
    Others: 0,
    OthersAll: 0,
    PurchaseRefund: 0,
    PurchaseRefundAll: 0,
    Receiving: 0,
    ReceivingAll: 0,
    Sales: 0,
    SalesAll: 0,
    SalesReturn: 0,
    SalesReturnAll: 0,
    StockTake: 0,
    StockTakeAll: 0,
    TnIN: 0,
    TnINAll: 0,
    TnOUT: 0,
    TnOUTAll: 0,
    Destroy: 0,
    DestroyAll: 0,
    ReceivingOrtok: 0,
    ReceivingOrtokAll: 0,
}

  const MutasiStock = (props) => {
    const router = useRouter();
    const [displayToast] = useToast();

    const pt = getStorage('pt');
    const pt_id = JSON.parse(pt).pt_id;
    const outcodeData = getStorage('outlet');
    const outcode = JSON.parse(outcodeData).out_code;
    const procod = router.query.id;

    var [proname, setProname] = useState('')

    // const language = 'EN'
    var language = props.language;
    const isMobile = useResponsive().isMobile;
  
    const debounceMountMutasiStock = useCallback(
      debounce(mountMutasiStock, 400),
      []
    );

    const debounceMountHeaderDO = useCallback(
      debounce(mountHeaderDO, 400),
      []
    );

    const debounceMountPrintTNIN = useCallback(
      debounce(mountPrintTNIN, 400),
      []
    );

    const debounceMountPrintReceiving = useCallback(
      debounce(mountPrintReceiving, 400),
      []
    );
  
    useEffect(() => {
      if (!router.isReady) return;

      if (router.query.proname !== ''){
        var decodeProname = atob(router.query.proname)
  
        setProname((proname = decodeProname))
      }
  
    //   debounceMountListStockDetail(0, 'B14', '', 'DESC', params);
    }, [router.isReady]);
  
    const [result, setResult] = useState([]);
    var[resultMetadata, setResultMetadata] = useState(initialResultMetadata)
  
    const [totalData, setTotalData] = useState(0);
    const [params, setParams] = useState({
      page: 0,
      length: 150,
    });

    var [dataAvailable, setDataAvailable] = useState(false)
    var [inputSearch, setInputSearch] = useState("");
    var [searchGroup, setSearchGroup] = useState('1');

    var [modalStockIsOpen, setModalStockIsOpen] = useState(false);
    var [startDate, setStartDate] = useState('')
    var [endDate, setEndDate] = useState(new Date().toJSON().slice(0, 10))
    var [showData, setShowData] = useState(false);
  
    async function mountMutasiStock(pt, outcode, procod, group, startdate, enddate, noref, type, params) {
      try {
        // console.log('hit be mutasi stock', pt, outcode, procod, group, startdate, enddate, noref, type)
        setDataAvailable((dataAvailable = true))
        const getMutasiStock = await api.getMutasiStockProcod(pt, outcode, procod, group, startdate, enddate, noref, type, params);
        const { data, metadata } = getMutasiStock.data;
        // console.log("data mutasi stock", getMutasiStock);

        if (data === null){
          setResult([])
        } else {
          setResult(data);
          setResultMetadata((resultMetadata = metadata))
        }
        
        setTotalData(metadata.total_data);
        setDataAvailable(false)
        
      } catch (error) {
        console.log(error);
        displayToast('error', 'Koneksi ke server gagal.')
      }
    }

    async function mountHeaderDO(notransf, pt, outcode) {
      try {
        // console.log('hit ke be print', notransf, pt, outcode)
        const getHeaderDO = await api.getHeaderDO(notransf, pt, outcode);
  
        //kalau error generate PDF
        if(getHeaderDO.headers['content-type'] === 'application/json'){
  
          let arrayBufferConverted = JSON.parse(
            String.fromCharCode.apply(null, new Uint8Array(getHeaderDO.data))
          )
            // console.log('ERROR BE PRINT', arrayBufferConverted)
          // setIsLoading(false);
          // setModalConfirm(false);
          // displayToast('error', language === 'EN' ? arrayBufferConverted.metadata.message.Id : arrayBufferConverted.metadata.message.Eng);
          displayToast('error', arrayBufferConverted.error.msg);
        } else {
            const urlblob = window.URL.createObjectURL(new Blob([getHeaderDO.data],{type:'application/pdf'}));
            window.open(urlblob);
            // const link = document.createElement("a");
            // link.href = urlblob;
            // link.setAttribute(
            //   "download",
            //   `PRINT_DO.pdf`
            // );
            // document.body.appendChild(link);
            // link.click();
          
        }mountHeaderDO
        
        // setIsLoading(false);
      } catch (error) {
        console.log(error);
        // setIsLoading(false);
        displayToast('error', language ==='EN' ? 'Failed to connect to server' : 'Koneksi ke server gagal.')
      }
    }

    async function mountPrintTNIN(norecv, pt) {
      try {
        // console.log('hit ke be print', norecv)
        const printTnIN = await api.printTnIN(norecv, pt);
  
        //kalau error generate PDF
        if(printTnIN.headers['content-type'] === 'application/json'){
  
          let arrayBufferConverted = JSON.parse(
            String.fromCharCode.apply(null, new Uint8Array(printTnIN.data))
          )
            // console.log('ERROR BE PRINT', arrayBufferConverted)
          // setIsLoading(false);
          // setModalConfirm(false);
          // displayToast('error', language === 'EN' ? arrayBufferConverted.metadata.message.Id : arrayBufferConverted.metadata.message.Eng);
          displayToast('error', arrayBufferConverted.error.msg);
        } else {
            const urlblob = window.URL.createObjectURL(new Blob([printTnIN.data],{type:'application/pdf'}));
            window.open(urlblob);
            // const link = document.createElement("a");
            // link.href = urlblob;
            // link.setAttribute(
            //   "download",
            //   `PRINT_TNIN.pdf`
            // );
            // document.body.appendChild(link);
            // link.click();
          
        }mountPrintTNIN
        
        // setIsLoading(false);
      } catch (error) {
        console.log(error);
        // setIsLoading(false);
        displayToast('error', language ==='EN' ? 'Failed to connect to server' : 'Koneksi ke server gagal.')
      }
    }

    async function mountPrintReceiving(pt, group, outcode, norecv) {
      try {
        // console.log('hit ke be print receive', pt, group, outcode, norecv)
        const getReceivePrint = await apiRecv.getReceivingPrint(pt, group, outcode, norecv);
        // console.log('get receive print', getReceivePrint)

        //kalau error generate PDF
        if(getReceivePrint.headers['content-type'] === 'application/json'){
  
          let arrayBufferConverted = JSON.parse(
            String.fromCharCode.apply(null, new Uint8Array(getReceivePrint.data))
          )
            // console.log('ERROR BE PRINT', arrayBufferConverted)
          // setIsLoading(false);
          // displayToast('error', language === 'EN' ? arrayBufferConverted.metadata.message.Id : arrayBufferConverted.metadata.message.Eng);
        } else {
            const urlblob = window.URL.createObjectURL(new Blob([getReceivePrint.data],{type:'application/pdf'}));
            window.open(urlblob);
            // const link = document.createElement("a");
            // link.href = urlblob;
            // link.setAttribute(
            //   "download",
            //   `PRINT_RECEIVING.pdf`
            // );
            // document.body.appendChild(link);
            // link.click();
          
        }mountPrintReceiving

      } catch (error) {
        // setDataAvailable(false)
        console.log(error);
        displayToast('error', error.code)
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
  
      setDataAvailable(false)
      debounceMountMutasiStock(pt_id, outcode, procod, 0, startDate, endDate, inputSearch, inputSearch, newParams);
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
  
      setDataAvailable(false)
      debounceMountMutasiStock(pt_id, outcode, procod, 0, startDate, endDate, inputSearch, inputSearch, newParams);
    };

    function setDate(type, e){
      if(type === 'startdate'){
          setStartDate((startDate = e))
          validateTgl()
      } else {
          setEndDate((endDate = e))
          validateTgl()
      }
    }

    function validateTgl(){
      var d1 = Date.parse(startDate);
      var d2 = Date.parse(endDate);

      //console.log('D1 D2 : ', d1, d2, endDate)

      var currentDate = new Date(startDate).getDate();
      var endDates = new Date(endDate).getDate();
      var validateWeek2 = currentDate - endDates < -6;
      // console.log('SEMINGGU', validateWeek2, 'DUA MINGGU', currentDate < endDate); 

      //   if(isNaN(d2)){
      //       d2 
      //   }
      //   if (isNaN(d2)) {

      //   } else {
        if (d1 > d2) {
            setResult((result = []))
            displayToast("error", 'The End Date cannot be less than the Start Date! ');
            return false
        }
        if (validateWeek2 === false && d1 < d2) {
            //this.updateInputValue();
        }

        return true
      //}
    }

    function getData(){
      if (startDate !== '' && endDate !== '') {
          if(validateTgl() === true){
              setDataAvailable(true)
              if(searchGroup === '1') {
                debounceMountMutasiStock(pt_id, outcode, procod, 0, startDate, endDate, inputSearch, '', params);
              } else {
                debounceMountMutasiStock(pt_id, outcode, procod, 0, startDate, endDate, '', inputSearch, params);
              }
              setShowData(true)
          }
      } else {
          displayToast("error", 'Please input the date to show the Data!');
        return;
      }
    }

    const changePageState = (mutasi_type, ref) => () => {
        
      var group = 0;
      var procods = router.query.id;

      if (procods.startsWith('01') || procods.startsWith('16') || procods.startsWith('18')) {
          group = 1
      } else {
          group = 2
      }

      if(mutasi_type == "Receiving"){
          // getHeaderReceive(ref, group);
          debounceMountPrintReceiving(pt_id, group, outcode, ref)
        }
        else if (mutasi_type == "DO" || mutasi_type == "TnOUT" || mutasi_type.toLowerCase() == 'tnout' || mutasi_type == "Sales" || mutasi_type == "SALES"){
          debounceMountHeaderDO(ref, pt_id, outcode)
        }
        else if (mutasi_type == "TnIN" || mutasi_type.toLowerCase() == 'tnin'){
          debounceMountPrintTNIN(ref, pt_id)
        }
      //   else if (mutasi_type == "StockTake" || mutasi_type.toLowerCase() == 'stocktake'){
      //     // printStockTake(ref);
      //   }
        else{
          displayToast('error', 'Bukti Tidak Tersedia Untuk Tipe Ini')
        }
  }

  const buttonPrint = (data) => {
      if(data.mutasi_type === '' || data.mutasi_type === 'StockTake'){
        return(
            <IconButton
              color="info"
              disabled
            >
              <PrintIcon />
            </IconButton>
          )
      } else if (data.mutasi_type !== ''){
          return(
            <IconButton
              color="info"
              onClick={changePageState(data.mutasi_type, data.mutasi_noref)}
            >
              <PrintIcon />
            </IconButton>
          )

      }
    }

    function selectSearchGroup(event) {
      setSearchGroup((searchGroup = event.target.value));
      // console.log('search group', searchGroup)
    }

    const enterPressed = event => {
      var code = event.keyCode || event.which;
      if (code === 13) {
        event.preventDefault();
        // setCurrentPage((currentPage = 1))
        const newParams = {
          ...params,
          page: 0,
          length: params.length,
        };
        setParams(newParams);
        setDataAvailable(true)

        if(searchGroup === '1') {
          debounceMountMutasiStock(pt_id, outcode, procod, 0, startDate, endDate, inputSearch, '', newParams);
        } else {
          debounceMountMutasiStock(pt_id, outcode, procod, 0, startDate, endDate, '', inputSearch, newParams);
        }
      }
    };
  
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <Grid container justifyContent={"space-between"}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
            <Link href="/stock">
                <IconButton aria-label="back">
                <ArrowBack />
                </IconButton>
            </Link>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} sx={{textAlign:'center'}}>
            <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
                {language === 'EN' ? 'Inventory Stock Turnover' : 'Mutasi Stock'}
            </Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2} justifyContent={"space-between"}>
          <Grid item xs={4} >
            <Typography variant="subtitle1" sx={{fontWeight:"bold"}}>
              {proname} ({router.query.id})
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        
        <Grid container sx={{ mb: 1 }} >
            <Grid item xs={12} sm={12} md={4} lg={4} display="flex">
              <Typography variant="subtitle1" sx={{fontWeight:"bold", mt: 0.5}}>
                  {language === 'EN' ? 'Period: ' : 'Periode: '}&nbsp;
              </Typography>
              <TextField
                size="small"
                type="date"
                sx={!isMobile ? { width: '250px'} : { width: '150px'}}
                margin={"none"}
                value={startDate}
                onChange={(e) => setDate('startdate', e.target.value)}
              />
              <Typography variant="subtitle1" sx={{fontWeight:"bold", mt: 0.5}}>
                  &nbsp;-&nbsp;
              </Typography>
              <TextField
                size="small"
                type="date"
                sx={!isMobile ? { width: '250px'} : { width: '150px'}}
                margin={"none"}
                value={endDate}
                onChange={(e) => setDate('enddate', e.target.value)}
              />
              <Button 
                variant="contained" 
                size="small" 
                sx={{ml: 2, height: '70%'}}
                onClick={() => getData()}
              >
                  <SearchIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid container sx={{ mb: 4 }} >
            <Grid item xs={12} sm={12} md={2} lg={2}>
            <TextField
                  fullWidth
                  size="small"
                  value={searchGroup}
                  onChange={(e) => selectSearchGroup(e)}
                  displayEmpty
                  select
                  // sx={{minWidth: 180}}
                >
                  {/* <MenuItem value={'0'}>
                      Search By
                  </MenuItem> */}
                  <MenuItem value={'1'}>
                      {language === 'EN' ? 'Reference No' : 'No Referensi'}
                  </MenuItem>
                  <MenuItem value={'2'}>
                      {language === 'EN' ? 'Transaction Type' : 'Tipe Transaksi'}
                  </MenuItem>
                </TextField>
              {/* <OutlinedInput
                  size="small"
                  startAdornment={<InputAdornment><SearchIcon/></InputAdornment>}
                  placeholder={language === 'EN' ? 'Search By Reference No Or Transaction Type' : 'Cari No Referensi Atau Tipe Transaksi'}
                  sx={{bgcolor:'white', width: 390, ml: 1}}
                  onChange={(e) => setInputSearch((inputSearch = e.target.value))}
                  onKeyPress={event => enterPressed(event)}
                /> */}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <OutlinedInput
                  size="small"
                  startAdornment={<InputAdornment><SearchIcon/></InputAdornment>}
                  placeholder={language === 'EN' ? 'Search By Reference No Or Transaction Type' : 'Cari No Referensi Atau Tipe Transaksi'}
                  sx={!isMobile ? {bgcolor:'white', width: 390, ml: 3} : {bgcolor:'white', width: 390, mt: 1}}
                  onChange={(e) => setInputSearch((inputSearch = e.target.value))}
                  onKeyPress={event => enterPressed(event)}
                />
           </Grid>
          </Grid>

        <Paper
            id="mutasiBottom"
            sx={showData ? {width: "100%", my: 2} : {display: 'none'}}
        >
        <Grid container>
            <Grid item xs={6} sx={{mt: 2, pl: 2, pr: 2}}>
                <Typography variant="subtitle1" style={{color:"green"}} sx={{ fontWeight: 600}}>
                    Beginning from Stocktake:
                </Typography>
                <TextField
                    disabled
                    variant="filled"
                    size="small"
                    label={
                      resultMetadata &&
                      resultMetadata.StockTake + " / " + resultMetadata.StockTakeAll
                    }
                    margin={"dense"}
                    fullWidth
                />
                <Typography variant="subtitle1" style={{color:"green"}} sx={{ fontWeight: 600}}>
                    Receiving Total:
                </Typography>
                <TextField
                    disabled
                    variant="filled"
                    size="small"
                    label={
                      resultMetadata &&
                      resultMetadata.Receiving + " / " + resultMetadata.ReceivingAll
                    }
                    margin={"dense"}
                    fullWidth
                />
                <Typography variant="subtitle1" style={{color:"green"}} sx={{ fontWeight: 600}}>
                    Receiving Ortok Total:
                </Typography>
                <TextField
                    disabled
                    variant="filled"
                    size="small"
                    label={
                      resultMetadata &&
                      resultMetadata.ReceivingOrtok + " / " + resultMetadata.ReceivingOrtokAll
                    }
                    margin={"dense"}
                    fullWidth
                />
                <Typography variant="subtitle1" style={{color:"green"}} sx={{ fontWeight: 600}}>
                  Refund Total (Sales Return):
                </Typography>
                <TextField
                    disabled
                    variant="filled"
                    size="small"
                    label={
                      resultMetadata &&
                      resultMetadata.SalesReturn + " / " + resultMetadata.SalesReturnAll
                    }
                    margin={"dense"}
                    fullWidth
                />
                <Typography variant="subtitle1" style={{color:"red"}} sx={{ fontWeight: 600}}>
                    Purchase Refund Total:
                </Typography>
                <TextField
                    disabled
                    variant="filled"
                    size="small"
                    label={
                      resultMetadata &&
                      resultMetadata.PurchaseRefund + " / " + resultMetadata.PurchaseRefundAll
                  }
                    margin={"dense"}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} sx={{mt: 2, pl: 2, pr: 2}}>
              <Typography variant="subtitle1" style={{color:"green"}} sx={{ fontWeight: 600 }}>
                  TN IN Total:
              </Typography>
              <TextField
                    disabled
                    variant="filled"
                    size="small"
                    label={
                      resultMetadata &&
                      resultMetadata.TnIN + " / " + resultMetadata.TnINAll
                    }
                    margin={"dense"}
                    fullWidth
                />
              <Typography variant="subtitle1" style={{color:"red"}} sx={{ fontWeight: 600 }}>
                  DO Total:
              </Typography>
              <TextField
                    disabled
                    variant="filled"
                    size="small"
                    label={
                      resultMetadata &&
                      resultMetadata.TnOUT + " / " + resultMetadata.TnOUTAll
                    }
                    margin={"dense"}
                    fullWidth
                />
                <Typography variant="subtitle1" style={{color:"red"}} sx={{ fontWeight: 600 }}>
                    Sales Total:
                </Typography>
                <TextField
                      disabled
                      variant="filled"
                      size="small"
                      label={
                        resultMetadata && resultMetadata.Sales + " / " + resultMetadata.SalesAll
                    }
                      margin={"dense"}
                      fullWidth
                  />
                <Typography variant="subtitle1" style={{color:"red"}} sx={{ fontWeight: 600 }}>
                    Destroy Total:
                </Typography>
                <TextField
                      disabled
                      variant="filled"
                      size="small"
                      label={
                        resultMetadata && resultMetadata.Destroy + " / " + resultMetadata.DestroyAll
                    }
                      margin={"dense"}
                      fullWidth
                  />
            </Grid>
        </Grid>
        <Divider sx={{ mt: 2 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Batch
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      ED
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Qty
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Reference No.' : 'No. Referensi'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Reference Date' : 'Tgl Referensi'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Reference Time' : 'Jam Referensi'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Type' : 'Tipe'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Tgl Mutasi' : 'Recorded Date'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Recorded Time' : 'Jam Mutasi'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Show Document' : 'Lihat Dokumen'}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {dataAvailable ? 
              (
                  <TableRow>
                    <TableCell align="center" colSpan={12}>
                      <CircularProgress/>
                    </TableCell>
                  </TableRow>
                ) : ( 
                result.length !== 0 ? 
                  (result.map((item) => (
                  <TableRow key={item.stck_batchnumber}>
                    <TableCell >
                     {item.mutasi_batch}
                    </TableCell>
                    <TableCell sx={{ width: "10%" }}>{formatDate(item.mutasi_ed, "ddd MMMM DD YYYY")}</TableCell>
                    <TableCell align="center" sx={item.mutasi_jenis === 'Plus' ? { color: 'green' } : {color: "red"}}>
                      {item.mutasi_qty}
                      </TableCell>
                    <TableCell>
                        {item.mutasi_noref}
                    </TableCell>
                    <TableCell align="center">{formatDate(item.mutasi_refdate, "ddd MMMM DD YYYY")}</TableCell>
                    <TableCell align="center">{formatDate(item.mutasi_refdate, "HH:mm:ss A")}</TableCell>
                    <TableCell align="center">{item.mutasi_type === '' ? "-" : item.mutasi_type}</TableCell>
                    <TableCell align="center">{formatDate(item.mutasi_lastupdate, "ddd MMMM DD YYYY")}</TableCell>
                    <TableCell align="center">{formatDate(item.mutasi_lastupdate, "HH:mm:ss A")}</TableCell>
                    <TableCell align="center">{buttonPrint(item)}</TableCell>
                  </TableRow>
                ))) : (
                  <TableRow>
                    <TableCell align="center" colSpan={12}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color:'gray' }}>
                      {/* {language === 'EN' ? 'NO DATA' : 'TIDAK ADA DATA'} */}
                      TIDAK ADA DATA
                    </Typography>
                    </TableCell>
                  </TableRow>
                )
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[150, 300, 500]}
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
  
  export default MutasiStock;
  