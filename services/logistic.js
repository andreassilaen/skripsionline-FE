import axios from "axios";
import { getStorage } from "../utils/storage";
import { handlePageParams } from "../utils/handleParams";

const logistic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

logistic.interceptors.request.use(
  async (config) => {
    config.baseURL = await getBaseUrl();
    return config;
  },
  (error) => Promise.reject(error)
);

export async function getBaseUrl() {
  var value = window.location.hostname.includes("chc")
    ? process.env.NEXT_PUBLIC_CHC_API_URL
    : process.env.NEXT_PUBLIC_BASE_API_URL;

  return value;
}

// SPDO & SPADDHO START
const getListSPBelumDilayani = async (params) => {
  params = handlePageParams(params);
  return await logistic.get(`/scm/v1/sp/pelayanan`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getDetailSPDilayani = async (noSP, params) => {
  return await logistic.get(`/scm/v1/sp/pelayanan/${noSP}/colek`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getBatchByProcode = async (procode, params) => {
  return await logistic.get(
    `/scm/v1/inventory/stock/${procode}/batch/available`,
    {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
      params,
    }
  );
};

const getAvailableBatch = async (noSP, params) => {
  return await logistic.get(`/scm/v1/sp/pelayanan/${noSP}/availablebatch`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getOutletTujuanByPTID = async (params) => {
  return await logistic.get(`/scm/v1/outlets/getoutletbysource`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getProductByKeyword = async (params) => {
  return await logistic.get(`/purchasing-neo/v1/products/slim`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getTujuanGabungBatch = async (noSP, params) => {
  return await logistic.get(`/scm/v1/sp/pelayanan/${noSP}/tujuanbatch`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const putEditQtyScan = async (noSP, body) => {
  return await logistic.put(`/scm/v1/sp/pelayanan/${noSP}/qty`, body, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    timeout: 30000,
  });
};

const putGabungBatch = async (noSP, body) => {
  return await logistic.put(`/scm/v1/sp/pelayanan/${noSP}/gabungbatch`, body, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    timeout: 30000,
  });
};

const putGantiBatch = async (noSP, body) => {
  return await logistic.put(`/scm/v1/sp/pelayanan/${noSP}/batch`, body, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    timeout: 30000,
  });
};

const putBelahBatch = async (noSP, body) => {
  return await logistic.put(`/scm/v1/sp/pelayanan/${noSP}/belahbatch`, body, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    timeout: 30000,
  });
};

const postConfirmSP = async (noSP, body) => {
  return await logistic.post(`/scm/v1/sp/pelayanan/${noSP}/confirm`, body, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `${getStorage("access_token")}`,
      Accept: "application/pdf",
    },
    timeout: 30000,
  });
};

const getDocumentSP = async (spid, params) => {
  return await logistic.get(`/scm/v1/packing-list/${spid}`, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `${getStorage("access_token")}`,
      Accept: "application/pdf",
    },
    params,
  });
};

const postCreateSPAddHO = async (body) => {
  return await logistic.post(`/scm/v1/sp`, body, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    timeout: 30000,
  });
};

// SPDO & SPADDHO END

//MONITORING SP START
const getListSPToMonitor = async () => {
  return await logistic.get(`/scm/v1/sp/pelayanan/getmonitoringsp`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};
//MONITORING SP END

//REPRINT DOKUMEN SP START
const getSPToReprint = async (spid, params) => {
  return await logistic.get(`/scm/v1/sp/${spid}/getsptoreprint`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};
//REPRINT DOKUMEN SP END

// Sales //

const getListOutlet = async () => {
  return await logistic.get("/scm/v1/outlets?ptid=0", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getListFaktur = async (ptid, outcode, offset, limit) => {
  return await logistic.get(
    `/scm/v2/sales/getlistfaktur?ptid=${ptid}&outcode=${outcode}&offset=${offset}&limit=${limit}`
  );
};

const searchFakturPajak = async (ptid, outcode, type, value) => {
  return await logistic.get(
    `/scm/v2/sales/searchfaktur?ptid=${ptid}&outcode=${outcode}&typesearch=${type}&value=${value}`
  );
};

const printFaktur = async (ptid, outcode, faktur) => {
  return await logistic.get(
    `/scm/v2/sales/printfaktur?ptid=${ptid}&outcode=${outcode}&fakturpajak=${faktur}`
  );
};

const getFakturDetail = async (ptid, outcode, faktur) => {
  return await logistic.get(
    `/scm/v2/sales/getfakturdetail?ptid=${ptid}&outcode=${outcode}&fakturpajak=${faktur}`
  );
};

const getTotalFaktur = async (ptid, outcode) => {
  return await logistic.get(
    `/scm/v2/sales/gettotalfaktur?ptid=${ptid}&outcode=${outcode}`
  );
};

const generateFakturByNoDo = async (ptid, outcode, nodo) => {
  return await logistic.get(
    `/scm/v2/sales/generetefakturbynodo?ptid=${ptid}&outcode=${outcode}&nodo=${nodo}`
  );
};

const printAllFaktur = async (body) => {
  return await logistic.post(`/scm/v2/sales/printallfaktur`, body);
};

const getListDestination = async (params) => {
  return await logistic.get("/scm/v2/sales/getlistdestination", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getListTrannoUnprocess = async (params) => {
  return await logistic.get("/scm/v2/sales/getlistfakturbydestination", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getTotalFakturUnprocess = async (params) => {
  return await logistic.get(`/scm/v2/sales/gettotalfakturunprocess`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getUnfakturDetail = async (params) => {
  return await logistic.get("/scm/v2/sales/getunfakturdetail", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getHistoryFakturFTZ = async (params) => {
  return await logistic.get("/scm/v2/sales/gethistoryfakturftz", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getHistoryFakturFTZDetail = async (params) => {
  return await logistic.get("/scm/v2/sales/gethistoryfakturftzdetail", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const searchHistoryFakturFTZ = async (params) => {
  return await logistic.get("/scm/v2/sales/searchhistoryfakturftz", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getTotalHistoryFTZ = async (params) => {
  return await logistic.get("/scm/v2/sales/gettotalhistoryftz", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const prosesFTZ = async (body) => {
  return await logistic.post(`/scm/v2/sales/getgeneratefakturftz`, body, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const printFakturFTZ = async (ptid, outcode, fakturpajak) => {
  const option = {
    method: "POST",
  };

  var url =
    process.env.NEXT_PUBLIC_BASE_API_URL +
    `/scm/v2/sales/printfakturftz?ptid=${ptid}&outcode=${outcode}&fakturpajak=${fakturpajak}`;
  await fetch(url, option)
    .then((response) => {
      if (response.ok) {
        return response;
      }
      throw new Error("Something went wrong");
    })
    .then((response) => {
      console.log("res", response);
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = fakturpajak + ".pdf";
        a.click();
      });
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const findSalesByDate = async (params) => {
  return await logistic.get("/scm/v2/sales/findsalesbydate", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getDetailByDate = async (params) => {
  return await logistic.get("/scm/v2/sales/getsalesdetailbydate", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getListSales = async (params) => {
  return await logistic.get("/scm/v2/sales/getlistsalesbydate", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const processSummarySales = async (body) => {
  return await logistic.post("/scm/v2/sales/processsummarysales", body, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const downloadSP = async (noSP, body) => {
  const option = {
    method: "POST",
    json: true,
    body: JSON.stringify(body),
  };

  var url =
    process.env.NEXT_PUBLIC_BASE_API_URL +
    `/scm/v1/sp/pelayanan/${noSP}/confirm`;
  await fetch(url, option)
    .then((response) => {
      if (response.ok) {
        return response;
      }
      throw new Error("Something went wrong");
    })
    .then((response) => {
      console.log("res", response);
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = noSP + ".pdf";
        a.click();
      });
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export default {
  getListSPBelumDilayani,
  getDetailSPDilayani,
  getBatchByProcode,
  getAvailableBatch,
  getTujuanGabungBatch,
  getOutletTujuanByPTID,
  getProductByKeyword,
  putEditQtyScan,
  putGabungBatch,
  putGantiBatch,
  putBelahBatch,
  postConfirmSP,
  getDocumentSP,
  postCreateSPAddHO,
  getListSPToMonitor,
  getSPToReprint,

  // SALES //
  getListOutlet,
  getListFaktur,
  searchFakturPajak,
  printFaktur,
  getFakturDetail,
  getTotalFaktur,
  generateFakturByNoDo,
  printAllFaktur,
  getListDestination,
  getListTrannoUnprocess,
  getTotalFakturUnprocess,
  getUnfakturDetail,
  getHistoryFakturFTZ,
  getHistoryFakturFTZDetail,
  searchHistoryFakturFTZ,
  prosesFTZ,
  getTotalHistoryFTZ,
  printFakturFTZ,
  findSalesByDate,
  getDetailByDate,
  getListSales,
  processSummarySales,
  downloadSP,
};
