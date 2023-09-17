import axios from "axios";
import { getStorage } from "../utils/storage";
import { handlePageParams } from "../utils/handleParams";

const qr = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QR_API_URL,
  timeout: 30000,
});

// const test = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE3_API_URL,
//   timeout: 10000,
// });

qr.interceptors.request.use(
  async (config) => {
    config.baseURL = await getBaseUrl();
    return config;
  },
  (error) => Promise.reject(error)
);

export async function getBaseUrl() {
  var value = window.location.hostname.includes("chc")
    ? process.env.NEXT_PUBLIC_CHC_API_URL
    : process.env.NEXT_PUBLIC_QR_API_URL;

  return value;
}

// SPDO & SPADDHO START
const getListAllProduct = async (params) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(`/qr/v1/data?type=getlistallproduct`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const createHeaderNewBatch = async (data) => {
  return await qr.post(`/qr/v1/data?type=createheadernewbatch`, data, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const createDetailNewBatch = async (data) => {
  return await qr.post(`/qr/v1/data?type=createdetailnewbatch`, data, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const createDetailNewBatch2 = async (data) => {
  return await qr.post(`/qr/v1/data?type=createdetailnewbatch2`, data, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getSeeMBList = async (params) => {
  return await qr.get(`/qr/v1/data?type=getmblistbyscanid&scanid=${params}`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getListMasterBox = async (data) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(`/qr/v1/data?type=getlistofmasterbox&scanid=${data}`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const getScanningPackagingData = async (data, mbid) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(
    `/qr/v1/data?type=getscanningpackagingdata&scanid=${data}&mbid=${mbid}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

const getListBatchToMonitor = async () => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(`/qr/v1/data?type=getlistbatchtomonitor`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const getBatchMonitorByProcode = async (procode) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(
    `/qr/v1/data?type=getbatchmonitorbyprocode&scanprocode=${procode}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

const getBatchMonitorByStatus = async (statusscan) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(
    `/qr/v1/data?type=getbatchmonitorbystatus&scanstatus=${statusscan}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

const getBatchMonitorByDate = async (date) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(
    `/qr/v1/data?type=getbatchmonitorbydate&scandate=${date}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

const getListBatchToReview = async () => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(`/qr/v1/data?type=getlistbatchtoreview`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const getReviewBatchByProcode = async (procode) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(
    `/qr/v1/data?type=getreviewbatchbyprocode&scanprocode=${procode}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

const getReviewBatchByDate = async (date) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(
    `/qr/v1/data?type=getreviewbatchbydate&scansubmitdate=${date}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

const updateDetailUBID = async (data) => {
  return await qr.put(`/qr/v1/data?type=updateubid`, data, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const updatePackingSelesai = async (scanid) => {
  return await qr.put(`/qr/v1/data?type=finishpacking&scanid=${scanid}`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getHeader = async (scanid) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(`/qr/v1/data?type=getheader&scanid=${scanid}`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const getFilterHeader = async (procode, status, submitdate) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(
    `/qr/v1/data?type=getfilterheader&procode=${procode}&status=${status}&submitdate=${submitdate}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

const getFilterHeaderApproval = async (procode, submitdate) => {
  return await qr.get(
    `/qr/v1/data?type=getfilterheaderapproval&procode=${procode}&submitdate=${submitdate}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
    }
  );
};

const generateCSVBPOM = async (scanid) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await fetch(
    `${process.env.NEXT_PUBLIC_QR_API_URL}/qr/v1/data?type=generatedetailbatch&scanid=${scanid}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  ).then((response) => {
    console.log("res", response);
    if (response.status === 200) {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        // penamaan File .csv excel
        a.download = scanid + ".csv";

        a.click();
        // setIsLoading(false);
      });
    } else {
    }
  });
};

const updateUploadBpom = async (scanid) => {
  return await qr.put(
    `/qr/v1/data?type=updateflagscanuploadbpom&scanid=${scanid}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
    }
  );
};

const updateReject = async (scanid) => {
  return await qr.put(`/qr/v1/data?type=rejectreviewbatch&scanid=${scanid}`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getListQRMasterCode = async (params) => {
  return await qr.get(`/qr/v1/data?type=getallqrdata`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const serachMasterQrByProcode = async (procode) => {
  return await qr.get(
    `qr/v1/data?type=serachmasterqrbyprocode&procode=${procode}`
  );
};

const updateJumlahQrCode = async (data) => {
  return await qr.put(`qr/v1/data?type=updatejumlahbarcode`, data, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getQrCodeByProcode = async (procode) => {
  return await qr.get(`qr/v1/data?type=getbarcodebyprocode&procode=${procode}`);
};

const createMasterQr = async (data) => {
  return await qr.post(`/qr/v1/data?type=insertmastercode`, data, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const printAll = async (nie, batch, expdate, procode) => {
  return await fetch(
    // `${process.env.NEXT_PUBLIC_QR_API_URL}/qr/v1/data/generatemasterqr`,
    `${process.env.NEXT_PUBLIC_QR_API_URL}/qr/v1/data/generatemasterqr?nie=${nie}&batch=${batch}&expdate=${expdate}&procode=${procode}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
    }
  ).then((response) => {
    console.log("res", response);
    if (response.status === 200) {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        // a.download = startDate + "111" + endDate + ".csv";
        a.download = nie + batch + expdate + procode + ".pdf";

        a.click();
        // setIsLoading(false);
      });
    } else {
      // setIsLoading(false);
      console.log("errorService");
      // setResponseModalIsOpen(true);
      // setResponseHeader("Data not Found");
      // setResponseBody("");
    }
  });
};

// SPDO & SPADDHO START
const getDataByProcodeAndBatch = async (procode, batch) => {
  // const getListAllProduct = async (params) => {
  //   params = handlePageParams(params);
  return await qr.get(
    `/qr/v1/data?type=getdatabyprocodeandbatch&procode=${procode}&batch=${batch}`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

export default {
  getListAllProduct,
  createHeaderNewBatch,
  createDetailNewBatch,
  createDetailNewBatch2,
  getSeeMBList,
  getListMasterBox,
  getScanningPackagingData,
  getListBatchToMonitor,
  getBatchMonitorByProcode,
  getBatchMonitorByDate,
  getListBatchToReview,
  getReviewBatchByProcode,
  getReviewBatchByDate,
  getBatchMonitorByStatus,
  updateDetailUBID,
  updatePackingSelesai,
  getHeader,
  generateCSVBPOM,
  updateReject,
  updateUploadBpom,
  updateReject,
  getFilterHeader,
  getFilterHeaderApproval,

  getListQRMasterCode,
  serachMasterQrByProcode,
  updateJumlahQrCode,
  getQrCodeByProcode,
  createMasterQr,
  printAll,

  getDataByProcodeAndBatch,
};
