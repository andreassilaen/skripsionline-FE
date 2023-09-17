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
    InputAdornment,
    OutlinedInput,
    FilledInput,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Link,
    IconButton,
  } from "@mui/material";
  import React, { useEffect, useState, useCallback } from "react";
  import { useRouter } from "next/router";
  import { debounce,isUndefined } from "lodash";
  
  import api from "../../../services/stock";
  // import Link from "../../utils/link";
  import { formatDate, formatRupiah } from "../../../utils/text";
  import useToast from "../../../utils/toast";
  import useResponsive from "../../../utils/responsive";
  import { getStorage } from "../../../utils/storage";
  
  import CircularProgress from '@mui/material/CircularProgress'
  import SearchIcon from '@mui/icons-material/Search';
  import { ArrowBack } from "@mui/icons-material";
  
  const MappedStock = (props) => {
    const router = useRouter();
    const [displayToast] = useToast();
  
    const pt = getStorage('pt');
    const pt_id = JSON.parse(pt).pt_id;
    const outcodeData = getStorage('outlet');
    const outcode = JSON.parse(outcodeData).out_code;

    // const language = 'EN';
    var language = props.language;
    const isMobile = useResponsive().isMobile;

    const debounceMountListMappedStock = useCallback(
      debounce(mountListMappedStock, 400),
      []
    );

    // const debounceMountListFormulaStock = useCallback(
    //     debounce(mountListFormulaStock, 400),
    //     []
    //   );

      const debounceMountLisPilihApp = useCallback(
        debounce(mountListPilihApp, 400),
        []
      );
  
    useEffect(() => {
      if (!router.isReady) return;

      debounceMountListMappedStock(0, 0, outcode, pt_id, outcode, inputSearch, urutkanStock, params);
    }, [router.isReady]);
  
    const [listMappedStock, setListMappedStock] = useState([]);
    const [listFormulaStock, setListFormulaStock] = useState([]);
    var [dataAvailable, setDataAvailable] = useState(false)
    var [dataAvailableModal, setDataAvailableModal] = useState(false)
  
    const [totalData, setTotalData] = useState(0);
    const [params, setParams] = useState({
      page: 0,
      length: 10,
    });

    const [paramsModal, setParamsModal] = useState({
      page: 0,
      length: 5,
    });
    
    var [inputSearch, setInputSearch] = useState("");

    var [urutkanStock, setUrutkanStock] = useState('ASC')
    var [modalProjectIsOpen, setModalProjectIsOpen] = useState(false);
    var [modalStockIsOpen, setModalStockIsOpen] = useState(false);
    var [objStock, setObjStock] = useState({})
    var [objModal, setObjModal] = useState({})
  
    async function mountListMappedStock(ptapp, projectapp, outcodeapp, pt, outcode, procode, sort, params) {
      try {
        // console.log('hit be mapped stock', ptapp, projectapp, outcodeapp)
        setDataAvailable((dataAvailable = true))
        const getMappedStock = await api.getMappedStock(ptapp, projectapp, outcodeapp, pt, outcode, procode, sort, params);
        const { data, error } = getMappedStock.data;
        // console.log("data mapped stock", getMappedStock);
        // setListMappedStock(data);

        if (error.status === true) {
          displayToast('error', error.msg);
          if (error.code === 401) {
            displayToast('error', 'Token is expired please login again')
            window.sessionStorage.clear();
            // history.push('/#/login')
          }
        } else {
          if(data === null || data === undefined){
            setListMappedStock([])
          } else {
            setListMappedStock((listMappedStock = data))
          }
        }
        setDataAvailable(false)

      } catch (error) {
        setDataAvailable(false)
        console.log(error);
        displayToast('error', error.code)
      }
    }

    // async function mountListFormulaStock(pt, outcode, params) {
    //     try {
    //       setDataAvailableModal((dataAvailableModal = true))
    //       const getFormulaStock = await api.getFormulaStock(pt, outcode, params);
    //       const { data, metadata, error } = getFormulaStock.data;
    //       // console.log("data formula stock", getFormulaStock);
    //       // setListFormulaStock(data);

    //       if (error.status === true) {
    //         displayToast('error', error.msg);
    //         if (error.code === 401) {
    //           displayToast('error', 'Token is expired please login again')
    //           window.sessionStorage.clear();
    //           // history.push('/#/login')
    //         }
    //       } else {
    //         if(data === null || data === undefined){
    //           setListFormulaStock([])
    //         } else {
    //           setListFormulaStock((listFormulaStock = data))
    //         }
    //       }
    //       setTotalData(metadata.total_data)
    //       setDataAvailableModal(false)

    //     } catch (error) {
    //       console.log(error);
    //       displayToast('error', error)
    //     }
    //   }

    async function mountListPilihApp(params) {
      try {
        setDataAvailableModal((dataAvailableModal = true))
        const getPilihApp = await api.getPilihApp(params);
        const { data, metadata, error } = getPilihApp.data;
        // console.log("data formula stock", getPilihApp);
        // setListFormulaStock(data);

        if (error.status === true) {
          displayToast('error', error.msg);
          if (error.code === 401) {
            displayToast('error', 'Token is expired please login again')
            window.sessionStorage.clear();
            // history.push('/#/login')
          }
        } else {
          if(data === null || data === undefined){
            setListFormulaStock([])
          } else {
            setListFormulaStock((listFormulaStock = data))
          }
        }
        setTotalData(metadata.total_data)
        setDataAvailableModal(false)

      } catch (error) {
        console.log(error);
        displayToast('error', error)
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
      debounceMountListStockHeader(outcode, pt_id, inputSearch, 'DESC', newParams);
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
      debounceMountListStockHeader(outcode, pt_id, inputSearch, 'DESC', newParams);
    };

    const handlePageChangeModal = (event, newPage) => {
      if (paramsModal.page === newPage) {
        return;
      }
  
      const newParamsModal = {
        ...params,
        page: newPage,
        length: params.length,
      };
      setParamsModal(newParamsModal);
  
      setDataAvailableModal(true)
      // debounceMountListFormulaStock(pt_id, outcode, newParamsModal)
      debounceMountLisPilihApp(newParamsModal)

    };
  
    const handleRowsPerPageChangeModal = async (event, newRows) => {
      if (paramsModal.length === newRows) {
        return;
      }
  
      const newParamsModal = {
        ...params,
        page: 0,
        length: event.target.value,
      };
      setParamsModal(newParamsModal);
  
      setDataAvailableModal(true)
      // debounceMountListFormulaStock(pt_id, outcode, newParamsModal)
      debounceMountLisPilihApp(newParamsModal)

    };

    const enterPressed = event => {
      var code = event.keyCode || event.which;
      if (code === 13) {
        event.preventDefault();
        setDataAvailable(false)
        const newParams = {
          ...params,
          page: 0,
          length: params.length,
        };
        setParams(newParams);
        // setCurrentPage((currentPage = 1))
        debounceMountListMappedStock(objModal.ptid, objModal.projectid, objModal.outletid, pt_id, outcode, inputSearch, urutkanStock, newParams);
      }
    };

    function getModalStock(procod){
      var index = listMappedStock.findIndex(
        (item) => item.procod === procod
      );
      setObjStock((objStock = listMappedStock[index]))
      setDataAvailable(false)
      setModalStockIsOpen(true)
    }

    function isEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    }

    function setSort(sortType) {
      setUrutkanStock((urutkanStock = sortType))

      const newParams = {
        ...params,
        page: 0,
        length: params.length,
      };
      setParams(newParams);

      setDataAvailable(true)
      
      if(isEmpty(objModal) === true) {
        debounceMountListMappedStock(0, 0, outcode, pt_id, outcode, inputSearch, urutkanStock, newParams);
      } else {
        debounceMountListMappedStock(objModal.ptid, objModal.projectid, objModal.outletid, pt_id, outcode, inputSearch, urutkanStock, newParams);
      }
    }

    function openModalProject(){
        setDataAvailableModal(true)
        setModalProjectIsOpen(true)
        const newParams = {
            ...params,
            page: 0,
            length: params.length,
          };
          setParams(newParams);

        // debounceMountListFormulaStock(pt_id, outcode, newParams)
        debounceMountLisPilihApp(newParams)
    }

    function closeModalProject(item){
        setObjModal((objModal = item))
        setDataAvailable(false)
        setModalProjectIsOpen(false)
        // console.log('close modal project', objModal)
        debounceMountListMappedStock(objModal.ptid, objModal.projectid, objModal.outletid, pt_id, outcode, inputSearch, urutkanStock, params);
    }
  
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
                Mapped Stock
            </Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        
        <Grid container columnSpacing={1}>
            <Grid item xs={12} sm={12} md={2} lg={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600}}>
                  PT App:
              </Typography>
              <TextField
                  disabled
                  variant="filled"
                  size="small"
                  label={objModal.ptid}
                  margin={"dense"}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600}}>
                  Project App:
              </Typography>
              <TextField
                  disabled
                  variant="filled"
                  size="small"
                  label={objModal.projectid}
                  margin={"dense"}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600}}>
                  Outcode App:
              </Typography>
              <TextField
                  disabled
                  variant="filled"
                  size="small"
                  label={objModal.outletid}
                  margin={"dense"}
              />
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Button
                  sx={{ mt: 4.5 }} 
                  size="large"
                  variant="contained"
                  onClick={() => openModalProject()}
              >
                  {language === 'EN' ? 'Choose' : 'Pilih'}
              </Button>
            </Grid>
          </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2} justifyContent={"space-between"}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <OutlinedInput
                  fullWidth={isMobile && true}
                  size="small"
                  startAdornment={<InputAdornment><SearchIcon/></InputAdornment>}
                  placeholder={language === 'EN' ? 'Search Procod...' : 'Cari Procod...'}
                  sx={{bgcolor:'white'}}
                  onChange={(e) => setInputSearch((inputSearch = e.target.value))}
                  onKeyPress={event => enterPressed(event)}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} display={"flex"} justifyContent={!isMobile && "flex-end"}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, pt: 0.5 }}>
                {language === 'EN' ? 'Order Stock By:' : 'Urutkan Stock:'}
              </Typography>
              <FormControl sx={{ ml: 2, minWidth: 150}} size="small">
                  <Select
                      value={urutkanStock}
                      onChange={(e) => setSort(e.target.value)}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                  >
                      <MenuItem value={'ASC'}>
                          {language === 'EN' ? 'Smallest' : 'Terkecil'}
                      </MenuItem>
                      <MenuItem value={'DESC'}>
                          {language === 'EN' ? 'Biggest' : 'Terbesar'}
                      </MenuItem>
                  </Select>
              </FormControl>
            </Grid>
          </Grid>

        {/* <Divider sx={{ my: 2 }} /> */}
        <Paper sx={{ width: "100%", my: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Procod
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Product Description' : 'Nama Produk'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Current Stock' : 'Stok Fisik'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Booked Stock' : 'Stok Dipesan'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Available Stock' : 'Stok Tersedia'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Koefisien Stock
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Mapping Stock
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Project Stock
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Sell Unit
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Med Unit
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {language === 'EN' ? 'Last Update' : 'Update Terakhir'}
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
                listMappedStock.length !== 0 ? 
                  (listMappedStock.map((item) => (
                  <TableRow key={item.procod}>
                    <TableCell >
                      {/* <Link
                        href={`/stock/view/${item.stck_proname === '' ? '-' : item.stck_proname}/${item.stck_procod}`}
                        // sx={{ textDecoration: "none" }}
                      > */}
                        {item.procod}
                      {/* </Link> */}
                    </TableCell>
                    <TableCell sx={{ width: "15%" }}>{item.proname === '' ? '-' : item.proname}</TableCell>
                    <TableCell align="center">{item.qtyfisik}</TableCell>
                    <TableCell align="center">
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => getModalStock(item.procod)}
                      >
                        {item.qtybook}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{item.qtyavailable}</TableCell>
                    <TableCell align="center">{item.koefqtymapping}</TableCell>
                    <TableCell align="center">{item.qtymapping}</TableCell>
                    <TableCell align="center">{item.qtyproject}</TableCell>
                    <TableCell align="center">{item.sellunit}</TableCell>
                    <TableCell align="center">{item.medunit}</TableCell>
                    <TableCell align="center"> 
                        <Chip
                          label={item.activeyn === "Y" ? "Active" : activeyn === "N" ? "Not Active" : "-"}
                          color={item.activeyn === "Y" ? "success" : activeyn === "N" ? "error" : "default"}
                        />
                    </TableCell>
                    <TableCell align="center">{formatDate(item.lastupdate, "ddd MMMM DD YYYY")}</TableCell>
                  </TableRow>
                ))) : (
                  <TableRow>
                    <TableCell align="center" colSpan={12}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color:'gray' }}>
                      {language === 'EN' ? 'NO DATA' : 'TIDAK ADA DATA'}
                      {/* TIDAK ADA DATA */}
                    </Typography>
                    </TableCell>
                  </TableRow>
                )
                )}
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

        {/* MODAL PROJECT */}
        <Dialog
        open={modalProjectIsOpen}
        onClose={() => setModalProjectIsOpen(false)}
        fullWidth
        PaperProps={{ sx: { position: "fixed", top: 10} }}
        >
            <DialogTitle sx={{fontWeight: 600}}>
            <Grid container sx={{ mt: 1.5}}>
            <Grid container item xs={8}>
                <Typography variant="h6" sx={{fontWeight:"bold"}}>
                  {language === 'EN' ? 'Choose App' : 'Pilih App'}
                </Typography>
            </Grid>
            </Grid>
            </DialogTitle>
            <DialogContent>
            <TableContainer>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        PT ID
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Project ID
                        </Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Outcode
                        </Typography>
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {dataAvailableModal ? 
                  (
                      <TableRow>
                        <TableCell align="center" colSpan={12}>
                          <CircularProgress/>
                        </TableCell>
                      </TableRow>
                    ) : ( 
                    listFormulaStock.length !== 0 ?
                     (listFormulaStock.map((item) => (
                    <TableRow key={item.ptid}>
                        <TableCell >
                            {item.ptid === '' ? '-' : item.ptid}
                        </TableCell>
                        <TableCell align="center">{item.projectid}</TableCell>
                        <TableCell align="center">{item.outletid}</TableCell>
                        <TableCell align="center">
                        <Button
                            variant="contained"
                            onClick={() => closeModalProject(item)}
                        >
                            {language === 'EN' ? 'Choose' : 'Pilih'}
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))) : (
                      <TableRow>
                        <TableCell align="center" colSpan={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color:'gray' }}>
                          {language === 'EN' ? 'NO DATA' : 'TIDAK ADA DATA'}
                          {/* TIDAK ADA DATA */}
                        </Typography>
                        </TableCell>
                      </TableRow>
                    )
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        count={totalData}
                        rowsPerPage={paramsModal.length}
                        page={paramsModal.page}
                        onPageChange={handlePageChangeModal}
                        onRowsPerPageChange={handleRowsPerPageChangeModal}
                    />
                    </TableRow>
                </TableFooter>
                </Table>
            </TableContainer>
            </DialogContent>
        </Dialog>
      {/* MODAL PROJECT */}

      {/* MODAL BOOK STOCK */}
      <Dialog
       open={modalStockIsOpen}
       onClose={() => setModalStockIsOpen(false)}
       fullWidth
       PaperProps={{ sx: { position: "fixed", top: 10} }}
       >
        <DialogTitle sx={{fontWeight: 600}}>
          <Grid container sx={{ mt: 1.5}}>
           <Grid container item xs={8}>
            <Typography variant="h6" sx={{fontWeight:"bold"}}>
              Book Stock Detail
            </Typography>
           </Grid>
           <Grid container item xs={4} justifyContent={"flex-end"}>
            <Typography variant="subtitle1">
                {objStock.procod === '' ? '-' : objStock.procod}
            </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider sx={{ my: 1 }} />
        <DialogContent>
          <Grid container>
           <Grid container item xs={8}>
             <Typography variant="subtitle1" sx={{fontWeight:"bold", pt: 1}}>
              Book SP
             </Typography>
           </Grid>
           <Grid container item xs={4} justifyContent={"flex-end"}>
           <TextField
              disabled
              variant="filled"
              size="small"
              label={objStock.qtybooksp}
              margin={"none"}
              fullWidth
            />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5}}>
           <Grid container item xs={8}>
             <Typography variant="subtitle1" sx={{fontWeight:"bold", pt: 1}}>
             Book Hold Order Distributor
             </Typography>
           </Grid>
           <Grid container item xs={4} justifyContent={"flex-end"}>
           <TextField
              disabled
              variant="filled"
              size="small"
              label={objStock.qtybookholdro} 
              margin={"none"}
              fullWidth
            />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5}}>
           <Grid container item xs={8}>
             <Typography variant="subtitle1" sx={{fontWeight:"bold", pt: 1}}>
             Book Unpaid B2B
             </Typography>
           </Grid>
           <Grid container item xs={4} justifyContent={"flex-end"}>
           <TextField
              disabled
              variant="filled"
              size="small"
              label={objStock.qtybookunpaidb2b}
              margin={"none"}
              fullWidth
            />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5}}>
           <Grid container item xs={8}>
             <Typography variant="subtitle1" sx={{fontWeight:"bold", pt: 1}}>
             Book Tukar Guling
             </Typography>
           </Grid>
           <Grid container item xs={4} justifyContent={"flex-end"}>
           <TextField
              disabled
              variant="filled"
              size="small"
              label={objStock.qtybooktukarguling}
              margin={"none"}
              fullWidth
            />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5}}>
           <Grid container item xs={8}>
             <Typography variant="subtitle1" sx={{fontWeight:"bold", pt: 1}}>
             Book Receiving PO Order Toko
             </Typography>
           </Grid>
           <Grid container item xs={4} justifyContent={"flex-end"}>
           <TextField
              disabled
              variant="filled"
              size="small"
              label={objStock.qtybookrecvortok}
              margin={"none"}
              fullWidth
            />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5}}>
           <Grid container item xs={8}>
             <Typography variant="subtitle1" sx={{fontWeight:"bold", pt: 1}}>
             Book LPB
             </Typography>
           </Grid>
           <Grid container item xs={4} justifyContent={"flex-end"}>
           <TextField
              disabled
              variant="filled"
              size="small"
              label={objStock.qtybooklpb} 
              margin={"none"}
              fullWidth
            />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5}}>
           <Grid container item xs={8}>
             <Typography variant="subtitle1" sx={{fontWeight:"bold", pt: 1}}>
              Book Other
             </Typography>
           </Grid>
           <Grid container item xs={4} justifyContent={"flex-end"}>
           <TextField
              disabled
              variant="filled"
              size="small"
              label={objStock.qtybookother} 
              margin={"none"}
              fullWidth
            />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1.5}}>
           <Grid container item xs={8}>
             <Typography variant="subtitle1" sx={{fontWeight:"bold", pt: 1}}>
             Total
             </Typography>
           </Grid>
           <Grid container item xs={4} justifyContent={"flex-end"}>
           <TextField
              disabled
              variant="filled"
              size="small"
              label={objStock.qtybook}
              margin={"none"}
              fullWidth
            />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
             variant="contained"
             onClick={() => setModalStockIsOpen(false)}
           >
             Close
           </Button>
        </DialogActions>
       </Dialog>
      {/* MODAL BOOK STOCK */}
      </Box>
    );
  };
  
  export default MappedStock;
  