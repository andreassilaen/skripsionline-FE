import {
  FormatListBulleted,
  Summarize,
  LocalShipping,
  ileMove,
  Store,
  Assessment,
  Dashboard,
  Inventory,
  ListAlt,
  Repeat,
  History,
  SwapHoriz,
  AdfScanner,
  AttachMoney,
  TrackChanges,
  Print,
  Search,
  Add,
  QrCode,
} from "@mui/icons-material";

export const Routes = (language) => {
  const arr = [
    {
      path: "/",
      menu: "Dashboard",
      icon: <Dashboard />,
    },
    // {
    //   path: "/",
    //   menu: "Master",
    //   icon: <Search />,
    //   id: "LOGISTIC_MASTER",
    //   submenu: [
    //     {
    //       path: "/master/ekspedisi",
    //       menu: "Ekspedisi",
    //       icon: <LocalShipping />,
    //       id: "LOGISTIC_MASTER_EKSPEDISI",
    //     },
    //     {
    //       path: "/container",
    //       menu: "Container  ",
    //       icon: <Dashboard />,
    //       id: "LOGISTIC_MASTER_CONTAINER",
    //     },
    //     {
    //       path: "/distributor",
    //       menu: "Distributor  ",
    //       icon: <Dashboard />,
    //       id: "LOGISTIC_MASTER_DISTRIBUTOR",
    //     },
    //   ],
    // },
    {
      path: "/approval",
      menu: language === "ID" ? "Upload to BPOM" : "Upload to BPOM",
      icon: <AttachMoney />,
      id: "QR_BPOM_MONITORING_OPERATOR",
    },
    {
      path: "/generate-master-qr",
      menu: language === "EN" ? "Generate Master QR " : "Generate Master QR ",
      icon: <QrCode />,
      id: "QR_BPOM_GENERATE_MASTER_QR",
    },
    {
      path: "/scan-new-batch",
      menu: language === "EN" ? "Scan New Batch  " : "Scan New Batch ",
      icon: <Inventory />,
      id: "QR_BPOM_SCAN_NEW_BATCH",
    },

    // // page baru buatan andreas, coba-coba
    // {
    //   path: "/scan-new-batch",
    //   menu: language === "EN" ? "Scan New Batch  " : "Scan New Batch ",
    //   icon: <Inventory />,
    //   id: "LOGISTIC_STOCK",
    // },
    // {
    //   path: "/",
    //   menu: "Receiving  ",
    //   icon: <ListAlt />,
    //   id: "LOGISTIC_RECEIVING",
    //   submenu: [
    //     {
    //       path: "/receiving/2",
    //       menu: "Receiving Floor  ",
    //       icon: <FormatListBulleted />,
    //     },
    //     {
    //       path: "/receiving/1",
    //       menu: "Receiving Apotek  ",
    //       icon: <FormatListBulleted />,
    //     },
    //   ],
    // },
    {
      path: "/monitoring-process-scan",
      menu: "Monitoring",
      icon: <Repeat />,
      id: "QR_BPOM_MONITORING_OPERATOR",
    },

    {
      path: "/monitoring-manager",
      menu: "Monitoring Manager",
      icon: <LocalShipping />,
      id: "QR_BPOM_MONITORING_MANAGER",
    },
    // {
    //   path: "/test",
    //   menu: "Transfer Gudang  ",
    //   icon: <LocalShipping />,
    //   id: "LOGISTIC_TRANSFER_GUDANG",
    // },
    // {
    //   path: "/test",
    //   menu: "Test",
    //   icon: <TrackChanges />,
    //   id: "LOGISTIC_MONITORING_SP",
    // },
    // {
    //   path: "/scan-new-batch2",
    //   menu: "Scan New Batch Test",
    //   icon: <TrackChanges />,
    //   id: "LOGISTIC_MONITORING_SP",
    // },
    // {
    //   path: "/",
    //   menu: "SPDO",
    //   icon: <ListAlt />,
    //   id: "LOGISTIC_SPDO",
    //   submenu: [
    //     {
    //       path: "/spdo",
    //       menu: "Pelayanan SPDO",
    //       icon: <Dashboard />,
    //       id: "LOGISTIC_SPDO",
    //     },
    //     {
    //       path: "/spdo/reprint",
    //       menu: "Reprint PDF SP",
    //       icon: <Print />,
    //       id: "LOGISTIC_SPDO_REPRINT",
    //     },
    //   ],
    // },

    // {
    //   path: "/refundb2b",
    //   menu: "REFUND",
    //   icon: <Dashboard />,
    //   id: "LOGISTIC_SPADDHO",
    // },

    {
      path: "/view-data-product",
      menu: language === "ID" ? "View Data Product" : "View Data Product",
      icon: <ListAlt />,
      id: "QR_BPOM_VIEW_DATA_PRODUCT",
      // submenu: [
      //   {
      //     path: "/posv2",
      //     menu: "POS",
      //     icon: <Store />,
      //     id: "LOGISTIC_POSV2",
      //   },
      //   {
      //     path: "/historysales",
      //     menu: language === "ID" ? "Riwayat Penjualan" : "History Sales",
      //     icon: <History />,
      //     id: "LOGISTIC_HISTORY_SALES",
      //   },
      //   {
      //     path: "/refund",
      //     menu: language === "ID" ? "Refund" : "Refund",
      //     icon: <SwapHoriz />,
      //     id: "LOGISTIC_REFUND",
      //   },
      //   {
      //     path: "/summarysale",
      //     menu: language === "ID" ? "Summary Sale" : "Summary Sale",
      //     icon: <Summarize />,
      //     id: "LOGISTIC_SUMMARY_SALES",
      //   },
      // ],
    },
    //   submenu: [
    //     {
    //       path: "/generatefaktur",
    //       menu: language === "ID" ? "Generate Faktur" : "Generate Faktur",
    //       icon: <AdfScanner />,
    //       id: "LOGISTIC_GENERATE_FAKTUR",
    //     },
    //     {
    //       path: "/generatefakturftz",
    //       menu:
    //         language === "ID" ? "Generate Faktur FTZ" : "Generate Faktur FTZ",
    //       icon: <AdfScanner />,
    //       id: "LOGISTIC_GENERATE_FAKTUR_FTZ",
    //     },
    //   ],
    // },
  ];

  return arr;
};
